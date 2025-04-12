-- Create recognition history table
CREATE TABLE IF NOT EXISTS recognition_history (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  recognized_character VARCHAR(10) NOT NULL,
  confidence DECIMAL(5,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_recognition_history_created_at 
  ON recognition_history(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recognition_history_updated_at
    BEFORE UPDATE ON recognition_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();