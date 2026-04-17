-- usuários
INSERT INTO users (id, first_name, last_name, email, password)
VALUES
  (gen_random_uuid(), 'Paulo', 'Dauzacker', 'paulodauzacker@email.com', '123456'),
  (gen_random_uuid(), 'Alexia', 'Vieira', 'alexia@email.com', '123456'),
  (gen_random_uuid(), 'Ana', 'Carolina', 'anacarolina@email.com', '123456');

-- transações
INSERT INTO transactions (user_id, name, transaction_date, amount, description, type)
SELECT
  u.id,
  t.name,
  t.transaction_date,
  t.amount,
  t.description,
  t.type
FROM users u
JOIN (
  VALUES
    ('Salário', NOW(), 5000.00, 'Salário mensal', 'income'::transaction_type),
    ('Aluguel', NOW(), 1200.00, 'Pagamento do aluguel', 'expense'::transaction_type),
    ('Supermercado', NOW(), 950.75, 'Compras do mês', 'expense'::transaction_type),
    ('Freelance', NOW(), 800.00, 'Projeto extra', 'income'::transaction_type),
    ('Investimento CDB', NOW(), 1000.00, 'Aplicação mensal', 'investment'::transaction_type)
) AS t(name, transaction_date, amount, description, type)
ON TRUE;