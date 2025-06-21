drop table if exists sys_backups;
create table sys_backups(
	RowID int auto_increment primary key,
    backuptime datetime,
    filename varchar(255),
    filetitle varchar(500),
    userid varchar(25),
    username varchar(255),
    filesize bigint,
    filesizedesc varchar(255),    
    downloadtimes int default 0,
    note mediumtext
);
insert into sys_backups (backuptime, filetitle, filename, userid, username, filesize, filesizedesc, note) values
('2021-10-11', 'db1', 'db1_2345678.sql', '20000555', '曹孟德', 20000, '20mb', '修改销售订单之前的数据');

select * from sys_backups order by backuptime desc;
-- delete from sys_backups where rowid=19;

drop table if exists sys_backupItems;
create table sys_backupItems(
	RowID int,  -- 外键
    filename varchar(255),
    filetitle varchar(500),
    filesize bigint,
    filesizedesc varchar(255),    
    downloadtimes int default 0
);