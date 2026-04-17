-- extensão pra UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- enum seguro
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'transaction_type'
    AND n.nspname = 'public'
  ) THEN
    CREATE TYPE transaction_type AS ENUM (
      'income',
      'expense',
      'investment'
    );
  END IF;
END
$$;

-- tabela users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- tabela transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  transaction_date TIMESTAMP DEFAULT NOW(),
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  description TEXT,
  type transaction_type NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- index
CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
ON transactions(user_id);