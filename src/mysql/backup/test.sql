use mysales;
#1）创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址创建一个存储过程，输入客户编码、 名称地址所属省份 编码 （RegionID）、 所属 城市编码 （CityID）这 5个参数，向客户表中插入一条记录要求 参数，向客户表中插入一条记录要求 该存储过程在完成记录 插 入后， 再按下面格式 内容 输出 这条客户记录 （包含 （包含 客户 所属的省份和城市名称，以及这个客户 所属的省份和城市名称，以及这个客户 所属的省份和城市名称，以及这个客户 在 所有客户中排序号 ，例如 24）。（20分）
drop procedure if exists p1;
delimiter $$
create procedure p1(
$cid varchar(10),
$cname varchar(100),
$address varchar(100),
$regionid varchar(10),
$cityid varchar(10),
out $rowno int
)
begin
	drop table if exists ccc;
    create table ccc select * from customers;
    insert into ccc (customerid,companyname,address,regionid,cityid) values($cid,$cname,$address,$regionid,$cityid);
	with tmp as (
    select a.*, b.areaname as provincename, c.areaname as cityname, row_number() over(order by customerid) as rowno from ccc a 
    join areas b on a.regionid=b.areaid 
    join areas c on a.cityid=c.areaid),
    tmp1 as (select @n:=rowno from ccc where customerid=$cid)    
    select *, @rowno:=rowno from tmp where customerid=$cid;
    set $rowno=@rowno;
end $$
delimiter ;
#call p1('TRTYG','aaaaaaaaaaa','ttttttt','440000','440300',  @rowno);
#select floor((@rowno-1)/10)+1, @rowno-floor((@rowno-1)/10)*10;


#1）创建一个用户定义函数，输入一个商品编码和月份（包含年份的）这两个参数，判断这个商品这个月份是否每天都有销售记录，或者按天汇总的销售额至少有7天是大于10万的。满足条件的返回1，否则返回0。（20分）
#2）调用这个用户定义函数，从而检索出2018年8月份和2018年11月份有哪些商品这两个月份的销售情况都是满足上述条件的，列出这商品的编码和名称。（10分）
drop function if exists f1;
delimiter $$
create function f1(
$pid varchar(10),
$date varchar(10)
)returns int deterministic
begin
	set $date=concat($date,'-01');
    with tmp as (
    select orderdate,count(*) as n,sum(amount) as amt from orderitems a 
    join orders using(orderid) where year(orderdate)=year($date) and month(orderdate)=month($date) and productid=$pid
    group by orderdate)
    select count(*), sum(if(amt>10000, 1,0)) into @m, @n from tmp;
    if (@n>=7 or @m=day(last_day($date))) then return 1;
    else return 0;
    end if;
end $$
delimiter ;
#select * from products where f1(productid,'2018-8')=1 and f1(productid,'2018-11')=1;
select * from students;
use mygrade;
with tmp1 as (
select a.* from grades a join courses b using(courseid) where coursetitle='数据库原理与应用' ),
tmp2 as (
select a.* from grades a join courses b using(courseid) where coursetitle='数据结构'
)
select a.*,b.score from students a 
join grades b using(studentid)
where a.studentid in (select studentid from tmp1) and a.studentid in (select studentid from tmp2) 
and a.studentid not in (select studentid from tmp1 where score<60) and a.studentid not in (select studentid from tmp2 where score<60);

#四、检索哪些学生在同一个学期中选修了“达尔文”老师2门或2门以上不同的课程。列出这些学生的学号、姓名、选课学期、课程编码与课程名称。（20分）
with tmp as (
select * from grades where teacherid in (select teacherid from teachers where name='陈国君')
),tmp1 as (
select a.* from tmp as a join tmp as b where a.studentid=b.studentid and a.term=b.term and a.courseid<>b.courseid)
select a.*, b.term,c.coursetitle from students a join tmp1 b on a.studentid=b.studentid
join courses c using(courseid);

