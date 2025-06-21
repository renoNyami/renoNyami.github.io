SELECT JSON_ARRAYAGG(JSON_OBJECT(
'productid', productid, 
'productname', productname, 
'quantityperunit', quantityperunit, 
'unit', unit, 
'unitprice', unitprice,
'photopath', photopath,
'categoryid', a.categoryid,
'supplierid', a.supplierid,
'categoryname', categoryname,
'companyname', companyname
)) as json FROM products a join categories b using(categoryid)
join suppliers c using(supplierid);


with tmp as (select * from products limit 30),
tmp1 as (select * from tmp order by productid)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
'productid', productid, 
'productname', productname, 
'quantityperunit', quantityperunit, 
'unit', unit, 
'unitprice', unitprice
)) as json FROM tmp1 a join categories b using(categoryid);


with tmp as (
select * from (select * from products limit 35,3) as p
union all
select * from (select * from (select * from products limit 10,10) as p order by rand() limit 2) as r
),
tmp1 as (select * from tmp order by productid)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
'productid', productid, 
'productname', productname, 
'quantityperunit', quantityperunit, 
'unit', unit, 
'unitprice', unitprice,
'categoryid', categoryid,
'subcategoryid', subcategoryid,
'supplierid', supplierid,
'releaseDate', ReleaseDate
)) as json FROM tmp1;



SELECT JSON_ARRAYAGG(JSON_OBJECT('customerid', customerid, 'companyname', companyname, 'contactname', contactname, 
'address', address,'city', b.areaname, 'province', c.areaname, 'phone', phone)) FROM customers a
join areas b on a.cityid=b.areaid
join areas c on a.regionid=c.areaid;

with tmp as (
select customerid from customers order by rand() limit 4)
SELECT JSON_ARRAYAGG(JSON_OBJECT('customerid', customerid, 'companyname', companyname, 'contactname', contactname, 
'address', address,'city', b.areaname, 'province', c.areaname, 'phone', phone)) as json FROM 
customers a
join areas b on a.cityid=b.areaid
join areas c on a.regionid=c.areaid
where customerid in (select customerid from tmp);

with tmp as (
select customerid from customers limit 10,8)
SELECT JSON_ARRAYAGG(JSON_OBJECT('customerid', customerid, 'companyname', companyname,
'address',address,'regionid', regionid,'cityid', cityid)) as json FROM 
customers a
where customerid in (select customerid from tmp);

select* from employees;

SELECT JSON_ARRAYAGG(JSON_OBJECT('employeeid', employeeid, 'name', employeename, 'title', title, 
'birthdate', date(birthdate), 'hiredate', date(hiredate), 'address', address, 'mobile', mobile)) as json FROM employees;

with tmp as (select * from jsonorders order by rand() limit 1000),
tmp1 as (select * from tmp order by orderid)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
'orderid', orderid, 
'orderdate', orderdate, 
'customerid', customerid, 
'employeeid', employeeid, 
'requireddate', requireddate, 
'freight', freight, 
'items', items
)) as json FROM tmp1;

with tmp as (
select *, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'subcategoryid', categoryid as 'key' from categorytree 
order by concat(trim(ancestor),id)
)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
'categoryid', categoryid,
'categoryname', categoryname,
'parentnodeid', parentnodeid,
'isparentflag', isparentflag,
'level', level,
'ancestor', ancestor
)) as json FROM tmp;

with tmp as (
select studentid as stuid,name as stuname,gender, birthdate,
(select elt(floor(rand()*5+1),'信息管理与信息系统','大数据管理与应用','计算机科学与技术','会计学','工商管理')) as deptname,
"下棋;钓鱼;书法;唱歌;编程;舞蹈" hobby
from imlab2020.x_students where studentid like '2013%' and birthdate<>'1900-01-01' 
order by rand() limit 30)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
'stuid', stuid,
'stuname', stuname,
'birthdate', birthdate,
'deptname', deptname,
'gender', gender,
'hobby', hobby
)) as json FROM tmp;


SELECT JSON_ARRAYAGG(JSON_OBJECT(
'id', categoryid,
'categoryname', categoryname
)) as json FROM categories;


SELECT JSON_ARRAYAGG(JSON_OBJECT(
'id', categoryid,
'name', categoryname,
'parentnodeid', parentnodeid
)) as json FROM categorytree;


SELECT JSON_ARRAYAGG(JSON_OBJECT(
'id', areaid, 'key', areaid,
'text', areaname,
'parentnodeid', parentnodeid
)) as json FROM areas;


with tmp as (select * from orderitems where discount=0 and productid in(1,2,3) order by rand() limit 15),
tmp1 as (select * from tmp order by orderid)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
'productid', productid, 
'quantity', quantity, 
'unitprice', unitprice
)) as json FROM tmp1;