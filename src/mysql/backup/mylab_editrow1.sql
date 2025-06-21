drop procedure if exists sys_runEditRow;
DELIMITER $$
CREATE PROCEDURE sys_runEditRow(   #插入或修改多行行记录
	$tablename varchar(255),   -- 表名  
	$keyfield varchar(500),    -- 主键列名
	$sortfield varchar(255),   -- 排序列
	$data MediumText,           -- json数组,多条记录
    out $keyfieldvalue varchar(255) #返回主键值json格式
)
begin
	declare $sql1, $sql2, $sql3, $sql4, $sql5, $sql6, $sql7, $selectsql, $row, $json, $value,$fieldset mediumtext default '';
	declare $database, $field, $type, $datatype, $autofield, $action, $extra, $key, $treefield, $quot1, $quot2, $sortfieldset, $s varchar(255) default '';
    declare $parentnodevalue varchar(255);   -- 当前结点的父结点的值
    declare $i, $j, $treeflag, $isreadonly, $isautoflag, $reloadrow, $level int default 0;
    declare $autorowid bigint;
    # treeflag判断是否是树形结构, $isreadonly判断列是否只读, $isautoflag是否存在自增列, $reloadrow是否需要重新家在数据
    set $database='mysales'; 
    set $quot1=Char(127 USING utf8mb4);  #前台传递数据时单引号的替代符
    set $quot2=concat($quot1, $quot1);   #前台传递数据时双引号的替代符
    set $fieldset='', $sortfieldset='', $autorowid=-1, $keyfieldvalue='';
    #$autorowid新增记录后最大的自增列;
    #set $row=replace($data, $quot2,'\\\"');  #替换双引号，字符串中可以带双引号
    set $row=replace($data, "'","''");  #替换单引号，字符串中可以带单引号   
    #select @data;
    call sys_GetColumnset($database, $tablename, $fieldset); # 获取表中所有列信息
    #set $tablename=concat($database,'.', $tablename);
    set $selectsql=concat('select * from ', $tablename);
	set $reloadrow=sys_GetJsonValue($row, '_reloadrow', 'n');  #是否重新加载数据
	set $action=sys_GetJsonValue($row, '_action', 'c');  #数据增删改类型add\update\delete
    set $action=if($action='insert', 'add', $action);    
    set $action=if($action='edit', 'update', $action);    
   	set $treeflag=sys_GetJsonValue($row, '_treeflag', 'n');  #记录树形结构的关键字
   	set $treefield=sys_GetJsonValue($row, '_treefield', 'c');  #记录树形结构的关键字
    if ($treefield<>'' and $treeflag=0) then set $treeflag=1; end if;
	set $treefield=if($treefield='', $keyfield, $treefield);
    set sql_safe_updates=0;
    set $keyfield=concat(';', $keyfield, ';');
    #sql1为insert,replace语句的列名部分
    #sql2为insert,replace语句的values值部分
    #sql3为update语句的set部分
    #sql4为update,replace,delete语句的where部分   
    
    #提取每一个列进行判断处理
    set $j=0;
    while $j<json_length($fieldset) do
		set $json=json_extract($fieldset, concat('$[', $j, ']'));
		set $field=sys_GetJsonValue($json, 'field', 'c');
		set $type=sys_GetJsonValue($json, 'type', 'c');
        #对于date,datetime,time,timestamp数据类型，$.取值可能会出错，故此改成varchar(50)
        set $type=if($type in('date','datetime','time','timestamp'), 'varchar(50)', $type);
        #对于json数据类型，数据格式会变化，故此改成mediumtext
        #set $type=if($type='json', 'mediumtext', $type);
		set $datatype=sys_GetJsonValue($json, 'datatype', 'c');
		set $key=sys_GetJsonValue($json, 'key', 'c');
		set $extra=sys_GetJsonValue($json, 'extra', 'c');
        set $isreadonly=0;
        if ($extra='auto_increment') then
			#自增列如果其值为<0，则不编辑这个值。等于0时，replace语句会自动添加值
			set $autofield=$field;
            if ($action='add') then
              #新增记录时设置自增列为0
			  set $row = JSON_SET($row, concat('$.',$autofield), 0);              
            end if;
			set $autorowid=sys_GetJsonValue($row, $autofield, 'n');
            #select 11111,$autorowid;
			if ($autorowid<=0) then set $isreadonly=1; end if;
		elseif (right($extra, 9)='generated') then set $isreadonly=1; #计算列不编辑
		end if;
        #判断是否是树形结构
        if ($field in ('parentnodeid','isparentflag','level','ancestor')) then 
			set $treeflag=$treeflag+1; 
		end if;
        #提取该列的值
		set $value=sys_GetJsonValue($row, $field, 'c');
        if ($value is not null) then
			set $value=replace($value, "'","\'");  #替换单引号，尤其是json数据中的双引号，此语句方法存在风险
			if ($datatype='date' and $value='') then
				set $value='1900-01-01'; #替换日期型数据中的空值
			elseif ($datatype='time' and $value='') then
				set $value='00:00'; #替换时间型数据中的空值
			elseif ($datatype='n' and $value='') then
				set $value='0'; #替换数值型中的空值
			end if;            
			if ($isreadonly=0) then
				#只对只读列数据进行处理
				if ($sql1<>'') then
					set $sql1=concat($sql1,','); #列名
					set $sql2=concat($sql2,','); #values...
					set $sql3=concat($sql3,','); #set ...
				end if;
				set $sql1=concat($sql1, $field);
                if ($datatype='n') then
					set $sql2=concat($sql2, $value);
					set $sql3=concat($sql3, concat($field,"=",$value));
                else
					set $sql2=concat($sql2, concat("'",$value,"'"));
					set $sql3=concat($sql3, concat($field,"='",$value,"'"));
                end if;
				#select $datatype,$field, $type;
				#如果是删除记录，只提取主键部分的列+树结构的ancestor列，而其他操作时都提取这些列。
			end if; ## if readonly		
			#根据主键确定update/delete中的where条件
			if ($key='pri' or locate(concat(';', $field, ';'), $keyfield)>0) then
				if ($sql4<>'') then 
					set $sql4=concat($sql4,' and '); 
				end if;
				set $sql4=concat($sql4, $field,"='",$value,"'");
				set $sortfieldset=concat($sortfieldset, ',', $field); 
				if ($keyfieldvalue<>'') then set $keyfieldvalue=concat($keyfieldvalue,','); end if; 
				set $keyfieldvalue=concat($keyfieldvalue,'"', $field,'":"',$value,'"'); #json格式
            end if;
		end if;
		set $j=$j+1;
	end while;
    set $keyfieldvalue=concat('{',$keyfieldvalue,',"_error":""}'); #json格式
    if ($sortfield<>'') then set $sortfieldset=replace($sortfield,';',',');
    else set $sortfieldset=substring($sortfieldset, 2);
    end if;
    set @n=0;
    #select $action,$autofield,$keyfield,locate(concat(';', $autofield, ';'), $keyfield);
    if ($action='add' and $keyfield<>'') then
		#新增记录时判断主键是否重复
		set @sql=concat('select count(*) into @n from ', $tablename,' where ', $sql4);
		#select $keyfield,$autofield,@sql;
		prepare stmt from @sql;
		execute stmt;
    end if;
	if ($treeflag>4) then   #记录删除结点的父结点和level 
    	#set $treefield=if($treefield='', $keyfield, $treefield);
		set $s=sys_GetJsonValue($row, $treefield, 'c');
		set $parentnodevalue=sys_GetJsonValue($row, 'parentnodeid', 'c');
		set $level=sys_GetJsonValue($row, 'level', 'n');
        if ($action<>'add') then
			set @sql=concat('select parentnodeid,level into @parentnodevalue, @level from ', $tablename ,' where ', $treefield,"='", $s,"'");
			prepare stmt from @sql;
			EXECUTE stmt;
			set $parentnodevalue=@parentnodevalue, $level=@level;
			#select @sql;
        end if;
		#select $parentnodevalue,$level,@parentnodevalue,@level;
	end if;

    if (@n=0) then  #新增记录主键不重复或之前没有错误发生
		if ($action='delete') then  #sqlx删除记录子孙结点，sql删除本身结点
			if ($treeflag>4) then
				#删除子结点的语句
				set @sql=concat('with tmp1 as (select a.',$treefield,', b.ancestor from tmp as a join ',$tablename,' as b using(',$treefield,'))');
				set @sql=concat(@sql,' delete a from ',$tablename,' a join tmp1 b on trim(a.ancestor) like concat(trim(b.ancestor), trim(b.',$treefield, '),"#%")');
				#删除树的子结点
				#select $treeflag;
				#select @sql;
				prepare stmt from @sql;
				execute stmt;
			end if;
            #删除自身结点的语句
			set @sql=concat(' delete from ', $tablename,' where ', $sql4);
		elseif ($action='update') then #修改记录
			set @sql=concat(' update ', $tablename, ' set ', $sql3, ' where ', $sql4);
		else
			set @sql=concat('insert into ', $tablename, '(', $sql1, ') values(', $sql2, ')'); #新增记录
		end if;
        ###############################
        #select 1,@sql; #逐语句，核心动作，执行数据增删改操作sssssssssss
		prepare stmt from @sql;   
		execute stmt;
        ###############################
        #select $treeflag,$action;
		#数据增删改操作之后，处理树形结构问题（要求树形结构实现计算出level,ancestor值，新增结点时将父结点的isparentflag设置为1
		if ($treeflag>4) then
			if ($action='add') then
				set @sql=concat('update ', $tablename ,' set isparentflag=1 where isparentflag=0 and level=', $level-1, ' and ', $treefield,"='", $parentnodevalue, "'");
				#select 2,@sql;
				prepare stmt from @sql;
				EXECUTE stmt;
			elseif ($action='delete') then  ##删除子结点之后判断父结点,只能删除一个结点 
				set @sql=concat('with tmp as (select * from ',$tablename,') update ', $tablename,' as a set isparentflag=0 where ', $treefield, "='", $parentnodevalue, "' and not exists (select 1 from tmp where tmp.parentnodeid=a.", $treefield,')');
				#select 'delenode', $treefield, @sql;
				prepare stmt from @sql;
				EXECUTE stmt;
			end if;
		end if;
        
		#取回最近操作的行
		set @selectsql="";
		if ($action<>'delete' and $reloadrow>0) then
			if ($autofield<>'') then #自增列不为空的时候
				if ($action='add') then
					set $autorowid=LAST_INSERT_ID(); #新增记录时取第一行值
                    set $keyfieldvalue=concat('{"', $autofield, '":"', $autorowid, '","_error":""}');
                    select $keyfieldvalue as f,$autorowid;
				else 
					set $autorowid=sys_GetJsonValue($row, $autofield, 'n'); #修改记录时取第一行值
				end if;
			end if;
			if ($autorowid>0) then set $sql5=concat($autofield, "=", $autorowid); end if;
			#select $sortfieldset,$autofield,$autorowid,$sql5;
			if ($sql5<>'') then
				set @sql=concat('with tmp1 as (', $selectsql, '),');
				set @sql=concat(@sql, 'tmp2 as (select *, row_number() over(order by ', $sortfieldset,') as rowno from tmp1)');
				set @sql=concat(@sql, 'select rowno into @rowno from tmp2 where ', $sql5);
				select 3,@sql as rownosql;
				prepare stmt from @sql;   
				execute stmt;
				set @selectsql=concat("select *, ", @rowno," as '_rowno' from (", $selectsql, " where ", $sql5,") as p") ;
			end if;
		else
			set @selectsql=concat("select '' as _error, 1 as flag,", $autorowid," as ", '_autorowid');   #20220219改$autorowid
		end if;
    else 
		#主键重复
		set @selectsql=concat("select 'pkerror' as _error, 1 as flag"); 
        set $keyfieldvalue='{"_error":"pkerror"}';
    end if;
    select 2,@selectsql;
	prepare stmt from @selectsql;   
	execute stmt;
	deallocate prepare stmt;    
end $$
delimiter ;
#set @row='[{"categoryid":"e15","categoryname":"555","englishname":"5555","_action":"add","parentnodeid":"E","isparentflag":0,"level":2,"ancestor":"E#","_reloadrow":1,"_treeflag":1,"_treefield":"categoryid"}]';
#call sys_runEditRows('categorytree','categoryid','',@row, @n);
set @data1='{"_action":"delete","_reloadrow":1,"productid":"147","productname":"哈奇咖喱粉","englishname":"Hachi curry powder","quantityperunit":"40g","unit":"瓶","unitprice":"32.50","subcategoryid":"B4","categoryname":"调味品","supplierid":"WHMSP","releasedate":"2012-01-01","categoryid":"B","photopath":[{"filename":"mybase/products/5.jpg","name":"图片"}],"_treeflag":0}';
set @data1='{"productid":"","productname":"1111","englishname":"11111","quantityperunit":"44444","unit":"7777","unitprice":22,"subcategoryid":"E4","categoryname":"谷类食品","supplierid":"DGTW","releasedate":"2023-04-26","categoryid":"E","photopath":[],"_action":"add","_reloadrow":1,"_treeflag":0}';
#select sys_GetJsonValue(@data1, 'photopath', 'c');
#set @data2 = JSON_SET(@data1, '$[0].productid', 0);
#select @data2;
call sys_runEditRow('products', 'productid', '', @data1, @v);
#select @v;
#select * from products;
 
 select replace("4234324'fefef'", "'" ,"\\\'");