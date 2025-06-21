import ajax from './ajax'
import React, { Component } from 'react';
import { Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate } from 'antd'
import { WindowsOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { myFileSize, myFileExtension, myStr2JsonArray, myDoFiles, myLocalTime, myDeleteFiles, reqdoSQL, reqdoTree, myNotice } from './functions.js';
import { findTreeNode, searchNodeInRows } from './antdTrees.js';
// import axios from "axios";
import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// import pinyinData from '../data/pinyin.json';
// import { getByAltText, render } from '@testing-library/react';
// import locale from 'antd/locale/zh_CN'
// import ReactDom from 'react-dom'
const sys = { ...React.sys };

export class MyFormComponent extends Component {
  constructor(props) {
    super(props)
  }
  getFormFields(form) {
    let fields = [];
    if (this[form]) {
      let data = this[form].getFieldsValue();
      for (var key in data) {
        fields.push(key);
      }
    }
    return fields;
  }

  setFormValues(form, row, fields) { //保存数据到表单中
    if (!row) return;
    let formdata = {};
    if (fields == undefined || fields == '') fields = this.getFormFields(form); //myGetFormFields(this, form);
    //console.log(112,fields,row);
    for (let i = 0; i < fields.length; i++) {
      let key = fields[i];
      //图片和jsons数据必须定义ref
      let str = row[key];
      let datatype = this[key]?.state?.datatype || '';
      let antclass = this[key]?.state?.antclass || '';
      //console.log(100,key,str, antclass,typeof str)
      if (datatype == 'json') { //处理json数据
        str = myStr2JsonArray(row[key]);  //将数据库中的json字符串转换成js的json
      }
      if (antclass === 'number') {   //处理数值型数据
        if (isNaN(str)) str = '0';
        str = parseFloat(str);
      } else if (antclass === 'date') {  //处理日期特殊格式,例如2010-01-10    
        //if (!str || str=='') str = myLocalTime().date;
        str = dayjs(str, sys.dateformat)
        //console.log(12346, str, typeof str)
        if (isNaN(str.$d)) {
          str = myLocalTime().date;
          str = dayjs(str, sys.dateformat)
        }
      } else if (antclass === 'cascader' && typeof str == 'string') {
        let node = searchNodeInRows(this[key].state?.attr.nodes, str);  //从线性表数组中找到这个元素节点
        //console.log(12346, str, typeof str, node)
        if (node?.ancestor && node?.ancestor != '') {
          str = (node.ancestor + str).split('#');
        } else {
          str = [str];  //是数组
        }
        //console.log(112, key, str, this[key]?.state?.antclass, node)
      }
      if (antclass === 'image') {
        //显示图片
        //console.log(555,key,str)
        //this[key]?.setState({ src: str }); //图片用js赋值，处理图片的特殊赋值方式 
      } else if (antclass === 'imageupload' || antclass === 'fileupload') {
        //上传图片，处理图片的特殊赋值方式
        let urlfield = this[key]?.state.attr.fieldNames.filename;
        let titlefield = this[key]?.state.attr.fieldNames.filetitle;
        let sizefield = this[key]?.state.attr.fieldNames.filesize;
        //console.log(111,key,str,this[key]?.state?.antclass,typeof str)
        if (str != null && typeof str == 'object') {
          str.forEach((item, index) => {
            //item.uid = key + '_' + index;
            item.uid = 'file_' + myLocalTime().timestamp + '_' + index;
            //if (!item.name) item.name = '图片';
            //item.status = 'done'
            item.url = sys.serverpath + '/' + item[urlfield]  //显示图片之用
          })
        }
        //console.log(112, key, str);
        //this[key]?.setState({ filelist: str, deletedfiles: [], uploadedfiles: [] }); //上传图片用filelist存储。
      }
      this[form].setFieldValue(key, str);
      //将数据保存起来，用于记录旧的数据
      //console.log(110, key, str, antclass, typeof str)
      formdata[key] = str;
      //当前控件把表单中其他控件的值保存起来,需要在控件定义时候写ref。在AntImageUpload中使用到
      if (antclass === 'imageupload' || antclass === 'fileupload') this[key]?.setState({ filelist: str, deletedfiles: [], uploadedfiles: [], formvalues: row, value: str }); //上传图片用filelist存储。
      else if (antclass === 'image') this[key]?.setState({ src: str, formvalues: row, value: str }); //图片用js赋值，处理图片的特殊赋值方式
      else if (antclass === 'file') this[key]?.setState({ filelist: str, formvalues: row, value: str }); //图片用js赋值，处理图片的特殊赋值方式
      else this[key]?.setState({ formvalues: row, value: str });
    }
    return formdata;
  }

  getFormValues(form, data, fields) { //从表单提取值，保存数据时候使用
    //讲表单中列属性添加到data中，data中原来的属性只是被覆盖或不变
    if (!data || typeof data !== 'object' || data == {}) data = this[form].getFieldsValue();
    if (fields == undefined || fields == '') fields = this.getFormFields(form);
    for (let i = 0; i < fields.length; i++) {
      let key = fields[i];
      let str = data[key] || '';
      let datatype = this[key]?.state?.datatype || '';
      let antclass = this[key]?.state?.antclass || '';
      if (datatype == 'json') { //数据是json格式
        if (antclass === 'imageupload' || antclass === 'fileupload') {
          //图片或文件上传，符合jsons数据，而且自定义组件在表单中必须定义ref
          //从filelist提取files
          console.log(5550, this[key].state.filelist);
          let { fieldNames } = this[key].state.attr;
          str = this[key].state.filelist.map((item, index) => {
            let s = item.url;
            let obj = item.originFileObj;   //判断是否是新上传的文件
            let x1 = s.indexOf(sys.serverpath + '//');
            let x2 = s.indexOf(sys.serverpath + '/');
            let x3 = s.indexOf(sys.serverpath + '\\\\');
            let x4 = s.indexOf(sys.serverpath + '\\');
            if (x1 >= 0) s = s.substring(x1 + sys.serverpath.length + 2);
            else if (x2 >= 0) s = s.substring(x2 + sys.serverpath.length + 1);
            else if (x3 >= 0) s = s.substring(x3 + sys.serverpath.length + 2);
            else if (x4 >= 0) s = s.substring(x4 + sys.serverpath.length + 1);
            let tmp = {};
            tmp.filename = s;
            tmp[fieldNames.filename] = s;
            if (item.name != undefined && item.name != '') {
              tmp.name = item.name;
              tmp[fieldNames.filetitle] = item.name;
            }
            //tmp.originFileObj = item.originFileObj;
            //tmp.targetpath = item.targetpath;
            //tmp.targetfile = item.targetfile+item.fileext;
            return (tmp)
          });
          console.log(999111, str, this[key].state.attr.targetpath);
          if (this[key]?.state?.deletedfiles?.length > 0) {
            //判断要删除的文件tmp1在要保存的文件tmp2中是否存在
            console.log('dddddd111-', this[key]?.state?.deletedfiles)
            //上传时做删除标记的文件在服务器端删除
            let fileToDelete = JSON.stringify(this[key]?.state?.deletedfiles);
            console.log(155, fileToDelete);
            myDoFiles('delete', fileToDelete);  //需要删除的文件
            //需要更名的文件filename-->targetfilename, 
          }
        }
      } else if (antclass === 'date') {
        //处理日期特殊格式,例如2010-01-10
        str = str.format(sys.dateformat);
      } else if (antclass === 'cascader' && typeof str == 'object') {
        //取数组最后一个元素
        str = (str.length > 0) ? str.pop() : [];
      }
      if (typeof str === 'string') str = str.replace(/\s+$/, '');  //去掉右边表达式 str.trimRight()这个函数被淘汰;
      //console.log(159,key,str, typeof str);
      data[key] = str;
    }
    return data;
  }

  resetFormValues(form) { //清空表单列和其他列（图片和上传的文件）数据
    let data = this[form].getFieldsValue();
    for (let key in data) {
      let str = '';
      if (this[key]) {
        if (this[key].state?.antclass == 'image' && this[key].state?.datatype == 'json') { //清空json数据      
          this[key].setState({ src: [], readOnly: false });
        } else if (this[key].state?.antclass == 'imageupload' && this[key].state?.datatype == 'json') {
          //清空json数据
          this[key].setState({ filelist: [], uploadedfiles: [], deletedfiles: [], formvalues: {}, readOnly: false });
        } else if (this[key].state?.antclass == 'fileupload' && this[key].state?.datatype == 'json') {
          //清空json数据
          this[key].setState({ filelist: [], uploadedfiles: [], deletedfiles: [], formvalues: {}, readOnly: false });
        } else if (this[key].state?.antclass == 'date') {
          str = dayjs(new Date());
          this[key].setState({ readOnly: false, disabled: false })
        } else {
          this[key].setState({ readOnly: false, disabled: false })
        }
      }
      this[form].setFieldValue(key, str); //清空表单数据,有些key没有ref，this[key]为null，但也要清空
    }
    //dayjs.locale('zh-cn');
    //this[form].resetFields(); //清空表单数据，日期会出错
  } //resetformvalues  

  setFormFields(form, type, flag) { //设置表单中字段的只读/disabled状态    
    let data = this[form].getFieldsValue();
    for (let key in data) {
      if (this[key]) {
        //console.log(999999, key, type, flag);
        this[key].setState({ [type]: flag })
      }
    }
  } //setFormFields

  renameUploadedFiles(form, _row) {
    //保存记录后，将一个表单中上传的文件重新命名，把id列对应的文件名称修改成row这一行对应的值
    //修改上传的文件名称，因为新增记录时有可能上传时自增列未知
    //row为保存数据后的新记录
    let fileToRename = [];
    let data = {};
    let fields = this.getFormFields(form);
    let renameFlag = 0;  //是否有文件上传过
    //将表单中的变量赋值    
    for (let i = 0; i < fields.length; i++) {
      let id = fields[i];
      let s = this[id]?.state?.antclass;
      if (s == 'imageupload' || s == 'fileupload') {
        let { timeStamp, targetpath, filetag, fieldNames } = this[id].state.attr;
        let { uploadedfiles, filelist } = this[id].state;
        let tag = filetag || '';
        if (tag.indexOf('${') >= 0) {
          tag = tag.split("${").join("${_row.");  //将${productid替换成${_row.productid
          try {
            filetag = eval(tag);
          } catch (error) {
            filetag = '';
          }
        } else {
          filetag = tag;
        }
        //console.log(5553, this[id].state.attr.filetag, filetag, tag, _row.productid);
        //console.log(5554, filelist);
        //console.log(5555, uploadedfiles);
        //设置修改文件的源文件和目标文件
        //console.log(66666111,id,filelist )
        let fileToRename = [];
        let fileToSave = [];
        for (let item of filelist) {
          let f1 = {};
          let f2 = {};
          if (item.originFileObj) {  //新上传的文件
            f1[fieldNames.filename] = targetpath + '/' + filetag + (timeStamp ? item.filestamp : item.fileno) + item.fileext;  //新文件
            if (fieldNames.filetitle !== undefined && fieldNames.filetitle !== '') f1[fieldNames.filetitle] = myFileExtension(item.name).filename;  //去掉文件名后缀
            if (fieldNames.filesize !== undefined && fieldNames.size !== '') f1[fieldNames.filesize] = myFileSize(item.size);
            fileToSave.push(f1);
            f2.targetfilename = f1[fieldNames.filename];
            f2.filename = item.filename; //源文件
            fileToRename.push(f2);
            renameFlag = 1;
          } else {  //旧文件也需要一起保存到数据库
            f1[fieldNames.filename] = item[fieldNames.filename];
            if (fieldNames.filetitle !== undefined && fieldNames.filetitle !== '') f1[fieldNames.filetitle] = item[fieldNames.filetitle];
            if (fieldNames.filesize !== undefined && fieldNames.size !== '') f1[fieldNames.filesize] = item[fieldNames.filesize];
            fileToSave.push(f1);
          }
        }
        //console.log(5557, fileToSave);
        myDoFiles('rename', JSON.stringify(fileToRename));
        data[id] = fileToSave; //files.map((item) => { return ({ filename: item.targetfilename }) });
        //console.log(5558, data[id]);
      }
    }
    //if (renameFlag == 0) data = {};  //没有新文件上传，不需要再保存记录
    return data;
  }  //rename  


  uploadFilesOnSave(form, _row) {
    //保存记录后，将一个表单中上传的文件重新命名，把id列对应的文件名称修改成row这一行对应的值
    //修改上传的文件名称，因为新增记录时有可能上传时自增列未知
    //row为保存数据后的新记录
    let fileToRename = [];
    let data = {};
    let fields = this.getFormFields(form);
    let renameFlag = 0;  //是否有文件上传过
    //将表单中的变量赋值    
    for (let i = 0; i < fields.length; i++) {
      let id = fields[i];
      let s = this[id]?.state?.antclass;
      if (s == 'imageupload' || s == 'fileupload') {
        let { timeStamp, targetpath, filetag, fieldNames } = this[id].state.attr;
        let { uploadedfiles, filelist } = this[id].state;
        let tag = filetag || '';
        console.log(8888, tag, _row)
        if (tag.indexOf('${') >= 0) {
          tag = tag.split("${").join("${_row.");  //将${productid替换成${_row.productid
          try {
            filetag = eval(tag);
          } catch (error) {
            filetag = '';
          }
        } else {
          filetag = tag;
        }
        //console.log(5553, this[id].state.attr.filetag, filetag, tag, _row.productid);
        //console.log(5554, filelist);
        //console.log(5555, uploadedfiles);
        //设置修改文件的源文件和目标文件
        let fileToRename = [];
        let fileToSave = [];
        for (let item of filelist) {
          let f1 = {};
          let f2 = {};
          if (item.originFileObj) {  //新上传的文件
            f1[fieldNames.filename] = targetpath + '/' + filetag + (timeStamp ? item.filestamp : item.fileno) + item.fileext;  //新文件
            if (fieldNames.filetitle !== undefined && fieldNames.filetitle !== '') f1[fieldNames.filetitle] = myFileExtension(item.name).filename;  //去掉文件名后缀
            if (fieldNames.filesize !== undefined && fieldNames.size !== '') f1[fieldNames.filesize] = myFileSize(item.size);
            fileToSave.push(f1);
            f2.targetfilename = f1[fieldNames.filename];
            f2.filename = item.filename; //源文件
            fileToRename.push(f2);
            renameFlag = 1;
          } else {  //旧文件也需要一起保存到数据库
            f1[fieldNames.filename] = item[fieldNames.filename];
            if (fieldNames.filetitle !== undefined && fieldNames.filetitle !== '') f1[fieldNames.filetitle] = item[fieldNames.filetitle];
            if (fieldNames.filesize !== undefined && fieldNames.size !== '') f1[fieldNames.filesize] = item[fieldNames.filesize];
            fileToSave.push(f1);
          }
        }
        //console.log(5557, fileToRename);
        myDoFiles('rename', JSON.stringify(fileToRename));
        data[id] = fileToSave; //files.map((item) => { return ({ filename: item.targetfilename }) });
        //console.log(5558, data[id]);
      }
    }
    if (renameFlag == 0) data = {};  //没有新文件上传，不需要再保存记录
    return data;
  }  //rename  


  deleteUploadedFiles(form, rows) {
    //删除记录后，删除附件文件，一行可能有多个列是上传文件类型
    let fields = this.getFormFields(form);
    let data = [];
    for (let i = 0; i < fields.length; i++) {
      let id = fields[i];
      let s = '';
      s = this[id]?.state?.antclass;
      if (s == 'imageupload' || s == 'fileupload') {
        let f = [];
        let url = this[id]?.state.attr.urlfield;
        rows.forEach(item => {
          let s1 = myStr2JsonArray(item[id]);
          f.push(...s1);
        });
        myDeleteFiles(JSON.stringify(f), url);
      }
    }
    return data;
  }//deleteUploadedFiles

  //删除table中的一行
  deleteTableRow = async (table, form, sqlprocedure) => {
    let { rowselection, selectedkeys, row, rowindex, rowkeyfield, keyfield, pageno, pagesize, total, data } = table.state;
    if (rowselection != 'multiple' && row) selectedkeys = [row[rowkeyfield]];
    console.log(990, table.state, rowselection, selectedkeys, row, rowindex)
    console.log(991, selectedkeys)
    if (!selectedkeys) return { pageno: -1, rowindex: -1 };
    //一次删除一行
    let p = {};
    p.sqlprocedure = sqlprocedure;
    let rows = [];
    rowindex = -1;
    //console.log(992, selectedkeys,rowkeyfield, keyfield)
    for (let i = 0; i < selectedkeys.length; i++) {
      let n = data.findIndex((item) => item[rowkeyfield] == selectedkeys[i]);
      if (n >= 0) {
        rowindex = rowindex < 0 ? n : Math.min(n, rowindex);
        let xdata = { ...data[n] };
        xdata._action = 'delete';
        xdata._reloadrow = 0;
        rows.push(xdata);
        p.data = [xdata];
        //console.log(123,p)
        let rs = await reqdoSQL(p);
      }
    }
    total = total - selectedkeys.length;
    //删除服务器端上传的文件，调用函数
    this.deleteUploadedFiles(form, rows);
    //删除记录后，重新定位到下一行。计算下一行的行号。
    let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
    if (rowno >= total) rowindex = total - 1 - (pageno - 1) * pagesize;
    if (rowindex < 0) {
      pageno--;
      rowindex = 0;   //定位到上一页第一行
    }
    if (pageno <= 0) pageno = 0;
    // this.myDeleteModal.setState({ visible: false });
    // this.setState({ myTable1: { ...table, pageno, rowindex }, deleteconfirm: false }, () => { //自动触发1次，先清空data
    //   setTimeout(() => {
    //     this.loadTableData();
    //   })
    // });     
    return { pageno, rowindex }
  } //deleterow

  //保存表格一行数据
  saveTableRow = async (table, form, sqlprocedure) => {
    //let table={...this.state.myTable1}
    let { pageno, pagesize, total, rowindex, row, keyfield, keytitle } = table.state;
    let { lastrow, addoredit } = this.state;
    let data = this.getFormValues(form);  //转换数据内容
    //if (data._action=='add') data[this.state.myTable1.keyfield]=0;  //主键值自动生成
    //console.log(664, addoredit, data);
    data._action = addoredit;
    data._reloadrow = 1;
    data._treeflag = 0;
    let p = {};
    //将table.state的以及属性赋值给p，可以从父类传存储过程所需要的参数给这个函数。
    for (let key in table.state) {
      if (typeof table.state[key] !== 'object') p[key] = table.state[key];
    }
    p.sqlprocedure = sqlprocedure;  //"demo504a";
    p.data = [];
    p.data.push(data);
    if (addoredit != 'add') {
      p.data.push(lastrow);  //旧的没有修改过的数据
    }
    //console.log(p.data);
    //console.log(123456,JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    let error = '';
    //console.log(23456, rs.rows[0]);
    if (rs.rows.length > 0 && (rs.rows[0]._error == undefined || rs.rows[0]._error == '')) { //数据验证
      //替换数组中的这个元素
      //console.log(777, rs.rows);
      //data[keyfield]=rs.rows[0][keyfield];  //提取主键列
      data = Object.assign({}, data, rs.rows[0]);  //合并对象属性，主键可能不止一个列
      //修改新增时上传文件的名称，可能需要把临时文件改成与主键列相关的文件名
      let data0 = this.renameUploadedFiles(form, rs.rows[0]);
      //if (this.state.addoredit=='add'){
      if (Object.keys(data0).length > 0) {
        data = Object.assign({}, data, data0);  //合并对象属性
        data._action = 'update';
        data._reloadrow = 1;
        data._treeflag = 0;
        let p = {};
        p.sqlprocedure = sqlprocedure;
        p.data = [];
        p.data.push(data);  //p.data只有一行时，where修改条件取第一行的值
        //console.log(775,JSON.stringify(p.data));
        let rs1 = await reqdoSQL(p);
      }
      //新增记录或修改记录后可能排序次序发生变化，重新进行分页，计算行号定位到新行的这一页这一行
      let rowno = parseInt(rs.rows[0]._rowno);
      if (pagesize > 0) {  //分页时计算页码和行号
        //console.log(666,rowno);
        pageno = parseInt((rowno - 1) / pagesize) + 1;
        rowindex = rowno - (pageno - 1) * pagesize - 1;
        total++;
      } else { //不分页不计算行号
        rowindex = rowno - 1;
      }
      myNotice(keytitle + '记录已经保存，请刷新数据!', '', 200);
    } else {
      error = '_error';
      myNotice(keytitle + '保存失败，检查主键是否重复或其他错误!', '', 200);
    }
    return { pageno, rowindex, total, error, rows: rs.rows, data }  //data为原始输入的数据
  }  //savetablerow


  //resizable拉伸条onResize事件
  handleResize = (event, { element, size }) => {
    //window.requestAnimationFrame(() => this.setState({ siderwidth: size.width }));
    //console.log(222, size.width)
    this.setState({
      splitSize: size,
    });
  };


  //方法定义结束
}
