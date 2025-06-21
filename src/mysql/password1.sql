drop table if exists sys_users;
create table sys_users
select teacherid,name,sys_fromycode(password) as password,mobile,email from
 x_teachers where char_length(teacherid)=8
union all
select studentid,name,sys_fromycode(password) as password,mobile,email from x_students 
where char_length(studentid)>8 and studentid>'2021' and studentid<'2022' limit 50;
select* from x_dictionary

select * from x_homeworkanswers where homeworkrowid between 148 and 177 
order by studentid;
select *,sys_fromycode(password) as password from
 x_students where studentid='2023333540012'
'
';

