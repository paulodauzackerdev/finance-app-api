-- =========================================
-- MIGRATION 03: FUNÇÕES DE BALANÇO
-- =========================================

-- =========================================
-- FUNÇÃO: get_user_balance
-- Alinhada com a regra de negócio do Repository
-- =========================================

CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS TABLE (
    total_income NUMERIC(12,2),
    total_expense NUMERIC(12,2),
    total_investment NUMERIC(12,2),
    balance NUMERIC(12,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN type = 'investment' THEN amount ELSE 0 END), 0) AS total_investment,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS balance
    FROM transactions
    WHERE user_id = uid;
END;
$$;


-- =========================================
-- TESTE PARA VERIFICAR (opcional, pode comentar)
-- =========================================

-- SELECT * FROM get_user_balance('uuid-do-usuario-aqui');
-- Retorno esperado:
-- total_income | total_expense | total_investment | balance
-- 5900.00      | 2050.50       | 1000.00          | 2849.50
-- (income 5900 - expense 2050.50 - investment 1000 = balance 2849.50)


-- =========================================
-- COMENTÁRIO DE DOCUMENTAÇÃO
-- =========================================

COMMENT ON FUNCTION get_user_balance(UUID) IS 
'Retorna os totais de transações do usuário seguindo a regra:
 - total_income: soma de todas as receitas (type = income)
 - total_expense: soma de todas as despesas (type = expense)
 - total_investment: soma de todos os investimentos (type = investment)
 - balance: saldo líquido = total_income - total_expense - total_investment';