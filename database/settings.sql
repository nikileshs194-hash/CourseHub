-- Run this ENTIRE script in Supabase SQL Editor

DROP TABLE IF EXISTS settings;

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name VARCHAR(100),
  email VARCHAR(100),
  institution_name VARCHAR(200),
  academic_year VARCHAR(20),
  website VARCHAR(200),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Grant table-level permissions to anon key
GRANT ALL ON TABLE settings TO anon;
GRANT ALL ON TABLE settings TO authenticated;

-- Enable RLS with fully open policies (more reliable than DISABLE in Supabase)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_anon" ON settings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_auth" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert the default row
INSERT INTO settings (admin_name, email, institution_name, academic_year, website)
VALUES (
  'Administrator',
  'admin@mitmysore.edu.in',
  'Maharaja Institute of Technology, Mysore',
  '2024-25',
  'https://mitmysore.in'
);
