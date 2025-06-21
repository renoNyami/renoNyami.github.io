use mysales;
DROP TABLE IF EXISTS `sys_users`;
CREATE TABLE `sys_users` (
  `userid` char(16) NOT NULL DEFAULT '',
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET gbk DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `sys_users` VALUES ('19990512','张燕燕','123456','13857123456','zhangyan@zstu.edu.cn'),('20000554','祝锡永','123456','13857134567','zxywolf@163.com'),
('20000555','曹孟德','123456','1234567123','12345@126.com'),('20000556','诸葛孔明','zxywolf99052','1234567123','1111@111.com'),
('20011234','朱晓玲','123456','13588823456','zhue@163.com'),('20010687','赖佩仪','123456','13858145678',
'laipy@126.com'),('202120902040','陈昌佳','zdd13791714957',NULL,NULL),('202120902041','高彧馨','962464',NULL,NULL),('202120902042','胡长伟','qwerdf123','13996586522','huchangw.ip@qq.com'),('202120902043','李彦林','202120902043',NULL,NULL),('202120902044','梁琳','qwer123++',NULL,NULL),('202120902045','刘晓蝶','19990101lxd',NULL,NULL),('202120902046','潘佳','pppjjj666',NULL,NULL),('202120902047','苏芳芳','123456.',NULL,NULL),('202120902048','屠尔刚','imlab1997',NULL,NULL),('202120902049','吴崇南','100216',NULL,NULL),('202120902050','杨佳晨','325614845',NULL,NULL),('202120902051','于浩','y1234567890.',NULL,NULL),('202120902052','袁田恬','1593574628ttY',NULL,NULL),('202120902053','章琳娅','zzz63546919',NULL,NULL),('202120902054','郑爱萍','amanda520AMANDA',NULL,NULL),('202130904077','邓陈曦','3904xi',NULL,NULL),('202130904078','傅正','fz970411',NULL,NULL),('202130904079','李彬彬','lms1214917894',NULL,NULL),('202130904080','陆一可','Zxyybxx1',NULL,NULL),('202130904081','吕永康','135670lyk',NULL,NULL),('202130904082','莫高华','momo725998',NULL,NULL),('202130904083','沙通','qwe382522',NULL,NULL),('202130904084','沈诗琦','ssq33419980409',NULL,NULL),('202130904085','孙琪','474457100',NULL,NULL),('202130904086','唐瑞锋','chaoyue.ziwo',NULL,NULL),('202130904087','王赟喆','wyz981124',NULL,NULL),('202130904088','杨斯婷','eskyyanjy',NULL,NULL),('202130904089','张恪菁','zkj378596',NULL,NULL),('202130904090','张艳文','25145wyz',NULL,NULL),('202130904091','赵梦婷','tingshuo',NULL,NULL),('202130904092','诸楚洁','q741852963',NULL,NULL);
select userid,username from sys_users;

#选项字典表
DROP TABLE IF EXISTS `dictionary`;
CREATE TABLE `dictionary` (
  `RowID` bigint(20) NOT NULL AUTO_INCREMENT primary key,
  `Type` varchar(50) DEFAULT '',
  `Title` varchar(255) DEFAULT '',
  `Code` varchar(255) DEFAULT '',
  `SortFlag` tinyint(4) DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
TRUNCATE TABLE Dictionary;
INSERT INTO `dictionary` VALUES (1,'职称','教授','jiaoshou',0),(2,'职称','副授','fushou',0),(3,'职称','讲师','jiangshi',0),(4,'职称','助教','zhujiao',0),(5,'职称','研究员','yanjiuyuan',0),(6,'职称','助理研究员','zhuliyanjiuyuan',0),(7,'职称','其他正高级','qitazhenggaoji',0),(8,'职称','其他副高级','qitafugaoji',0),(9,'职称','正高','zhenggao',0),(10,'职称','副高','fugao',0),(11,'职称','中级','zhongji',0),(12,'职称','初级','chuji',0),(13,'职称','其它','qita',9),(14,'学历','博士研究生','boshiyanjiusheng',0),(15,'学历','硕士研究生','shishiyanjiusheng',0),(16,'学历','大学本科','daxuebenke',0),(17,'学历','大学专科','daxuezhuanke',0),(18,'学历','高中','gaozhong',0),(19,'学历','初中','chuzhong',0),(20,'学历','小学','xiaoxue',0),(21,'学历','无','wu',0),(22,'学历','其它','qita',9),(23,'党派','中国党员','zhongguodangyuan',0),(24,'党派','民建同盟','minjiantongmeng',0),(25,'党派','九三学社','jiusanxueshe',0),(26,'党派','致公党','zhigongdang',0),(27,'党派','民革','minge',0),(28,'党派','中国国民党','zhongguoguomindang',0),(29,'党派','无党派','wudangpai',0),(30,'党派','中国党员','zhongguodangyuan',0),(31,'资源类别','电子课件','dianzikejian',0),(32,'资源类别','电子教材','dianzijiaocai',0),(33,'资源类别','自编讲义','zibianjiangyi',0),(34,'资源类别','电子题库','dianzidiku',0),(35,'资源类别','电子图书','dianzitushu',0),(36,'资源类别','视频课程','shibinkecheng',0),(37,'资源类别','音频课程','yinbinkecheng',0),(38,'资源类别','学科竞赛作品','xuekejingsaizuopin',0),(39,'资源类别','学生论文','xueshenglunwen',0),(40,'资源类别','学生专利','xueshengzhuanli',0),(41,'资源类别','开源系统实例','kaiyuanxitongshili',0),(42,'资源类别','系统演示版','xitongyanshiban',0),(43,'资源类别','专业培养计划','zhuanyepeiyangjihua',0),(44,'资源类别','课程教学大纲','kechengjiaoxuedagang',0),(45,'资源类别','课程考试大纲','kechengkaoshidagang',0),(46,'资源类别','课程简介','kechengjianjie',0),(47,'资源类别','实验指导书','shiyanzhidaoshu',0),(48,'资源类别','课程考试总结','kechengkaoshizongji',0),(49,'资源类别','教学日历','jiaoxuerili',0),(50,'资源类别','其他资源','qitaziyuan',9),(51,'资源类别','知识超链接','zhishichaolianjie',0),(52,'资源类别','实用工具','shiyonggongju',0),(53,'资源类别','英语学习','yangyuxuexi',0),(54,'资源类别','软件工具','ruanjiangongju',0),(55,'资源类别','毕业设计','biyesheji',0),(56,'难度等级','容易','',1),(57,'难度等级','适中','',2),(58,'难度等级','较难','',3),(59,'难度等级','其他','',9),(60,'试题来源','试题集','',1),(61,'试题来源','往年考题','',2),(62,'试题来源','教材','',3),(63,'试题来源','参考书','',4),(64,'试题来源','网络媒体','',5),(65,'试题来源','其他','',9),(66,'试题类型','练习','',1),(67,'试题类型','考试','',2),(68,'试题类型','其他','',9),(69,'优先级','高','',1),(70,'优先级','较高','',2),(71,'优先级','中等','',3),(72,'优先级','低','',4),(73,'优先级','较低','',5),(74,'优先级','很低','',6),(75,'优先级','其他','',9),(76,'用户类别','学生','1',1),(77,'用户类别','教师','2',2),(78,'用户类别','系统管理员','3',3),(79,'用户类别','游客','0',4),(80,'Excel模板','一行一题','1',1),(81,'Excel模板','多行一题','2',2),(82,'课题性质','工程设计','',0),(83,'课题性质','作品设计','',0),(84,'课题性质','软件设计','',0),(85,'课题性质','创作设计','',0),(86,'课题性质','理论研究','',0),(87,'课题性质','实验研究','',0),(88,'课题性质','论题研究和调查统计 ','',0),(89,'课题来源','纵向课题','',0),(90,'课题来源','横向课题','',0),(91,'课题来源','教师自立课题','',0),(92,'课题来源','学生自立课题','',0),(96,'选题类型','毕业论文与毕业设计','',3),(97,'选题类型','毕业论文','',2),(98,'选题类型','毕业设计','',1),(99,'奖项成绩','特等奖','',1),(100,'奖项成绩','一等奖','',2),(101,'奖项成绩','二等奖','',3),(102,'奖项成绩','三等奖','',4),(103,'奖项成绩','金奖','',5),(104,'奖项成绩','银奖','',6),(105,'奖项成绩','铜奖','',7),(106,'奖项成绩','其他','',8),(107,'竞赛等级','国家级','',1),(108,'竞赛等级','国家部委级','',2),(109,'竞赛等级','省级','',3),(110,'竞赛等级','厅局级','',4),(111,'竞赛等级','校级','',5),(112,'竞赛等级','其他','',6),(113,'科创项目类型','国家创新训练项目','',1),(114,'科创项目类型','浙江省新苗项目','',2),(115,'科创项目类型','省部级科创项目','',3),(116,'科创项目类型','厅局级科创项目','',4),(117,'科创项目类型','校级科创项目','',5),(118,'科创项目类型','其他科创项目','',6),(119,'科创项目等级','国家级','',1),(120,'科创项目等级','省部级','',2),(121,'科创项目等级','厅局级','',3),(122,'科创项目等级','校级','',4),(123,'科创项目等级','其它','',5);
-- INSERT INTO Dictionary VALUES(1,'所属行业','农业  ','',0),(2,'所属行业','渔业','',0),(3,'所属行业','牧业','',0),(4,'所属行业','林业','',0),(5,'所属行业','采矿业  ','',0),(6,'所属行业','制造业  ','',0),(7,'所属行业','电力、热力、燃气及水生产和供应业  ','',0),(8,'所属行业','建筑业  ','',0),(9,'所属行业','批发和零售业  ','',0),(10,'所属行业','交通运输、仓储和邮政业  ','',0),(11,'所属行业','住宿和餐饮业  ','',0),(12,'所属行业','信息传输、软件和信息技术服务业  ','',0),(13,'所属行业','金融业  ','',0),(14,'所属行业','房地产业  ','',0),(15,'所属行业','租赁和商务服务业  ','',0),(16,'所属行业','科学研究和技术服务业  ','',0),(17,'所属行业','水利、环境和公共设施管理业  ','',0),(18,'所属行业','居民服务、修理和其他服务业  ','',0),(19,'所属行业','教育  ','',0),(20,'所属行业','卫生和社会工作  ','',0),(21,'所属行业','文化、体育和娱乐业  ','',0),(22,'所属行业','公共管理、社会保障和社会组织  ','',0),(23,'所属行业','国际组织','',0),(24,'所属行业','其他','',9),(25,'单位性质','国有企业  ','SOE',0),(26,'单位性质','国有控股企业  ','SCE',0),(27,'单位性质','外资企业  ','FIE',0),(28,'单位性质','合资企业  ','JV',0),(29,'单位性质','私营企业  ','PE',0),(30,'单位性质','事业单位  ','PI',0),(31,'单位性质','国家行政机关  ','SAO',0),(32,'单位性质','其他','',8);
select * from Dictionary;

drop procedure if exists demo1301a;
delimiter $$
create procedure demo1301a()
begin
    select distinct type as 'key', type as 'id', type as 'text', '' as parentnodeid, 1 as level, 0 as isparentflag,  '' as ancestor from dictionary;
end $$
delimiter ;

drop procedure if exists demo1301b;
delimiter $$
create procedure demo1301b(
	$type char(14)
)
begin
	select * from dictionary where type=$type order by sortflag;
end $$
delimiter ;
call demo1301b('职称');

drop procedure if exists demo1301c;
delimiter $$
create procedure demo1301c(  #修改或删除类别
	$oldtype varchar(100),
    $newtype varchar(100),
    $action varchar(100)
)
begin
	if ($action='update') then
		if exists(select 1 from dictionary where type=$newtype) then
			select 0 as flag;
		else
			update dictionary set type=$newtype where type=$oldtype;
			select 1 as flag;
		end if;        
	elseif ($action='delete') then
		delete from dictionary where type=$oldtype;
        select 1 as flag;
	end if;    
end $$ 
delimiter ;

drop procedure if exists demo1301d;
delimiter $$
create procedure demo1301d(  #保存选项明细记录
	$newdata json,
    $olddata json
)
begin
	declare $n1, $n2, $flag int default 0; 
    declare $type varchar(100);
    #set $n1=json_length($newdata);
    #set $n2=json_length($olddata);
	#判断是否相同
	drop temporary table if exists tmp1;
	drop temporary table if exists tmp2;
	create temporary table tmp1 SELECT * FROM JSON_TABLE($olddata, "$[*]" COLUMNS(        
		type varchar(100) PATH "$.type", 
		title varchar(100) PATH "$.title", 
		code varchar(100) PATH "$.code", 
		sortflag int PATH "$.sortflag", 
		rowid int PATH "$.rowid"
	)) as p;
	create temporary table tmp2 SELECT * FROM JSON_TABLE($newdata, "$[*]" COLUMNS(
		type varchar(100) PATH "$.type", 
		title varchar(100) PATH "$.title", 
		code varchar(100) PATH "$.code", 
		sortflag int PATH "$.sortflag", 
		rowid int PATH "$.rowid"        
	) ) as p;
    select count(*) into $n1 from tmp1;
    select count(*) into $n2 from tmp2;
    if ($n1=$n2) then    
		select count(*) into $n1 from tmp1 where rowid not in (select rowid from tmp2);
		select count(*) into $n2 from tmp2 where rowid not in (select rowid from tmp1);
        if ($n1=0 && $n2=0) then 
			if not exists (select 1 from tmp1 as a join tmp2 as b on a.rowid=b.rowid where a.title<>b.title or a.code<>b.code or a.sortflag<>b.sortflag) then
				set $flag=1; 
			end if;
        end if;    
    end if;
    update dictionary as a join tmp2 as b on a.rowid=b.rowid 
    set a.title=b.title, a.code=b.code, a.sortflag=b.sortflag, a.type=b.type;
    insert into dictionary (type, title,code, sortflag) select type, title,code, sortflag from tmp2 
    where rowid is null or rowid=0;
    delete from dictionary where rowid in (select rowid from tmp1 where rowid not in (select rowid from tmp2));          
    select type into $type from tmp2 limit 1;
    select * from dictionary where type=$type order by sortflag;
end $$
delimiter ;
set @olddata='[{"code":"boshiyanjiusheng","_sysrowno":"1","type":"学历","title":"博士研究生1","rowid":"14","sortflag":"0"},{"code":"shishiyanjiusheng","_sysrowno":"2","type":"学历","title":"硕士研究生","rowid":"15","sortflag":"0"},{"code":"daxuebenke","_sysrowno":"3","type":"学历","title":"大学本科2","rowid":"16","sortflag":"0"},{"code":"daxuezhuanke","_sysrowno":"4","type":"学历","title":"大学专科","rowid":"17","sortflag":"0"},{"code":"gaozhong","_sysrowno":"5","type":"学历","title":"高中","rowid":"18","sortflag":"0"},{"code":"chuzhong","_sysrowno":"6","type":"学历","title":"初中","rowid":"19","sortflag":"0"},{"code":"xiaoxue","_sysrowno":"7","type":"学历","title":"小学","rowid":"20","sortflag":"0"},{"code":"wu","_sysrowno":"8","type":"学历","title":"无","rowid":"21","sortflag":"0"},{"code":"qita","_sysrowno":"7","type":"学历","title":"其它","rowid":"22","sortflag":"9"}]';
set @newdata='[{"code":"boshiyanjiusheng","_sysrowno":"1","type":"学历","title":"博士研究生1","rowid":"14","sortflag":"0"},{"code":"shishiyanjiusheng","_sysrowno":"2","type":"学历","title":"硕士研究生","rowid":"15","sortflag":"0"},{"code":"daxuebenke","_sysrowno":"3","type":"学历","title":"大学本科2","rowid":"16","sortflag":"0"},{"code":"daxuezhuanke","_sysrowno":"4","type":"学历","title":"大学专科","rowid":"17","sortflag":"0"},{"code":"gaozhong","_sysrowno":"5","type":"学历","title":"高中","rowid":"18","sortflag":"0"},{"code":"chuzhong","_sysrowno":"6","type":"学历","title":"初中","rowid":"19","sortflag":"0"},{"code":"qita","_sysrowno":"7","type":"学历","title":"其它","rowid":"22","sortflag":"9"},{"_sysrowno":"8","title":"其它2","code":"qt1","sortflag":0,"type":"学历"},{"_sysrowno":"9","title":"其他1","code":"qt3","sortflag":2,"type":"学历"}]';
#call demo1301d(@newdata, @olddata);
#set @newdata='[{"code":"boshiyanjiusheng","_total":"123","_sysrowno":"1","type":"学历","title":"博士研究生","rowid":"14","sortflag":1},{"code":"shishiyanjiusheng","_total":"123","_sysrowno":"2","type":"学历","title":"硕士研究生","rowid":"15","sortflag":2},{"code":"daxuebenke","_total":"123","_sysrowno":"3","type":"学历","title":"大学本科","rowid":"16","sortflag":"0"},{"code":"daxuezhuanke","_total":"123","_sysrowno":"4","type":"学历","title":"大学专科","rowid":"17","sortflag":"0"},{"code":"gaozhong","_total":"123","_sysrowno":"5","type":"学历","title":"高中11","rowid":"18","sortflag":"0"},{"code":"chuzhong","_total":"123","_sysrowno":"6","type":"学历","title":"初中","rowid":"19","sortflag":"0"},{"code":"xiaoxue","_total":"123","_sysrowno":"7","type":"学历","title":"小学22","rowid":"20","sortflag":"0"},{"code":"wu","_total":"123","_sysrowno":"8","type":"学历","title":"无","rowid":"21","sortflag":"0"},{"code":"qita","_total":"123","_sysrowno":"9","type":"学历","title":"其它","rowid":"22","sortflag":"9"},{"_sysrowno":"10","title":"职高","code":"zhegao","sortflag":8}]';
select * from tmp1;
select * from tmp2;

select* from dictionary where type='学历';
 