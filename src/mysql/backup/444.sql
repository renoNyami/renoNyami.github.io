drop procedure if exists demo302b; 
delimiter $$
create procedure demo302b(
	$cid varchar(10)
)
begin
START TRANSACTION;
-- 检查是否存在与该客户相关的未完成的订单
SELECT * FROM orders WHERE customer_id = $cid;
-- 如果存在未完成的订单，阻止删除操作并回滚事务
IF FOUND_ROWS() > 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete customer with pending orders';
    -- 或者通知用户
ELSE
    -- 锁定客户记录
    SELECT * FROM customers WHERE customer_id = $cid FOR UPDATE;
    -- 删除客户记录
    DELETE FROM customers WHERE customer_id = $cid;
    COMMIT;
END IF;
end $$
delimiter ;
