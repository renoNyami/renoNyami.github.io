DROP TABLE IF EXISTS `examples`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `examples` (
  `ExampleID` char(12) NOT NULL,
  `Title` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `submodules` varchar(255) DEFAULT NULL,
  `ParentNodeid` varchar(12) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `isparentflag` tinyint(4) DEFAULT NULL,
  `ancestor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ExampleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `examples` VALUES ('01','第1章 Javascript基础',NULL,NULL,'',1,1,''),
('02','第2章 React与HTML基础',NULL,NULL,'',1,1,''),
('03','第3章 React与数据库操作',NULL,NULL,'',1,1,''),
#('04','第4章 EasyUI基础控件',NULL,NULL,'',1,1,''),
#('05','第5章 EasyUI数据库控件',NULL,NULL,'',1,1,''),
#('06','第6章 EasyUI综合应用',NULL,NULL,'',1,1,''),
('07','第7章 AntD基础控件',NULL,NULL,'',1,1,''),
('08','第8章 AntD数据库控件',NULL,NULL,'',1,1,''),
('09','第9章 AntD表格数据编辑',NULL,NULL,'',1,1,''),
('10','第10章 AntD树数据编辑',NULL,NULL,'',1,1,''),
('101','js基础语句','pages/chp01/demo101','','01',2,0,'01#'),
('102','常量及其定义','pages/chp01/demo102','','01',2,0,'01#'),
('103','let与var在if语句中的区别','pages/chp01/demo103','','01',2,0,'01#'),
('104','let与var在循环语句中的区别','pages/chp01/demo104','','01',2,0,'01#'),
('105','日期与字符串数据类型转换','pages/chp01/demo105','','01',2,0,'01#'),
('106','*React元素变量及其应用','pages/chp01/demo106','','01',2,0,'01#'),
('107','*汉字助记码函数','pages/chp01/demo107','','01',2,0,'01#'),
('108','*字符串函数应用于数据验证','pages/chp01/demo108','','01',2,0,'01#'),
('109','模板字符串','pages/chp01/demo109','','01',2,0,'01#'),
('110','条件语句的比较与应用','pages/chp01/demo110','','01',2,0,'01#'),
('111','循环语句的比较与应用','pages/chp01/demo111','','01',2,0,'01#'),
('112','try...catch...finally语句应用','pages/chp01/demo112','','01',2,0,'01#'),
('113','*sort函数中实现汉字拼音排序','pages/chp01/demo113','','01',2,0,'01#'),
('114','求字符串中最大重复部分','pages/chp01/demo114','','01',2,0,'01#'),
('115','数组合并应用','pages/chp01/demo115','','01',2,0,'01#'),
('116','JSON数据嵌套定义','pages/chp01/demo116','','01',2,0,'01#'),
('117','*JSON数据的更新','pages/chp01/demo117','','01',2,0,'01#'),
('118','*JSON属性的递归遍历','pages/chp01/demo118','','01',2,0,'01#'),
('119','*JSON属性的变量功能','pages/chp01/demo119','','01',2,0,'01#'),
('120','JSON对象嵌套属性合并','pages/chp01/demo120','','01',2,0,'01#'),
('121','JSON解析赋值','pages/chp01/demo121','','01',2,0,'01#'),
('122','JSON数组for循环遍历','pages/chp01/demo122','','01',2,0,'01#'),
('123','JSON数组map()遍历','pages/chp01/demo123','','01',2,0,'01#'),
('124','JSON数组forEach()遍历','pages/chp01/demo124','','01',2,0,'01#'),
('125','JSON数组过滤与查找','pages/chp01/demo125','','01',2,0,'01#'),
('126','JSON树结点递归遍历','pages/chp01/demo126','','01',2,0,'01#'),
('127','JSON树结点特征值的计算','pages/chp01/demo127','','01',2,0,'01#'),
('128','JSON树结点的查找','pages/chp01/demo128','','01',2,0,'01#'),
('129','JSON树结点的新增','pages/chp01/demo129','','01',2,0,'01#'),
('130','JSON树型结构逐级汇总','pages/chp01/demo130','','01',2,0,'01#'),
('131','JS函数——计量单位换算','pages/chp01/demo131','','01',2,0,'01#'),
('132','JS函数——数字转人民币大写','pages/chp01/demo132','','01',2,0,'01#'),
('191','我的临时实例','pages/chp01/Page191','', '01', 2, 0, '01#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
#('201','主控程序index.js','pages/chp02/demo201','', '02', 2, 0, '02#'),
('202','Route页面跳转','pages/chp02/demo202','', '02', 2, 0, '02#'),
('203','state与setState','pages/chp02/demo203','', '02', 2, 0, '02#'),
('204','props与类组件','pages/chp02/demo204','', '02', 2, 0, '02#'),
('205','useState与函数组件','pages/chp02/demo205','', '02', 2, 0, '02#'),
('206','数组渲染HTML','pages/chp02/demo206','', '02', 2, 0, '02#'),
('207','字符串渲染HTML','pages/chp02/demo207','', '02', 2, 0, '02#'),
('208','React生命周期-视频播放','pages/chp02/demo208','', '02', 2, 0, '02#'),
('209','React的事件与取值','pages/chp02/demo209','', '02', 2, 0, '02#'),
('227','动态添加组件值','pages/chp02/Page205','', '02', 2, 0, '02#'),
('228','使用div+span标签','pages/chp02/Page206','', '02', 2, 0, '02#'),
('229','类式组件页面跳转','pages/chp02/Page207','pages/chp02/Page207b', '02',2, 0, '02#'),
('230','函数组件页面跳转','pages/chp02/Page208','pages/chp02/Page208a','02', 2, 0, '02#'),
('239','Link页面跳转参数传递','pages/chp02/Page209','', '02', 2, 0, '02#'),
('242','Tabs选项卡跳转','pages/chp02/Page210','pages/chp02/Page210a', '02', 2, 0, '02#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('301','axios远程访问服务器','pages/chp03/Page301','', '03', 2, 0, '03#'),
('302','axios连接数据库','pages/chp03/Page302','', '03', 2, 0, '03#'),
('303','span数据展示','pages/chp03/Page303','', '03', 2, 0, '03#'),
('304','数据分页显示','pages/chp03/Page304','', '03', 2, 0, '03#'),
('305','数据联动','pages/chp03/Page305','', '03', 2, 0, '03#'),
('306','树形结构显示数据','pages/chp03/Page306','', '03', 2, 0, '03#'),
('307','列表与数据编辑','pages/chp03/Page307','', '03', 2, 0, '03#'),
('308','表格与窗体数据编辑','pages/chp03/Page308','', '03', 2, 0, '03#');


/*
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('401','EasyUI基础控件','pages/chp04/Page401','', '04', 2, 0, '04#'),
('402','函数组件的定义与使用','pages/chp04/Page402','', '04', 2, 0, '04#'),
('403','类组件的定义与使用','pages/chp04/Page403','', '04', 2, 0, '04#'),
('404','layout控件','pages/chp04/Page404', '','04', 2, 0, '04#'),
('405','Tabs选项卡','pages/chp04/Page405','', '04', 2, 0, '04#'),
('406','filebutton文件上传','pages/chp04/Page406','', '04', 2, 0, '04#'),
('407','菜单','pages/chp04/Page407', '','04', 2, 0, '04#'),
('408','window窗体','pages/chp04/Page408','', '04', 2, 0, '04#'),
('409','综合应用','pages/chp04/Page409','', '04', 2, 0, '04#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('501','combobox联动','pages/chp05/Page501','', '05', 2, 0, '05#'),
('502','datalist数据列表','pages/chp05/Page502','', '05', 2, 0, '05#'),
('503','datalist分页','pages/chp05/Page503','', '05', 2, 0, '05#'),
('504','datagrid分页与过滤','pages/chp05/Page504','', '05', 2, 0, '05#'),
('505','tree一次性加载结点','pages/chp05/Page505','', '05', 2, 0, '05#'),
('506','tree逐级展开结点','pages/chp05/Page506','', '05', 2, 0, '05#'),
('507','tree树结点的合成','pages/chp05/Page507','', '05', 2, 0, '05#'),
('508','tree树结点联动','pages/chp05/Page508','', '05', 2, 0, '05#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('601','网格数据增删改','pages/chp06/Page601','', '06', 2, 0, '06#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('602','树结点增删改','pages/chp06/Page602','', '06', 2, 0, '06#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('603','树网格数据分类增删改','pages/chp06/Page603','', '06', 2, 0, '06#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('604','订单编辑程序','pages/chp06/Page604','', '06', 2, 0, '06#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('606','树与eCharts图表','pages/chp06/Page606','', '06', 2, 0, '06#');
*/
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('701','AntD基础控件与事件','pages/chp07/Page701','', '07', 2, 0, '07#'),
('702','AntD绝对位置布局','pages/chp07/Page702','', '07', 2, 0, '07#'),
('703','AntD自定义组件','pages/chp07/Page703','', '07', 2, 0, '07#'),
('704','AntD-layout控件','pages/chp07/Page704', '','07', 2, 0, '07#'),
('705','AntD-Tabs选项卡','pages/chp07/Page705','', '07', 2, 0, '07#'),
('706','AntD-upload文件上传','pages/chp07/Page706','', '07', 2, 0, '07#'),
('707','AntD-菜单','pages/chp07/Page707', '','07', 2, 0, '07#'),
('708','AntD-浮窗与消息框','pages/chp07/Page708','', '07', 2, 0, '07#'),
('710','AntD临时文件','pages/chp07/Page710','', '07', 2, 0, '07#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('801','Table数据分页与过滤','pages/chp08/Page801','', '08', 2, 0, '08#'),
('802','List横竖分页显示数据','pages/chp08/Page802','', '08', 2, 0, '08#'),
('803','Tree一次性加载结点','pages/chp08/Page803','', '08', 2, 0, '08#'),
('804','Tree逐级展开结点','pages/chp08/Page804','', '08', 2, 0, '08#'),
('805','Tree结点组合与选中事件','pages/chp08/Page805','', '08', 2, 0, '08#'),
('806','Table数据查询组件','pages/chp08/Page806','', '08', 2, 0, '08#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('901','Table+浮窗数据编辑','pages/chp09/Page901','', '09', 2, 0, '09#'),
('902','Table+选项卡数据编辑','pages/chp09/Page902','', '09', 2, 0, '09#'),
('903','Table+抽屉选项卡数据编辑','pages/chp09/Page903','', '09', 2, 0, '09#'),
('904','span+浮窗数据编辑','pages/chp09/Page904','', '09', 2, 0, '09#'),
('905','Table数据编辑组件','pages/chp09/Page905','', '09', 2, 0, '09#'),
('906','Table数据查询组件','pages/chp09/Page906','', '09', 2, 0, '09#'),
('907','Table一对多数据编辑','pages/chp09/Page907','', '09', 2, 0, '09#'),

('1001','tree结点增删改','pages/chp10/Page1001','', '10', 2, 0, '10#'),
('1002','tree结点逐级展开与增删改','pages/chp10/Page1002','', '10', 2, 0, '10#'),
('1003','tree结点编码自动生成','pages/chp10/Page1003','', '10', 2, 0, '10#'),
('1004','tree+Table数据增删改','pages/chp10/Page1004','', '10', 2, 0, '10#'),

('1101','AntD订单编辑程序','pages/chp11/Page1101','', '11', 2, 0, '11#'),
('1102','AntD订单审核程序','pages/chp11/Page1102','', '11', 2, 0, '11#'),

('1201','highcharts单序列图','pages/chp12/Page1201','', '12', 2, 0, '12#'),
('1202','highcharts多序列图','pages/chp12/Page1202','', '12', 2, 0, '12#');

