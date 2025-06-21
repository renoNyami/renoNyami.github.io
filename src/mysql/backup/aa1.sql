drop function if exists f1;
DELIMITER $$
create function f1(	$id varchar(50))
returns mediumtext deterministic
begin
	select trim(ancestor) into @s from categorytree where categoryid=$id;
    set @json=concat('["categoryid":"', $id,'"');
    set @x=LOCATE('#', @s);
    while @x>0 do
		set @s1=left(@s,@x-1);
        set @json=concat(@json, ',"categoryid":"', @s1,'"');
        set @s=substring(@s,@x+1);        
		set @x=LOCATE('#', @s);    
    end while;
    if (@s<>'') then
		set @json=concat(@json, '，"categoryid":"', @s,'"');
    end if;
	set @json=concat(@json,']');
    return @json;
end $$
DELIMITER ;
select f1('A101');
