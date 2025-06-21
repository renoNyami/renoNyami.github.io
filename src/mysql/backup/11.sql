drop procedure if exists p1; 
delimiter $$
create procedure p1($customerset json)
begin
	declare $i, $n int;
    declare $c1,$c2,$c3 varchar(500);
    with tmp as (select * from json_table($customerset, '$[*]' columns(
    customerid varchar(15) path '$.customerid'
    )) as p
    select *, exampleid as id, if(level>1, concat('   实例',exampleid,' ',title), title) as text,
    if(level>1, concat('   实例',exampleid,' ',title), title) as label,
    if(level=1,"arrowforwardIcon","arrowforwardIcon") as iconCls     
    from examples order by concat(trim(ancestor),id);
end $$
delimiter ;