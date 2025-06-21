select * from orders;
/*
alter table orders add column Operator varchar(20);    
alter table orders add column Updatetime datetime;      
alter table orders add column Checker varchar(20);     
alter table orders add column Checktime datetime;    #审核时间
*/
alter table orders add column CheckFlag tinyint;

update orders as a
join employees b on a.employeeid=b.employeeid
 set operator=if(rand()>0.5, a.employeeid, b.reportsto),updatetime=timestampadd(day, (5*rand()), orderdate) 
 where orderid<>0;
 update orders set updatetime=timestampadd(minute, 60*8+480*rand(), updatetime) where orderid<>0;

update orders as a
join employees b on a.employeeid=b.employeeid
 set checker=if(a.operator<>a.employeeid, a.employeeid, b.reportsto),checktime=timestampadd(day,floor(2*rand()),updatetime) 
 where orderid<>0;
 
 update orders set checktime=timestampadd(minute, 30+90*rand(), checktime) where updatetime=checktime and orderid<>0;
 update orders set checktime=timestampadd(minute, 10+30*rand(), checktime) where updatetime<>checktime and orderid<>0;
 
 update orders set checktime=timestampadd(minute, 10+30*rand(), checktime) where updatetime<>checktime and orderid<>0;
 
 update orders as a set checker='ZGJ110M' where orderid<>0 and checker='';
 
 update orders as a set checkflag=1 where orderid<>0; 
 
 with tmp1 as (
 select * from orders where orderdate between '2019-10-1' and '2019-10-20' order by rand() limit 50
 ),tmp2  as (
 select * from orders where orderdate between '2019-10-21' and '2019-10-31' order by rand() limit 155
 )
 update orders set checker='', checktime=null, checkflag=0 
 where (orderid in (select orderid from tmp1) or orderid in (select orderid from tmp2)) and orderid<>0;
 
 
 with tmp1 as (
 select * from orders where orderdate between '2019-10-1' and '2019-10-31' and checkflag=1 order by rand() limit 45
 )
 update orders set checkflag=-1 where orderid in (select orderid from tmp1) and orderid<>0;
 
 with tmp1 as (
 select * from orders where orderdate between '2019-10-1' and '2019-10-31' and checkflag=1 order by rand() limit 10
 )
 update orders set checkflag=-9 where orderid in (select orderid from tmp1) and orderid<>0;
 
 with tmp1 as (
 select * from orders where orderdate not between '2019-10-1' and '2019-10-31' and checkflag=1 order by rand() limit 145
 )
 update orders set checkflag=-9 where orderid in (select orderid from tmp1) and orderid<>0;

 update orders set checkflag=-1 where orderid='24900';
 update orders set checkflag=-9 where orderid='24898';
 
 update orders set checker='', checktime=null, checkflag=0 where orderid='24905';
 
  update orders set checkflag=-1,checker='CHL523F', checktime='2019-10-30' where orderid='25459';
  update orders set checkflag=-9 where orderid='25461';
  update orders set checkflag=2 where orderid='25463';
  
 

 with tmp1 as (
 select * from orders where orderdate between '2019-10-25' and '2019-10-31' and checkflag=1 order by rand() limit 50
 )
 update orders set checker='', checktime=null, checkflag=0 where orderid in (select orderid from tmp1) and orderid<>0;

  select * from orders where orderdate between '2019-10-25' and '2019-10-31' and checkflag<>0;
 
 select * from orders where checkflag =-9;
 
 
 select * from employees
 