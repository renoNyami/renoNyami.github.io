/**
 * 包含应用中使用请求接口的模块
 */
import ajax from './ajax'
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Button, Tooltip, Label, TextBox, DateBox, NumberBox, ComboBox, message, Messager, Layout, LayoutPanel, DataList, FileButton, LinkButton, ButtonGroup, Tabs, TabPanel, Dialog } from 'rc-easyui';
import { Modal, Upload, notification, message, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate } from 'antd'
import { WindowsOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useRef, useImperativeHandle } from 'react';
import axios from "axios";
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import pinyinData from '../data/pinyin.json';
import { getByAltText, render } from '@testing-library/react';
import locale from 'antd/locale/zh_CN'
import ReactDom from 'react-dom'
//定义系统变量，包括登录的用户信息
let sys = sessionStorage.getItem('sys');
if (!sys) {
  sys = {};
  sys.user = {};
  //sys.user.userid = '20000554';
  //sys.user.username = '诸葛剑楠';
} else {
  sys = JSON.parse(sys)
}
if (!sys.user) sys.user = {};
if (!sys.account) sys.account = {};
//账套信息，即本单位信息
sys.account.companyname = '浙江理工大学';
sys.account.taxpayerno = '12330000470009034M';
sys.account.chief = '陈问星';
sys.account.address = '杭州下沙高教园区2号大街928号';
sys.account.bank = '中国农业银行杭州枫华支行';
sys.account.bankno = '19001401040051897';
sys.label = {};
sys.label.fontsize = 14;
sys.label.fontname = '楷体';
sys.colors = {};
sys.colors.toolbar = "#f0f2f5";
sys.colors.footer = '#efefef';
sys.colors.selected = "#efefef";
sys.colors.panel = "#E0ECFF";
sys.colors.border = "#95B8E7";  //panel边框线颜色border:"1px solid #ccc", 
sys.colors.header = "#f2f2f2"; //#efefef";  //网格标题和footer的颜色
sys.colors.cell = '#efefef';  //表格底色
sys.colors.readonly = '#f5f5f5';
sys.colors.activeborder = '#1677ff';
sys.dateformat = "YYYY-MM-DD";
sys.serverpath = "myServer/";
sys.rootpath = "http://localhost:8080/myServer/"; //不是https
sys.inputNumberStyle = { fontFamily: "times new roman" };
sys.rowheight = 32;   //表格行距
sys.lineheight = 40;  //表单行距
sys.pinyin = pinyinData;
//svg按钮的颜色，用于1102、1104审核标记。红：#d81e06，绿色：#1afa29，浅蓝：#1296db，深蓝：#13227a，紫色：#d4237a，黑：#2c2c2c
sys.icon = { red: '#d81e06', green: '#1afa29', lightblue: '#1296db', darkblue: '#13227a', purple: '#d4237a', black: '#2c2c2c' };

sys.resizeVHandle = < div style={{
  zIndex: 9,
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '-3px', /* 使得把手稍微突出以便于拖动 */
  width: '4px', /* 把手宽度 */
  cursor: 'ew-resize',
  backgroundColor: 'rgb(255,236,255)',
  //borderRight: '1px solid ' + sys.colors.border,
  borderLeft: '1px solid ' + sys.colors.border,
}} />;

sys.resizeVRHandle = < div style={{
  zIndex: 9,
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '-3px', /* 使得把手稍微突出以便于拖动 */
  width: '4px', /* 把手宽度 */
  //backgroundColor: 'rgb(255,236,255)',
  cursor: 'col-resize',
  //borderLeft: '1px solid ' + sys.colors.border,
}} />;


React.sys = { ...sys };
//console.log(880, sys);
//console.log(881, sys.user);
//localStorage.setItem("sys", JSON.stringify(sys)); //将变量存储到
//事件定义开始
export const myPreventRightClick = () => {
  document.oncontextmenu = function (e) {
    e = e || window.event;
    return false;
  }
}

export const setCookie = (name, value, days) => {
  /*cookie的数据格式
    isbn=978-7-04-059125-5; 
    title=数据库系统概论; 
    book={"isbn":"978-7-04-059125-5","title":"数据库系统概论","authors":[{"name":"王珊","gender":"女","unit":"中国人民大学信息学院"},{"name":"杜小勇","gender":"男","unit":"中国人民大学理工学科建设处"},{"name":"陈红","gender":"女","unit":"中国人民大学信息学院"}],"publisher":{"companyname":"高等教育出版社","address":"北京市丰台区成寿寺路11号","phone":"010-58581118","homepage":"www.hep.com.cn"},"pubdate":"2020-03-10","price":59,"hasEBook":true}
  */
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieValue;
}

export const getCookie = (name) => {
  console.log(444, document.cookie);
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
}

export const deleteCookie = (name) => {
  const expirationDate = new Date('2000-01-01'); // 设置一个过去的日期
  const cookieValue = `${name}=; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieValue;
}

export const pinyin = (chnstring) => {
  let pycode1 = '';
  let pycode2 = '';
  for (let char of chnstring) {
    if (sys.pinyin[char]) {
      pycode1 += sys.pinyin[char];
      pycode2 += '琢' + sys.pinyin[char];  //最后一个拼音汉字
    } else {
      pycode1 += char;
      pycode2 += char;
    }
  }
  return { pinyin: pycode1, pycode: pycode2 };
}

export const myDate = (date, format) => {  //转换字符串为日期
  let d = new Date(date);
  //console.log(d,date)
  return d;
}

export const myDatetoStr = (date, format) => {  //转换日期为字符串
  if (format == undefined) format = 'ymd';
  if (typeof date !== 'object') date = new Date(date);
  let y = date.getFullYear();
  let m = (date.getMonth() + 101).toString();
  let d = (date.getDate() + 100).toString();
  let str = y + '-' + m.slice(-2) + '-' + d.slice(-2);
  if (format == 'longdate') {
    str = y + '年' + m.slice(-2) + '月' + d.slice(-2) + '日';
  }
  return str;
}

export const myLocalTime = (date) => {
  if (date == undefined || date == '') var date = new Date();
  else date = new Date(date);
  var y = date.getFullYear() + '';
  var m = date.getMonth() + 1 + '';
  var d = date.getDate() + '';
  var h = date.getHours() + '';
  var mi = date.getMinutes() + '';
  var sec = date.getSeconds() + '';
  var ms = date.getMilliseconds() + '';
  var timeid = date.getTime() + '';
  if (m.length < 2) m = '0' + m;
  if (d.length < 2) d = '0' + d;
  if (h.length < 2) h = '0' + h;
  if (mi.length < 2) mi = '0' + mi;
  if (sec.length < 2) sec = '0' + sec;
  let now = new Date();
  // 创建一个新的日期对象表示今天0点
  let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // 计算从今天0点到现在的毫秒数
  let todaytimeid = now - startOfDay;
  var rs = {};
  rs.date = y + '-' + m + '-' + d;
  rs.datetime = y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + sec;
  rs.longdate = y + '年' + m + '月' + d + '日';
  rs.time = h + ':' + mi + ':' + sec + '.' + ms;
  rs.fulldatetime = y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + sec + '.' + ms;
  rs.timestamp = y + '' + m + '' + d + '' + todaytimeid;
  rs.dateid = y + '' + m + '' + d;
  rs.timeid = timeid;  //时间整数
  rs.ms = ms;  //毫秒
  rs.sec = sec;  //秒
  return rs;
}

export const myInvoiceCode = (params) => { //自动生成发票编码
    let {orderid, orderdate} =this.params;



  
  
}

export const myIsArray = (o) => { //判断某个变量是不是数组类型
  //return Object.prototype.toString.call(o)=='[object Array]';
  return Array.isArray(o);
}

export const MyIsJson = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || obj instanceof Date || obj instanceof Function) return false;
  try {
    JSON.parse(JSON.stringify(obj));  //如果不出错表示对象是一个JSON对象
    return true;
  } catch (error) {
    //对象不是一个JSON对象
    return false;
  }
}

export const myStr2Json = (str) => { //将一个字符串转成json对象，判断是否合法
  var obj = {};
  if (typeof str == 'string' && str != '') {
    if (str.substring(0, 1) == '"' || str.substring(0, 1) == "'") str = str.substring(1, str.length - 1); //去掉双引号
    str = str.replace(/\n/g, "<br/>");  //不能有换行。这样会正确，否则json换行字符串会出语法错误。不能使用<br>要用<br/>
    try {
      obj = JSON.parse(str);
    } catch (e) {
      obj = null; //{};
    }
  } else {
    obj = str;
  }
  return obj;
}

export const myStr2JsonArray = (value) => {
  //console.log(2222,value,typeof value, myIsArray(value))
  if (typeof value == 'string') {
    //不是数组的时候转换
    if (value == undefined || value == '' || value == '{}' || value == '[{}]') value = [];
    else value = myStr2Json(value);
  }
  if (value != undefined && !myIsArray(value)) {  //将值转换为数组形式
    var s = value;
    value = [];
    value.push(s);  //值作为一个元素存放到数组
  }
  return value;
}

export const deepCopy = (obj, cache = new WeakMap()) => {
  if (obj === null) return null; // 处理 null 值
  if (typeof obj !== 'object') return obj; // 基本数据类型直接返回  
  if (cache.has(obj)) {
    return cache.get(obj); // 如果已经拷贝过这个对象，则直接返回之前的拷贝结果
  }
  let cloneObj = Array.isArray(obj) ? [] : {};
  cache.set(obj, cloneObj); // 存储原始对象及其拷贝结果  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepCopy(obj[key], cache); // 递归拷贝每个属性值
    }
  }
  //console.log(1119,cloneObj);
  return cloneObj;
}

export const numberToChinese = (num) => {
  // 定义中文数字和单位
  const units = ["", "拾", "佰", "仟"];
  const bigUnits = ["", "万", "亿", "兆"];
  const digitToChinese = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const decimalUnits = ["角", "分"];
  // 判断特殊情况
  if (num === 0) return "零元整";
  if (num < 0) return "负" + numberToChinese(-num);
  let result = "";
  // 处理整数部分
  let integerPart = Math.floor(num);
  let decimalPart = (num - integerPart).toFixed(2).slice(2);
  // 分割整数部分，按每四位处理一组
  let i = 0;
  while (integerPart > 0) {
    let part = integerPart % 10000;
    if (part > 0) {
      let partChinese = "";
      for (let j = 0; j < 4 && part > 0; j++) {
        let digit = part % 10;
        if (digit > 0) {
          partChinese = digitToChinese[digit] + units[j] + partChinese;
        } else if (!partChinese.startsWith("零")) {
          partChinese = "零" + partChinese;
        }
        part = Math.floor(part / 10);
      }
      result = partChinese.replace(/零+$/, "") + bigUnits[i] + result;
    }
    integerPart = Math.floor(integerPart / 10000);
    i++;
  }
  result += "元";
  // 处理小数部分
  if (decimalPart > 0) {
    for (let k = 0; k < decimalUnits.length; k++) {
      let digit = decimalPart[k];
      if (digit > 0) {
        result += digitToChinese[digit] + decimalUnits[k];
      }
    }
  } else {
    result += "整";
  }
  return result.replace(/零+/g, "零").replace(/零元/, "元").replace(/^元/, "");
}


export const myParseTags = (str, tag1) => {
  return str.replace(/${/g, "sys.${");
  //将${productid}替换成类似的${sys.productid}
  /*
    if (tag1 == undefined) tag1 = '{';
    let tag2 = '}';
    if (tag1 == '[') tag2 = ']';
    else if (tag1 == '<') tag2 = '>';
    let rs = {};
    rs.exp = '';
    rs.str = '';
    if (str != undefined && str != '') {
      let s1 = str.slice(0, tag1.length);
      let s2 = str.slice(-tag2.length);
      alert(s1+',---,'+s2)
      if (s1 == tag1 && s2 == tag2) {
        rs.exp = str.slice(tag1.length, str.length - tag2.length);
      } else {
        rs.str = str;
      }
    }
    return rs;
    */
}


String.prototype.removeRightSpace = function (str) {
  let i = str.length - 1;
  while (i >= 0 && str[i] === ' ') {
    i--;
  }
  return str.substring(0, i + 1);
}

String.prototype.replaceAll = function (s1, s2) {
  var s = this;
  if (s == undefined) s = '';
  return this.replace(new RegExp(s1, 'gm'), s2);
  //var result=s;
  //if (result.indexOf(s1)>=0) result = str.replace(eval("/"+str1+"/gi"), str2);
  //return result;
}
/*
String.prototype.getTextWH = function(style){//获取字符串宽度及高度  
  let span=$("<span>"+this+"</span>");  
  span.css($.extend({}, style, {visibility:"hidden"}));  
  $("body").append($span);  
  var result={  
      "width": $span.width(),  
      "height": $span.height()  
  };  
  $span.remove();  
  return result;  
}; 

export const myGetTextSize=(str, fontname, fontsize, fontweight)=>{  //gettextwidth,gettextheight
  //计算一个文本字体所占的高度和宽度，与字体及其大小有关
  if (fontweight==undefined || fontweight=='') fontweight='normal';
  if (fontsize==undefined || fontsize=='') fontsize = sys.label.fontsize;
  if (fontname==undefined || fontname=='') fontname = sys.label.fontname;  
  let size={}; 
  size.width=0; 
  size.height=0; 
  if (str!='' && str!==undefined){
    size=str.getTextWH({"fontSize":fontsize, "fontFamily":fontname, "font-weight":fontweight});
  } 
  return size;
}
*/

export const myGetTextSize = (text, fontname, fontsize, fontweight) => {
  if (fontweight == undefined || fontweight == '') fontweight = 'normal';
  if (fontsize == undefined || fontsize == '') fontsize = sys.label.fontsize;
  if (fontname == undefined || fontname == '') fontname = sys.label.fontname;
  // const text = 'Hello, World!';
  // const font = 'Arial';
  // const fontSize = 16; // 16px
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontsize}px ${fontname}`;
  const hw = context.measureText(text);
  hw.height = hw.actualBoundingBoxAscent + hw.actualBoundingBoxDescent;
  return hw;
};

export const mySelectOnFocus = () => { //聚焦后选中全文本，有bug
  /*
  $('input').on('focus', function() {
    var $this = $(this)
    .one('mouseup.mouseupSelect', function() {
      $this.select();
      return false;
    })
    .one('mousedown', function() {
      // compensate for untriggered 'mouseup' caused by focus via tab
      $this.off('mouseup.mouseupSelect');
    })
    .select();
  });
  */
}

export const myDoFiles = async (action, sourcefile) => {
  //服务器端文件处理：action=删除文件delete、判断文件是否存在exists、文件更名rename等操作，文件属性名称为filename
  let rs = {};
  try {
    if (typeof sourcefile === 'object') sourcefile = JSON.stringify(sourcefile);
    if (sourcefile !== '' && sourcefile !== '{}') {
      let url = 'http://localhost:8080/myServer/doFiles?action=' + encodeURIComponent(action) + '&sourcefile=' + encodeURIComponent(sourcefile);
      const response = await axios.post(url, {});
      rs = response.data;
    }
  } catch (error) {
    console.error('Network error:', error);
    // 处理错误情况，例如显示用户友好的错误消息
  }
  // let url = 'http://localhost:8080/myServer/doFiles?action=' + action + '&sourcefile=' + sourcefile;
  // // res= ajax(url, {}, 'POST');  
  // await axios.post(url, {}).then(res => {
  //   rs = res;
  // })  
  return rs;
}

export const myDoPdf = async (params) => {
  if (!params._action) params._action = 'replace';
  return ajax('http://localhost:8080/myServer/doPdf', params, 'POST');
}

// 登录
// const Base ='http://localhost:/8080/imlab'
// /imlab/doLogin?dbms=mysql&database=&action=login&paramvalues={"userid":"20000555","password":"123456","autologin":1}
// /imlab/doLogin?dbms=mysql&database=&action=login&paramvalues={"userid":"20000555,"password":"123456","autologin":1}
//登录请求
export const reqLogin = (dbms, database, action, paramvalues) => {
  var url = '/myServer/doLogin?dbms=' + dbms + '&database=' + database + '&action=' + action + '&paramvalues=' + encodeURIComponent(paramvalues)
  //console.log(url)
  return ajax(url, {}, 'POST')
  // return ajax('/imlab/doLogin', {dbms, database, action, paramvalues}, 'POST')
}

export const fetchData = sqlprocedure => $fetchData({ sqlprocedure })
export const $fetchData = async (params) => {
  if (params.nodetype === undefined) params.nodetype = 'datagrid';
  return fetch(`http://localhost:8080/myServer/doSQL?paramvalues=${JSON.stringify(encodeURIComponent(params))}`).then(res => res.json())
}

//数据增删改查请求
export const reqdoSQL = (params) => {
  if (params.nodetype === undefined) params.nodetype = 'datagrid';
  //const paramvalues = JSON.stringify(params);
  //*原来通过url传递参数的方法，url最多2024B
  //var url = 'http://localhost:8080/myServer/doSQL?paramvalues=' + encodeURIComponent(paramvalues);
  //return ajax(url, {}, 'POST');
  //*/
  //23-12-17修改的程序，不通过url传递参数  
  return ajax('http://localhost:8080/myServer/doSQL', params, 'POST');
}

export const reqdoTree = (params) => {
  params.nodetype = 'tree';
  if (params.style === undefined || params.style !== 'expand') params.style = "full";
  if (params.keyvalue === undefined) params.keyvalue = '';
  /*原来通过url传递参数的方法，url最多2024B
  const paramvalues = JSON.stringify(params);
  var url = 'http://localhost:8080/myServer/doSQL?paramvalues=' + encodeURIComponent(paramvalues);
  return ajax(url, {}, 'POST');
  */
  return ajax('http://localhost:8080/myServer/doSQL', params, 'POST');
}

export const saveAsImage = (params) => {
  params.action = 'saveimage';
  return ajax('http://localhost:8080/myServer/doFiles', params, 'POST');
}

//数据增删改查请求
export const lockTable = (table, action) => {
  let param = { table, action };
  return ajax('http://localhost:8080/myServer/lockTable', param, 'POST');
}

//数据库备份或恢复
export const backupDatabase = (params) => {
  //登录数据库的信息
  if (params.user == undefined) params.user = '';
  if (params.password == undefined) params.password = '';
  if (params.database == undefined) params.database = '';
  if (params.filetitle == undefined) params.filetitle = 'backup';
  if (params.filepath == undefined || params.filepath == '') params.filepath = 'mybase\\backups\\';
  params.filetitle = myFileExtension(params.filetitle).filename;
  params.filename = params.filetitle; // + '_' + myLocalTime().timestamp + '.sql';
  params._action = 'backup';
  //为什么params中的属性也会返回？
  return ajax('http://localhost:8080/myServer/doSQL', params, 'POST');
}

//数据库备份或恢复
export const restoreDatabase = (params) => {
  console.log(1888, params)
  //登录数据库的信息
  if (params.user == undefined) params.user = '';
  if (params.password == undefined) params.password = '';
  if (params.database == undefined) params.database = '';
  if (params.filepath == undefined || params.filepath == '') params.filepath = 'mybase\\backups\\';
  params._action = 'restore';
  return ajax('http://localhost:8080/myServer/doSQL', params, 'POST');
}

export const fileUpload = async (params) => {
  let { targetfile, targetpath, file } = params;
  if (targetfile === undefined) targetfile = 'temp_' + myLocalTime('').timestamp;
  if (targetpath === undefined || targetpath == '') targetpath = 'mybase\\';
  if (!targetpath.endsWith("\\")) targetpath += "\\";
  let formData = new FormData();
  formData.append("targetpath", targetpath);  //文件路径
  formData.append("targetfile", targetfile);  //目标文件名，与时间戳有关       
  formData.append("file", file.originFileObj);  //上传第一个文件
  const config = { headers: { "Content-Type": "multipart/form-data" } }
  let rs = await axios.post("/myServer/doFileUpload", formData, config).then(res => {
    //服务器端返回文件名称，实际文件名。如果文件名为空表示文件上传失败
    return res.data;
  })
  return rs;
}

export const fileDownload = async (p) => {
  //const realfilename = 'http://127.0.0.1:8080/myServer/mybase/backups/' + targetfilename;
  const realfilename = sys.rootpath + p.filepath + p.sourcefilename;
  //添加targetfilename文件后缀名
  let s1 = myFileExtension(p.sourcefilename).fileext;
  let s2 = myFileExtension(p.targetfilename).filename;
  p.targetfilename = s2 + '.' + s1;
  //console.log(555, sys.rootpath, p.targetfilename, p.filepath, p.sourcefilename, realfilename)
  //console.log(556, p.filepath + p.sourcefilename)
  let rs = await myDoFiles('exists', [{ filename: p.filepath + p.sourcefilename }]);  //判断文件是否存在
  //console.log(557, rs)
  let msg = '';
  if (rs.flag > 0) {
    try {
      const response = await fetch(realfilename); // 使用fetch获取文件数据      
      if (!response.ok) { // 检查请求是否成功
        msg = '网络响应错误！'
        throw new Error(msg);
      }
      const blob = await response.blob(); // 将响应数据转换为Blob      
      setTimeout(() => {
        saveAs(blob, p.targetfilename); // 使用file-saver保存文件到本地
      });
      //msg = '服务器端文件下载结束！';
    } catch (error) {
      msg = '服务器端文件下载到本地失败！';
    }
  } else {
    msg = '服务器端数据文件找不到！';
  }

  /*
    axios({
      url: 'http://127.0.0.1:8080//myServer/' + filepath + '/' + sourcefilename, // 服务器端文件下载的URL
      method: 'GET',
      responseType: 'blob', // 表明服务器返回的数据类型
    }).then((response) => {
      const blob = new Blob([response.data], { type: response.data.type });
      saveAs(blob, targetfilename);
    }).catch((error) => {
      msg = error;
      //console.error(sourcefilename + '文件下载失败:', error);
    });
    */
  return msg;
}

export const myFileExtension = (fileName) => {
  // 查找最后一个点的位置
  const lastDotIndex = fileName.lastIndexOf('.');
  let json = {};
  // 如果找到点，并且点不是第一个字符
  if (lastDotIndex > 0) {
    json.filename = fileName.substring(0, lastDotIndex);
    json.fileext = fileName.substring(lastDotIndex + 1);
  } else {
    json.filename = fileName;
    json.fileext = '';
    // 如果没有找到点或者点是第一个字符，返回原始文件名    
  }
  return json;
}

export const MyRedirect = (to) => {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

export const navigateCom = (A) => {  //在props中添加一个navigate属性
  return (props) => {
    let navigate = useNavigate();
    return <A {...props} navigate={navigate} />
  }
}

export const myFileSize = (size) => {
  let x = 0;
  if (size <= 1024) x = size;
  else if (size <= 1024 * 1024) x = size / 1024.00;
  else if (size <= 1024 * 1024 * 1024) x = size / 1024.00 / 1024.0;
  else x = size / 1024 / 1024.00 / 1024.0;
  x = parseFloat(parseInt((x + 0.005) * 100) / 100);
  let str = '';
  if (size <= 1024) str = parseInt(x) + "B";
  else if (size <= 1024 * 1024) str = x + "KB";
  else if (size <= 1024 * 1024 * 1024) str = x + "MB";
  else str = x + "GB";
  return str;
}

function anonyCom(A) {
  return (props) => {
    let navigate = useNavigate();
    return <A {...props} navigate={navigate} />
  }
}

export const xmyOnFocusEvent = async (id) => {
  //控件onchange事件补充
  console.log(991, id);
  return;
}

export const renderGridTitle = (title) => {
  return (<span className="labelStyle">{title}</span>);
}

// export const myParseGridColumns = (columns, type) => {
//   //let cols="[@c#160%d]对应课程/coursename;[%d#130]选课号/classno;[%x@c#150]面向对象/scope;[%d#85]任课教师/teachername;[%d#85]发布教师/assigner;[%d#80]发布日期/assigndate;[%d#80]截止日期/requireddate;[%d#65]习题数量/topicnumber;[%d#110]复制方式/copystyle";
//   let fieldset = [];
//   let fields = columns.split(';');
//   let w = 0;
//   for (let i = 0; i < fields.length; i++) {
//     fieldset[i] = {};   //[@c#160%d]对应课程/coursename
//     let tmp = fields[i].split('/');
//     if (tmp.length > 1) fieldset[i].field = tmp[1];
//     let s = tmp[0].toLocaleLowerCase(); //[@c#160%d]对应课程
//     let x1 = s.indexOf('[');
//     let x2 = s.indexOf(']');
//     s = s.substring(x1 + 1, x2 - x1);  //@c#160%d
//     fieldset[i].title = tmp[0].substring(x2 + 1); //对应课程
//     //处理对齐方式
//     let x31 = s.indexOf('@c');
//     let x32 = s.indexOf('@l');
//     let x33 = s.indexOf('@r');  //#160%d
//     fieldset[i].align = '';
//     if (x31 >= 0) {
//       fieldset[i].align = 'center';
//     } else if (x33 >= 0) {
//       fieldset[i].align = 'right';
//     } else if (x32 >= 0) {
//       fieldset[i].align = 'left';
//     }
//     s = s.replaceAll('@c', '');
//     s = s.replaceAll('@l', '');
//     s = s.replaceAll('@r', '');
//     //处理数据类型
//     let x41 = s.indexOf('%d');  //日期型，数字型，默认居中，times new roman字体
//     let x42 = s.indexOf('%n');  //数值型，默认右对齐，times new roman字体
//     let x43 = s.indexOf('%f');  //数值型，默认右对齐，非零显示，times new roman字体  
//     let x44 = s.indexOf('%x');
//     fieldset[i].datatype = 'c';
//     if (x41 >= 0) {
//       if (fieldset[i].align == '') fieldset[i].align = 'center';
//       fieldset[i].datatype = 'd';
//     } else if (x42 >= 0) {
//       if (fieldset[i].align == '') fieldset[i].align = 'right';
//       fieldset[i].datatype = 'n';
//     } else if (x43 >= 0) {
//       if (fieldset[i].align == '') fieldset[i].align = 'right';
//       fieldset[i].datatype = 'f';
//     }
//     s = s.replaceAll('%d', '');
//     s = s.replaceAll('%n', '');
//     s = s.replaceAll('%f', '');
//     s = s.replaceAll('%x', '');  //#160
//     fieldset[i].width = 100;
//     let x51 = s.indexOf('#');
//     if (x51 >= 0) {
//       s = s.substring(x51 + 1);
//       if (!isNaN(s)) fieldset[i].width = parseInt(s);
//     }
//     w += fieldset[i].width;
//   }
//   let columnset = [];
//   for (let i = 0; i < fieldset.length; i++) {
//     let item = fieldset[i];
//     if (item.datatype == 'd' || item.datatype == 'f' || item.datatype == 'n') {
//       columnset.push(<GridColumn frozen={type == 'fixed' ? true : false} key={'_' + item.field} width={item.width} align={item.align} halign='center' field={item.field} title={<span className="labelStyle">{item.title}</span>} totalwidth={w}
//         render={({ row }) => (<div style={{ fontFamily: 'times new roman' }}>{row[`${item.field}`]}</div>)}></GridColumn>)
//     } else {
//       columnset.push(<GridColumn frozen={type == 'fixed' ? true : false} key={'_' + item.field} width={item.width} align={item.align} halign='center' field={item.field} title={<span className="labelStyle">{item.title}</span>} totalwidth={w}>
//       </GridColumn>)
//     }
//   }
//   return columnset;
// }

export const myLoadData = async (id) => {
  //console.log(id.props.sqlparams);
  let p = { ...id.props.sqlparams };
  let rs = await reqdoSQL(p);
  id.setState({ data: rs.rows });
}

//tree处理函数
//将线性表结构的数据转成树形结构数据，只需要父节点

function myHeader(title) {
  return (<span><WindowsOutlined /><label style={{ marginLeft: 8 }} className='headerStyle'>学生详细信息</label></span>);
}

export function myNotice(msg, type, width, time) {
  if (!type || type == '') type = 'success';
  if (time == undefined || isNaN(time)) time = 2;
  let json = {
    key: '_notice1',
    message: '系统提示!',
    description: msg,
    duration: time > 0 ? time : null,
    type: type,
    overlayStyle: {},
    placement: ''
  };
  if (type == 'success') json.placement = 'bottomRight';
  else if (type == 'info') json.placement = 'top';
  else json.placement = 'topRight';
  if (!isNaN(width) && width > 0) json.overlayStyle.width = width;
  notification.open(json);
};

// export function myMessage(msg, type, position) {
//   if (type == undefined || type == '') type = 'info';
//   if (position == undefined || position == '') position = 'top';
//   let json = {
//     key: '_message1',
//     message: '系统提示!',
//     description: msg,
//     duration: null,
//     type: type,
//     //overlayStyle: {},
//     placement: position,
//   };
//   notification.open(json);
//   // <Popconfirm open={this.state.openConfirm1} arrow title='系统确认' description='是否确定删除这条记录？'
//   // onConfirm={this.handleDeleteClick.bind(this)} onCancel={()=>this.setState({openConfirm1: false})}
//   // okText="确定" showCancel={false} overlayStyle={{width:350}} placement='bottom' />
// }

export function myResetJsonValues(data) {
  //处理日期变量
  for (var key in data) {
    if (typeof data[key] === 'object' && typeof data[key].$d === 'object') { //将日期型数据转成字符串
      data[key] = data[key].format(sys.dateformat);
    }
  }
  return data;
}

export function myDeleteFiles(filestring, urlfield) {  //删除服务器端上传的文件
  if (!filestring) return;
  if (urlfield == undefined) urlfield = 'filename';
  let tmp = myStr2JsonArray(filestring);
  let files = [];
  for (let i = 0; i < tmp.length; i++) {
    files[i] = {};
    files[i].filename = tmp[i][urlfield];
  }
  myDoFiles('delete', JSON.stringify(files));
}


/*编译antd组件 */
export function myParseTableColumns(columns, fixedtype) {
  //let cols="[@c#160%d]对应课程/coursename;[%d#130]选课号/classno;[%x@c#150]面向对象/scope;[%d#85]任课教师/teachername;[%d#85]发布教师/assigner;[%d#80]发布日期/assigndate;[%d#80]截止日期/requireddate;[%d#65]习题数量/topicnumber;[%d#110]复制方式/copystyle";
  let columnset = [];
  if (columns == undefined) return columnset;
  if (fixedtype == undefined) fixedtype = '';
  let fieldset = [];
  let fields = columns.split(';');
  let w = 0;
  for (let i = 0; i < fields.length; i++) {
    fieldset[i] = {};   //[@c#160%d]对应课程/coursename
    let tmp = fields[i].split('/');
    if (tmp.length > 1) fieldset[i].dataIndex = tmp[1];
    let s = tmp[0].toLocaleLowerCase(); //[@c#160%d]对应课程
    let x1 = s.indexOf('[');
    let x2 = s.indexOf(']');
    s = s.substring(x1 + 1, x2 - x1);  //@c#160%d
    fieldset[i].title = tmp[0].substring(x2 + 1); //对应课程
    //处理对齐方式
    let x31 = s.indexOf('@c');
    let x32 = s.indexOf('@l');
    let x33 = s.indexOf('@r');  //#160%d
    fieldset[i].align = '';
    if (x31 >= 0) {
      fieldset[i].align = 'center';
    } else if (x33 >= 0) {
      fieldset[i].align = 'right';
    } else if (x32 >= 0) {
      fieldset[i].align = 'left';
    }
    s = s.replaceAll('@c', '');
    s = s.replaceAll('@l', '');
    s = s.replaceAll('@r', '');
    //处理数据类型
    let x41 = s.indexOf('%d');  //日期型，数字型，默认居中，times new roman字体
    let x42 = s.indexOf('%n');  //数值型，默认右对齐，times new roman字体
    let x43 = s.indexOf('%f');  //数值型，默认右对齐，非零显示，times new roman字体  
    let x44 = s.indexOf('%x');
    //console.log(s);
    fieldset[i].datatype = 'c';
    //console.log(x41,x42,x43,x44)
    if (x41 >= 0) {
      if (fieldset[i].align == '') fieldset[i].align = 'center';
      fieldset[i].datatype = 'd';
    } else if (x42 >= 0) {
      if (fieldset[i].align == '') fieldset[i].align = 'right';
      fieldset[i].datatype = 'n';
    } else if (x43 >= 0) {
      if (fieldset[i].align == '') fieldset[i].align = 'right';
      fieldset[i].datatype = 'f';
    }
    s = s.replaceAll('%d', '');
    s = s.replaceAll('%n', '');
    s = s.replaceAll('%f', '');
    s = s.replaceAll('%x', '');  //#160
    fieldset[i].width = 100;
    let x51 = s.indexOf('#');
    if (x51 >= 0) {
      s = s.substring(x51 + 1);
      if (!isNaN(s)) fieldset[i].width = parseInt(s);
    }
    w += fieldset[i].width;
    if (fieldset[i].align == '') fieldset[i].align = 'left';
  }
  for (let i = 0; i < fieldset.length; i++) {
    let item = fieldset[i];
    item.width += 'px';
    item.ellipsis = true;
    if (fixedtype != '') item.fixed = fixedtype;
    if (item.datatype == 'd' || item.datatype == 'f' || item.datatype == 'n') {
      item.render = (text, record, index) => { return <div style={{ fontFamily: 'times new roman' }}>{text}</div> };
    }
    columnset.push(item)
  }
  return columnset;
}

export const myParseAntFormItemProps = (props) => {
  //可以有三种方式接受参数
  //调用方式1：<MyTextBox params='stuname,学生姓名,72, 70, 20, 28,240,诸葛孔明, ,' />
  //调用方式2：<MyTextBox id='supplierid' label='供应商' labelwidth='72' top={20+7*rowheight} left='20' width='200' ref={ref => this.supplierid = ref} addonRight={this.addon.bind(this, 'help')} />
  //let params=this.props.params;  
  // attr=this.props.attr;
  //editable控制控件是否只读，value控制控件的值
  //console.log(1,props)
  //console.log(2,props.params)
  let attr = {};
  if (props.params != undefined && typeof props.params === 'string') {
    //将字符串转换成json对象。参数逗号间隔，例如'filter,快速过滤, 72, 2, 16,0, 300,,'
    let tmp = props.params.split(','); //id, label, labelwidth, top, left, height, width, value, style 
    for (let i = 0; i < tmp.length; i++) tmp[i] = tmp[i].trim();
    if (tmp.length > 0) attr.id = tmp[0];
    if (tmp.length > 1) attr.label = tmp[1];
    if (tmp.length > 2) attr.labelwidth = tmp[2];
    if (tmp.length > 3) attr.top = tmp[3];
    if (tmp.length > 4) attr.left = tmp[4];
    if (tmp.length > 5) attr.height = tmp[5];
    if (tmp.length > 6) attr.width = tmp[6];
    if (tmp.length > 7) attr.style = tmp[7];
    if (tmp.length > 8) attr.items = tmp[8];  //radio/checkbox选项     
    if (tmp.length > 9) attr.textfield = tmp[9];  //label的field名称
  }
  attr = { ...attr, ...props };  //
  if (attr.hidden || (attr.style !== undefined && attr.style === 'hidden')) {
    attr.top = 0; attr.left = 0; attr.height = 0; attr.width = 1; attr.labelwidth = 0; attr.label = '';
  }
  if (attr.antclass != 'label' && attr.antclass != 'image') {
    if (attr.height === undefined || parseInt(attr.height) === 0) attr.height = 28;
  }
  if (attr.antclass != 'radio' && attr.antclass != 'image' && attr.antclass != 'imageupload') {
    if (attr.width === undefined || parseInt(attr.width) === 0) attr.width = 200;
  }
  if (attr.panelheight === undefined) attr.panelheight = 250;
  if (attr.rows === undefined || isNaN(attr.rows)) attr.rows = 4;
  if (attr.maxCount === undefined || isNaN(attr.maxCount)) attr.maxCount = -1;
  if (attr.top === undefined || isNaN(attr.top)) attr.top = -1;
  if (attr.left === undefined || isNaN(attr.left)) attr.left = -1;
  attr.rows = parseInt(attr.rows);
  attr.top = parseInt(attr.top);   //top='10'  10
  attr.left = parseInt(attr.left);
  attr.height = parseInt(attr.height);
  attr.width = parseInt(attr.width);
  attr.labelwidth = parseInt(attr.labelwidth);
  if (attr.panelwidth === undefined) attr.panelwidth = attr.width;
  attr.panelheight = parseInt(attr.panelheight);
  attr.panelwidth = parseInt(attr.panelwidth);
  attr.maxCount = parseInt(attr.maxCount);
  if (attr.items == undefined) attr.items = '';
  if (attr.label === undefined) attr.label = '';
  if (attr.style === undefined) attr.style = '';
  if (attr.disabled == undefined) attr.disabled = false;
  if (attr.datatype == undefined || attr.datatype == '') {
    //数据类型，如果是json，那么按数组处理    
    //if (attr.antclass=='image' || attr.antclass=='imageupload') attr.datatype='json';
    //else attr.datatype='c';  
    attr.datatype = 'c';
  }
  if (attr.label !== '' && attr.colon) attr.label += ':';
  attr.editable = true;
  attr.multiline = false;
  attr.hidden = false;
  if (attr.textfield == undefined || attr.textfield == '') attr.textfield = 'label';
  if (attr.valuefield == undefined || attr.valuefield == '') attr.valuefield = attr.id;
  attr.addon = '';
  attr.spinners = false;
  attr.required = false;
  attr.buttontype = 'default';  //用于radio
  attr.cascader = false;
  let style = attr.style.split(';');
  if (style.includes('hidden')) attr.hidden = true;  //框隐藏文本框
  if (style.includes('readonly')) attr.editable = false;  //文本框永远只读
  if (style.includes('disabled') || style.includes('disable')) attr.disabled = true;  //文本框永远只读
  if (style.includes('textarea')) attr.multiline = true;  //多行文本框，类似于textarea
  if (style.includes('required')) attr.required = true;
  if (attr.hidden) attr.editable = false;
  if (style.includes('spinner') || style.includes('spinners')) attr.spinners = true;
  if (style.includes('button')) attr.buttontype = 'button';
  if (style.includes('cascader')) attr.cascader = true;
  if (style.includes('search')) attr.addon = 'search';
  else if (style.includes('help')) attr.addon = 'help';
  if (attr.value === undefined) attr.value = '';
  if (attr.message != undefined && attr.message != '') attr.required = true;
  if (attr.form !== undefined && attr.form == 'none') attr.form = false;
  else attr.form = true;
  attr.data = [];
  if (attr.options != undefined && typeof attr.options === 'object') attr.data = attr.options;
  if (attr.items != '') {
    if (typeof attr.items === 'object') //本身是对象
      attr.data = attr.items;
    else if (typeof attr.items === 'string')
      attr.data = attr.items.split(';').map(item => {  //字符串,checkbox只能使用label,value？不能设置fieldNames
        let row = {}; row[attr.id] = item; row.label = item; row.value = item;
        return (row)
      });
  }
  return attr;
}


export const myParseAntTreeTableProps = (attr) => {
  if (attr.rowtitle != undefined && attr.rowTitle == undefined) attr.rowTitle = attr.rowtitle;
  if (attr.rowTitle == undefined) attr.rowTitle = '记录';
  attr.modalflag = false;
  attr.drawerflag = false;
  if (typeof attr.modal == 'object') {
    if (attr.modal.height != undefined) attr.modalHeight = attr.modal.height;
    if (attr.modal.width != undefined) attr.modalWidth = attr.modal.width;
    if (attr.modal.title != undefined) attr.modalTitle = attr.modal.title;
  }
  if ((attr.modalHeight != undefined && !isNaN(attr.modalHeight)) || (attr.modalWidth != undefined && !isNaN(attr.modalWidth)) || (attr.modalTitle != undefined && attr.modalTitle != '')) {
    attr.modalflag = true;
    if (attr.modalWidth == undefined) attr.modalWidth = 500;
    if (attr.modalHeight == undefined) attr.modalHeight = 500;
    if (attr.modalTitle == undefined) attr.modalTitle = '编辑' + attr.rowTitle;
    attr.modalWidth = parseInt(attr.modalWidth);
    attr.modalHeight = parseInt(attr.modalHeight);
  }

  //drawer判别
  if (typeof attr.drawer == 'object') {
    if (attr.drawer.width != undefined) attr.drawerWidth = attr.drawer.width;
    if (attr.drawer.title != undefined) attr.drawerTitle = attr.drawer.title;
    if (attr.drawer.placement != undefined) attr.drawerPlacement = attr.drawer.placement;
    if (attr.drawer.position != undefined) attr.drawerPlacement = attr.drawer.position;
    attr.drawerflag = true;
  }
  if ((attr.drawerWidth != undefined && !isNaN(attr.drawerWidth)) || (attr.drawerTitle != undefined && attr.drawerTitle != '') || (attr.drawerPosition != undefined) || (attr.drawerPlacement != undefined)) {
    attr.drawerflag = true;
    attr.drawerWidth = parseInt(attr.drawerWidth);
  }
  attr.tabsflag = false;
  attr.formflag = true;
  attr.splitflag = '';
  if (typeof attr.tabItems == 'object') attr.tabsflag = true;
  if (attr.splitHeight == undefined && attr.splitheight != undefined) attr.splitHeight = attr.splitheight;
  if (attr.splitHeight != undefined && !isNaN(attr.splitHeight)) {
    attr.splitHeight = parseInt(attr.splitHeight);
    attr.splitflag = 'bottom';
  }
  if (attr.splitWidth == undefined && attr.splitwidth != undefined) attr.splitWidth = attr.splitwidth;
  if (attr.splitWidth != undefined && !isNaN(attr.splitWidth)) {
    attr.splitWidth = parseInt(attr.splitWidth);
    attr.splitflag = 'right';
  }
  if (attr.border == undefined || typeof attr.toolbar == 'string' && attr.border == '') attr.border = false;
  else if (typeof attr.toolbar != 'boolean') attr.border = true;
  //console.log(attr.toolbar)
  if (attr.toolbar != undefined && typeof attr.toolbar == 'boolean' && !attr.toolbar) attr.toolbar = '';
  else if (attr.toolbar == undefined || typeof attr.toolbar == 'boolean' && attr.toolbar) attr.toolbar = 'add;edit;delete;save;filter;refresh';
  if (attr.pagesize != undefined && attr.pageSize == undefined) attr.pageSize = attr.pagesize;
  if (typeof attr.pageSize == 'boolean' && !attr.pageSize) attr.pageSize = 0;
  else if (isNaN(attr.pageSize)) attr.pageSize = 20;
  attr.pageSize = parseInt(attr.pageSize);

  //判断是否存在行编辑的小按钮
  if (attr.rowButton == undefined) attr.rowButton = '';

  if (attr.parentclass != undefined && attr.parentClass == undefined) attr.parentClass = attr.parentclass;
  console.log(990, attr.parentClass)
  //是否出现行号
  if (attr.rownumber != undefined && attr.rowNumber == undefined) attr.rowNumber = attr.rownumber;
  if (typeof attr.rowNumber == 'boolean' && attr.rowNumber) attr.rowNumber = '序号';
  else if (attr.rowNumber == undefined || (typeof attr.rowNumber == 'boolean' && !attr.rowNumber)) attr.rowNumber = '';
  //只可以选择行  
  if (attr.selectonly != undefined && attr.selectOnly == undefined) attr.selectOnly = attr.selectonly;
  if (attr.selectOnly == undefined) attr.selectonly = false;
  if (typeof attr.selectOnly == 'string' && attr.selectOnly == '') attr.selectonly = false;
  if (attr.selectonly) attr.border = true;  //选择模式时带边框
  //单选或多选，默认多选多行
  if (attr.singleselect != undefined && attr.singleSelect == undefined) attr.singleSelect = attr.singleselect;
  if (attr.singleSelect == undefined) attr.singleSelect = false;
  if (typeof attr.singleSelect == 'string' && attr.singleSelect == '') attr.singleSelect = false;

  if (attr.masterfield != undefined && attr.masterField == undefined) attr.masterField = attr.masterfield;
  if (attr.masterField == undefined) attr.masterField = '';

  if (attr.canceltext != undefined && attr.cancelText == undefined) attr.cancelText = attr.canceltext;
  if (attr.cancelText == undefined) attr.cancelText = '取消';
  if (attr.oktext != undefined && attr.okText == undefined) attr.okText = attr.oktext;
  if (attr.okText == undefined) attr.okText = '确定';
  if (attr.fixedcolumns != undefined && attr.fixedColumns == undefined) attr.fixedColumns = attr.fixedcolumns;
  //判断存储过程
  if (attr.selectprocedure != undefined && attr.selectProcedure == undefined) attr.selectProcedure = attr.selectprocedure;
  if (attr.queryprocedure != undefined && attr.queryProcedure == undefined) attr.queryProcedure = attr.queryprocedure;
  if (attr.selectProcedure != undefined && attr.queryProcedure == undefined) attr.queryProcedure = attr.selectProcedure;

  if (attr.insertrocedure != undefined && attr.insertProcedure == undefined) attr.insertProcedure = attr.insertprocedure;
  if (attr.updateprocedure != undefined && attr.updateProcedure == undefined) attr.updateProcedure = attr.updateprocedure;
  if (attr.insertProcedure == undefined && attr.updateProcedure != undefined) attr.insertProcedure = attr.updateProcedure;
  else if (attr.updateProcedure == undefined && attr.insertProcedure != undefined) attr.updateProcedure = attr.insertProcedure;
  if (attr.deleteprocedure != undefined && attr.deleteProcedure == undefined) attr.deleteProcedure = attr.deleteprocedure;
  return attr;
}


export const mySetPdfText = async (doc, text, top, left, fontname, fontsize, fontstyle) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  if (!fontname === undefined || fontname == '') fontname = 'SimSun';
  if (!fontsize === undefined || isNaN(fontsize) || fontsize == '') fontsize = sys.label.fontsize;
  if (!fontstyle === undefined || fontstyle == '') fontstyle = 'normal';
  console.log(999, pageWidth)
  doc.setFont(fontname, fontstyle);
  doc.setFontSize(fontsize);
  let x = left;
  let y = top;
  let textWidth = doc.getTextWidth(text);
  if (left == -1) x = pageWidth - textWidth;
  else if (left == -2) x = (pageWidth - textWidth) / 2;
  doc.text(text, x, y);
  return doc;
}

export const myFetchfromFile = async (file) => {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
};