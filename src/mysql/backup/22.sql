drop procedure if exists p01a; 
delimiter $$
create procedure p01a($customerset json)
begin
	declare $i, $n int default 1;
    with tmp1 as (select *,row_number() over(order by customerid) as rowno from customers)
    select rowno from tmp1 where customerid=(select min(customerid) from (
    select customerid from JSON_TABLE($customerset, "$[*]" COLUMNS(
		customerid varchar(20) PATH "$.customerid")	) as p
    ));   
    delete from orders where customerid in (select customerid from JSON_TABLE($customerset, "$[*]" COLUMNS(
		customerid varchar(20) PATH "$.customerid")	) as p);
end $$
delimiter ;
call p01a('[{"customerid": "ZJTYMY"}, {"customerid": "ZJHDDZ"},{"customerid": "HNCQYL"},{"customerid": "GDZYYL" },{"customerid": "TJMLYB"}]');

drop procedure if exists p01b; 
delimiter $$
create procedure p01b($customerset json)
begin
	declare $i, $n int default 1;
    drop temporary table if exists tmp ;
    create temporary table tmp 
	select * from JSON_TABLE($customerset, "$[*]" COLUMNS(
		customerid varchar(20) PATH "$.customerid")    
	) as p;
    with tmp1 as (select *,row_number() over(order by customerid) as rowno from customers)
    select rowno from tmp1 where customerid=(select min(customerid) from tmp);
end $$
delimiter ;
call p01b('[{"customerid": "ZJTYMY"}, {"customerid": "ZJHDDZ"},{"customerid": "HNCQYL"},{"customerid": "GDZYYL" },{"customerid": "TJMLYB"}]');

drop procedure if exists p01c; 
delimiter $$
create procedure p01c($customerset json)
begin
	declare $i, $n int default 0;
    declare $s, $minid varchar(20) default '';
    while ($i<json_length($customerset)) do
		set $s=JSON_UNQUOTE(json_extract($customerset, concat('$[', $i,'].customerid')));
		if ($minid='' or $s<$minid) then 
			set $minid=$s; 
        end if;
        select $s;
        set $i=$i+1;
    end while;
    with tmp1 as (select *,row_number() over(order by customerid) as rowno from customers)
    select rowno from tmp1 where customerid= $minid;
end $$
delimiter ;
call p01c('[{"customerid": "ZJTYMY"}, {"customerid": "ZJHDDZ"},{"customerid": "HNCQYL"},{"customerid": "GDZYYL" },{"customerid": "TJMLYB"}]');

drop procedure if exists p02a; 
delimiter $$
create procedure p1()
begin
	declare $i, $n int;
    declare $c1,$c2,$c3 varchar(500);
	if not exists (select 1 from information_schema.columns where table_schema='mysales' and table_name='orders'  and column_name='items') then
		alter table orders add column items json;
    end if;
    with tmp as (select orderid,json_arrayagg(json_object('productid', productid, 'quantity', quantity, 'unitprice', unitprice, 'discount', discount)) as items 
    from orderitems group by orderid)
    -- update orders as a set a.items=(select b.items from tmp as b where b.orderid=a.orderid) where orderid>0;
    update orders as a join tmp as b using(orderid) set a.items=b.items where orderid>0;    
    -- select * from orders;
end $$
delimiter ;
call p02a();

drop function if exists f02a; 
delimiter $$
create function f02a($customerid varchar(10), $xmonth varchar(10))
returns json deterministic
begin
	with tmp as (
    SELECT a.orderid,a.orderdate,a.requireddate,a.freight,p.*, p.unitprice*p.quantity*(1-p.discount) as amount, c.productname FROM orders as a
	join JSON_TABLE(a.items, "$[*]" COLUMNS(
		productid int PATH "$.productid",
		unitprice decimal(12,2) PATH "$.unitprice",
		quantity int PATH "$.quantity",
		discount decimal(8,2) path "$.discount")    
	) as p 
	join products as c on c.productid=p.productid
    where customerid=$customerid and year(orderdate)=year($xmonth) and month(orderdate)=month($xmonth)
    )
    select json_arrayagg(json_object(
    'orderid', orderid, 'orderdate', orderdate, 'requireddate', requireddate, 'freight', freight,
    'productid', productid, 'productname', productname, 'quantity', quantity, 'unitprice', unitprice, 'discount', discount, 'amount',amount)) into @data from tmp;
    return @data;
end $$
delimiter ;
select f02a('AHDTSM', '2019-10-1');



drop function if exists f02b; 
delimiter $$
create function f02b($customerid varchar(10), $xmonth varchar(10))
returns json deterministic
begin
    select json_arrayagg(json_object(
    'orderid', orderid, 'orderdate', orderdate, 'requireddate', requireddate, 'freight', freight,
    'items', items)) into @data from orders where customerid=$customerid and year(orderdate)=year($xmonth) and month(orderdate)=month($xmonth);
    return @data;
end $$
delimiter ;
select f02b('AHDTSM', '2019-10-1');
 SELECT * from JSON_TABLE(f2('AHDTSM', '2019-10-1'), "$[*]" COLUMNS(
		orderid int PATH "$.orderid",
		productid int PATH "$.productid",
		unitprice decimal(12,2) PATH "$.unitprice",
		quantity int PATH "$.quantity",
		discount decimal(8,2) path "$.discount")    
	) as p ;
	
    
select * from customers;




