drop table if exists accounts;
CREATE TABLE accounts (
    account_id INT PRIMARY KEY,
    account_name VARCHAR(100),
    balance DECIMAL(10, 2)
);
insert into accounts values(19990512,'张燕燕',10000), (20000554,'祝锡永',20000), (20000555,'曹孟德',30000), (20000556,'诸葛孔明',40000), (20011234,'朱晓玲',50000), (20010687,'赖佩仪',60000);
drop table if exists transactions;
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    from_account INT,
    to_account INT,
    amount DECIMAL(10, 2),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

drop procedure if exists TransferAmount;
DELIMITER $$
CREATE PROCEDURE TransferAmount(
    IN fromAccountId INT,  
    IN toAccountId INT,
    IN amount DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- 当发生语法或其他错误时，回滚事务内的各项数据库操作
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '发生异常，回滚操作';
    END;
    START TRANSACTION;    
-- 判断转出账户是否存在，余额是否足够。
    IF (SELECT COUNT(*) FROM accounts WHERE account_id = fromAccountId) = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '转出账户不存在！';
    END IF;    
    IF (SELECT balance FROM accounts WHERE account_id = fromAccountId) < amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '转出账户余额不足！';
    END IF;
    -- 判断转入转出账户是否存在
    IF (SELECT COUNT(*) FROM accounts WHERE account_id = toAccountId) = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '转出账户不存在！';
    END IF;
    -- 在执行update语句之前，记录事务保存点
    -- SAVEPOINT before_balance_update;
    -- 从账户转出金额
    UPDATE accounts SET balance = balance - amount WHERE account_id = fromAccountId;    
    -- 向账户转入金额
    UPDATE accounts SET balance = balance + amount WHERE account_id = toAccountId;
    -- 插入转账记录
    INSERT INTO transactions (from_account, to_account, amount) VALUES (fromAccountId, toAccountId, amount);    
    COMMIT;
END $$
DELIMITER ;
call TransferAmount(20000554, 20000556, 5000);
select * from accounts;
select * from transactions;

