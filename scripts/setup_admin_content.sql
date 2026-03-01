-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  image_url TEXT,
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_section table
CREATE TABLE IF NOT EXISTS about_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  map_embed_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image_url TEXT,
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add is_admin column to auth.users (Supabase-specific)
-- Note: This is done via Supabase dashboard under User Management or via metadata

-- Set up Row Level Security (RLS) policies
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read hero_content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read about_section" ON about_section FOR SELECT USING (true);
CREATE POLICY "Allow public read contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read team_members" ON team_members FOR SELECT USING (true);

-- Allow authenticated admin users to manage content
CREATE POLICY "Allow admin update hero_content" ON hero_content 
  FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin insert hero_content" ON hero_content 
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin delete hero_content" ON hero_content 
  FOR DELETE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

CREATE POLICY "Allow admin update services" ON services 
  FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin insert services" ON services 
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin delete services" ON services 
  FOR DELETE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

CREATE POLICY "Allow admin update about_section" ON about_section 
  FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin insert about_section" ON about_section 
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin delete about_section" ON about_section 
  FOR DELETE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

CREATE POLICY "Allow admin update contact_info" ON contact_info 
  FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin insert contact_info" ON contact_info 
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin delete contact_info" ON contact_info 
  FOR DELETE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

CREATE POLICY "Allow admin update team_members" ON team_members 
  FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin insert team_members" ON team_members 
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );
CREATE POLICY "Allow admin delete team_members" ON team_members 
  FOR DELETE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

-- Insert default content (single hero content, sample services, etc.)
INSERT INTO hero_content (title, subtitle, button_text, button_link) 
  VALUES ('Welcome to Royal Friends Trading', 'Your trusted partner for quality trading solutions', 'Get Started', '/contact')
  ON CONFLICT DO NOTHING;

INSERT INTO about_section (title, description) 
  VALUES ('About Us', 'Royal Friends Trading is committed to providing the best trading experience with integrity and excellence.')
  ON CONFLICT DO NOTHING;

INSERT INTO contact_info (email, phone, address, city, country) 
  VALUES ('info@royalfriendstrading.com', '+1-800-123-4567', '123 Trading Street', 'New York', 'USA')
  ON CONFLICT DO NOTHING;
