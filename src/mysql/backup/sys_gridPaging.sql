drop procedure if exists sys_gridPaging;
DELIMITER $$
CREATE PROCEDURE sys_gridPaging(
	$selectsql mediumtext,
    $pageno int,
    $pagesize int,
    $keyfield varchar(255),
    $keyvalue varchar(255),
    $fieldset varchar(500),
    $filter varchar(500)
)
begin
   	declare $wheresql mediumtext default '';
    declare $start int;
    drop temporary table if exists _tmp, _tmp1;
    set @sql=concat('create temporary table _tmp1 as ', $selectsql);
    prepare stmt from @sql;
	execute stmt;    
    set @sql=concat('create temporary table _tmp as select * from _tmp1 ');
    if ($fieldset<>'' and $filter<>'') then
		set $fieldset=concat($fieldset,';');
		while (instr($fieldset,';')>0) do
			if ($wheresql<>'') then set $wheresql=concat($wheresql, ' or ' ); end if;
			set $wheresql=concat($wheresql, substring($fieldset, 1, instr($fieldset,';')-1), ' like \'%', $filter,'%\'');
			set $fieldset=substring($fieldset, instr($fieldset, ';')+1);
		end while;
    end if;
    if ($wheresql<>'') then 
		set @sql=concat(@sql, ' where (', $wheresql,')'); 
	end if;
    prepare stmt from @sql;
	execute stmt;
    if ($keyfield<>'' and $keyvalue<>'' and $pagesize>0) then
		set @n=-1;
		set @sql=concat('select _rowno into @n from (select *, @rowno:=@rowno+1 as _rowno from _tmp a join (select @rowno:=0) as p) as t where ', $keyfield,'="', $keyvalue,'"');
        #select @sql;
		prepare stmt from @sql;
		execute stmt;
        if (@n<=0) then
			set $pageno=1;
        else
			set $pageno=floor((@n-1)/$pagesize)+1;
        end if;		
        set @m=@n-($pageno-1)*$pagesize;
    else
		set @m=0, @n=0;
    end if;
    select count(*) into @total from _tmp;
    #select @sql,@total;
    if ($pageno<1) then set $pageno=1; end if;
    if ($pagesize<=0) then set $pagesize=@total; end if;
    set $start=($pageno-1)*$pagesize;
    set @sql=concat('select *, ', @total,' as _total,', @n, ' as _rowno, ', @m,' as _rowindex, ', $pageno,' as _pageno from _tmp');    
    set @sql=concat(@sql, ' limit ', $start, ',', $pagesize);
	prepare stmt from @sql;
	EXECUTE stmt;
	deallocate prepare stmt;
end$$
DELIMITER ;
set @s="select a.*,b.companyname as suppliername, b.address, c.categoryname from products a join suppliers b on a.supplierid=b.supplierid join categories c using(categoryid) order by a.unitprice";
set @s="select a.*,b.companyname as suppliername, b.address, c.categoryname from products a join suppliers b on a.supplierid=b.supplierid join categories c using(categoryid) order by a.productid";
#call sys_gridPaging(@s, 2, 10,'productid','','','辣');


drop procedure if exists demo304d; 
delimiter $$
create procedure demo304d(
	$pageno int,
    $pagesize int,
    $filter varchar(255)
)
begin
	set @sql="select a.*, b.areaname as region, c.areaname as city from customers a 
    join areas b on a.regionid=b.areaid join areas c on a.cityid=c.areaid order by a.customerid";
    call sys_gridPaging(@sql, $pageno, $pagesize, 'customerid','JSXYSP','customerid;companyname;contactname;address;phone', $filter);
end $$
delimiter ;
call demo304d(1, 10,'江');