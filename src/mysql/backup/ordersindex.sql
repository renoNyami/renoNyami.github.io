drop procedure if exists orders100;
DELIMITER $$
create procedure orders100(
	$n int
)
begin
	declare $i,$j int default 1;
    #drop table if exists orders100;
    #create table orders100 select orderdate,customerid,employeeid,requireddate,shippeddate,invoicedate,shipperid,freight from orders limit 0;
    while $i<=56939 do
		select customerid into @s1 from customers order by rand() limit 1;
		select employeeid into @s2 from employees order by rand() limit 1;
		set @s3=timestampadd(day,rand()*1100,'2019-1-1');
		set @s4=timestampadd(day,rand()*20, @s3);
        set @x1=rand();
        if (@x1>0.6) then 
			set @s5=timestampadd(day,rand()*25, @s4);
			set @s6=timestampadd(day,rand()*30, @s4);
		else
			set @s5=timestampadd(day,rand()*15, @s4);
			set @s6=timestampadd(day,rand()*20, @s4);       
        end if;
		select shipperid into @s8 from shippers order by rand() limit 1;
		set @x2=round(1000*rand()+200,2);        
        insert into orders100 (orderdate,customerid,employeeid,requireddate,shippeddate,invoicedate,shipperid,freight)
        values(@s3,@s1,@s2,@s4,@s5,@s6,@s8,@x2);
    
		set $i=$i+1;
    end while;    
end $$
DELIMITER ;

call orders100(100);

drop table if exists orders60;
create table orders60 like orders;
insert into orders60 (orderid,orderdate,customerid,employeeid,requireddate,shippeddate,invoicedate,shipperid,freight) 
select 10247+row_number() over (order by orderdate) as orderid,a.* from orders100 a ;
select * from orders60;
select ASCII('a'),ASCII('A')

#select timestampadd(day,rand()*2000,'2020-1-1');

select  600000-543061