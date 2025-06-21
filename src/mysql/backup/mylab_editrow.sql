#记录增删改，可以多行，但不能批量删除原来记录，如dictionary，需要beforesave中先删除记录
#json中数据，_action='add,delete,update,replace'，_reloadrow=1表示重新加载行，_treeflag=1与_treefield=xxx处理树型结构表，
drop procedure if exists sys_runEditRows;
DELIMITER $$
CREATE PROCEDURE sys_runEditRows(   #插入或修改多行行记录
	$tablename varchar(255),   -- 表名  
	$keyfield varchar(500),    -- 主键列名
	$sortfield varchar(255),   -- 排序列
	$data MediumText,           -- json数组,多条记录
    out $keyfieldvalue varchar(255) #返回主键值json格式
)
begin
	declare $sql1, $sql2, $sql3, $sql4, $sql5, $sql6, $sql7, $selectsql, $row, $json, $value mediumtext default '';
	declare $database, $field, $type, $datatype, $autofield, $action, $extra, $key, $treefield, $quot1, $quot2, $sortfieldset, $s varchar(255) default '';
    declare $parentnodevalue varchar(255);   -- 当前结点的父结点的值
    declare $i, $j, $treeflag, $isreadonly, $isautoflag, $reloadrow, $level int default 0;
    declare $autorowid bigint;
    declare $fieldset mediumtext;
    # treeflag判断是否是树形结构, $isreadonly判断列是否只读, $isautoflag是否存在自增列, $reloadrow是否需要重新家在数据
    set $database='mysales'; 
    set $quot1=Char(127 USING utf8mb4);  #前台传递数据时单引号的替代符
    set $quot2=concat($quot1, $quot1);   #前台传递数据时双引号的替代符
    set $fieldset='', $sortfieldset='', $autorowid=-1, $keyfieldvalue='';
    #$autorowid新增记录后最大的自增列;
    set @data=replace($data, $quot2,'\\\"');
    #select @data;
    call sys_GetColumnset($database, $tablename, $fieldset); # 获取表中所有列信息
    #set $tablename=concat($database,'.', $tablename);
    set $row=json_extract($data, '$[0]'); #取第一行
    set $selectsql=concat('select * from ', $tablename);
	set $reloadrow=sys_GetJsonValue($row, '_reloadrow', 'n');  #是否重新加载数据
	set $action=sys_GetJsonValue($row, '_action', 'c');  #数据增删改类型add\replace\update\delete
    set $action=if($action='', 'replace', $action);
   	set $treeflag=sys_GetJsonValue($row, '_treeflag', 'n');  #记录树形结构的关键字
   	set $treefield=sys_GetJsonValue($row, '_treefield', 'c');  #记录树形结构的关键字
    if ($treefield<>'' and $treeflag=0) then set $treeflag=1; end if;
	set $treefield=if($treefield='', $keyfield, $treefield);
    set sql_safe_updates=0;
    set $keyfield=concat(';', $keyfield, ';');
    if ($action='add') then
		#对于新增记录，将自增列值设置为0
		set $j=0;
		while $j<json_length($fieldset) do
			set $json=json_extract($fieldset, concat('$[', $j, ']'));
			set $extra=sys_GetJsonValue($json, 'extra', 'c');
			set $field=sys_GetJsonValue($json, 'field', 'c');
			if ($extra='auto_increment') then
				set $autofield=$field;
				set $i=0;
				while $i<json_length(@data) do
					set @data = JSON_SET(@data, concat('$[', $i, '].', $autofield), 0);  #设置为0
					set $i=$i+1;
				end while;
                set $j=json_length($fieldset)+1;  #退出循环
			end if;
			set $j=$j+1;
		end while;         
    end if;
    #select @data;
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
            set $autorowid=sys_GetJsonValue($row, $autofield, 'n');
            #select 11111,$autorowid;
			if ($autorowid<=0) then set $isreadonly=1; end if;
		elseif (right($extra, 9)='generated') then set $isreadonly=1; #计算列不编辑
		end if;
        #判断是否是树形结构
        if ($field in ('parentnodeid','isparentflag','level','ancestor')) then 
			set $treeflag=$treeflag+1; 
		end if;
		if ($isreadonly=0) then
			if ($sql1<>'') then
				set $sql1=concat($sql1,',');   #列出replace语句中的列名
            end if;
            set $sql1=concat($sql1, $field);
            #select $datatype,$field, $type;
			#确定replace语句之后批量提取数据的select语句部分。
            #如果是删除记录，只提取主键部分的列+树结构的ancestor列，而其他操作时都提取这些列。
            if ($action<>'delete' or $key='pri' or locate(concat(';', $field, ';'), $keyfield)>0 or $field='ancestor') then
				if ($sql3<>'') then
					set $sql2=concat($sql2,',');   #提取json数据$.???
					set $sql3=concat($sql3,','); 
                end if;
                if ($datatype='n') then 
					set $sql2=concat($sql2, $field, ' varchar(255) path "$.', $field, '"');  #将数值型数据类型变成varchar(255)，避免空值的处理
                else
					set $sql2=concat($sql2, $field, ' ', $type, ' path "$.', $field, '"');   #其他数据类型不变
                end if;
				if ($datatype='date') then
					set $sql3=concat($sql3, concat("if(", $field,"='', '1900-01-01',", $field, ")")); #替换日期型数据中的空值
					set $sql3=concat($sql3, ' as ', $field);
				elseif ($datatype='time') then
					set $sql3=concat($sql3, concat("if(", $field,"='', '00:00',", $field, ")")); #替换时间型数据中的空值
					set $sql3=concat($sql3, ' as ', $field);
				elseif ($datatype='n') then
					set $sql3=concat($sql3, "if(", $field,"='', 0, ", $field,")"); #替换数值型中的空值
					set $sql3=concat($sql3, ' as ', $field);
				else
					#trim(both '"' from cast(json_extract(field1, '$.t_value') as char))
					#set $sql3=concat($sql3, concat('replace(replace(', $field,', $quot2,\'"\'), $quot1,"\'")')); #替换单引号与双引号
					set $sql3=concat($sql3, $field); 
				end if;
				#set $sql3=concat($sql3, concat('replace(replace(', $field,', $quot2,\'"\'), $quot1,"\'")')); #替换单引号与双引号
				#set $sql3=concat($sql3, ' as ', $field);
            end if;
            #sql4为update语句set中的列名，例如：set a.f1=b.f1
            if ($key<>'pri' and sys_GetJsonValue($row, $field, '') is not null) then            
				if ($sql4<>'') then
					set $sql4=concat($sql4,',');   #update语句中的set子句
				end if;
				set $sql4=concat($sql4, ' a.', $field, '=b.', $field);  
            end if;
		end if; ## if readonly		
		#根据主键确定update/delete中的where条件
		if ($key='pri' or locate(concat(';', $field, ';'), $keyfield)>0) then
			#sql5为查询第一条记录的where条件，sql6为update的where条件,sql7为删除记录的where条件,sql8为删除记录时需要提取的列（比sql3要少，但格式与sql3相同）
			if ($sql5<>'') then 
				set $sql5=concat($sql5,' and '); 
				set $sql6=concat($sql6,' and '); 
				set $sql7=concat($sql7,' and '); 
			end if;
			set $s=sys_GetJsonValue($row, $field, 'c');
			set $sql5=concat($sql5, $field,"='", $s, "'");
			set $sql6=concat($sql6, 'a.', $field, '=b.', $field);
			set $sql7=concat($sql7, $field,' in (select ', $field, ' from tmp)');
			set $sortfieldset=concat($sortfieldset, ',', $field); 
            if ($keyfieldvalue<>'') then set $keyfieldvalue=concat($keyfieldvalue,','); end if; 
            set $keyfieldvalue=concat($keyfieldvalue,'"',$field,'":"',$s,'"'); #json格式
		end if;
		set $j=$j+1;
	end while;
    set $keyfieldvalue=concat('{',$keyfieldvalue,',"_error":""}'); #json格式
	set @sql=concat(' with tmp as (select * from json_table(@data, \'$[*]\' columns (', $sql2, ') ) as p)');
	#set @sql=concat(" with tmp as (select * from json_table('", @data,"', '$[*]' columns (", $sql2, ") ) as p)");
	#提取数据
    #select $sql5 as f, $keyfieldvalue;
    if ($sortfield<>'') then set $sortfieldset=replace($sortfield,';',',');
    else set $sortfieldset=substring($sortfieldset, 2);
    end if;
    set @n=0;
    #select $action,$autofield,$keyfield,locate(concat(';', $autofield, ';'), $keyfield);
    if ($action='add' and $keyfield<>'' and locate(concat(';', $autofield, ';'), $keyfield)=0) then #新增记录
		#新增记录时判断主键是否重复
		set @sqlx=concat('select count(*) into @n from ', $tablename,' where ', $sql5);
		#select $keyfield,$autofield,@sqlx;
		prepare stmt from @sqlx;
		execute stmt;
    end if;
	if ($treeflag>4) then   #记录删除结点的父结点和level 
    	#set $treefield=if($treefield='', $keyfield, $treefield);
		set $s=sys_GetJsonValue($row, $treefield, 'c');
		set $parentnodevalue=sys_GetJsonValue($row, 'parentnodeid', 'c');
		set $level=sys_GetJsonValue($row, 'level', 'n');
        if ($action<>'add') then
			set @sqly=concat('select parentnodeid,level into @parentnodevalue, @level from ', $tablename ,' where ', $treefield,'="', $s,'"');
			prepare stmt from @sqly;
			EXECUTE stmt;
			set $parentnodevalue=@parentnodevalue, $level=@level;
			#select @sqly;
        end if;
		#select $parentnodevalue,$level,@parentnodevalue,@level;
	end if;

    if (@n=0) then  #新增记录主键不重复或之前没有错误发生
		if ($action='delete') then  #sqlx删除记录子孙结点，sql删除本身结点
			#set @sqlx=concat(@sql, ' delete a from ', $tablename,' as a join tmp as b on a.ancestor like concat(trim(b.ancestor), trim(b.', $treefield,'),"#%")');
            /* e.g.
             with tmp as (select * from json_table(@data, '$[*]' columns (ancestor varchar(150) path "$.ancestor",categoryid char(14) path "$.categoryid") ) as p) 
			 select a.*, trim(b.ancestor) as ancestor, c.categoryid from tmp as a
			 join categorytree b on a.categoryid=b.categoryid
			 join categorytree c on trim(c.ancestor) like concat(trim(b.ancestor), trim(a.categoryid),"#%");
             
			with tmp as (select * from json_table(@data, '$[*]' columns (ancestor varchar(150) path "$.ancestor",categoryid char(14) path "$.categoryid") ) as p),
			 tmp1 as (
			 select a.categoryid, b.ancestor from tmp as a
			 join categorytree b on a.categoryid=b.categoryid
			 )
			 delete a from categorytree a join tmp1 b on trim(a.ancestor) like concat(trim(b.ancestor), trim(b.categoryid),"#%")          
			*/
            #删除子结点的语句
            set @sqlx=concat(@sql,', tmp1 as (select a.',$treefield,', b.ancestor from tmp as a join ',$tablename,' as b using(',$treefield,'))');
            set @sqlx=concat(@sqlx,' delete a from ',$tablename,' a join tmp1 b on trim(a.ancestor) like concat(trim(b.ancestor), trim(b.',$treefield, '),"#%")');
            #删除自身结点的语句
			set @sql=concat(@sql, ' delete a from ', $tablename,' as a join tmp as b on ', $sql6);
			#删除树的子结点
            #select $treeflag;
			if ($treeflag>4) then
				#select @sqlx;
				prepare stmt from @sqlx;
				execute stmt;
			end if;
		elseif ($action='update') then #修改记录
			set @sql=concat(@sql, ' update ', $tablename, ' as a join (select ', $sql3, ' from tmp) as b');
			set @sql=concat(@sql, ' set ', $sql4, ' where ', $sql6);
		else
			set @sql=concat('replace into ', $tablename, '(', $sql1, ')', @sql, ' select ', $sql3, ' from tmp'); #替换记录或新增
		end if;
        ###############################
        #select 1,@sql; #逐语句，核心动作，执行数据增删改操作sssssssssss
		prepare stmt from @sql;   
		execute stmt;
        ###############################
        #select $treeflag,$action;
		#数据增删改操作之后，处理树形结构问题（要求树形结构实现计算出level,ancestor值，新增结点时将父结点的isparentflag设置为1
		if ($treeflag>4) then
			if ($action='add' or $action='replace') then
				set @sql=concat('update ', $tablename ,' set isparentflag=1 where isparentflag=0 and level=', $level-1, ' and ', $treefield,'="', $parentnodevalue, '"');
				#select 2,@sql;
				prepare stmt from @sql;
				EXECUTE stmt;
			elseif ($action='delete') then  ##删除子结点之后判断父结点,只能删除一个结点 
				set @sql=concat('with tmp as (select * from ',$tablename,') update ', $tablename,' as a set isparentflag=0 where ', $treefield, '="', $parentnodevalue, '" and not exists (select 1 from tmp where tmp.parentnodeid=a.', $treefield,')');
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
                    #select $keyfieldvalue as f;
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
				#select @sql as rownosql;
				prepare stmt from @sql;   
				execute stmt;
				set @selectsql=concat("select *, ", @rowno," as '_rowno' from (", $selectsql, " where ", $sql5,") as p") ;
			end if;
		else
			#set @selectsql=concat("select '' as _error, 1 as flag,", $autorowid," as ", $autorowid); 
			set @selectsql=concat("select '' as _error, 1 as flag,", $autorowid," as ", '_autorowid');   #20220219改$autorowid
		end if;
    else 
		#主键重复
		set @selectsql=concat("select 'pkerror' as _error, 1 as flag"); 
        set $keyfieldvalue='{"_error":"pkerror"}';
    end if;
	prepare stmt from @selectsql;   
	execute stmt;
	deallocate prepare stmt;
end $$
delimiter ;
#set @row='[{"categoryid":"e15","categoryname":"555","englishname":"5555","_action":"add","parentnodeid":"E","isparentflag":0,"level":2,"ancestor":"E#","_reloadrow":1,"_treeflag":1,"_treefield":"categoryid"}]';
#call sys_runEditRows('categorytree','categoryid','',@row, @n);
set @data1='[{"productid":"0","productname":"青岛啤酒2","englishname":"Tsintao Beer","quantityperunit":"330ml*6罐","unit":"箱","unitprice":"26.00","categoryid":"A","supplierid":"qtpj","categoryname":"饮料","_action":"add","_reloadrow":1,"_treeflag":0}]';
set @data1='[{"productid":111,"productname":"111","englishname":"111","quantityperunit":"111","unit":"111","unitprice":11,"subcategoryid":"D3","categoryname":"乳制品","supplierid":"DLSP","releasedate":"2023-04-16","categoryid":"D","photopath":[],"_action":"add","_reloadrow":1,"_treeflag":0}]';
#set @data2 = JSON_SET(@data1, '$[0].productid', 0);
#select @data2;
#call sys_runEditRows('products', 'productid', '', @data1, @v);
#select @v;