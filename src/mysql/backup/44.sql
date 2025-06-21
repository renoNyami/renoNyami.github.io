set @data='[{"productid":"20","productname":"青岛啤酒2","englishname":"Tsintao Beer","quantityperunit":"330ml*6罐","unit":"箱","unitprice":"26.00","categoryid":"A","supplierid":"qtpj","categoryname":"饮料","_action":"add","_reloadrow":1,"_treeflag":0}]';
drop procedure if exists p1;
create procedure p1(
	$data mediumtext,
    $tablename varchar(100),
    $action varchar(20)   -- 'add/update/delete'
)
begin
	？？
end $$
delimiter ;
call p1(@data,'products','add');
call p1(@data,'orders','update');
call p1(@data,'customers','delete');



#set @row='[{"categoryid":"e15","categoryname":"555","englishname":"5555","_action":"add","parentnodeid":"E","isparentflag":0,"level":2,"ancestor":"E#","_reloadrow":1,"_treeflag":1,"_treefield":"categoryid"}]';
#call sys_runEditRows('categorytree','categoryid','',@row, @n);
set @data='[{"productid":"0","productname":"青岛啤酒2","englishname":"Tsintao Beer","quantityperunit":"330ml*6罐","unit":"箱","unitprice":"26.00","categoryid":"A","supplierid":"qtpj","categoryname":"饮料","_action":"add","_reloadrow":1,"_treeflag":0}]';

