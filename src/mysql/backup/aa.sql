drop procedure if exists d1;
delimiter $$
create procedure d1()
begin
	select *,companyname as 'label', supplierid as 'value' from suppliers;
end $$
delimiter ;

drop procedure if exists d2;
delimiter $$
create procedure d2()
begin
	select *, categoryid as id, categoryname as 'text' from categorytree order by concat(trim(ancestor),id);
end $$
delimiter ;

drop procedure if exists d3;
delimiter $$
create procedure d3()
begin
	select *, areaid as id, areaname as 'text' from areas order by concat(trim(ancestor),id);
end $$
delimiter ;

