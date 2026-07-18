-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read messages from their conversations" ON private_messages;
DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON private_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON private_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON private_messages;

DROP POLICY IF EXISTS "Users can read messages from their groups" ON group_messages;
DROP POLICY IF EXISTS "Users can insert messages into their groups" ON group_messages;
DROP POLICY IF EXISTS "Users can update their own group messages" ON group_messages;
DROP POLICY IF EXISTS "Users can delete their own group messages" ON group_messages;

DROP POLICY IF EXISTS "Users can read their conversations" ON private_conversations;
DROP POLICY IF EXISTS "Users can read their groups" ON groups;
DROP POLICY IF EXISTS "Users can read group members of their groups" ON group_members;
DROP POLICY IF EXISTS "Users can read attachments from accessible messages" ON attachments;
DROP POLICY IF EXISTS "Users can read attachments" ON attachments;
DROP POLICY IF EXISTS "Users can insert attachments" ON attachments;

-- Enable RLS on private_messages
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- Policy for reading messages: Users can read messages from conversations they are part of
CREATE POLICY "Users can read messages from their conversations"
ON private_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM private_conversations 
    WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- Policy for inserting messages: Users can insert messages into conversations they are part of
CREATE POLICY "Users can insert messages into their conversations"
ON private_messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM private_conversations 
    WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
  AND sender_id = auth.uid()
);

-- Policy for updating messages: Users can update their own messages
CREATE POLICY "Users can update their own messages"
ON private_messages FOR UPDATE
USING (sender_id = auth.uid());

-- Policy for deleting messages: Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
ON private_messages FOR DELETE
USING (sender_id = auth.uid());

-- Enable RLS on group_messages
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;

-- Policy for reading group messages: Users can read messages from groups they are members of
CREATE POLICY "Users can read messages from their groups"
ON group_messages FOR SELECT
USING (
  group_id IN (
    SELECT group_id FROM group_members 
    WHERE user_id = auth.uid()
  )
);

-- Policy for inserting group messages: Users can insert messages into groups they are members of
CREATE POLICY "Users can insert messages into their groups"
ON group_messages FOR INSERT
WITH CHECK (
  group_id IN (
    SELECT group_id FROM group_members 
    WHERE user_id = auth.uid()
  )
  AND sender_id = auth.uid()
);

-- Policy for updating group messages: Users can update their own messages
CREATE POLICY "Users can update their own group messages"
ON group_messages FOR UPDATE
USING (sender_id = auth.uid());

-- Policy for deleting group messages: Users can delete their own messages
CREATE POLICY "Users can delete their own group messages"
ON group_messages FOR DELETE
USING (sender_id = auth.uid());

-- Enable RLS on private_conversations
ALTER TABLE private_conversations ENABLE ROW LEVEL SECURITY;

-- Policy for reading conversations: Users can read conversations they are part of
CREATE POLICY "Users can read their conversations"
ON private_conversations FOR SELECT
USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Enable RLS on groups
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Policy for reading groups: Users can read groups they are members of
CREATE POLICY "Users can read their groups"
ON groups FOR SELECT
USING (
  id IN (
    SELECT group_id FROM group_members 
    WHERE user_id = auth.uid()
  )
);

-- Enable RLS on group_members
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Policy for reading group members: Users can read members of groups they are in
CREATE POLICY "Users can read group members of their groups"
ON group_members FOR SELECT
USING (
  group_id IN (
    SELECT group_id FROM group_members 
    WHERE user_id = auth.uid()
  )
);

-- Enable RLS on attachments
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Simplified policy for reading attachments: Allow read access for now
CREATE POLICY "Users can read attachments"
ON attachments FOR SELECT
USING (true);

-- Policy for inserting attachments: Users can insert attachments
CREATE POLICY "Users can insert attachments"
ON attachments FOR INSERT
WITH CHECK (true);
