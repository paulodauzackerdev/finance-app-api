-- =========================================
-- LIMPEZA (opcional em dev)
-- =========================================

TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;


-- =========================================
-- USERS
-- =========================================

INSERT INTO users (first_name, last_name, email, password_hash)
VALUES
  (
    'Paulo',
    'Dauzacker',
    'paulo@email.com',
    '$2b$10$KbQi6VqU4v1l0lT5uQmCNe9ZxQ2s6g9G8Wl0wQ2f8yQ2eZ1z1z1z1' -- hash fake
  ),
  (
    'Alexia',
    'Vieira',
    'alexia@email.com',
    '$2b$10$KbQi6VqU4v1l0lT5uQmCNe9ZxQ2s6g9G8Wl0wQ2f8yQ2eZ1z1z1z1'
  ),
  (
    'Ana',
    'Carolina',
    'ana@email.com',
    '$2b$10$KbQi6VqU4v1l0lT5uQmCNe9ZxQ2s6g9G8Wl0wQ2f8yQ2eZ1z1z1z1'
  );


-- =========================================
-- TRANSACTIONS
-- =========================================

INSERT INTO transactions (
  user_id,
  name,
  amount,
  description,
  type,
  transaction_date
)
SELECT
  u.id,
  t.name,
  t.amount,
  t.description,
  t.type,
  t.transaction_date
FROM users u
JOIN (
  VALUES
    ('Salário', 5000.00, 'Salário mensal', 'income'::transaction_type, NOW()),
    ('Aluguel', 1200.00, 'Pagamento aluguel', 'expense'::transaction_type, NOW()),
    ('Supermercado', 850.50, 'Compras do mês', 'expense'::transaction_type, NOW()),
    ('Freelance', 900.00, 'Projeto extra', 'income'::transaction_type, NOW()),
    ('Investimento CDB', 1000.00, 'Aplicação mensal', 'investment'::transaction_type, NOW())
) AS t(name, amount, description, type, transaction_date)
ON TRUE;