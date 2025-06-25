
-- Create enhanced wallet system for real money transactions
CREATE TABLE public.wallet_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance_ksh DECIMAL(12,2) DEFAULT 0.00,
  glow_coins INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('mpesa', 'bank_account', 'card')),
  account_number TEXT,
  account_name TEXT,
  bank_name TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced wallet transactions with real money support
ALTER TABLE public.wallet_transactions 
ADD COLUMN payment_method_id UUID REFERENCES public.payment_methods(id),
ADD COLUMN reference_id TEXT,
ADD COLUMN currency TEXT DEFAULT 'KSH';

-- Create artist availability table
CREATE TABLE public.artist_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'busy', 'offline')) DEFAULT 'available',
  allows_group_sessions BOOLEAN DEFAULT true,
  max_group_size INTEGER DEFAULT 4,
  hourly_rate DECIMAL(10,2),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(artist_id)
);

-- Create artist portfolio table
CREATE TABLE public.artist_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  service_category TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create business team management
CREATE TABLE public.business_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'staff',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, member_id)
);

-- Create transport tasks table
CREATE TABLE public.transport_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  task_type TEXT CHECK (task_type IN ('service_pickup', 'food_delivery', 'product_delivery')),
  pickup_location TEXT,
  delivery_location TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'picked_up', 'delivered', 'cancelled')) DEFAULT 'pending',
  estimated_earnings DECIMAL(10,2),
  actual_earnings DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet_balances
CREATE POLICY "Users can view own wallet balance" ON public.wallet_balances
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet balance" ON public.wallet_balances
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet balance" ON public.wallet_balances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_methods
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for artist_availability
CREATE POLICY "Artists can manage own availability" ON public.artist_availability
  FOR ALL USING (auth.uid() = artist_id);
CREATE POLICY "Everyone can view artist availability" ON public.artist_availability
  FOR SELECT USING (true);

-- RLS Policies for artist_portfolio
CREATE POLICY "Artists can manage own portfolio" ON public.artist_portfolio
  FOR ALL USING (auth.uid() = artist_id);
CREATE POLICY "Everyone can view artist portfolio" ON public.artist_portfolio
  FOR SELECT USING (true);

-- RLS Policies for business_teams
CREATE POLICY "Business owners can manage teams" ON public.business_teams
  FOR ALL USING (auth.uid() = business_id);
CREATE POLICY "Team members can view team info" ON public.business_teams
  FOR SELECT USING (auth.uid() = member_id OR auth.uid() = business_id);

-- RLS Policies for transport_tasks
CREATE POLICY "Drivers can view assigned tasks" ON public.transport_tasks
  FOR SELECT USING (auth.uid() = driver_id OR driver_id IS NULL);
CREATE POLICY "Drivers can update own tasks" ON public.transport_tasks
  FOR UPDATE USING (auth.uid() = driver_id);

-- Create function to initialize wallet for new users
CREATE OR REPLACE FUNCTION public.initialize_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.wallet_balances (user_id, balance_ksh, glow_coins)
  VALUES (NEW.id, 0.00, 50);
  
  -- Initialize artist availability if user is an artist
  IF NEW.raw_user_meta_data->>'user_role' = 'artist' THEN
    INSERT INTO public.artist_availability (artist_id, status, allows_group_sessions)
    VALUES (NEW.id, 'available', true);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for wallet initialization
DROP TRIGGER IF EXISTS on_auth_user_wallet_created ON auth.users;
CREATE TRIGGER on_auth_user_wallet_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.initialize_user_wallet();
