-- Add reset token fields to users table for password reset functionality
ALTER TABLE `users` 
ADD COLUMN `reset_token` varchar(255) DEFAULT NULL,
ADD COLUMN `reset_token_expiry` datetime DEFAULT NULL;

-- Add index for reset token for faster lookups
CREATE INDEX idx_users_reset_token ON users(reset_token);
