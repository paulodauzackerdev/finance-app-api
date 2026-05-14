-- =========================================
-- EXTENSÕES
-- =========================================

-- UUID seguro
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =========================================
-- ENUMS
-- =========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'transaction_type'
  ) THEN
    CREATE TYPE transaction_type AS ENUM (
      'income',
      'expense',
      'investment'
    );
  END IF;
END
$$;


-- =========================================
-- TABELA: USERS
-- =========================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,

  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================
-- TABELA: TRANSACTIONS
-- =========================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  name VARCHAR(100) NOT NULL,

  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

  description TEXT,

  type transaction_type NOT NULL,

  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================
-- INDEXES (PERFORMANCE)
-- =========================================

CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_transactions_user_id 
ON transactions(user_id);

CREATE INDEX idx_transactions_type 
ON transactions(type);

CREATE INDEX idx_transactions_date 
ON transactions(transaction_date);


-- =========================================
-- TRIGGER: AUTO UPDATE updated_at
-- =========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();