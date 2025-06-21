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
INSERT INTO `examples` VALUES 
-- ('00','第0章 我的作业',NULL,NULL,'',1,1,''),
('01','第1章 Javascript基础',NULL,NULL,'',1,1,''),
('02','第2章 React与HTML基础',NULL,NULL,'',1,1,''),
('03','第3章 React与数据库操作',NULL,NULL,'',1,1,''),
('07','第7章 AntD基础控件',NULL,NULL,'',1,1,''),
('08','第8章 AntD数据库控件',NULL,NULL,'',1,1,''),
('09','第9章 AntD表格数据编辑',NULL,NULL,'',1,1,''),
('10','第10章 AntD树结点编辑',NULL,NULL,'',1,1,''),
('11','第11章 AntD综合应用',NULL,NULL,'',1,1,''),
('12','第12章 eCharts图表应用',NULL,NULL,'',1,1,''),
('13','第13章 系统管理',NULL,NULL,'',1,1,''),
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
('133','JS实现数据分组汇总1','pages/chp01/demo133','','01',2,0,'01#'),
('134','JS实现数据分组汇总2','pages/chp01/demo134','','01',2,0,'01#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
#('201','主控程序index.js','pages/chp02/demo201','', '02', 2, 0, '02#'),
('202','Route页面跳转','pages/chp02/demo202','', '02', 2, 0, '02#'),
('203','state与setState','pages/chp02/demo203','', '02', 2, 0, '02#'),
('204','props与类组件','pages/chp02/demo204','', '02', 2, 0, '02#'),
('205','useState与函数组件','pages/chp02/demo205','', '02', 2, 0, '02#'),
('206','数组渲染HTML','pages/chp02/demo206','', '02', 2, 0, '02#'),
('207','字符串渲染HTML','pages/chp02/demo207','', '02', 2, 0, '02#'),
('208','React生命周期-播放器','pages/chp02/demo208','', '02', 2, 0, '02#'),
('209','React的事件与取值','pages/chp02/demo209','', '02', 2, 0, '02#'),
('210','页面跳转与参数传递','pages/chp02/demo210','', '02',2, 0, '02#'),
('211','自定义组件-带星评价','pages/chp02/demo211','', '02',2, 0, '02#'),
('212','自定义组件-','pages/chp02/demo211','', '02',2, 0, '02#');

insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('301','Axios访问服务器','pages/chp03/demo301','', '03', 2, 0, '03#'),
('302','redoSQL访问数据库','pages/chp03/demo302','', '03', 2, 0, '03#'),
('303','span动态数据展示','pages/chp03/demo303','', '03', 2, 0, '03#'),
('304','数据分页显示','pages/chp03/demo304','', '03', 2, 0, '03#'),
('305','下拉框数据联动','pages/chp03/demo305','', '03', 2, 0, '03#'),
('306','树形结构显示数据','pages/chp03/demo306','', '03', 2, 0, '03#'),
('307','表格与表单数据编辑','pages/chp03/demo307','', '03', 2, 0, '03#'),
('308','表格与窗体数据编辑','pages/chp03/demo308','', '03', 2, 0, '03#'),
('309','列表与表单数据编辑','pages/chp03/demo309','', '03', 2, 0, '03#'),
('310','动态类组件菜单','pages/chp03/demo310','', '03', 2, 0, '03#'),
('311','动态函数组件菜单','pages/chp03/demo311','', '03', 2, 0, '03#'),
('312','<ul>+<li>嵌套与await','pages/chp03/demo312','', '03', 2, 0, '03#'),
('313','线性表表示的树型结构','pages/chp03/demo313','', '03', 2, 0, '03#'),
('314','自定义组件MyInput','pages/chp03/demo314','', '03', 2, 0, '03#'),
('315','用户登录框','pages/chp03/demo315','', '03', 2, 0, '03#');
#('316','临时文件','pages/chp03/demo316','', '03', 2, 0, '03#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('701','AntD基础控件与事件','pages/chp07/demo701.jsx','', '07', 2, 0, '07#'),
('702','AntD绝对位置布局','pages/chp07/demo702.jsx','', '07', 2, 0, '07#'),
('703','AntD自定义组件','pages/chp07/demo703.jsx','', '07', 2, 0, '07#'),
('704','AntD-layout控件','pages/chp07/demo704', '','07', 2, 0, '07#'),
('705','AntD-Tabs选项卡','pages/chp07/demo705','', '07', 2, 0, '07#'),
('706','AntD-upload文件上传','pages/chp07/demo706','', '07', 2, 0, '07#'),
('707','AntD-菜单',          'pages/chp07/demo707', '','07', 2, 0, '07#'),
('708','AntD-浮窗与消息框','pages/chp07/demo708','', '07', 2, 0, '07#'),
('710','AntD临时文件','pages/chp07/demo710','', '07', 2, 0, '07#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('801','Table数据分页与过滤','pages/chp08/Page801','', '08', 2, 0, '08#'),
('802','List横竖分页显示数据','pages/chp08/Page802','', '08', 2, 0, '08#'),
('803','Tree一次性加载结点','pages/chp08/Page803','', '08', 2, 0, '08#'),
('804','Tree逐级展开结点','pages/chp08/Page804','', '08', 2, 0, '08#'),
('805','Tree结点组合与选中事件','pages/chp08/Page805','', '08', 2, 0, '08#'),
('806','AntdTree自定义组件','pages/chp08/Page806','', '08', 2, 0, '08#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('901','Table+浮窗数据编辑','pages/chp09/Page901','', '09', 2, 0, '09#'),
('902','Table+表单数据编辑','pages/chp09/Page902','', '09', 2, 0, '09#'),
('903','Table+抽屉数据编辑','pages/chp09/Page903','', '09', 2, 0, '09#'),
('904','span+浮窗数据编辑','pages/chp09/Page904','', '09', 2, 0, '09#'),
('905','card+浮窗数据编辑','pages/chp09/Page905','', '09', 2, 0, '09#'),
('906','AntdTable表格组件','pages/chp09/Page906','', '09', 2, 0, '09#'),
('907','*期初余额基础','pages/chp09/Page907','', '09', 2, 0, '09#'),
('908','*期初余额高级','pages/chp09/Page908','', '09', 2, 0, '09#'),
('909','*Table行编辑','pages/chp09/Page908','', '09', 2, 0, '09#');

insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('1001','tree结点增删改','pages/chp10/Page1001','', '10', 2, 0, '10#'),
('1002','tree结点逐级展开增删改','pages/chp10/Page1002','', '10', 2, 0, '10#'),
('1003','tree子结点增删改','pages/chp10/Page1003','', '10', 2, 0, '10#'),
('1004','tree结点编码自动生成','pages/chp10/Page1004','', '10', 2, 0, '10#');
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('1101','数据分类编辑','pages/chp11/Page1101','', '11', 2, 0, '11#'),
('1102','订单编辑','pages/chp11/Page1102','', '11', 2, 0, '11#'),
('1103','订单审核','pages/chp11/Page1103','', '11', 2, 0, '11#'),
('1104','发票开具','pages/chp11/Page1104','', '11', 2, 0, '11#'),
('1105','发货管理','pages/chp11/Page1105','', '11', 2, 0, '11#');

insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('1201','单序列图','pages/chp12/Page1201','', '12', 2, 0, '12#'),
('1202','多序列图','pages/chp12/Page1202','', '12', 2, 0, '12#'),
('1203','图表钻取','pages/chp12/Page1203','', '12', 2, 0, '12#');

insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('1301','选项管理','pages/chp13/Page1301','', '13', 2, 0, '13#'),
('1302','完整数据备份','pages/chp13/Page1302','', '13', 2, 0, '13#'),
('1303','局部数据备份','pages/chp13/Page1303','', '13', 2, 0, '13#'),
('1304','数据恢复','pages/chp13/Page1304','', '13', 2, 0, '13#');

#以下jsx文件只加载页面，不显示在页面上。如果app.js中不加载，后面不能引用这些文件
insert into examples (exampleid,title,url,submodules,parentnodeid,level,isparentflag,ancestor) values
('9901','','pages/chp07/register','', '07',2, 0, '07#'),
('9903','','pages/chp02/demo210a','', '02',2, 0, '02#'),
('9904','','pages/chp02/demo210b','', '02',2, 0, '02#'),
('9905','','pages/chp02/demo210c','', '02',2, 0, '02#'),
('9906','','pages/chp02/demo210d','', '02',2, 0, '02#'),
('9907','','pages/chp02/demo210e','', '02',2, 0, '02#'),
('9908','','pages/chp02/demo210f','', '02',2, 0, '02#'),
('9909','','pages/chp03/demo303a','', '03', 2, 0, '03#');
select * from examples;