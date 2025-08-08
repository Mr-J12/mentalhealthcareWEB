/*
  # Fix users table RLS policy for sign-up

  1. Security Updates
    - Drop existing restrictive INSERT policy on users table
    - Create new INSERT policy that allows authenticated users to insert their own data
    - Ensure the policy works during the sign-up process when user is being authenticated

  This fixes the "new row violates row-level security policy" error during user registration.
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new INSERT policy that allows authenticated users to insert their own data
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the SELECT and UPDATE policies are also correct
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);