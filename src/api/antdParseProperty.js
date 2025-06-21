/*
 解析自定义控件的属性
*/
import ajax from './ajax'
import React, { Component } from 'react';
const sys = { ...React.sys };

export const parseParams = (props) => {  //解析属性
  let attr = { ...props }
  let { id, type, antclass, label, labelwidth, top, left, height, width, value, visible, maxcount, count, spacing, labelfield, valuefield, textfield, precision } = attr;
  if (!height || isNaN(height) || height == 0) height = -1;
  if (!width || isNaN(width) || width == 0) width = -1;
  //labelwidth大写会提示警告
  if (labelwidth && !isNaN(labelwidth) && labelwidth > 0 && (!labelwidth || isNaN(labelwidth))) labelwidth = labelwidth;
  if (!labelwidth || isNaN(labelwidth) || labelwidth == 0) labelwidth = 80;  //labelwidth labelwidth
  if (!spacing || isNaN(spacing)) spacing = 8;  //列间距、行间距
  if (!count) count = -1;
  if (!value) value = '';
  //height = parseInt(height);
  labelwidth = parseInt(labelwidth);     
  spacing = parseInt(spacing);
  if (width && !isNaN(width)) width = parseInt(width);
  if (height && !isNaN(height)) height = parseInt(height);
  if (top && !isNaN(top)) top = parseInt(top);
  if (left && !isNaN(left)) left = parseInt(left);
  count = parseInt(count);
  if (precision && !isNaN(precision)) precision = parseInt(precision);
  if (attr.max && !isNaN(attr.max)) attr.max = parseInt(attr.max);
  if (attr.min && !isNaN(attr.min)) attr.min = parseInt(attr.min);  
  //visible部署原生属性，用变量
  if (visible !== undefined && !visible) visible = false;
  if (!labelfield && textfield) labelfield = textfield;
  if (labelfield == undefined || labelfield == '') labelfield = 'label';
  if (valuefield == undefined || valuefield == '') valuefield = 'value';
  textfield = labelfield;
  if (type === undefined) type = antclass;
  //if (attr.onSearch) type = 'search';
  if (!type || type == '') type = 'text';
  if (type === 'datebox') type = 'date';
  else if (type === 'numberbox') type = 'number';
  else if (type === 'textbox') type = 'text';
  antclass = type;
  //赋值到attr
  attr = { ...attr, type, antclass, label, labelwidth, labelwidth, top, left, height, width, value, spacing, visible, labelfield, textfield, valuefield, precision }
  //处理showcount，大小写等同。
  if (attr.showcount && !attr.showCount) attr.showCount = attr.showcount;
  //处理resize，resize没有定义或定义为false时
  if (!attr.resize) attr.resize = 'none'; //默认不能改变大小
  if (attr.resize !== 'none') attr.resize = null;
  if (attr.readOnly === undefined && attr.readonly) attr.readOnly = attr.readonly;
  if (attr.readOnly === undefined || !attr.readOnly) attr.readOnly = false;
  else attr.readOnly = true;
  if (attr.disabled === undefined || !attr.disabled) attr.disabled = false;
  else attr.disabled = true;
  //visible部署原生属性，用变量
  attr.visible = 1;
  if (attr.visible !== undefined && !attr.visible) visible = 0;
  //绝对位置与相对位置定位
  attr.position = 'absolute';
  if (top !== undefined && !isNaN(top) && left !== undefined && !isNaN(left)) attr.position = 'absolute';
  else attr.position = 'relative';
  if (attr.position === 'absolute'){
     attr.style = { position: 'absolute', top: attr.top, left: attr.left }
  }else{
     attr.style = {};
     if (top != undefined && !isNaN(top)) attr.style.marginTop = parseInt(top);
     if (left != undefined && !isNaN(left)) attr.style.marginLeft = parseInt(left);          
  }
  if (height != undefined && !isNaN(height) && height > 0) attr.style.height = parseInt(attr.height);
  //存储过程
  if (attr.sqlprocedure === undefined) attr.sqlprocedure = '';
  if (attr.sqlparams === undefined) attr.sqlparams = null;
  //console.log(22222,attr.id,attr.style,attr.position)
  return attr;
}

export const parseData = (attr) => {
  if (attr.options != undefined && typeof attr.options === 'object') attr.data = attr.options;  //本身是json格式化数据
  if (attr.items != '' && typeof attr.items === 'string') {
    attr.data = attr.items.split(';').map((item, index) => {  //字符串,checkbox只能使用label,value？不能设置fieldNames
      let row = {};
      row[attr.id] = item;
      row[attr.labelfield] = item;
      row[attr.valuefield] = item;
      if (attr.labelfield != 'label') row.label = item;
      if (attr.valuefield != 'value') row.value = item;
      row.key = item + index;
      return (row)
    });
  }
  return attr;
}

export const parseSQLParams = (attr) => {
  //解析sql存储过程需要用的参数，如果存在sqlparams属性，则以它为标准；否则从attr、props中提取（去掉json或其他对象变量）存储过程参数
  let { sqlprocedure, sqlparams } = attr;
  let p = null;
  if (sqlprocedure !== undefined && sqlprocedure !== '') {
    if (sqlparams && typeof sqlparams == 'object') {
      p = { ...sqlparams };
      p.sqlprocedure = sqlprocedure;
    } else {
      p = {};
      for (let key in attr) {
        if (typeof attr[key] !== 'object') p[key] = attr[key];   //必须去掉object，否则死循环
      }
    }
  }
  return p;
}

/*
const loadData = async (sqlprocedure, sqlparams) => {
    if (!sqlprocedure) return [];
    let p={...sqlparams};
    p.sqlprocedure = sqlprocedure;
    console.log(99,p);
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    console.log(999,rs.rows);
    return rs.rows;
}
*/

