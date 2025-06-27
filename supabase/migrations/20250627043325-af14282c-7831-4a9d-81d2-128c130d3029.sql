
-- Create comprehensive database schema for Deevah Glow Hub - Clean version

-- Update profiles table to include all necessary fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS glowcoins_balance INTEGER DEFAULT 50;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Create unique index for referral codes
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Update existing services table structure if needed
ALTER TABLE services ADD COLUMN IF NOT EXISTS mood_tags TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_type TEXT CHECK (location_type IN ('home', 'salon', 'group_session'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_details TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS escrow_held BOOLEAN DEFAULT false;

-- Update bookings status constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'accepted', 'en_route', 'in_progress', 'completed', 'cancelled', 'rejected'));

-- Update existing glow_posts table
ALTER TABLE glow_posts ADD COLUMN IF NOT EXISTS artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE glow_posts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE glow_posts ADD COLUMN IF NOT EXISTS mood_tags TEXT[];

-- Update existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS mood_tags TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create meals table for restaurants
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  prep_time INTEGER, -- minutes
  image_url TEXT,
  mood_tags TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_sessions table for glow together feature
CREATE TABLE IF NOT EXISTS group_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  location TEXT NOT NULL,
  max_guests INTEGER NOT NULL,
  current_guests INTEGER DEFAULT 0,
  price_per_person DECIMAL(10,2) NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')),
  mood_vibe TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_session_guests table
CREATE TABLE IF NOT EXISTS group_session_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES group_sessions(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, guest_id)
);

-- Create rides table for transport integration
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  fare DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'en_route_pickup', 'passenger_picked', 'en_route_dropoff', 'completed', 'cancelled')),
  estimated_duration INTEGER, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_session_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Policies for meals
CREATE POLICY "Anyone can view available meals" ON meals 
FOR SELECT USING (is_available = true);
CREATE POLICY "Restaurant owners can manage their meals" ON meals 
FOR ALL USING (auth.uid() = restaurant_id);

-- Policies for group sessions
CREATE POLICY "Anyone can view open group sessions" ON group_sessions 
FOR SELECT USING (status = 'open');
CREATE POLICY "Hosts can manage their sessions" ON group_sessions 
FOR ALL USING (auth.uid() = host_id);

-- Policies for group session guests
CREATE POLICY "Anyone can view session guests" ON group_session_guests FOR SELECT TO public USING (true);
CREATE POLICY "Users can join sessions" ON group_session_guests FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Policies for rides
CREATE POLICY "Riders and passengers can view their rides" ON rides 
FOR SELECT USING (auth.uid() = rider_id OR auth.uid() = passenger_id);
CREATE POLICY "Passengers can create rides" ON rides 
FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "Riders and passengers can update rides" ON rides 
FOR UPDATE USING (auth.uid() = rider_id OR auth.uid() = passenger_id);

-- Functions for wallet operations
CREATE OR REPLACE FUNCTION handle_wallet_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's wallet balance based on transaction
  IF NEW.type IN ('deposit', 'refund', 'escrow_release', 'referral_bonus') THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance + NEW.amount 
    WHERE id = NEW.user_id;
  END IF;
  
  IF NEW.type IN ('withdrawal', 'payment', 'escrow_hold') THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance - NEW.amount 
    WHERE id = NEW.user_id;
  END IF;
  
  IF NEW.type = 'glow_coins' THEN
    UPDATE profiles 
    SET glowcoins_balance = glowcoins_balance + NEW.amount::INTEGER 
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for wallet transactions (update existing)
DROP TRIGGER IF EXISTS wallet_transaction_trigger ON wallet_transactions;
CREATE TRIGGER wallet_transaction_trigger
  AFTER INSERT ON wallet_transactions
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION handle_wallet_transaction();

-- Function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := 'DEEVAH' || UPPER(SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral code generation
DROP TRIGGER IF EXISTS generate_referral_code_trigger ON profiles;
CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();
