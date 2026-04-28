-- ============================================
-- GOLF HEROES DATABASE SCHEMA
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active','inactive','cancelled','past_due')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly','yearly')),
  subscription_end_date TIMESTAMPTZ,
  charity_id UUID REFERENCES charities(id),
  charity_percentage NUMERIC DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHARITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website TEXT,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GOLF SCORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS golf_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- ============================================
-- DRAWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month DATE NOT NULL,
  draw_type TEXT DEFAULT 'random' CHECK (draw_type IN ('random','algorithmic')),
  winning_numbers INT[] NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','simulated','published')),
  jackpot_amount NUMERIC DEFAULT 0,
  pool_4match NUMERIC DEFAULT 0,
  pool_3match NUMERIC DEFAULT 0,
  total_subscribers INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRAW RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS draw_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES draws(id),
  user_id UUID REFERENCES profiles(id),
  match_count INT NOT NULL CHECK (match_count IN (3,4,5)),
  prize_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','verified','paid','rejected')),
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRIZE POOL CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prize_pool_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_fee_monthly NUMERIC DEFAULT 9.99,
  subscription_fee_yearly NUMERIC DEFAULT 99.99,
  pool_percentage_5match NUMERIC DEFAULT 40,
  pool_percentage_4match NUMERIC DEFAULT 35,
  pool_percentage_3match NUMERIC DEFAULT 25,
  charity_min_percentage NUMERIC DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY SETUP
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_pool_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update profiles"
ON profiles FOR UPDATE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- GOLF SCORES POLICIES
-- ============================================
CREATE POLICY "Users can read own scores"
ON golf_scores FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can read all scores"
ON golf_scores FOR SELECT
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert own scores"
ON golf_scores FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own scores"
ON golf_scores FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own scores"
ON golf_scores FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can update all scores"
ON golf_scores FOR UPDATE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- CHARITIES POLICIES
-- ============================================
CREATE POLICY "Public can read charities"
ON charities FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can insert charities"
ON charities FOR INSERT
TO authenticated
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update charities"
ON charities FOR UPDATE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete charities"
ON charities FOR DELETE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- DRAWS POLICIES
-- ============================================
CREATE POLICY "Public can read published draws"
ON draws FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can read all draws"
ON draws FOR SELECT
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert draws"
ON draws FOR INSERT
TO authenticated
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update draws"
ON draws FOR UPDATE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- DRAW RESULTS POLICIES
-- ============================================
CREATE POLICY "Users can read own draw results"
ON draw_results FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can read all draw results"
ON draw_results FOR SELECT
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert draw results"
ON draw_results FOR INSERT
TO authenticated
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update draw results"
ON draw_results FOR UPDATE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- PRIZE POOL CONFIG POLICIES
-- ============================================
CREATE POLICY "Public can read prize pool config"
ON prize_pool_config FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can update prize pool config"
ON prize_pool_config FOR UPDATE
TO authenticated
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_golf_scores_user_id ON golf_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_golf_scores_score_date ON golf_scores(score_date);
CREATE INDEX IF NOT EXISTS idx_golf_scores_user_score_date ON golf_scores(user_id, score_date);
CREATE INDEX IF NOT EXISTS idx_draws_draw_month ON draws(draw_month);
CREATE INDEX IF NOT EXISTS idx_draws_status ON draws(status);
CREATE INDEX IF NOT EXISTS idx_draw_results_draw_id ON draw_results(draw_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_user_id ON draw_results(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_payment_status ON draw_results(payment_status);
CREATE INDEX IF NOT EXISTS idx_charities_featured ON charities(featured);
CREATE INDEX IF NOT EXISTS idx_charities_active ON charities(active);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charities_updated_at
BEFORE UPDATE ON charities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_golf_scores_updated_at
BEFORE UPDATE ON golf_scores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_draws_updated_at
BEFORE UPDATE ON draws
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_draw_results_updated_at
BEFORE UPDATE ON draw_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prize_pool_config_updated_at
BEFORE UPDATE ON prize_pool_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
