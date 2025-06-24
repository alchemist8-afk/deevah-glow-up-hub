
-- Create user profiles table with roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_role TEXT NOT NULL CHECK (user_role IN ('client', 'artist', 'business', 'transport')),
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER, -- duration in minutes
  image_url TEXT,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  location TEXT,
  notes TEXT,
  mood TEXT CHECK (mood IN ('calm', 'fast', 'social', 'private')),
  is_group_session BOOLEAN DEFAULT FALSE,
  max_guests INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'booking', 'referral_earning', 'glow_coins')),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  reward_amount DECIMAL(10,2) DEFAULT 25.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create glow feed posts table
CREATE TABLE public.glow_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  service_used TEXT,
  artist_name TEXT,
  likes_count INTEGER DEFAULT 0,
  is_group_session BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post likes table
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.glow_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create post comments table
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.glow_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glow_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Artists and businesses can insert services" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own services" ON public.services
  FOR UPDATE USING (auth.uid() = provider_id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Businesses can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = provider_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Clients can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Providers can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = provider_id OR auth.uid() = client_id);

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view their referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Glow posts policies
CREATE POLICY "Posts are viewable by everyone" ON public.glow_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON public.glow_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.glow_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Likes are viewable by everyone" ON public.post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON public.post_likes
  FOR ALL USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.post_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
