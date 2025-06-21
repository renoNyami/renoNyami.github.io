drop table if exists myOrders;
create table myOrders like orders;
drop table if exists myOrderItems;
create table myOrderItems like OrderItems;
drop procedure if exists GenAnOrder;
DELIMITER $$
CREATE PROCEDURE GenAnOrder()
begin
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    begin
        rollback to Step3;    
    end;
    truncate table myOrders;
    truncate table myOrderitems;
    insert into myOrders select * from orders order by rand() limit 100;
    insert into myOrderItems (orderid, productid,quantity,unitprice,discount) select orderid, productid,quantity,unitprice,discount from orderitems
    where orderid in (select orderid from myOrders); 
	-- 1. 插入一条订单
    start transaction;
	insert into myOrders (orderdate, customerid, employeeid, requireddate, invoicedate,shipperid, freight, operator,updatetime)
	values('2020-01-01','GDZYYL','CHL523F','2020-01-07','2020-01-31',5, 217.00,'ZGJ110M', now());	
	-- 2. 插入10248订单的第一条订单明细记录
	INSERT INTO myOrderitems (orderid, productid, quantity, unitprice,discount) VALUES (LAST_INSERT_ID(), 101, 100, 10, 0.05);	
    
	SAVEPOINT Step1; -- 创建第一个事务保存点
    set @x=ceiling((select max(orderid)-min(orderid))*rand());
    select productid, unitprice into @y,@p from products limit 1;
	-- 3. 增加10248订单的第二个商品销售记录
	INSERT INTO myOrderitems (orderid, productid, quantity, unitprice,discount) VALUES (@x, @y, 200, @p*1.25, 0.05);
	if (select count(*) from myOrders where orderid=@x)=0 then 
		-- 假设10248订单编号不存在，则回滚到第一个保存点,撤销10248订单的第二个商品销售记录
		ROLLBACK TO Step1;
	end if;
    
	SAVEPOINT Step2;  -- 创建第二个事务保存点
	-- 4. 增加10249订单的一个商品销售记录
	INSERT INTO myOrderitems (orderid, productid, quantity, unitprice,discount) VALUES (10249, 104, 300, 20, 0);
	if (select count(*) from myOrders where orderid=10249)=0 then 
		-- 假设10249订单编号不存在，则回滚到第二保存点，撤销10249订单的第一个商品销售记录
		ROLLBACK TO Step2;
	end if;
	SAVEPOINT Step3; -- 创建第三个事务保存点
	-- 5. 增加10248订单的一个商品销售记录，主键订单编号+商品编码重复
	INSERT INTO myOrderitems (orderid, productid, quantity, unitprice,discount) VALUES (10248, 102, 150, 20, 0);
	-- 如果一切顺利，提交事务
	COMMIT;
end $$
delimiter ;
call GenAnOrder();
select * from myorders;
select * from myorderitems;

