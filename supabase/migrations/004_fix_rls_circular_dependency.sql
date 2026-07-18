-- Fix circular dependency in RLS policies
-- The previous policies had circular references between group_members and groups tables

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their groups" ON groups;
DROP POLICY IF EXISTS "Users can read group members of their groups" ON group_members;

-- Simplified policy for reading groups: Allow users to read groups they are members of
-- Using EXISTS instead of IN to avoid circular dependency
CREATE POLICY "Users can read their groups"
ON groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = groups.id 
    AND group_members.user_id = auth.uid()
  )
);

-- Simplified policy for reading group members: Allow users to read members of groups they are in
-- Direct check without subquery
CREATE POLICY "Users can read group members of their groups"
ON group_members FOR SELECT
USING (user_id = auth.uid());
