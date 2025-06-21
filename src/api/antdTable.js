import { Divider, Tooltip, FloatButton, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import React, { Component } from 'react'
import { myGetTextSize, myDoFiles, myLocalTime, reqdoSQL, reqdoTree, myNotice } from './functions';
import { MyFormComponent } from './antdFormMethod.js';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdHiddenField, AntdImage, MessageBox, AntdModal } from './antdClass.js';
import { DownloadOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
/*
const components = {
  body: {
    row: props => <tr className="tableRowStyle" {...props} />,
  },
};
*/
//myTableStyle在style.css中
//https://ant.design/components/overview-cn/
//https://blog.csdn.net/weixin_45991188/article/details/108050424 
const sys = { ...React.sys };
const rowheight = 42;
const rowStyle = {
  padding: 0,
  color: 'white',
  height: 32,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'

}
const buttonStyle = {
  padding: 0,
  height: 30,
  width: 62,
  marginTop: 2,
}

export class AntdTable extends MyFormComponent {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'table';
    let { modal, columns, filter, rowselect, rowbuttons, contextmenu, rowkeyfield, keyfield, rowkey, keytitle, rownumber, pagesize,
      rowselection, toolbar, height, width, showQuickJumper, showSizeChanger, rowheight, paginationAlign, paginationalign } = attr;
    if (!height || isNaN(height)) height = -1;
    else height = parseInt(height);
    if (!width || isNaN(width)) width = -1;
    else width = parseInt(width);
    if (!rowheight || isNaN(rowheight)) rowheight = -1;
    else rowheight = parseInt(rowheight);
    if (!pagesize || isNaN(pagesize)) pagesize = 20;
    else pagesize = parseInt(pagesize);
    if (!rowkeyfield || rowkeyfield == '') rowkeyfield = keyfield;
    if (paginationAlign == undefined && paginationalign !== undefined) paginationAlign = paginationalign;
    if (paginationAlign == undefined) paginationAlign = 'right';
    if (paginationAlign != 'center' && paginationAlign != 'left') paginationAlign = 'right';
    //工具栏按钮文本判断
    if (attr.addtext != undefined && attr.addText == undefined) attr.addText = attr.addtext;
    if (attr.addText == undefined) attr.addText = '新增';
    if (attr.edittext != undefined && attr.editText == undefined) attr.editText = attr.edittext;
    if (attr.editText == undefined) attr.editText = '修改';
    if (attr.deletetext != undefined && attr.deleteText == undefined) attr.deleteText = attr.deletetext;
    if (attr.deleteText == undefined) attr.deleteText = '删除';
    if (attr.savetext != undefined && attr.saveText == undefined) attr.saveText = attr.savetext;
    if (attr.saveText == undefined) attr.saveText = '保存';
    if (attr.exporttext != undefined && attr.exportText == undefined) attr.exportText = attr.exporttext;
    if (attr.exportText == undefined) attr.exportText = '导出';
    if (attr.refreshtext != undefined && attr.refreshText == undefined) attr.refreshText = attr.refreshtext;
    if (attr.refreshText == undefined) attr.refreshText = '刷新';
    if (attr.filtertext != undefined && attr.filterText == undefined) attr.filterText = attr.filtertext;
    if (attr.filterText == undefined) attr.filterText = '快速过滤';
    if (attr.downloadtext != undefined && attr.downloadText == undefined) attr.downloadText = attr.downloadtext;
    if (attr.downloadText == undefined) attr.downloadText = '下载';

    //console.log(666,rownumber,columns)
    //页码处理
    let rownumberbar = {
      title: '序号', dataIndex: '_rowno', width: 50, fixed: 'left', className: 'rownumberStyle',
      render: (text, record, index) => (this.state.pageno - 1) * this.state.pagesize + index + 1
    }
    let index;
    if (rownumber) { //新版antd会执行2次这条语句
      index = columns.findIndex((item) => item.dataIndex == '_rowno');
      if (index < 0) columns.unshift(rownumberbar);
      else columns[index] = rownumberbar;
    }
    //columns = myParseColumns(columns) ;
    if (rowbuttons && rowbuttons != '') {//新版antd会执行2次这条语句
      let buttons = toolbar.split(';');
      let rowbuttonwidth = buttons.includes("add") ? 60 : 50;
      let n = 0;
      if (buttons.includes("edit")) n++;
      if (buttons.includes("delete")) n++;
      if (buttons.includes("download")) n++;
      if (n > 2) rowbuttonwidth = 60 + 21 * (n - 2);  //每个按钮操作列增加20px宽度
      else if (n == 2) rowbuttonwidth = Math.max(rowbuttonwidth, 60);
      //alert(rowbuttonwidth + '--' + n)
      let rowbuttonbar = {
        title: (<span>操作{buttons.includes("add") && <Tooltip title={attr.addText + "记录"} placement="bottom"><Button size='small' type="text" icon={<PlusCircleOutlined style={{ textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => this.handleAddClick()} /></Tooltip>}</span>), dataIndex: '_operation', key: '_operation', fixed: 'right', width: rowbuttonwidth, align: 'center',
        render: (text, record, index) => <>
          {buttons.includes("edit") && <Tooltip title={attr.editText + "记录"} placement="bottom"><Button size='small' type="text" icon={<EditOutlined style={{ fontSize: '12px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => { this.handleEditClick(record, index) }} /></Tooltip>}
          {buttons.includes("delete") && <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={<>是否确定删除<br />{`【${record[keyfield]}】`}<br />这条{keytitle}记录？</>} onConfirm={() => { this.handleDeleteRow(record, index) }} placement="topLeft"><Tooltip title={attr.deleteText + "记录"} placement="bottom"><Button size='small' type="text" icon={<DeleteOutlined style={{ fontSize: '12px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} /></Tooltip></Popconfirm>}
          {buttons.includes("download") && <Tooltip title={attr.downloadText + "记录"} placement="bottom"><Button size='small' type="text" icon={<DownloadOutlined style={{ fontSize: '12px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => { this.handleDownloadClick(record, index) }} /></Tooltip>}
        </>
      }
      //if (buttons.includes("edit") && buttons.includes("delete")) rowbuttonwidth = 60;
      index = columns.findIndex((item) => item.dataIndex == '_operation');
      if (index < 0) columns.push(rowbuttonbar);
      else columns[index] = rowbuttonbar;
    }

    if (rowselection === undefined) rowselection = 'radio';
    else if (rowselection != 'checkbox' && rowselection != 'multiple' && rowselection != 'none') rowselection = 'radio';
    //处理工具栏
    if (toolbar === undefined) toolbar = '';
    let toolbarbuttons = [];
    let toolbarwidth = 12;
    let tmp = toolbar.split(';');
    let filterflag = 0;
    for (let i = 0; i < tmp.length; i++) {
      let buttontext = attr[tmp[i] + 'Text'];  //attr.addText、attr.exitText、deleteText、saveText.....
      let buttonwidth = 8;
      let buttonheight = 30;
      let buttonstyle = {};
      if (tmp[i] !== '-' && typeof buttontext == 'string') buttonwidth = myGetTextSize(buttontext).width + 34;
      else if (tmp[i] == '-') buttonheight = 8;
      if (tmp[i] == '-') {
        if (filterflag == 0) buttonstyle = { marginLeft: 4, marginRight: 4, height: 22 }
        else buttonstyle = { position: 'absolute', left: toolbarwidth + 4, top: 6, height: 22 }
      } else {
        if (filterflag == 0) buttonstyle = { marginLeft: 0, padding: 0, height: buttonheight, width: buttonwidth, marginTop: 2 };
        else buttonstyle = { position: 'absolute', left: toolbarwidth + 4, top: 2, height: buttonheight, width: buttonwidth };
      }
      if (tmp[i] == '-') {
        //console.log(99911111, filterflag)
        toolbarbuttons.push(<Divider key={'_divider' + i} type='vertical' style={buttonstyle} />);
      } else if (tmp[i] == 'add') {
        toolbarbuttons.push(<Button type="text" key='_cmdadd' icon={<PlusCircleOutlined />} style={buttonstyle} onClick={this.handleAddClick}>{attr.addText}</Button>)
      } else if (tmp[i] == 'edit') {
        toolbarbuttons.push(<Button type="text" key='_cmdedit' icon={<EditOutlined />} style={buttonstyle} onClick={() => this.handleEditClick(this.state.row)}>{attr.editText}</Button>)
      } else if (tmp[i] == 'delete') {
        toolbarbuttons.push(<Button type="text" key='_cmddelete' icon={<DeleteOutlined />} style={buttonstyle} onClick={() => this.handleDeleteClick(this.state.row)}>{attr.deleteText}</Button>);
      } else if (tmp[i] == 'save') {
        toolbarbuttons.push(<Button type="text" key='_cmdsave' icon={<SaveOutlined />} style={{ marginLeft: filterflag, marginLeft: filterflag, padding: 0, height: 30, width: buttonwidth, marginTop: 2 }} onClick={this.handleSaveClick.bind(this)}>{attr.saveText}</Button>);
      } else if (tmp[i] == 'export') {
        toolbarbuttons.push(<Button type="text" key='_cmdexport' icon={<FileExcelOutlined />} style={buttonstyle} onClick={this.handleExportClick}>{attr.exportText}</Button>);
      } else if (tmp[i] == 'download') {
        toolbarbuttons.push(<Button type="text" key='_cmddownload' icon={<DownloadOutlined />} style={buttonstyle} onClick={this.handleDownloadClick}>{attr.downloadText}</Button>);
      } else if (tmp[i] == 'refresh') {
        toolbarbuttons.push(<Button type="text" key='_cmdrefresh' icon={<RedoOutlined />} style={buttonstyle} onClick={this.handleRefreshClick}>{attr.refreshText}</Button>);
      } else if (tmp[i] == 'filter') {
        buttonwidth -= 12;  //没有图标
        //console.log(22222, buttonwidth)
        toolbarbuttons.push(<AntdInputBox type='search' key='_filtertext' id='_filtertext' label={attr.filterText} labelwidth={buttonwidth} top='1' left={toolbarwidth} width='300' ref={ref => this._filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />);
        filterflag = 1; //toolbarwidth; //filter之后的按钮或分隔线需要加marginleft，用filterflag记录
        toolbarwidth += 300;
      }
      toolbarwidth += buttonwidth; //62;

    }
    if (contextmenu == undefined) contextmenu = '';
    let menuitems = [];
    tmp = contextmenu.split(';');
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i] == '-') {
        menuitems.push({ type: 'divider', key: '_menu' + i });
      } else if (tmp[i] == 'add') {
        menuitems.push({ label: attr.addText, key: '_menu_add', icon: <PlusCircleOutlined /> });
      } else if (tmp[i] == 'edit') {
        menuitems.push({ label: attr.editText, key: '_menu_edit', icon: <EditOutlined /> });
      } else if (tmp[i] == 'delete') {
        menuitems.push({ label: attr.deleteText, key: '_menu_delete', icon: <DeleteOutlined /> });
      } else if (tmp[i] == 'refresh') {
        menuitems.push({ label: attr.refreshText, key: '_menu_refresh', icon: <RedoOutlined /> });
      } else if (tmp[i] == 'download') {
        menuitems.push({ label: attr.downloadText, key: '_menu_download', icon: <DownloadOutlined /> });
      } else if (tmp[i] == 'save') {
        menuitems.push({ label: attr.saveText, key: '_menu_save', icon: <SaveOutlined /> });
      }
    }
    //判断modal
    if (modal === undefined || modal === '' || (typeof modal === 'string' && modal !== 'true')) modal = false;
    else if (modal === 'true') modal = true;
    if (showQuickJumper === undefined) showQuickJumper = true;
    if (showSizeChanger === undefined) showSizeChanger = true;
    attr = { ...attr, columns, filter, rowselect, rowbuttons, menuitems, contextmenu, rowkeyfield, keyfield, keytitle, rownumber, pagesize, rowselection, height, width, showQuickJumper, showSizeChanger, paginationAlign }
    this.state = {
      attr: attr,
      columns: columns,
      data: [],  //某一页数据
      total: 0,  //行总数
      pageno: 1, //当前选中页
      pagesize: pagesize,  //每页显示行数
      rownumberwidth: 50,
      rowindex: 0,   //当前页光标位置
      rowkeyfield: rowkeyfield,
      keyfield: keyfield,   //主键        
      keytitle: keytitle,
      sortfield: '',   //排序列，只有一列
      rowselection: rowselection,
      row: {},  //当前选中的行
      lastrow: {},  //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
      selectedkeys: [],  //antd中选中打钩的行
      addoredit: 'update',
      form: attr.form,
      window: attr.window,
      menuitems: menuitems,
      toolbarwidth: toolbarwidth,
      toolbarbuttons: toolbarbuttons,
    }
  }

  componentDidMount = async () => {
    this.loadTableData();
  }

  loadTableData = async () => { //加载每页数据
    let { pageno, pagesize, selectedkeys, rowindex, attr } = this.state;
    let { afterLoadData, beforeLoadData } = attr;
    //console.log(7777, attr);
    beforeLoadData?.();
    //将父组件的第一层属性传到p
    let p = {};
    for (let key in attr) {
      if (typeof attr[key] !== 'object') p[key] = attr[key];
    }
    for (let key in this.props) {
      if (typeof attr[key] !== 'object') p[key] = this.props[key];
    }
    p.sqlprocedure = attr.sqlprocedure;
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue = '';
    p.filter = this._filtertext?.state.value.trim() || '';
    p.sortfield = this.state.sortfield;
    //console.log(77772, p);
    const rs = await reqdoSQL(p)
    //计算total  可以没有记录total值
    let total = 0;
    if (rs.rows && rs.rows.length > 0 && rs.rows[0]._total) total = parseInt(rs.rows[0]._total);
    else if (rs.rows) total = rs.rows.length;
    if (rowindex < 0 || rowindex >= rs.rows.length) rowindex = 0;
    if (rowindex < rs.rows.length) selectedkeys = [rs.rows[rowindex][this.state.rowkeyfield]];
    else selectedkeys = [];
    let row = rs.rows[rowindex];
    //console.log(991,JSON.stringify(rs));
    //console.log(991, rs.rows);
    this.setState({ data: rs.rows, row, pageno: pageno, pagesize, total, rowindex, selectedkeys: selectedkeys }, () => {
      setTimeout(async () => {
        await afterLoadData?.();
      })
    });
    return rs.rows;
  }

  handleSearchFilter = async () => {
    this.setState({ pageno: 1, rowindex: 0 }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handlePageChange = (pageno, pagesize) => { //换页事件
    console.log(110, pageno, pagesize)
    this.setState({ pagesize, pageno }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  showTotal = (total, range) => {
    let { pageno, pagesize } = this.state;
    let start = (pageno - 1) * pagesize + 1;
    let limit = Math.min(start + pagesize - 1, total);
    let pagecount = parseInt((total - 1) / pagesize) + 1;
    return `当前第${pageno}页（共${pagecount}页），第${start}~${limit}行（共${total}行）。`;
  }

  handleContextMenu = (row, index, e) => {
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    this.handleSelectRow(row, index);
    //if (this.state.menuitems?.length==0) return;
    let id = document.getElementById('AntdTable');
    id.oncontextmenu = function (e) {
      e.preventDefault();
    }
  }

  handleSizeChange = (current, pagesize) => {
    this.setState({ pagesize }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handleSorter = (v1, v2, sorter) => {
    let f = sorter.field;
    let d = sorter.order;
  }

  selectionChange = (selectedkeys, rows) => {
    //console.log(112, rows);
    let { rowselection, rowkeyfield, keyfield, data, pagesize } = this.state;
    //checkbox选中的项,单选功能的实现
    let row = null;
    let index = -1;
    if (rows.length > 0) {
      row = rows[rows.length - 1];
      index = rows.length - 1;
    }
    if (rowselection === 'multiple') {
      this.setState({ selectedkeys: selectedkeys });
    } else if (rows.length > 0) {
      this.setState({ selectedkeys: [row[rowkeyfield]] }, () => this.handleSelectRow(row, rows.length - 1));
    }
  }

  handleMyMenu1Click = (e) => {
    //右键菜单程序
    let key = e.key;
    if (key == '_menu_delete') this.handleDeleteClick(this.state.row);
    else if (key == '_menu_add') this.handleAddClick();
    else if (key == '_menu_edit') this.handleEditClick(this.state.row);
    else if (key == '_menu_refresh') this.handleRefreshClick(e);
  }

  handleAddClick = () => {  //aaaaaaaa
    let { onAddRow, form, window } = this.state.attr;
    onAddRow?.(); //清空表单+打开窗体
  }

  handleDownload = (selectedkeys, rows) => {
    let { onDownload, form, window } = this.state.attr;
    onDownload?.();
  }

  handleSelectRow = (row, index) => {
    if (!row) return;
    let { onSelectRow } = this.state.attr;
    this.setState({ row: row, rowindex: index, selectedkeys: [row[this.state.rowkeyfield]] }, () => {
      onSelectRow?.(row, index);
    });
  }

  handleEditClick = (row, index) => { //先触发这个时间，再自动触发handleSelectRow
    if (!row) return;
    let { onEditRow, form, window } = this.state.attr;
    onEditRow?.(row);  //修改表单内容+打开窗体
  }

  handleDeleteClick = async (e) => {
    let { row, rowkeyfield, keyfield, keytitle, selectedkeys, rowselection } = this.state;
    let title = '';
    console.log(999, row, selectedkeys, keyfield)
    if (rowselection == 'multiple' && selectedkeys.length > 1) {
      if (selectedkeys.length > 1) title = '是否确定删除这 ' + selectedkeys.length + ' 条' + keytitle + '记录？';
    } else if (row) {
      title = '是否确定删除<br>【' + row[keyfield] + '】<br>这条' + keytitle + '记录？';
    }
    if (title != '') this.myDeleteModal.setState({ visible: true, description: title });
    else myNotice('没有选择需要删除的' + keytitle + '记录!', 'info', 200);
    //确定后执行handleDeleteRow函数
  }

  handleDeleteRow = async (row, index) => {  //ddddddddddddddelete
    //console.log(999,row, index);
    let { onDeleteRow, rowselection } = this.state.attr;
    let rs = await onDeleteRow?.(row, index) || null;  //antdFormMethod+deleteTableRow
    this.myDeleteModal.setState({ visible: false });
    if (!rs || !rs.pageno || rs.pageno <= 0) return;
    let { rowindex, pageno } = rs;
    //console.log(119, rs);
    this.setState({ pageno, rowindex }, () => { //自动触发1次，先清空data
      this.loadTableData();
    });
  }

  handleRefreshClick = (e) => {
    let { onRefresh } = this.state.attr;
    let rs = onRefresh?.(e) || null;
    if (!rs) return;
    this.setState({ rowindex: 0, pageno: 1 }, () => {
      this.loadTableData();
    });
  }

  handleExportClick = (e) => {
    let { onExport } = this.state.attr;
    onExport?.();
  }

  handleDownloadClick = (e) => {
    let { onDownload } = this.state.attr;
    onDownload?.();
  }

  handleSaveClick = (e) => {
    let { onSave } = this.state.attr;
    onSave?.();
  }

  render() {
    let { data, pagesize, total, addoredit, pageno, columns, rowkeyfield, keyfield, keytitle, menuitems, rowselection, toolbarbuttons, toolbarwidth, filter,attr } = this.state;
    let { onAddRow, onRefresh, onExport, onDoubleClick, modal, height, width, showQuickJumper, showSizeChanger, rowheight, paginationAlign } = attr;
    //let scrolly = (modal && height>0)? { x: '90%', y: 'calc(100vh - '+(652-height)+'px)' }: { x: '90%', y: 'calc(100vh - 148px)'}
    let scroll = this.props.scroll;      //这样才可以实时设置属性的值，不要用state.height或attr.height
    //console.log(666666, scroll)
    let scrolly;
    if (scroll) scrolly = scroll;
    else scrolly = (modal && height > 0) ? { x: '90%', y: (height - 100 + (toolbarbuttons.length > 0 ? 0 : 35)) + 'px' } : { x: '90%', y: 'calc(100vh - 141px)' }
    console.log(666667, attr.id, scrolly,scroll)
    if (width < 700) showSizeChanger = false;
    if (width < 640) showQuickJumper = false;
    return (<>
      <Layout style={{ overflow: 'hidden' }}>
        {toolbarbuttons.length > 0 && <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '35px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='_filterbar'>
            {toolbarbuttons}
          </Form>
        </Header>}
        <Dropdown menu={{ items: menuitems, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={[menuitems.length > 0 ? 'contextMenu' : '']}>
          <Content style={{ overflow: 'auto', position: 'relative', width: '100%' }}>
            <Table {...this.state.attr} id='AntdTable' ref={ref => this.AntdTable = ref} className="myTableStyle" sticky={true} size='small' rowKey={rowkeyfield} bordered={true}
              scroll={scrolly}  //页面中的表格
              style={{ overflow: 'hidden', position: 'absolute', height: '100%', maxHeight: '100%' }}
              //rowClassName={rowStyle}
              columns={columns} dataSource={this.state.data} pagination={false}
              onChange={this.handleSorter}
              rowSelection={{
                hideSelectAll: rowselection === 'checkbox',
                //disabled: rowselection === 'checkbox', 
                type: rowselection === 'radio' ? 'radio' : 'checkbox',
                selectedRowKeys: this.state.selectedkeys,
                onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) },
                // getCheckboxProps: (record) => {
                //   console.log(555, record);
                //   return ({
                //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
                //     name: record.name,
                //   })
                // },
              }}
              onRow={(record, index) => {
                return {
                  onClick: (e) => { this.handleSelectRow(record, index) }, // 点击行
                  onDoubleClick: (e) => { this.handleSelectRow(record, index); onDoubleClick?.(record, index); },  //点击checkbox小按钮时需要选中行
                  onContextMenu: (e) => { this.handleContextMenu(record, index, e) }
                };
              }}
            />
          </Content>
        </Dropdown>
        {pagesize > 0 && <Footer style={{ padding: '5px 16px 0px 16px', height: 34, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: '#efefef' }}>
          <Pagination size="small" total={this.state.total} className='paginationStyle' style={{ display: 'flex', justifyContent: paginationAlign }}
            showQuickJumper={showQuickJumper}
            showSizeChanger={showSizeChanger}
            pageSizeOptions={['10', '20', '50', '100']}
            current={this.state.pageno} defaultPageSize={this.state.pagesize}
            pageSize={this.state.pagesize}
            showTotal={(total, range) => <div style={{ width: '100%', textAlign: 'center' }}>{this.showTotal(total, range)}</div>}
            onShowSizeChange={this.handleSizeChange.bind(this)}
            onChange={this.handlePageChange.bind(this)}
          />
        </Footer>}
      </Layout>
      <MessageBox ref={ref => this.myDeleteModal = ref} onConfirm={(e) => this.handleDeleteRow(this.state.row, this.state.rowindex)} />
    </>)
  }
}
