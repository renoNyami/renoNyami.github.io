drop procedure if exists withdraw;
delimiter $$
CREATE PROCEDURE withdraw(
	$accountno int,
    $amount decimal(10,2),
    $transactiondate datetime
)
BEGIN
	start transaction;
	-- 读取余额。
	SELECT @balance:= balance FROM accounts WHERE Accountno = $accountno;
	SET @balance = @balance - $amount;
	UPDATE accounts SET balance = @balance WHERE Accountno = $accountno;
	COMMIT;
END $$;
delimiter ;
call withdraw(1001, )