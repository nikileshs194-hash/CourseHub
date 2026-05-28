-- Run this in Supabase SQL Editor to allow frontend direct access
ALTER TABLE students      DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses       DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
