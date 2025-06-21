-- alter table orders add filepath json;
update orders set filepath='[{"filename":"mybase/books/2022React-0905.pdf", "title":"React教材"},
{"filename":"mybase/books/139780133970777.pdf", "title":"数据库系统原理"}]' where orderid<10548;
update orders set filepath='[{"filename":"mybase/books/2022React-0905.pdf", "title":"React教材"},
{"filename":"mybase/books/139780133970777.pdf", "title":"数据库系统原理"},
{"filename":"mybase/books/139781292094007.pdf", "title":"管理信息系统"},
{"filename":"mybase/books/datastructure-c.pdf", "title":"数据结构-C语言"},
{"filename":"mybase/books/datastructure-js.pdf", "title":"数据结构-Javascript语言"},
{"filename":"mybase/books/2018_刘崇-基于BP神经网络的医保欺诈识别.pdf", "title":"2018_刘崇-基于BP神经网络的医保欺诈识别"}
]' where orderid>=10548;
