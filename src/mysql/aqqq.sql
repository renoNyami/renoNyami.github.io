
DROP TABLE IF EXISTS `sys_users`;
CREATE TABLE `sys_users` (
  `userid` char(16) NOT NULL DEFAULT '',
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET gbk DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  hobby3 json,
  hobby1 varchar(500),
  hobby2 varchar(500)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `sys_users` (userid, username,password, mobile, email) VALUES ('19990512','张燕燕','123456','13857123456','zhangyan@zstu.edu.cn'),('20000554','祝锡永','123456','13857134567','zxywolf@163.com'),('20000555','曹孟德','123456','1234567123','12345@126.com'),('20000556','诸葛孔明','zxywolf99052','1234567123','1111@111.com'),('20011234','朱晓玲','123456','13588823456','zhue@163.com'),('20010687','赖佩仪','123456','13858145678',
'laipy@126.com'),('202120902040','陈昌佳','zdd13791714957',NULL,NULL),('202120902041','高彧馨','962464',NULL,NULL),('202120902042','胡长伟','qwerdf123','13996586522','huchangw.ip@qq.com'),('202120902043','李彦林','202120902043',NULL,NULL),('202120902044','梁琳','qwer123++',NULL,NULL),('202120902045','刘晓蝶','19990101lxd',NULL,NULL),('202120902046','潘佳','pppjjj666',NULL,NULL),('202120902047','苏芳芳','123456.',NULL,NULL),('202120902048','屠尔刚','imlab1997',NULL,NULL),('202120902049','吴崇南','100216',NULL,NULL),('202120902050','杨佳晨','325614845',NULL,NULL),('202120902051','于浩','y1234567890.',NULL,NULL),('202120902052','袁田恬','1593574628ttY',NULL,NULL),('202120902053','章琳娅','zzz63546919',NULL,NULL),('202120902054','郑爱萍','amanda520AMANDA',NULL,NULL),('202130904077','邓陈曦','3904xi',NULL,NULL),('202130904078','傅正','fz970411',NULL,NULL),('202130904079','李彬彬','lms1214917894',NULL,NULL),('202130904080','陆一可','Zxyybxx1',NULL,NULL),('202130904081','吕永康','135670lyk',NULL,NULL),('202130904082','莫高华','momo725998',NULL,NULL),('202130904083','沙通','qwe382522',NULL,NULL),('202130904084','沈诗琦','ssq33419980409',NULL,NULL),('202130904085','孙琪','474457100',NULL,NULL),('202130904086','唐瑞锋','chaoyue.ziwo',NULL,NULL),('202130904087','王赟喆','wyz981124',NULL,NULL),('202130904088','杨斯婷','eskyyanjy',NULL,NULL),('202130904089','张恪菁','zkj378596',NULL,NULL),('202130904090','张艳文','25145wyz',NULL,NULL),('202130904091','赵梦婷','tingshuo',NULL,NULL),('202130904092','诸楚洁','q741852963',NULL,NULL);

with tmp as (select userid from sys_users order by rand() limit 10)
update sys_users set hobby3='[{"title":"下棋"},{"title":"唱歌"},{"title":"编程"}]', hobby1='下棋;唱歌;书法;编程', hobby2="['下棋','唱歌','书法']" where userid in (select userid from tmp);

with tmp as (select userid from sys_users order by rand() limit 10)
update sys_users set hobby3='[{"title":"下棋"},{"title":"唱歌"},{"title":"编程"}]', hobby1='下棋;钓鱼;书法;弹琴', hobby2="['下棋','钓鱼','弹琴','编程']" where userid in (select userid from tmp);

with tmp as (select userid from sys_users order by rand() limit 10)
update sys_users set hobby3='[{"title":"下棋"},{"title":"唱歌"},{"title":"编程"}]', hobby1='下棋;钓鱼;唱歌;书法;弹琴;编程', hobby2="['下棋','钓鱼','唱歌','书法','弹琴','编程']" where userid in (select userid from tmp);


select * from sys_users;