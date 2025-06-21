drop procedure if exists p1;
DELIMITER $$
create procedure p1( $n int)
begin
    with tmp as (select orderid,sum(amount) as amt from orderitems group by orderid)
    select b.*, a.amt from tmp as a join orders b using(orderid) order by rand() limit $n;    
end $$
DELIMITER ;
call p1(200);

drop procedure if exists p2;
DELIMITER $$
create procedure p2()
begin
    select distinct left(sys_getFirstPyCode(companyname),1) as pycode from customers order by pycode;
end $$
DELIMITER ;

drop procedure if exists p3;
DELIMITER $$
create procedure p3($pycode char(1))
begin
    select * from customers where left(sys_getFirstPyCode(companyname),1)=$pycode;
    if 10248 in (select orderid from orders where customerid<>'aaa') then
		select 111;
        end if;
end $$
DELIMITER ;
call p3('D');



drop function if exists f1;
DELIMITER $$
create function f1($categoryid char(100))
returns mediumtext deterministic
begin
	with recursive tmp as (
		select a.* from categorytree a where categoryid=$categoryid 
        union all
		select a.* from categorytree as a join tmp as b on b.parentnodeid=a.categoryid
     )
     select json_arrayagg(json_object('categoryid', categoryid)) into @s from tmp;     
     return @s;    
end $$
DELIMITER ;
select categoryid,categoryname from categorytree where categoryid in (select p.categoryid from categorytree as a, 
json_table(f1(categoryid), '$[*]' columns (
 categoryid varchar(255) path "$.categoryid"
) ) as p
where categoryname like '%水%') order by categoryid;


