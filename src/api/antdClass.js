/*
自定义antd组件，antdtable和antdtree、antdcascader除外
*/
import ajax from './ajax'
import React, { Component } from 'react';
import { useEffect, useRef, useImperativeHandle } from 'react';
import axios from "axios";
//import { Resizable } from 'react-resizable';
import { Resizable } from 'react-resizable';
import { Drawer, Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate, Tooltip } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, LeftOutlined, RightOutlined, ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined, FullscreenExitOutlined, FileSearchOutlined, DownloadOutlined, UploadOutlined, SearchOutlined, WindowsOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { fileDownload, myFileExtension, myParseAntFormItemProps, myParseTableColumns, myParseTags, myNotice, myDoFiles, myLocalTime, reqdoTree, reqdoSQL, myStr2JsonArray, myStr2Json, myDatetoStr, myGetTextSize } from './functions.js'
import { MyFormComponent } from './antdFormMethod.js'
import { parseParams, parseData, parseSQLParams } from './antdParseProperty.js'
import { saveAs } from 'file-saver';
import PDF from 'react-pdf-js';
//import { Document, Page } from 'react-pdf-js';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { BlockOutlined, DownOutlined, UpOutlined, FileOutlined, TagOutlined, PaperClipOutlined } from '@ant-design/icons';
import { FloatButton, Tree, Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const sys = { ...React.sys };


export class AntdInputBox extends React.Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    let attr = parseParams(props);
    //console.log(555, attr.value)
    if (attr.width < 0) attr.width = 200;
    if (attr.antclass == 'browse') attr.antclass = 'text';
    this.state = {
      attr: attr,  //attr.id  attr.value
      id: attr.id,
      value: attr.value,
      antclass: attr.antclass,
      readOnly: attr.readOnly,
      disabled: attr.disabled,
      visible: attr.visible > 0 ? true : false,
    }
  }

  hideArrow = () => {
    return null; // 返回 null 来隐藏 spinner 箭头
  };

  handleBrowseClick = () => {
    let { id, onSearch, onBrowse } = this.state.attr;
    //console.log(222, id, xonsearch, onBrowse);
    onSearch?.();
  }

  handleDatepickerFocus = (e) => {
    if (e.target.tagName === 'INPUT') {  //选中值之后tagname变为div
      e.target.select();
    }
    this.state.attr.onFocus?.(e);
  }

  InputItem = ($this) => {
    //需要设置ref，在聚焦中使用这个ref，例如this.categoryname.myInputbox.focus()
    let { id, type, height, width, label, top, left, labelwidth, rules, showCount, resize, onChange, onSearch, onBrowse, onFocus, style, position, step } = $this.state.attr;
    let { value, readOnly, disabled, editable, visible } = $this.state;
    if (this.props.top && !isNaN(this.props.top)) top = parseInt(this.props.top)
    if (this.props.left && !isNaN(this.props.left)) left = parseInt(this.props.left)
    //console.log(678,id,top,left, $this.props)
    const token = 'some-token-value';
    const inputStyle = {
      backgroundColor: readOnly || disabled ? sys.colors.readonly : '',
      color: 'black', //input有效，datepicker无效，datepicker需要在style.css中设置,例如.ant-picker-disabled .ant-picker-input input{ color: black !important; }}
      width: width,
    };
    if (!isNaN(height)) inputStyle.height = height;
    //console.log('height=', $this.state.attr.style);
    const searchStyle = readOnly || disabled ? 'inputDisbledStyle' : '';
    //const customStyle = readOnly || disabled ? {backgroundColor: '#f5f5f5', color: 'black'} : {};
    //console.log(4444444, id, readOnly, type, onSearch)
    if (type === 'browse') {
      return (<div>
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }}>
          <Input {...this.state.attr} id={id} ref={ref => this.myInputbox = ref}
            onFocus={(e) => { e.target.select(); onFocus?.(e); }}
            readOnly={readOnly} disabled={disabled}
            className='textboxStyle'
            style={{ width: width - 32, backgroundColor: readOnly || disabled ? sys.colors.readonly : '' }}
            onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
          />
        </Form.Item>
        <Form.Item label='' name={id + '_button'} labelCol={{ style: { width: labelwidth + width } }} style={{ ...style, display: visible ? 'block' : 'none' }}>
          <Button icon={<SearchOutlined />} style={{ marginTop: -4, left: labelwidth + width - 32, height: 30, top: 2, width: 32 }}
            readOnly={readOnly} disabled={disabled || readOnly}
            onClick={this.handleBrowseClick}
          />
        </Form.Item>
      </div>
      )
    } if (type === 'search' || type === 'searchbox') {
      return (
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
          <Input.Search  {...this.state.attr} id={id} ref={ref => this.myInputbox = ref}
            onFocus={(e) => { e.target.select(); onFocus?.(e); }}
            className={searchStyle}
            //style={{ width: width}}
            //style={customStyle}  //无效
            style={inputStyle} value={this.state.value} readOnly={readOnly} disabled={readOnly || disabled}
            onSearch={(e) => onSearch?.(e)}
            onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
            enterButton={this.state.attr.enterButton} size="medium" />
        </Form.Item>
      )
    } else if (type === 'text' || type === 'textbox') {
      //console.log(6666,id,readOnly)
      return (
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
          <Input {...this.state.attr} id={id} ref={ref => this.myInputbox = ref}
            onFocus={(e) => { e.target.select(); onFocus?.(e); }}
            readOnly={readOnly} disabled={disabled}
            className='textboxStyle' style={inputStyle}
            //style={{ width: width, backgroundColor: readOnly || disabled ? sys.colors.readonly : '' }}            
            onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
          />
        </Form.Item>
      )
    } else if (type === 'password' || type === 'passwordbox') {
      return (
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
          <Input.Password {...this.state.attr} id={id} ref={ref => this.myInputbox = ref}
            onFocus={(e) => { e.target.select(); onFocus?.(e); }}
            readOnly={readOnly} disabled={disabled}
            className='textboxStyle'
            //style={{ width: width, backgroundColor: readOnly || disabled ? sys.colors.readonly : '' }}
            style={inputStyle}
            onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
          />
        </Form.Item>
      )
    } else if (type === 'date' || type === 'datebox') {
      return (
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
          <DatePicker {...this.state.attr} id={id} ref={ref => this.myDatepicker = ref}
            className='dateboxStyle'
            style={inputStyle}
            //onFocus={(e) => { e.target.select(); onFocus?.(e); }} 
            //onFocus={(e) => { this.myInput?.setSelectionRange(0, this.myInput.value?.length); onFocus?.(e); }} 
            onFocus={this.handleDatepickerFocus}
            disabled={readOnly || disabled}
            onChange={(value) => {
              this.setState({ value: value || new Date() }, () => {
                setTimeout(() => {
                  const input = this.myDatepicker;
                  if (input) {
                    input.focus();
                  }
                  onChange?.(value);
                });
              });

            }}
            format={sys.format} />
        </Form.Item>
      )
    } else if (type === 'number' || type === 'numberbox') {
      return (
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
          <InputNumber
            controls={false} //去掉箭头
            keyboard
            id={id} ref={ref => this.myInputbox = ref}
            className={step ? 'spinnerboxStyle' : 'numberboxStyle'}
            {...this.state.attr} /*放在classname之后*/
            value={this.state.value}
            readOnly={readOnly} disabled={disabled}
            //style={{ width: width, backgroundColor: readOnly || disabled ? sys.colors.readonly : '' }}
            style={inputStyle}
            //formatter={this.hideArrow} parser={this.hideArrow}  //没有效果
            onFocus={(e) => { e.target.select(); onFocus?.(e); }}
            onChange={(value) => { this.setState({ value: value }); onChange?.(value) }}
          />
        </Form.Item>
      )
    } else if (type === 'textarea') {
      if (showCount === undefined) showCount = true;  //默认显示字数
      if (showCount) height -= 24;
      return (
        <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
          <Input.TextArea {...this.state.attr} id={id} ref={ref => this.myInputbox = ref}
            onFocus={(e) => { e.target.select(); onFocus?.(e); }} readOnly={readOnly} disabled={disabled}
            //autoSize={{ minRows: 4, maxRows: 4 }} 
            onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
            showCount={showCount} style={{ resize: resize, height: height, width: width, marginBottom: 24 }} />
        </Form.Item>
      )
    }
  }
  render() {
    let { form, id, type, height, width, label, top, left, labelwidth, showCount, resize, onChange, onSearch, style, position } = this.state.attr;
    let { readOnly, disabled, value, visible } = this.state;
    let { rules } = this.props;
    if (!value || isNaN(value) || value === '') value = '0';
    //console.log(id, visible);
    /*
    return (<div>
        {type === 'search' && 
           <Form.Item label={label} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={style} >
              <Input.Search  {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref} enterButton={this.state.attr.enterButton} size="medium" onSearch={(e) => onSearch?.(e)} onChange={(e) => onChange?.(e)} />
           </Form.Item>
        }
        {type === 'text' &&
            <Form.Item label={label} {...this.state.attr} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }}  style={style} >
              <Input {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref} onChange={(e) => onChange?.(e)} />
            </Form.Item>
        }
        {type === 'date' &&
            <Form.Item label={label} {...this.state.attr} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }}  style={style} >
              <DatePicker  {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref} format={sys.format} onChange={(e) => onChange?.(e)} />
            </Form.Item>
        }
        {type === 'textarea' &&
            <Form.Item label={label} {...this.state.attr} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }}  style={style} >
              <Input.TextArea {...this.state.attr} id={id} style={{ resize:'none', height:height-24, width: width, marginBottom:24 }} ref={ref => this.myInput = ref}                   
               //autoSize={{ minRows: 4, maxRows: 4 }} 
                showCount
               onChange={(e) => onChange?.(e)} />
            </Form.Item>
        }
    </div>)
   */
    return (<>
      {/* <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} > */}
      {this.InputItem(this)}
      {/*</Form.Item> */}
    </>)
  }
}

export class AntdCheckBox extends MyFormComponent { //Component {  
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    //console.log(171,attr)
    attr.antclass = 'checkbox';
    attr = parseParams(attr);
    if (attr.buttontype != 'button') attr.buttontype = 'default';
    attr = parseData(attr);
    if (!attr.checkalltext) attr.checkalltext = '全选';
    if (attr.maxcount === undefined || isNaN(attr.maxcount)) attr.maxcount = 0;
    else attr.maxcount = parseInt(attr.maxcount);
    if (attr.checkall !== undefined && attr.checkall === 'true') attr.checkall = true;
    else attr.checkall = false;
    if (attr.checkall) attr.maxcount = 0;  //有全选时不控制选项个数
    //console.log(181, this.props)
    this.state = {
      attr: attr,
      page: attr.page,
      form: attr.form,
      id: attr.id,
      value: [],
      data: attr.data,
      checkall: attr.checkall,
      antclass: attr.antclass,
      visible: attr.visible > 0 ? true : false,
      disabled: attr.disabled,
      readOnly: attr.readOnly,
      checkallflag: 0,
      checkallvalue: [],
    }
  }

  async componentDidMount() {
    /*
    let attr = this.state.attr;
    let {sqlprocedure, sqlparams} = attr;
    if (sqlprocedure !== undefined && sqlprocedure !== ''){      
      let p={};
      if (sqlparams && typeof sqlparams =='object'){
        p={...sqlparams};
        p.sqlprocedure=sqlprocedure;
      }else{
        for (let key in this.state.attr){
          if (typeof this.state.attr[key] !=='object') p[key]=this.state.attr[key]
        }
      }
    */
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      let rs = await reqdoSQL(p);
      this.setState({ data: rs.rows });
    }
    //this.setState({checkallflag:2, checkallvalue:'1'});
    //console.log(1444, this.props.xform('myForm1'));
  }

  handleChange_checkall = (value) => {  //全选或全不选
    let { page, form, data, id } = this.state;
    let tmp;
    if (value.length > 0) tmp = data.map((item) => item.value) //全选
    else tmp = [];   //全不选
    this.setState({ value: tmp, checkallflag: (tmp.length > 0 ? 1 : 0) }, () => page[form].setFieldValue(id, tmp));
  };

  handleChange_check = (values) => {  //单击单个checkbox
    let { page, form, data, id, checkall } = this.state;
    let flag = 0;
    let checkallvalue = 0;
    if (values.length == this.state.data.length) {
      flag = 1;
      checkallvalue = ['1']
    } else if (values.length > 0) {
      flag = 2;
      checkallvalue = [];
    }
    if (checkall) this.setState({ value: values, checkallflag: flag }, () => page[form].setFieldValue(id + '_checkall', checkallvalue));
    else this.setState({ value: values });
  }
  //checkbox.group 之后加上<row><col>可以分行显示选项
  formItems = () => {
    let { id, label, labelwidth, top, left, height, width, style, maxcount, spacing } = this.state.attr;
    let { value, checkallvalue, visible, data, checkall, readOnly, disabled } = this.state;
    //console.log(12345,data);
    if (!data) data = [];
    let html = [];
    //生成多个checkbox
    let options = data.map((item, index) => {
      return (<Checkbox id={id + index} key={id + index} disabled={maxcount > 0 && value.length >= maxcount && !value.includes(item.value)}
        ref={ref => this[id + index] = ref} value={item.value} className={checkall ? 'textdiv' : 'textdiv'} style={{ width: width > 0 ? width : null, marginRight: spacing }}>{item.label}</Checkbox>)
    })
    let hints = '';
    if (maxcount > 0) hints = <label className='labelStyle'>（限{maxcount}项）</label>;
    if (checkall) {
      html.push(<Form.Item label={label} id={id + '_checkall'} key={id + '_checkall'} className={checkall ? 'labelStyle' : 'labelStyle'}
        //valuePropName='checked' 
        labelCol={{ style: { width: labelwidth } }} style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
        <Checkbox.Group onChange={this.handleChange_checkall.bind(this)} id={id + '_checkall'} ref={ref => this.checkall = ref} disabled={readOnly} value={checkallvalue}>
          <Checkbox checked={this.state.checkallflag == 1} value="1" indeterminate={this.state.checkallflag == 2}>全选</Checkbox>
        </Checkbox.Group>
      </Form.Item>);
      left += labelwidth + spacing + 60;
      label = '';
      html.push(<Form.Item label={label} name={id} key={id} labelCol={{ style: { width: labelwidth } }}
        className='textdiv' style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
        <Checkbox.Group id={id} ref={ref => this.myCheckbox = ref} disabled={readOnly} value={value} onChange={(values) => this.handleChange_check(values)} {...this.props}>
          {options}
          {hints}
        </Checkbox.Group>
      </Form.Item>)
    } else {
      html.push(<Form.Item label={label} id={id + '_label'} key={id + '_label'} labelCol={{ style: { width: labelwidth } }}
        className={checkall ? 'labelStyle' : 'labelStyle'} style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
      </Form.Item>)
      html.push(<Form.Item label='' name={id} key={id} labelCol={{ style: { width: labelwidth } }}
        className='textdiv' style={{ ...style, top: top, left: left + labelwidth, display: visible ? 'block' : 'none' }} >
        <Checkbox.Group id={id} ref={ref => this.myCheckbox = ref} {...this.props} disabled={readOnly} value={value} onChange={(values) => this.handleChange_check(values)} {...this.props}>
          {options}
          {hints}
        </Checkbox.Group>
      </Form.Item>)
    }
    //return options;   
    return html;
  }

  render() {
    let { onChange, rules } = this.props;
    let { id, label, labelwidth, top, left, height, width, maxcount, style } = this.state.attr;
    let { visible, value } = this.state;
    return (<>
      {/* <Form.Item label={label} name={id+'_label'}  key={id+'_label'}  labelCol={{style:{ width: labelwidth }}} 
          style={{...style, display:visible? 'block':'none'}} >
          <Checkbox.Group id={id} ref={ref => this.myCheckbox = ref} {...this.props} 
          value={value} 
          onChange={(values)=>this.setState({value:values})} 
          { ...this.props }>
            {this.formItems()}
            {maxcount>0 && <label className='labelStyle'>（限{maxcount}项）</label>}
          </Checkbox.Group>
        </Form.Item>) */}
      {this.formItems()}
    </>)
  }
}

export class AntdRadio extends Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'radio';
    attr = parseParams(attr);
    if (attr.buttontype != 'button') attr.buttontype = 'default';
    attr = parseData(attr);
    //console.log(181, this.props)
    if (attr.optionType == "button") attr.spacing = 0;
    this.state = {
      attr: attr,
      id: attr.id,
      value: [],
      readOnly: attr.readOnly,
      data: attr.data,
      antclass: attr.antclass,
      visible: attr.visible > 0 ? true : false,
    }
  }

  async componentDidMount() {
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      let rs = await reqdoSQL(p);
      this.setState({ data: rs.rows });
    }
  }

  formItems = () => {
    let { id, label, labelwidth, top, left, height, width, style, spacing, hint } = this.state.attr;
    let { value, visible, data, readOnly } = this.state;
    if (!data) data = [];
    let html = [];
    let options = [];
    for (let i = 0; i < data.length; i++) {
      options[i] = <Radio key={id + '_' + i} style={{ marginRight: spacing }} value={data[i][id]}>{data[i].label}</Radio>
    }
    let hints = '';
    if (hint != '') hints = <label className='labelStyle'>{hint}</label>;
    html.push(<Form.Item label={label} key={id + '_label'} id={id + '_label'} labelCol={{ style: { width: labelwidth } }}
      className='labelStyle' style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
    </Form.Item>)
    html.push(<Form.Item label='' key={id} name={id} labelCol={{ style: { width: labelwidth } }} className='textdiv' style={{ ...style, top: top, left: left + labelwidth, display: visible ? 'block' : 'none' }} >
      <Radio.Group id={id} key={id} ref={ref => this[id] = ref} {...this.props} readOnly={readOnly} buttonStyle="solid" style={{ marginLeft: 0 }} >
        {options}
        {hints}
      </Radio.Group>
    </Form.Item>)
    return html;
  }

  render() {
    let { onChange, rules } = this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, editable, data, labelfield, textfield, message, buttontype } = this.state.attr;
    let { visible } = this.state;
    return (
      <>
        {this.formItems()}
      </>
    )
  }
}

export class AntdComboBox extends React.Component {  //
  // <AntComboBox params='deptname,所属院系,82,0,14,0,260,,信息管理与信息系统;大数据管理与应用;工商管理;计算机科学与技术;会计学' top={16+rowheight*5} ref={ref=>this.deptname=ref}/>
  //供应商编码区分大小写
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'combobox';
    attr = parseParams(attr);
    attr = parseData(attr);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      id: attr.id,
      value: [],
      row: [],
      data: attr.data,
      antclass: attr.antclass,
      visible: attr.visible > 0 ? true : false,
      readOnly: attr.readOnly,
      editable: attr.editable,
      disabled: attr.disabled,
      display: 'block',
    }
  }

  async componentDidMount() {
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      let rs = await reqdoSQL(p);
      this.setState({ data: rs.rows });
    }
  }

  render() {
    let { onChange, rules } = this.props;
    let { label, labelwidth, top, left, height, width, style, hidden, textfield, message, labelfield, valuefield } = this.state.attr;
    let { id, value, editable, data, visible, readOnly, disabled } = this.state;
    const selectStyle = {
      backgroundColor: readOnly || disabled ? sys.colors.readonly : '',
      color: 'black',
      width: width,
    };

    //console.log(1777,id,textfield,data)
    //console.log(666, id, readOnly, valuefield, labelfield)
    return (
      <Form.Item label={label} name={id} key={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle'
        style={{ ...style, display: visible ? 'block' : 'none' }} >
        <Select id={id} key={id} ref={ref => this[id] = ref}
          fieldNames={{ value: valuefield, label: labelfield }} options={data}
          disabled={readOnly}
          style={{ width: width }}
          //style={selectStyle}  //没有效果，靠style.css中.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector
          //className={readOnly ? 'selectDisabledStyle' : ''}  //设置disabled时的样式
          onChange={(value, row) => { this.setState({ value: value, row: row }); onChange?.(value, row) }}
          {...this.props} />
      </Form.Item>
    )
  }
}

export class AntdImage extends React.Component {  //class的名称必须大写字母开头
  //显示图片，可以是json的多个文件，规定文件名称的属性名为filename，或者由fieldnames指定
  constructor(props) {
    super(props);
    this.refs = {};
    //let p={...this.props};  //this.props不能添加属性e.g.antclass
    let attr = parseParams(props);
    //let attr=myParseAntFormItemProps(p);
    attr.antclass = 'image';  //不同控件参数解析不同
    if (attr.height == 0) attr.height = sys.fontSize;
    if (attr.fieldnames?.url) attr.urlfield = attr.fieldnames.url;
    if (attr.urlfield === undefined || attr.urlfield && attr.urlfield == '') attr.urlfield = 'url';
    if (attr.path === undefined || attr.path === '') attr.path = 'server';
    //console.log(attr.id, attr.preview);
    if (attr.preview === undefined || (attr.preview !== 'false' && attr.preview !== false)) attr.preview = 1;
    if (attr.preview = false || attr.preview == 'false') attr.preview = 0;
    else attr.preview = 1;
    //console.log(attr.id, attr.preview);
    this.state = {
      attr: attr,
      id: attr.id,
      src: attr.src,
      value: attr.src,
      datatype: attr.datatype,
      antclass: attr.antclass,
      display: 'block'
    }
  }
  render() {
    let { id, label, labelwidth, top, left, height, width, style, urlfield, hidden, form, datatype, maxcount, path, preview } = this.state.attr;
    //AntdImage中必须对src属性赋值，里面可以带state变量或动态变换的值
    let src = this.props.src; //703, 704，801, 1102的antdimage直接src赋值而且不变的，用props。src，用this.state.src无效
    //if (src===undefined && this.state.src!='') src = this.state.src; //必须设置ref
    //src = this.state.src;  //801，1102换页不会更新图片。setformvalues不是从state.attr中提取。从数据库中提取图片路径不能使用this.props.src
    /*图片组件应用定义
    1)Page801 <AntdImage id='photopath' ref={ref=>this.photopath=ref} label='图片预览' labelwidth='82' left='14' width='300' datatype='json' top={16+rowheight*9} fieldnames={{url:'filename'}} src={this.photopath?.state.src}  />
    2)Page704 <Image style={{ position: 'absolute', top: 16 + rowheight * 8, left: 96 }} preview={false} width={250} src={"/myServer/mybase/products/" + this.state.product.productid + ".jpg"} />
    3)Page704 <AntdImage id="photopath" ref={this.photopath} top={16 + rowheight * 8} left='396' preview={false} width={250} src={'mybase/products/'+this.state.product.productid + ".jpg"} />
    4)Page703 <AntdImage id="photopath1" top='10' left='400' height='130' src={this.state.student.photopath1} datatype='json' path='server' />
    5)Page904 <AntdImage form='' id={"image_" + index} height={135} ref={ref => this["image_" + index] = ref} src={filenames[0].filename} path="server" preview='false' datatype='xjson' />
    6)Page1102 <AntdImage id="ischeckedflag" src={checkedUrl} ref={ref => this.ischeckedflag = ref} top='32' left='700' path='local' preview='false' width='72' />
    */
    let html = [];
    let elem = [];
    let url = '';
    if (datatype == 'json') src = myStr2JsonArray(src);
    //console.log(1111115, id, datatype, src, form);
    if (src && typeof src === 'object') {
      if (!maxcount || maxcount <= 0) maxcount = src.length;
    } else if (src && src != '') {
      maxcount = 1;
      src = [{ 'url': src }]; //转成json数组，以便一起处理
    } else {  //src==null or src==''
      maxcount = 1;
      src = [{ 'url': require('../icons/image-not-found.png') }];
      path = 'local';
      preview = 0;
    }
    //console.log(116, id, label,labelwidth,maxcount, urlfield, src[0][urlfield], path, preview,typeof src[0][urlfield]);
    for (let i = 0; i < maxcount; i++) {  //多个图片文件,json格式中使用filename属性指定图片文件
      if (src[i][urlfield] != undefined) {
        if (path === 'local') url = src[i][urlfield];
        else url = sys.serverpath + '/' + src[i][urlfield] + '?time=' + myLocalTime('').timestamp;  //加服务器路径
        let key = id + '_' + i;
        //带预览功能
        if (preview > 0) html.push(<Image key={key} {...this.state.attr} style={{ marginRight: 6 }} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} placeholder={<Image width={width > 0 ? width : null} height={height > 0 ? height : null} preview={false} src={url} />} />)
        //不带预览功能,普通图片刷新速度要快很多
        else html.push(<img key={key} {...this.state.attr} fill='black' style={{ marginRight: 6 }} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} />)
      }
    }
    if (form === undefined && form != '') {
      return (
        <Form.Item label={label} name={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' style={{ position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} >
          <div name={id}>{html}</div>
        </Form.Item>
      )
    } else {  //无表单
      return (
        <div style={{ position: (top >= 0 && left >= 0) ? 'absolute' : 'relative', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} >
          {label != undefined && label != '' && <span className='labelStyle' style={{ textAlign: 'right', display: 'inline-block', width: labelwidth, marginRight: 2 }}>{label != undefined && label != '' ? label + ':' : ''}</span>}
          {html}
        </div>
      )
    }
  }
}

export class AntdFile extends React.Component {  //class的名称必须大写字母开头
  //显示图片，可以是json的多个文件，规定文件名称的属性名为filename，或者由fieldnames指定
  constructor(props) {
    super(props);
    this.refs = {};
    //let p={...this.props};  //this.props不能添加属性e.g.antclass
    let attr = parseParams(props);
    //let attr=myParseAntFormItemProps(p);
    attr.antclass = 'file';  //不同控件参数解析不同
    if (attr.height == 0) attr.height = sys.fontSize;
    if (attr.fieldnames?.url) attr.urlfield = attr.fieldnames.url;
    if (attr.urlfield === undefined || attr.urlfield && attr.urlfield == '') attr.urlfield = 'url';
    if (attr.path === undefined || attr.path === '') attr.path = 'server';
    //console.log(attr.id, attr.preview);
    if (attr.preview === undefined || (attr.preview !== 'false' && attr.preview !== false)) attr.preview = 1;
    if (attr.preview = false || attr.preview == 'false') attr.preview = 0;
    else attr.preview = 1;
    //console.log(attr.id, attr.preview);
    this.state = {
      attr: attr,
      id: attr.id,
      src: attr.src,
      value: attr.src,
      datatype: attr.datatype,
      antclass: attr.antclass,
      display: 'block'
    }
  }
  render() {
    let { id, label, labelwidth, top, left, height, width, style, urlfield, hidden, form, datatype, maxcount, path, preview } = this.state.attr;
    //AntdImage中必须对src属性赋值，里面可以带state变量或动态变换的值
    let src = this.props.src; //703, 704，801, 1102的antdimage直接src赋值而且不变的，用props。src，用this.state.src无效
    //if (src===undefined && this.state.src!='') src = this.state.src; //必须设置ref
    //src = this.state.src;  //801，1102换页不会更新图片。setformvalues不是从state.attr中提取。从数据库中提取图片路径不能使用this.props.src
    /*图片组件应用定义
    1)Page801 <AntdImage id='photopath' ref={ref=>this.photopath=ref} label='图片预览' labelwidth='82' left='14' width='300' datatype='json' top={16+rowheight*9} fieldnames={{url:'filename'}} src={this.photopath?.state.src}  />
    2)Page704 <Image style={{ position: 'absolute', top: 16 + rowheight * 8, left: 96 }} preview={false} width={250} src={"/myServer/mybase/products/" + this.state.product.productid + ".jpg"} />
    3)Page704 <AntdImage id="photopath" ref={this.photopath} top={16 + rowheight * 8} left='396' preview={false} width={250} src={'mybase/products/'+this.state.product.productid + ".jpg"} />
    4)Page703 <AntdImage id="photopath1" top='10' left='400' height='130' src={this.state.student.photopath1} datatype='json' path='server' />
    5)Page904 <AntdImage form='' id={"image_" + index} height={135} ref={ref => this["image_" + index] = ref} src={filenames[0].filename} path="server" preview='false' datatype='xjson' />
    6)Page1102 <AntdImage id="ischeckedflag" src={checkedUrl} ref={ref => this.ischeckedflag = ref} top='32' left='700' path='local' preview='false' width='72' />
    */
    let html = [];
    let elem = [];
    let url = '';
    if (datatype == 'json') src = myStr2JsonArray(src);
    //console.log(115, id, datatype, src,form);
    if (src && typeof src === 'object') {
      if (!maxcount || maxcount <= 0) maxcount = src.length;
    } else {
      maxcount = 1;
      src = [{ 'url': src }]; //转成json数组，以便一起处理
    }
    //console.log(116, id, label,labelwidth,maxcount, urlfield, src[0][urlfield], path, preview,typeof src[0][urlfield]);
    for (let i = 0; i < maxcount; i++) {  //多个图片文件,json格式中使用filename属性指定图片文件
      if (src[i][urlfield] != undefined) {
        if (path === 'local') url = src[i][urlfield];
        else url = sys.serverpath + '/' + src[i][urlfield] + '?time=' + myLocalTime('').timestamp;  //加服务器路径
        let key = id + '_' + i;
        //带预览功能
        if (preview > 0) html.push(<Image key={key} {...this.state.attr} style={{ marginRight: 6 }} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} placeholder={<Image width={width > 0 ? width : null} height={height > 0 ? height : null} preview={false} src={url} />} />)
        //不带预览功能,普通图片刷新速度要快很多
        else html.push(<img key={key} {...this.state.attr} fill='black' style={{ marginRight: 6 }} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} />)
      }
    }
    if (form === undefined && form != '') {
      return (
        <Form.Item label={label} name={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' style={{ position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} >
          <div name={id}>{html}</div>
        </Form.Item>
      )
    } else {  //无表单
      return (
        <div style={{ position: (top >= 0 && left >= 0) ? 'absolute' : 'relative', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} >
          <span className='labelStyle' style={{ textAlign: 'right', display: 'inline-block', width: labelwidth, marginRight: 2 }}>{label != undefined && label != '' ? label + ':' : ''}</span>
          {html}
        </div>
      )
    }
  }
}

export class AntdFileUpload extends React.Component {  //class的名称必须大写字母开头
  //上传的文件保存在一个json数组中，json格式filename,filetitle, filesize，通过fieldNames可以修改这些属性名称。
  //先上传文件到服务器保存为临时文件，保存记录时根据表中值更改文件名。
  constructor(props) {
    super(props);
    let attr = parseParams(props);
    attr.antclass = 'fileupload';  //不同控件参数解析不同
    if (!attr.fieldNames) attr.fieldNames = {};
    if (!attr.fieldNames.filename || attr.fieldNames.filename == '') attr.fieldNames.filename = 'filename';
    if (!attr.fieldNames.filetitle || attr.fieldNames.filetitle == '') attr.fieldNames.filetitle = 'filetitle';
    if (attr.timeStamp == undefined) attr.timeStamp = true;
    if (attr.tag == undefined) attr.tag = '';
    if (attr.filetag == undefined) attr.filetag = '';  //文件上传文件名标识
    if (attr.filepath == undefined) attr.filepath = 'mybase/';  //文件上传文件名标识
    if (attr.type == undefined) attr.type = '*';
    if (attr.type == 'image') attr.listType = 'picture-card';
    if (attr.listType == 'picture-card') attr.antclass = 'imageupload';
    if (attr.uploadonsave === undefined || attr.uploadonsave === '' || attr.uploadonsave === 'false') attr.uploadonsave = false;
    else if (attr.uploadonsave === 'true') attr.uploadonsave = true;
    if (attr.type === 'pdf') attr.accept = 'application/pdf';
    else if (attr.type === 'image') attr.accept = 'image/*';
    if (!attr.maxCount || isNaN(attr.maxCount)) attr.maxCount = -1;
    if (!isNaN(attr.maxCount)) attr.maxCount = parseInt(attr.maxCount);
    //alert(attr.listType)
    this.state = {
      attr: attr,
      src: attr.src,
      filelist: [],
      readOnly: attr.readOnly,
      disabled: attr.disabled,
      formvalues: {},  //保存表单中其他控件的值
      deletedfiles: [],   //删除的文件
      uploadedfiles: [],   //新上传的文件
      datatype: attr.datatype,
      antclass: attr.antclass,
      flag: false,
      display: 'none',
      uploadonsave: attr.uploadonsave,  //保存记时才上传文件
    }
  }

  handleChange = async (e) => {
    //console.log(999,e);
    let { attr, filelist, deletedfiles, uploadedfiles, uploadonsave } = this.state;
    let { filetag, timeStamp, targetpath, fieldNames, maxCount } = attr;
    let file = e.file;
    if (!file) return;
    const fileArray = filelist;
    //上传的都是临时文件
    //console.log(666666661, file.status, e.file);
    let fileno = '';
    if (file.status !== 'removed') {
      //console.log(777777770, filelist, maxCount,file);
      if ((maxCount > 0 && filelist.length < maxCount) || maxCount < 0 || (maxCount == 1 && filelist.length > 0)) {
        //多个文件时或文件个数没有限制时或只有一个文件不断替换时，可以上传文件
        if (!uploadonsave) {
          let formData = new FormData();
          fileno = (filelist.length > 0 ? '_' + (filelist.length) : '');
          let filestamp = myLocalTime('').timestamp;
          let targetfile = 'tmp_' + filestamp;
          //console.log(9922, filetag, e.file, targetpath, targetfile, this.state.attr.timeStamp);
          formData.append("targetpath", targetpath);  //文件路径
          formData.append("targetfile", targetfile);  //目标文件名，与时间戳有关       
          formData.append("file", file.originFileObj);  //上传第一个文件
          const config = { headers: { "Content-Type": "multipart/form-data" } }
          await axios.post("/myServer/doFileUpload", formData, config).then(res => {
            //服务器端返回文件名称，实际文件名。如果文件名为空表示文件上传失败
            let json = res.data;
            file.targetfile = targetfile;
            file.targetpath = targetpath;
            file.filestamp = filestamp;  //文件的时间标记，替换文件名称时需要用到
            //服务器端返回的内容
            file.filename = json.filename;
            file[fieldNames.filename] = json.filename;
            file[fieldNames.filetitle] = myFileExtension(file.originFileObj.name).filename;
            file.url = sys.serverpath + '/' + json.filename;
            file.realfilename = json.realfilename;
            file.uid = attr.id + '_' + filelist.length + '_' + myLocalTime('').timestamp;
            file.status = 'done'
            file.fileno = fileno;
            file.fileext = json.fileext;
            file.newflag = 1;   //新上传的文件标记
            if (maxCount == 1 && filelist.length > 0) {
              //只有一个文件时，用新文件替换旧文件
              let f = filelist[0][fieldNames.filename];
              if (f != json.filename) {  //新旧文件名称不能相同
                deletedfiles.push({ filename: f });  //删除原文件  
              }
              filelist[0] = file;   //输入新文件
            } else {
              filelist.push(file);
            }
            uploadedfiles.push(file);  //临时上传的文件            
          })
        } else {
          if (filelist.findIndex((item) => item.uid == file.uid) < 0) {
            filelist.push({ [fieldNames.filename]: file.name, [fieldNames.filetitle]: file.name, uid: file.uid });
          }
        }
      }
    } else {
      //console.log(771,deletedfiles,e.file.filename);
      deletedfiles.push({ filename: e.file.filename })
      filelist = e.fileList;
    }
    //console.log(777777771, filelist);
    if (maxCount > 0) filelist = filelist.slice(0, maxCount);  //只提取前maxcount个文件
    //console.log(777777772, deletedfiles);
    //console.log(1777, uploadedfiles);
    this.setState({ filelist: filelist, deletedfiles, uploadedfiles });
  }

  handleRemoveFile = async (file) => {
    let { filelist, deletedfiles, uploadedfiles, uploadonsave } = this.state;
    let files = filelist.filter((item) => item.uid === file.uid);
    deletedfiles.push(files[0]);
    filelist = filelist.filter((item) => item.uid !== file.uid);
    this.setState({ filelist, deletedfiles });
  }

  handleDownloadFile = async (file) => {  //下载文件
    //console.log(file);
    let { fieldNames } = this.state.attr;
    if (!file) return;
    let filename = file[fieldNames.filename];
    let filedesc = file[fieldNames.filetitle] || '';
    if (filedesc == '') filedesc = filename;
    let p = {};
    p.filepath = '';
    p.sourcefilename = filename;
    p.targetfilename = filedesc;
    let msg = await fileDownload(p);  //下载文件    
  }

  handlePreviewFile = async (file) => {  //预览pdf文件    
    let { onPreview } = this.state.attr;
    if (onPreview) {
      onPreview?.(file);
    } else {
      //console.log(file);
      let { fieldNames } = this.state.attr;
      if (!file) return;
      let filename = file[fieldNames.filename];
      let filedesc = file[fieldNames.filetitle] || '';
      if (filedesc == '') filedesc = filename;
      if (myFileExtension(filename).fileext === 'pdf') {
        let url = 'http://127.0.0.1:8080/' + sys.serverpath + filename;
        //需要手动设置游览器容许打开pdf文件，无法设置窗体的标题
        //let newWindow = window.open(url, "_blank"); 
        //可以设置窗体标题的方法
        let newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(`
      <html>
        <head>
          <title>${filedesc}</title>
        </head>
        <body style="margin:0;">
          <iframe 
            src="${url}" 
            style="border:none;" 
            width="100%" 
            height="100%">
          </iframe>
        </body>
      </html>
    `);
          // 关闭document的写入操作，刷新新窗口内容
          newWindow.document.close();
        }
      }
    }
  }

  handlePreviewImage = async (file) => {
    let src = file.url;
    this.setState({ src: src, flag: true })
  }

  render() {
    let { attr, readOnly, filelist, disabled, antclass } = this.state;
    let { id, label, labelwidth, top, left, height, width, style, hidden, maxCount, filetag, type, fieldNames, accept, preview } = attr;
    //console.log(5551, id, fieldNames);
    //destroyOnClose使用modal的这个属性，可以每次打开时生成组件
    disabled = readOnly || disabled;
    this.state.attr.tag = '';
    if (filetag != '') {
      let sys = this.state.formvalues;
    }
    let html = [];
    if (antclass == 'imageupload') {
      html.push(<Form.Item label={label} name={id} key={id + '_labelx'} labelCol={{ style: { width: labelwidth } }}
      // style={{ width: width, position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null }}
      >
        <Upload key={id} listType="picture-card" fileList={filelist} ref={ref => this.imageupload = ref}
          disabled={disabled} accept={accept}
          //className={styles.imageuploadx}
          onPreview={this.handlePreviewImage.bind(this)}
          onChange={this.handleChange.bind(this)}  >
          {maxCount < 0 || filelist?.length < maxCount && '+ 上传'}
        </Upload>
      </Form.Item>)
      html.push(
        <Form.Item key={id + '_labely'} >
          <Image src={this.state.src} key={id + '_image'} style={{ width: '100%', display: this.state.display }}
            preview={{
              visible: this.state.flag, src: this.state.src, onVisibleChange: (value) => { this.setState({ flag: value }) }
            }} />
        </Form.Item>)
    } else if (antclass == 'fileupload') {
      //上传普通文件
      let msg = ''
      if (!isNaN(maxCount) && maxCount > 0 && type !== '*') msg = '最多' + maxCount + '个' + type + '文件';
      else if (type !== '*') msg = type + '文件';
      else if (!isNaN(maxCount) && maxCount > 0) msg = '最多' + maxCount + '个文件';
      if (disabled) msg = '';
      html.push(
        <Form.Item label='' name={id} key={id + '_label'} labelCol={{ style: { width: 0 } }}
        // style={{ width: width, position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null }}
        >
          <Upload key={id} {...this.state.attr} fileList={filelist} ref={ref => this.fileupload = ref}
            disabled={readOnly || disabled} accept={accept}
            onChange={this.handleChange.bind(this)}
            itemRender={(originNode, file, filelist) => {
              //console.log(1111, maxCount, file, file.uid, width);
              const index = filelist.indexOf(file) + 1;
              let margintop = 0;
              let marginleft = 0;
              if (filelist.length == 1 && maxCount == 1) {
                margintop = -30;
                marginleft = myGetTextSize(msg).width + labelwidth + left + 45;
              }
              return (
                <div key={'file_' + file.uid} style={{ width: width, display: 'flex', marginLeft: marginleft, marginTop: margintop }}>
                  <a className='linkStyle' style={{ flexGrow: 1, padding: '4px 0px 0px 0px' }} onClick={() => this.handlePreviewFile(file)}>
                    {(filelist.length > 1 || maxCount > 1) && <span style={{ fontFamily: 'times new roman', display: 'inline-block', width: 30 }}>{index + '.'}</span>}
                    <span>{file[fieldNames?.filetitle]}</span></a>
                  {!disabled && <Button type='link' style={{ height: 28, width: 28, marginLeft: 0 }} icon={<DeleteOutlined style={{ fontSize: 13 }} />} onClick={() => this.handleRemoveFile(file)} />}
                  {disabled && <Button type='link' style={{ height: 28, width: 28, marginLeft: 0 }} icon={<DownloadOutlined style={{ fontSize: 13 }} />} onClick={() => this.handleDownloadFile(file)} />}
                  {/* {preview && <Button type='link' style={{ height: 28, width: 28, marginLeft: 0 }} icon={<FileSearchOutlined style={{ fontSize: 13 }} />} onClick={() => this.handlePreviewFile(file)} />} */}
                </div>)
            }}
          >
            <Button key={id + '_button'} style={{ width: labelwidth }} icon={<UploadOutlined />}>{label}</Button>
            {msg != '' && <label style={{ marginLeft: 6 }}>{'（限' + msg + '）'}</label>}
          </Upload>
        </Form.Item>);
    }
    return (
      // 需要加一个div否则表单中的第一列无法编辑
      <div style={{ width: width, position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null }} >
        {html}
      </div>)
  }
}

export class AntdHiddenField extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'textbox';  //不同控件参数解析不同
    //let attr=myParseAntFormItemProps(this.props,'');
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass
    }
  }
  render() {
    let { onChange } = this.props;
    let id = this.state.attr.id;
    return (
      <Form.Item label='' labelCol={{ style: { width: 0 } }} name={id} style={{ position: 'absolute', top: 0, left: 0, display: 'none' }}>
        <Input style={{ width: 0, height: 1 }} id={id} key={id} ref={ref => this[id] = ref} disabled {...this.props} />
      </Form.Item>
    )
  }
}

export class AntdLabel extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    //let attr=myParseAntFormItemProps(props);
    let attr = parseParams(props);
    attr.antclass = 'label';  //不同控件参数解析不同
    if (attr.height == 0) attr.height = sys.fontSize;
    this.state = {
      attr: attr,
      antclass: attr.antclass,
      display: 'block'
    }
  }
  render() {
    //<Header style={{height:30,lineHeight:'30px', paddingLeft:12, borderBottom:'1px solid #95B8E7', background:'#E0ECFF', fontSize:14}}>    <WindowsOutlined />    <label style={{marginLeft:8}} className='headerStyle'>学生详细信息</label>    </Header>   
    let { id, label, labelwidth, top, left, height, width, style, hidden, icon } = this.state.attr;
    return (
      <Form.Item label={label} name={id} key={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' colon={false}
        style={{ fontSize: height, position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} />
    )
  }
}


export class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'confirmmodal';
    console.log(99, attr);
    if (attr.width && !isNaN(attr.width)) attr.width = parseInt(attr.width);
    if (attr.height && !isNaN(attr.height)) attr.height = parseInt(attr.height);
    this.state = {
      attr: attr,
      id: attr.id,
      visible: false,
      title: attr.title,
      description: attr.description,
      message: attr.message,
      width: attr.width,
      height: attr.height,
      okText: attr.okText,
      cancelText: attr.cancelText,
      type: attr.type,
      onConfirm: attr.onConfirm,
    }
  }
  render() {
    let { id, width, height, okText, cancelText, title, visible, description, message, type, onConfirm } = this.state;
    if (title === undefined) title = '系统提示';
    if (type === undefined) type = 'confirm';
    if (type == 'info' || type == 'alert') {
      okText = '';
      if (cancelText === undefined || cancelText == '') cancelText = (type == 'info' ? '确认' : '关闭');
    } else {
      //type === 'confirm') {
      if (okText === undefined || okText == '') okText = '确定';
      if (cancelText === undefined || cancelText == '') cancelText = '取消';
    }
    if (width === undefined) width = 370;
    //if (height === undefined) height = 160;
    //console.log(11111, message, description, width, height);
    if (description === undefined && message != undefined) description = message;
    if (description === undefined) description = '是否确定删除这条记录？';
    //<QuestionCircleOutlined /> <InfoCircleOutlined />
    return (
      <Modal name='myMsg1' key='myMsg1' title={title} open={this.state.visible}
        centered maskClosable={false}
        //style={{ position: 'relative', padding: 0 }} 
        closable keyboard={false}
        {...this.props}
        styles={{ body: { overflowY: 'auto', padding: 0, margin: 0 } }}
        width={width}
        onCancel={() => this.setState({ visible: false })}
        footer={[
          okText !== '' && <Button key='_btnok' type='primary' onClick={(e) => { onConfirm?.(e) }}>{okText}</Button>,
          cancelText !== '' && <Button key='_btnclose' type='primary' onClick={() => this.setState({ visible: false })}>{cancelText}</Button>
        ]}>
        <div style={{ height: height ? height : null }} dangerouslySetInnerHTML={{ __html: description }} />  {/* 可以支持使用html语句  */}
        {/* {description} */}
      </Modal>
    )
  }
}

{/* <Popconfirm open={this.state.openConfirm1} arrow title='系统确认' description='是否确定删除这条记录？'
onConfirm={this.handleDeleteClick.bind(this)} onCancel={()=>this.setState({openConfirm1: false})}
okText="确定" cancelText="取消" overlayStyle={{width:350}} placement='bottom' /> */}

export class AntdViewer extends Component {  //预览文件抽屉vvvvv
  constructor(props) {
    super(props);
    let attr = parseParams(props);
    attr.antclass = 'pdfviewer';  //不同控件参数解析不同
    if (attr.width == undefined || isNaN(attr.width)) attr.width = -1;
    if (attr.height == undefined || isNaN(attr.height)) attr.height = -1;
    attr.width = parseInt(attr.width);
    attr.height = parseInt(attr.height);
    if (attr.minwidth == undefined) attr.minwidth = attr.width;
    if (attr.maxwidth == undefined) attr.maxwidth = attr.width;
    if (attr.minheight == undefined) attr.minheight = attr.height;
    if (attr.maxheight == undefined) attr.maxheight = attr.height;
    if (attr.title == undefined || attr.title == '') attr.title = '文件预览';
    this.state = {
      attr: attr,
      visible: false,
      originalwidth: attr.width,  //原始pdf文件大小
      drawerwidth: attr.width,
      expanded: false,
      filename: '',
      pageCount: 1,
      page: 1,
      scale: 1,
      title: attr.title,
      pagecountwidth: 20,
      pagenowidth: 20,
      pagevalue: 1,
      pages: [],
      tempfiles:[],  //预览生成的文件
    }
  }

  componentDidMount() {
    this.setState({ drawerwidth: this.originalwidth * this.state.scale, page: 1, pagevalue: 1 });
  }

  handleReSizeViewer = () => {
    let { scale, drawerwidth, expanded, minwidth, originalwidth } = this.state;
    if (!expanded) {
      scale = window.innerWidth / originalwidth;
      drawerwidth = window.innerWidth;
    } else {
      scale = 1;
      drawerwidth = originalwidth;
    }
    this.setState({ drawerwidth, scale, expanded: !expanded });
  }

  handleSetScale = (flag) => {   //sssssssss
    let { scale, drawerwidth, expanded, minwidth, defaultwidth } = this.state;
    //console.log(551, scale, drawerwidth, this.state)
    if (flag > 0) {
      scale = 1.25 * scale;
      drawerwidth = 1.25 * drawerwidth;
    } else {
      scale = 0.8 * scale;
      drawerwidth = 0.8 * drawerwidth;
    }
    //console.log(555, scale, drawerwidth)
    if (drawerwidth < window.innerWidth) expanded = false;
    this.setState({ scale, drawerwidth, expanded });
  }

  handleDownload = async () => {
    //console.log(9999, this.state);    
    let { filename, title } = this.state;
    if (!filename || filename == '') return;
    let p = {};
    p.filepath = '';
    p.sourcefilename = filename;
    p.targetfilename = title;
    let msg = await fileDownload(p);
    if (msg != '') myNotice(msg, 'info');
  }

  handleTurnPage = (flag) => {
    let { page, pageCount, pagevalue } = this.state;
    if (flag == 1 && page > 1) page--;
    else if (flag == 2 && page < pageCount) page++;
    pagevalue = page;
    this.setState({ page, pagevalue })
  }

  handleChange = (e) => {
    let { pagevalue, pageCount } = this.state;
    //if (!isNaN(e.target.value) && parseInt(e.target.value) < pageCount) {
    let s = e.target.value;
    if ((!isNaN(s) && parseInt(s) > pageCount)) {
      s = pageCount;
    } else if (isNaN(s)) {
      s = '';
    }
    let s1 = s + '';
    let s2 = '9'.repeat(s1.length);
    let pagenowidth = myGetTextSize(s2, 'times new roman', sys.label.fontsize - 0).width;
    console.log(6667, pagenowidth);
    if (pagenowidth < 25) pagenowidth = 25;
    this.setState({ pagevalue: s, pagenowidth });

  }

  handleEnterPress = (e) => {
    let { page, pageCount } = this.state;
    let n = e.target.value;
    if (n == '' || isNaN(n) || parseInt(n) > pageCount || parseInt(n) < 1) n = 1;
    n = parseInt(n);
    this.setState({ page: n, pagevalue: n });
  }

  handleDocumentLoad = (numPages) => {
    //计算文本的宽度
    let s1 = numPages + '';
    let s2 = '9'.repeat(s1.length);
    let pagecountwidth = myGetTextSize(s2, 'times new roman', sys.label.fontsize - 0).width;
    console.log(6666, numPages, pagecountwidth);
    if (pagecountwidth < 25) pagecountwidth = 25;
    this.setState({ pageCount: numPages, pagecountwidth, pagenowidth: pagecountwidth });
  };

  onDocumentComplete = (pdf) => {
    this.setState({ pages: pdf.numPages });
  };

  handleLoadError = (pdf) => {
    console.log(11116666, pdf);
  };

  renderPDF = (file, scale, page) => {
    try {
      return (
        <PDF file={file} scale={scale} page={page}
          onLoadError={this.handleLoadError}
          onDocumentComplete={this.handleDocumentLoad}
        />
      );
    } catch (error) {
      this.handleLoadError(error);
      return <div>Error loading page {page}: {error.message}</div>;
    }
  };

  render() {  //vvvvvvvvvvvvvvvv
    let { height, minwidth, maxwidth, minheight, maxheight, filename, onClose } = this.state.attr;
    let { scale, page, pagevalue, expanded, visible, originalwidth, title, width, drawerwidth, pageCount, pagecountwidth, pagenowidth, pages } = this.state;
    //let { children,drawerwidth, filename } = this.props;
    if (filename == undefined) filename = this.state.filename;
    if (scale > 4) scale = 4;
    else if (scale < 0.4) scale = 0.4;
    drawerwidth = scale * originalwidth;
    return (<div>
      <Drawer id='myPdfViewer' placement='left' size='small' forceRender centered maskClosable={false} keyboard={true}
        styles={{ body: { padding: 0, margin: 0 }, header: { height: 45 } }}
        //ref={ref => this.myPdfViewer = ref} 不能加        
        {...this.state.attr}  //必须加载前面，否则后面的width无效
        open={visible}
        width={drawerwidth}
        onClose={(e) => { this.setState({ visible: false }); onClose?.(e) }} style={{ position: 'relative', padding: 0, margin: 0 }} closable
        title={
          <Form>
            <span className="labelStyle" style={{ fontSize: 18 }}>{title}</span>
            <Button type="text" icon={expanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />} style={{ float: 'right', width: 24, height: 24, marginTop: 2, marginRight: -6 }} onClick={this.handleReSizeViewer} />
            <Button type="text" icon={<ZoomOutOutlined />} style={{ float: 'right', width: 24, height: 24, marginTop: 2, marginRight: 3 }} onClick={() => this.handleSetScale(-1)} />
            <Button type="text" icon={<ZoomInOutlined />} style={{ float: 'right', width: 24, height: 24, marginTop: 2, marginRight: 3 }} onClick={() => this.handleSetScale(1)} />
            {
              pageCount > 1 && <div style={{ marginTop: 0, float: 'right' }}>
                <Button type="text" icon={<MyIconOutlined type='pagenext' />} style={{ float: 'right', width: 24, height: 24, margin: '2px 0px 0px 6px', color: '#2c2c2c' }} onClick={() => this.handleTurnPage(2)}></Button>
                <Tooltip title="总页数">
                  {/* <Input style={{ border:0, borderRadius: 0, height: 25, fontSize: sys.label.fontsize - 0, float: 'right', width: pagecountwidth + 12, marginRight: 2, marginLeft: -1, textAlign: 'center' }} value={'/'+pageCount} onChange={this.handleChange} /> */}
                  <label style={{ border: 0, borderRadius: 0, height: 25, fontFamily: 'times new roman', fontSize: sys.label.fontsize - 0, float: 'right', marginTop: 2, marginRight: 2, marginLeft: 0, textAlign: 'center' }}>{'/ ' + pageCount}</label>
                </Tooltip>
                <Tooltip title="按回车确认">
                  <Input style={{ borderRadius: 0, height: 25, fontSize: sys.label.fontsize - 0, float: 'right', width: pagenowidth + 12, marginTop: 1, marginRight: 6, textAlign: 'center' }} id='pageno' ref={ref => this.pageno = ref}
                    value={pagevalue} onChange={this.handleChange} onPressEnter={this.handleEnterPress} onBlur={this.handleEnterPress} />
                </Tooltip>
                {/* <Input style={{ textAlign: 'center', marginTop: 1, fontSize: sys.label.fontsize - 1, float: 'right', width: pagecountwidth * 2 + 48 }}
                  className="smallboxStyle" id='pageno' ref={ref => this.pageno = ref} value={pagevalue} onChange={this.handleChange} onPressEnter={this.handleEnterPress} onBlur={this.handleEnterPress}
                  //hangeOnWheel //suffix={'/'+pageCount+'页'}  //addonAfter={'/' + pageCount}  //计算文本框宽度和高度
                  addonAfter={<span style={{ paddingTop: -5, margin: '0px -4px 0px -4px', fontSize: sys.label.fontsize - 0, width: pagecountwidth + 24, fontFamily: 'times new roman' }}>{' / ' + pageCount}</span>}
                /> */}
                <Button type="text" icon={<MyIconOutlined type='pageprior' />} style={{ float: 'right', width: 24, height: 24, marginTop: 2, marginRight: -2, color: '#2c2c2c' }} onClick={() => this.handleTurnPage(1)}></Button>
              </div>
            }
            <Button type="text" icon={<DownloadOutlined />} style={{ marginTop: 1, float: 'right', width: 24, height: 24, marginRight: 6 }} onClick={() => this.handleDownload()} />
          </Form>
        }
      // footer={[<Button key='btnclose' type='primary' onClick={() => { this.setState({ visible: false }) }} style={{ float: 'right', marginRight: 3 }} >关闭</Button>,]}
      >
        {/* {filename && filename != '' && <PDF file={sys.serverpath + filename} scale={scale} page={page} onLoadError={this.handleLoadError} onDocumentComplete={this.handleDocumentLoad} />} */}
        {filename && filename != '' && this.renderPDF(sys.serverpath + filename, scale, page)}
      </Drawer>
    </div>
    )
  }
}

export class AntdResizable extends Component {
  constructor(props) {
    super(props);
    let attr = parseParams(props);
    console.log(222, attr);
    if (attr.width == undefined || isNaN(attr.width)) attr.width = -1;
    if (attr.height == undefined || isNaN(attr.height)) attr.height = -1;
    attr.width = parseInt(attr.width);
    attr.height = parseInt(attr.height);
    if (attr.minwidth == undefined) attr.minwidth = attr.width;
    if (attr.maxwidth == undefined) attr.maxwidth = attr.width;
    if (attr.minheight == undefined) attr.minheight = attr.height;
    if (attr.maxheight == undefined) attr.maxheight = attr.height;
    this.state = {
      attr: attr,
      width: attr.width,
      height: attr.height,
      minwidth: attr.minwidth,
      maxwidth: attr.maxwidth,
      maxheight: attr.maxheight,
      minheight: attr.minheight,
    }
  }


  handleResizeStart = (e, direction, ref) => {
    console.log('Resize started', { e, direction, ref });
  };
  // handleResize = (e, direction, ref, d) => {
  //   console.log('Resizing', { e, direction, ref, d });
  //   this.setState({
  //     width: this.state.width + d.width,
  //     height: this.state.height + d.height,
  //   });
  // };

  handleResizeStop = (e, direction, ref, d) => {
    console.log('Resize stopped', { e, direction, ref, d });
    this.setState({
      width: this.state.width + d.width,
      height: this.state.height + d.height,
    });
  };

  handleResize = (event, { element, size }) => {
    //window.requestAnimationFrame(() => this.setState({ siderwidth: size.width }));
    this.setState({
      width: Math.min(400, Math.max(size.width, 100)),
      //height: this.state.height, // Keep height fixed
    });
  };
  render() {
    let { width, height, minwidth, maxwidth, minheight, maxheight } = this.state;
    let { children } = this.props;
    let html = [];
    if (width > 0) {
      html.push(
        <Resizable key='_Resizable1' width={width} height='100vh'
          //minConstraints={[100, height]} // Fixed height
          //maxConstraints={[300, height]} // Fixed height
          axis="x"
          handle={<div style={{
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '-4px', /* 使得把手稍微突出以便于拖动 */
            width: '5px', /* 把手宽度 */
            cursor: 'ew-resize',
            backgroundColor: 'rgb(255,236,255)',
            borderRight: '1px solid ' + sys.colors.border,
            borderLeft: '1px solid ' + sys.colors.border,
            zIndex: 10
          }} />}
          //onResizeStart={this.handleResizeStart}
          onResize={this.handleResize}
        //onResizeStop={this.handleResizeStop}
        >
          <div style={{ width: `${width}px`, height: `${height}px`, border: '1px solid #ccc', position: 'relative' }}>
            {children}
          </div>
        </Resizable >
      )
    } else {
      html.push(
        <Resizable key='_Resizable1' height={height} width={100} minheight={minheight} maxheight={maxheight}
          minConstraints={[100, height]} // Fixed height
          maxConstraints={[300, height]} // Fixed height
          axis="y"
          onResizeStart={this.handleResizeStart}
          onResize={this.handleResize}
          onResizeStop={this.handleResizeStop}
        >
          <div style={{ width: '100%', height: '100%' }}></div>
        </Resizable>
      )
    }
    console.log(333, width, html);
    return (html)
  }
}

export class MyIconOutlined extends React.Component {
  constructor(props) {
    super(props);
    let attr = { ...props };
    attr.antclass = 'icon';
    // if (!attr.size || isNaN(attr.size)) attr.size = 16;
    // attr.size = parseInt(attr.size);   //图表的大小
    // if (!attr.width || isNaN(attr.width)) attr.width = attr.size;
    // if (!attr.height || isNaN(attr.height)) attr.height = attr.size;
    // attr.width = parseInt(attr.width);
    // attr.height = parseInt(attr.height);
    if (!attr.type) attr.type = '';
    if (!attr.id) attr.id = 'icon_' + myLocalTime().timeid;
    if (!attr.color) attr.color = '';
    this.state = {
      attr: attr,  //attr.id  attr.value
      id: attr.id,
      visible: attr.visible,
    }
  }
  render() {
    let { type, size, width, height, color } = this.props;
    let { attr } = this.state;
    let { id } = attr;
    if (!size || isNaN(size)) size = attr.size;
    if (!width || isNaN(width)) width = size;
    if (!height || isNaN(width)) height = size;
    if (!color) color = attr.color;
    let html = [];
    switch (type) {
      case 'summerize':
        html.push(<svg key={id} width={width || '14px'} height={height || '14px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1473" style={{ marginLeft: 0, padding: 0 }}  {...this.props} >
          <path d="M865.232 218.346 710.068 53.085l-10.019-10.671-14.644 0L237.944 42.414c-48.574 0-88.34 38.993-88.34 87.274l0 764.619c0 48.31 39.757 87.279 88.34 87.279l548.099 0c48.612 0 88.352-38.96 88.352-87.279L874.395 241.502l0-13.393L865.232 218.346zM786.044 913.924 237.944 913.924c-11.514 0-20.678-8.982-20.678-19.616l0-764.62c0-10.614 9.18-19.612 20.678-19.612l426.494 0 0 46.146 0 72.444 0 33.831 33.831 0 68.017 0 40.447 0 0 631.81C806.734 904.95 797.583 913.924 786.044 913.924z" fill="#2c2c2c" p-id="2490"></path><path d="M686.805 351.114c0-18.7-15.131-33.831-33.831-33.831L260.678 317.283l239.923 252.18L252.783 797.295l400.191 0c18.7 0 33.831-15.131 33.831-33.831s-15.131-33.831-33.831-33.831L426.366 729.633l170.708-156.997-178.604-187.69 234.505 0C671.674 384.945 686.805 369.814 686.805 351.114z" fill="#2c2c2c" p-id="2491"></path>
        </svg>);
        break;
      case 'sumup':
        html.push(<svg key={id} width={width || '14px'} height={height || '14px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1473" style={{ marginLeft: 0, padding: 0 }}  {...this.props} >
          <path d="M460.507429 479.597714L133.558857 98.742857h656.676572v164.352h-95.085715V193.828571H340.48l244.297143 284.525715-264.484572 320.438857h393.508572v-66.852572h95.085714v161.938286H118.637714z" fill="#2c2c2c" p-id="1474"></path>
        </svg>);
        break;
      case 'invoice.checked':
        if (color == 'red' || color == '') html.push(<svg key={id} width={width || '24px'} height={height || '24px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4488" style={{ marginLeft: -8 }}  {...this.props} >
          <path d="M371.2 300.8l15.2-12 20 1.6-7.2-17.6 7.2-17.6-20 1.6-15.2-12-4.8 18.4-16.8 9.6 16.8 9.6 4.8 18.4zM644 280l13.6 13.6 5.6-17.6 16.8-8-16-12-3.2-19.2-14.4 11.2-19.2-3.2 6.4 18.4-8.8 16.8H644z m-152.8-21.6l18.4-5.6 17.6 8.8v-19.2l13.6-12.8-18.4-5.6-8.8-16.8-11.2 15.2-20 1.6 11.2 16-2.4 18.4z m-201.6 112l12.8 13.6 6.4-18.4 17.6-8.8-14.4-10.4-2.4-18.4-16 11.2-19.2-3.2 5.6 18.4-9.6 16.8 19.2-0.8z m367.2 368l-15.2 12-19.2-1.6 7.2 17.6-7.2 17.6 19.2-1.6 15.2 12 4.8-18.4 16.8-9.6-16.8-9.6-4.8-18.4zM537.6 772l-18.4 5.6-16.8-9.6v19.2L488.8 800l18.4 6.4 8.8 16.8 11.2-15.2 19.2-2.4-11.2-15.2 2.4-18.4z m-143.2-21.6l-13.6-13.6-5.6 17.6-16.8 8 16 12 3.2 19.2 15.2-10.4 19.2 3.2-7.2-18.4 8-16.8-18.4-0.8z" fill="#d81e06" p-id="4489"></path><path d="M512 106.4C288 106.4 106.4 288 106.4 512S288 917.6 512 917.6 917.6 736 917.6 512 736 106.4 512 106.4z m0 784c-208.8 0-378.4-169.6-378.4-378.4S303.2 133.6 512 133.6 890.4 303.2 890.4 512 720.8 890.4 512 890.4z" fill="#d81e06" p-id="4490"></path><path d="M512 172c-187.2 0-340 152.8-340 340s152.8 340 340 340 340-152.8 340-340-152.8-340-340-340z m0 664.8c-179.2 0-324.8-145.6-324.8-324.8S332.8 187.2 512 187.2 836.8 332.8 836.8 512c0 66.4-20 128.8-54.4 180l-6.4-17.6 8-17.6-19.2 1.6-13.6-12-5.6 18.4-16.8 9.6 16 9.6 3.2 18.4 15.2-12 19.2 1.6C724 779.2 624 836.8 512 836.8z" fill="#d81e06" p-id="4491"></path><path d="M645.6 348.8c-37.6-31.2-84.8-48-133.6-48-100.8 0-188 72-207.2 171.2l13.6 2.4c17.6-92.8 99.2-160 193.6-160 45.6 0 90.4 16 124.8 44.8l8.8-10.4zM512 709.6c-45.6 0-90.4-16-124.8-44.8l-8.8 10.4c37.6 31.2 84.8 48 133.6 48 100.8 0 188-72 207.2-171.2l-13.6-2.4c-17.6 92.8-99.2 160-193.6 160zM404 548.8l-102.4 37.6L320 636c2.4 7.2 7.2 8.8 13.6 6.4l84.8-31.2c4-1.6 6.4-3.2 8-6.4 1.6-4 0-15.2-5.6-33.6l12.8-0.8c5.6 20.8 8 34.4 5.6 40-2.4 4.8-6.4 8.8-12.8 11.2l-91.2 33.6c-12.8 4.8-20.8 0-25.6-12.8l-32-87.2 12-4 8.8 24 90.4-32.8-16-43.2L261.6 540l-4-11.2L380.8 484l23.2 64.8z m22.4-82.4l128.8-47.2 4 11.2-28 10.4 16 44L584 472l4 11.2-36 13.6 26.4 73.6-12 4-26.4-73.6-48 17.6c4.8 17.6 6.4 32.8 5.6 45.6-1.6 16-8 30.4-19.2 44l-10.4-8c10.4-12.8 16-26.4 16.8-40.8 0-10.4-1.6-23.2-5.6-36.8L440.8 536l-4-11.2 39.2-14.4-1.6-5.6-13.6-38.4-30.4 11.2-4-11.2z m47.2-3.2L488 504l0.8 3.2 47.2-16.8-16-44-46.4 16.8z m108-56.8L728 352.8l4 10.4-49.6 18.4 4.8 13.6 36.8-13.6 12.8 36-120.8 44-12.8-36L640 412l-4.8-13.6-49.6 18.4-4-10.4z m68 32l-5.6-16-25.6 9.6 5.6 16 25.6-9.6zM618.4 500L760 448.8l4 10.4-63.2 23.2 8.8 24.8c3.2 9.6 0 16-10.4 20l-14.4 5.6-6.4-9.6c6.4-1.6 10.4-3.2 13.6-4 4.8-1.6 7.2-4.8 4.8-9.6l-8-22.4-67.2 24-3.2-11.2z m8.8-28l109.6-40 4 9.6-109.6 40-4-9.6z m48 33.6c-7.2 13.6-18.4 27.2-32.8 40l-10.4-6.4c13.6-12.8 24.8-24.8 32.8-37.6l10.4 4z m0.8-106.4l-4.8-13.6-24.8 8.8 4.8 13.6 24.8-8.8z m9.6 25.6l-5.6-16-24.8 8.8 5.6 16 24.8-8.8z m36.8-12.8l-5.6-16-24.8 8.8 5.6 16 24.8-8.8z m6.4 66.4c18.4 2.4 34.4 5.6 48 10.4l-5.6 11.2c-11.2-4-27.2-8-48-11.2l5.6-10.4z" p-id="4492" fill="#d81e06"></path>
        </svg>);
        else html.push(<svg key={id} width={width || '24px'} height={height || '24px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4488" style={{ marginLeft: -8 }}  {...this.props} >
          <path d="M371.2 300.8l15.2-12 20 1.6-7.2-17.6 7.2-17.6-20 1.6-15.2-12-4.8 18.4-16.8 9.6 16.8 9.6 4.8 18.4zM644 280l13.6 13.6 5.6-17.6 16.8-8-16-12-3.2-19.2-14.4 11.2-19.2-3.2 6.4 18.4-8.8 16.8H644z m-152.8-21.6l18.4-5.6 17.6 8.8v-19.2l13.6-12.8-18.4-5.6-8.8-16.8-11.2 15.2-20 1.6 11.2 16-2.4 18.4z m-201.6 112l12.8 13.6 6.4-18.4 17.6-8.8-14.4-10.4-2.4-18.4-16 11.2-19.2-3.2 5.6 18.4-9.6 16.8 19.2-0.8z m367.2 368l-15.2 12-19.2-1.6 7.2 17.6-7.2 17.6 19.2-1.6 15.2 12 4.8-18.4 16.8-9.6-16.8-9.6-4.8-18.4zM537.6 772l-18.4 5.6-16.8-9.6v19.2L488.8 800l18.4 6.4 8.8 16.8 11.2-15.2 19.2-2.4-11.2-15.2 2.4-18.4z m-143.2-21.6l-13.6-13.6-5.6 17.6-16.8 8 16 12 3.2 19.2 15.2-10.4 19.2 3.2-7.2-18.4 8-16.8-18.4-0.8z" fill="#2c2c2c" p-id="15305"></path><path d="M512 106.4C288 106.4 106.4 288 106.4 512S288 917.6 512 917.6 917.6 736 917.6 512 736 106.4 512 106.4z m0 784c-208.8 0-378.4-169.6-378.4-378.4S303.2 133.6 512 133.6 890.4 303.2 890.4 512 720.8 890.4 512 890.4z" fill="#2c2c2c" p-id="15306"></path><path d="M512 172c-187.2 0-340 152.8-340 340s152.8 340 340 340 340-152.8 340-340-152.8-340-340-340z m0 664.8c-179.2 0-324.8-145.6-324.8-324.8S332.8 187.2 512 187.2 836.8 332.8 836.8 512c0 66.4-20 128.8-54.4 180l-6.4-17.6 8-17.6-19.2 1.6-13.6-12-5.6 18.4-16.8 9.6 16 9.6 3.2 18.4 15.2-12 19.2 1.6C724 779.2 624 836.8 512 836.8z" fill="#2c2c2c" p-id="15307"></path><path d="M645.6 348.8c-37.6-31.2-84.8-48-133.6-48-100.8 0-188 72-207.2 171.2l13.6 2.4c17.6-92.8 99.2-160 193.6-160 45.6 0 90.4 16 124.8 44.8l8.8-10.4zM512 709.6c-45.6 0-90.4-16-124.8-44.8l-8.8 10.4c37.6 31.2 84.8 48 133.6 48 100.8 0 188-72 207.2-171.2l-13.6-2.4c-17.6 92.8-99.2 160-193.6 160zM404 548.8l-102.4 37.6L320 636c2.4 7.2 7.2 8.8 13.6 6.4l84.8-31.2c4-1.6 6.4-3.2 8-6.4 1.6-4 0-15.2-5.6-33.6l12.8-0.8c5.6 20.8 8 34.4 5.6 40-2.4 4.8-6.4 8.8-12.8 11.2l-91.2 33.6c-12.8 4.8-20.8 0-25.6-12.8l-32-87.2 12-4 8.8 24 90.4-32.8-16-43.2L261.6 540l-4-11.2L380.8 484l23.2 64.8z m22.4-82.4l128.8-47.2 4 11.2-28 10.4 16 44L584 472l4 11.2-36 13.6 26.4 73.6-12 4-26.4-73.6-48 17.6c4.8 17.6 6.4 32.8 5.6 45.6-1.6 16-8 30.4-19.2 44l-10.4-8c10.4-12.8 16-26.4 16.8-40.8 0-10.4-1.6-23.2-5.6-36.8L440.8 536l-4-11.2 39.2-14.4-1.6-5.6-13.6-38.4-30.4 11.2-4-11.2z m47.2-3.2L488 504l0.8 3.2 47.2-16.8-16-44-46.4 16.8z m108-56.8L728 352.8l4 10.4-49.6 18.4 4.8 13.6 36.8-13.6 12.8 36-120.8 44-12.8-36L640 412l-4.8-13.6-49.6 18.4-4-10.4z m68 32l-5.6-16-25.6 9.6 5.6 16 25.6-9.6zM618.4 500L760 448.8l4 10.4-63.2 23.2 8.8 24.8c3.2 9.6 0 16-10.4 20l-14.4 5.6-6.4-9.6c6.4-1.6 10.4-3.2 13.6-4 4.8-1.6 7.2-4.8 4.8-9.6l-8-22.4-67.2 24-3.2-11.2z m8.8-28l109.6-40 4 9.6-109.6 40-4-9.6z m48 33.6c-7.2 13.6-18.4 27.2-32.8 40l-10.4-6.4c13.6-12.8 24.8-24.8 32.8-37.6l10.4 4z m0.8-106.4l-4.8-13.6-24.8 8.8 4.8 13.6 24.8-8.8z m9.6 25.6l-5.6-16-24.8 8.8 5.6 16 24.8-8.8z m36.8-12.8l-5.6-16-24.8 8.8 5.6 16 24.8-8.8z m6.4 66.4c18.4 2.4 34.4 5.6 48 10.4l-5.6 11.2c-11.2-4-27.2-8-48-11.2l5.6-10.4z" p-id="15308" fill="#2c2c2c"></path>
        </svg>);
        break;
      case 'invoice.unchecked':
        if (color == '' || color == 'black') html.push(<svg key={id} width={width || '24px'} height={height || '24px'} viewBox="0 0 1336 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="93308" style={{ marginLeft: -8 }}  {...this.props} >
          <path d="M490.537438 263.49899c81.713131-58.440404 182.561616-70.593939 271.644445-41.761616l37.882828-14.222222c-103.046465-44.606061-226.521212-35.684848-324.783838 34.391919-47.321212 33.874747-83.264646 77.963636-106.925253 126.965656l37.882828-13.963636c20.945455-35.038384 49.131313-66.068687 84.29899-91.410101z m153.082829-130.585859l27.280808 1.551515-9.69697-24.824242 11.377778-25.212121-27.668687 2.456565L624.484913 69.818182l-7.369697 26.50505-23.789899 14.610101 22.884849 13.575758 5.430303 26.246465 21.979798-17.842425zM309.139459 300.735354l-26.634344 0.387878 11.765657 24.824243-8.662627 26.634343 26.505051-4.525252L333.575822 364.218182l4.525253-27.79798 21.979798-16.678788-23.40202-12.541414-7.757576-26.505051-19.781818 20.040405z m145.454545-149.59192l-25.341414-7.757575 3.749495 27.280808-16.290909 22.755555 26.50505 3.749495 15.515152 21.979798 12.670707-24.953535 25.858586-9.438384-18.488889-18.876768 0.387879-27.668687-24.565657 12.929293z m338.230303-37.10707l-28.056566 0.387878 12.670707 23.402021-8.274747 25.341414 27.668687-4.525253 22.884848 15.385859 4.39596-26.246465 22.49697-15.90303-24.953536-11.765657-8.921212-25.212121-19.911111 19.135354z m359.692929-10.472728l-1118.125252 418.909091c-27.410101 10.343434-41.244444 40.856566-31.030303 68.266667l111.838384 298.020202c10.343434 27.410101 40.856566 41.244444 68.266666 31.030303l1118.125253-418.909091c27.410101-10.343434 41.244444-40.856566 31.030303-68.266667l-111.838384-297.890909c-9.955556-27.280808-40.856566-41.50303-68.266667-31.159596z m48.226263 53.010101l102.270707 273.325253c7.628283 20.557576-2.715152 43.70101-23.272727 51.2L186.699055 890.440404c-20.557576 7.628283-43.70101-2.585859-51.2-23.272727l-102.270708-273.325253c-7.628283-20.557576 2.585859-43.70101 23.272728-51.2L1149.672792 133.171717c20.29899-7.628283 43.183838 2.844444 51.070707 23.40202zM390.335418 123.345455C570.440469-5.30101 808.727337 9.050505 971.765721 143.127273l28.573738-10.731313C828.25057-18.230303 569.276832-36.848485 375.208145 101.753535 257.422287 185.923232 186.828347 311.337374 168.727337 444.121212l28.315152-10.731313C216.9536 312.630303 283.15158 199.757576 390.335418 123.345455zM929.616226 668.70303c-20.945455 34.779798-49.131313 66.19798-84.29899 91.410101-81.713131 58.440404-182.561616 70.593939-271.644444 41.761616l-37.882828 14.222223c103.046465 44.606061 226.521212 35.684848 324.525252-34.391919 47.321212-33.874747 83.393939-77.963636 106.925253-126.965657L929.616226 668.70303zM729.987943 879.062626l-27.280808-1.680808 9.69697 24.824243-11.119192 24.953535 27.410101-2.327273 20.428283 17.19596 7.240404-26.246465 23.660606-14.610101-22.884848-13.575757-5.430303-26.246465-21.721213 17.713131z m180.105051-28.185858l25.341414 7.757575-3.749495-27.022222 16.032323-22.755555-26.50505-4.008081-15.256566-21.591919L893.414206 808.080808l-25.6 9.309091 18.488889 18.876768-0.387879 27.668687 24.177778-13.058586z m-369.907071 59.474747l27.79798 1.551515-11.119192-24.436363 10.214142-24.565657-27.668687 2.327273-21.59192-16.808081-6.076767 25.858586-23.40202 14.351515 23.789899 13.446465 6.981818 25.729293 21.074747-17.454546z m405.204041-9.69697C765.414206 1029.30101 527.127337 1014.949495 364.088954 880.614141l-28.573738 10.731314c171.959596 150.49697 431.062626 169.244444 625.131313 30.642424C1078.432388 837.818182 1149.026327 712.40404 1167.127337 579.620202l-28.315151 10.731313c-19.911111 120.759596-85.979798 233.632323-193.422222 310.30303zM1045.074812 709.818182l26.634344-0.387879-11.765657-24.565657 8.274747-26.50505-26.246464 4.525252-21.591919-16.290909-4.39596 27.410101L994.262691 690.424242l23.40202 12.541415 7.886869 26.50505 19.523232-19.652525z m0 0" p-id="9331" fill="#2c2c2c"></path><path d="M407.014206 615.692929c38.787879 26.246465 94.513131 45.769697 139.248485 48.09697-2.456566 5.042424-5.818182 14.480808-7.111111 20.29899-44.088889-4.525253-98.133333-24.694949-139.248485-52.234344l40.468687 107.571718-19.006061 7.111111-39.822222-105.890909c-12.670707 47.450505-39.692929 96.581818-69.559596 128.90505-4.913131-3.10303-13.446465-8.145455-19.006061-10.472727 32.193939-31.288889 61.155556-81.971717 72.533334-127.741414L266.989964 668.444444l-6.852526-18.10101 109.511111-41.115151-18.618181-49.519192-89.987879 33.874747-6.723232-17.842424 89.987878-33.874747L327.240469 496.484848l19.00606-7.111111L363.313196 534.49697l92.961616-34.909091 6.723232 17.842424-92.961616 34.909091 18.618182 49.519192L500.363701 559.838384l6.852525 18.10101-100.20202 37.753535zM784.808145 476.315152l-61.931313 23.272727 44.218182 117.527273-18.747475 6.981818-44.218181-117.527273-80.032324 30.125252c12.8 44.864646 14.480808 92.832323-24.436363 143.903031-4.525253-2.715152-13.446465-6.593939-19.264647-7.886869 35.814141-46.80404 35.814141-89.470707 24.953536-129.034343l-65.163637 24.565656-6.593939-17.583838 66.327273-24.953535c-1.292929-4.266667-2.844444-8.40404-4.39596-12.541415l-25.470707-67.620202-56.113131 21.074748-6.59394-17.583839 225.357576-84.686868 6.593939 17.583838-53.139394 19.911111 30.125253 80.032323 61.931313-23.272727 6.593939 17.713132z m-87.272727 12.670707l-30.125252-80.032324-78.99798 29.737374 25.470707 67.620202c1.551515 4.137374 3.10303 8.274747 4.39596 12.541414l79.256565-29.866666zM855.919257 327.369697l-77.834344 29.220202-5.688889-15.127273 236.347475-88.824242 5.688889 15.127273-77.834344 29.220202 8.533334 22.496969 64.646464-24.30707 23.402021 62.189899-206.610101 77.70505-23.402021-62.189899 61.414142-23.014141-8.662626-22.49697z m-17.842425 87.014141l44.347475-16.678787-12.670707-33.616162-44.347475 16.678788 12.670707 33.616161z m233.890909-9.309091l5.688889 15.127273-113.131313 42.537374 18.747475 49.777778c3.749495 9.955556 3.232323 15.385859-3.361616 21.074747-6.981818 5.688889-19.264646 10.731313-39.563637 18.359596-2.844444-4.913131-8.016162-10.472727-12.412121-14.480808 16.420202-5.559596 29.349495-10.472727 33.616162-12.282828 3.878788-1.422222 4.266667-2.844444 2.973737-6.206061l-18.488889-49.260606-112.614141 42.278788-5.688889-15.127273 244.234343-91.79798z m-218.375757 58.828283l-5.559596-14.868687 177.389899-66.715151 5.559596 14.868687-177.389899 66.715151z m62.189899 32.452526c-8.921212 26.246465-28.185859 55.466667-46.416162 76.153535-4.137374-1.939394-13.705051-5.559596-18.618182-6.852525 19.652525-19.652525 37.882828-45.381818 46.028283-68.783839l19.006061-0.517171z m3.490909-192.775758l-46.157576 17.325253 8.533333 22.496969 46.157576-17.325252-8.533333-22.49697z m-19.781818 87.789899l46.157575-17.325253-12.670707-33.616161-46.157575 17.325252 12.670707 33.616162z m50.941414-57.406061l12.670707 33.616162 46.545454-17.454545-12.670707-33.616162-46.545454 17.454545z m61.931313 120.50101c27.151515 3.620202 63.224242 11.119192 83.135354 18.101011l-9.955556 16.290909c-18.747475-7.369697-54.820202-15.515152-82.747475-19.781819l9.567677-14.610101z" p-id="9332" fill="#2c2c2c"></path>   //黑色
        </svg>);
        else html.push(<svg key={id} width={width || '24px'} height={height || '24px'} viewBox="0 0 1336 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="93308" style={{ marginLeft: -8 }}  {...this.props} >
          <path d="M490.537438 263.49899c81.713131-58.440404 182.561616-70.593939 271.644445-41.761616l37.882828-14.222222c-103.046465-44.606061-226.521212-35.684848-324.783838 34.391919-47.321212 33.874747-83.264646 77.963636-106.925253 126.965656l37.882828-13.963636c20.945455-35.038384 49.131313-66.068687 84.29899-91.410101z m153.082829-130.585859l27.280808 1.551515-9.69697-24.824242 11.377778-25.212121-27.668687 2.456565L624.484913 69.818182l-7.369697 26.50505-23.789899 14.610101 22.884849 13.575758 5.430303 26.246465 21.979798-17.842425zM309.139459 300.735354l-26.634344 0.387878 11.765657 24.824243-8.662627 26.634343 26.505051-4.525252L333.575822 364.218182l4.525253-27.79798 21.979798-16.678788-23.40202-12.541414-7.757576-26.505051-19.781818 20.040405z m145.454545-149.59192l-25.341414-7.757575 3.749495 27.280808-16.290909 22.755555 26.50505 3.749495 15.515152 21.979798 12.670707-24.953535 25.858586-9.438384-18.488889-18.876768 0.387879-27.668687-24.565657 12.929293z m338.230303-37.10707l-28.056566 0.387878 12.670707 23.402021-8.274747 25.341414 27.668687-4.525253 22.884848 15.385859 4.39596-26.246465 22.49697-15.90303-24.953536-11.765657-8.921212-25.212121-19.911111 19.135354z m359.692929-10.472728l-1118.125252 418.909091c-27.410101 10.343434-41.244444 40.856566-31.030303 68.266667l111.838384 298.020202c10.343434 27.410101 40.856566 41.244444 68.266666 31.030303l1118.125253-418.909091c27.410101-10.343434 41.244444-40.856566 31.030303-68.266667l-111.838384-297.890909c-9.955556-27.280808-40.856566-41.50303-68.266667-31.159596z m48.226263 53.010101l102.270707 273.325253c7.628283 20.557576-2.715152 43.70101-23.272727 51.2L186.699055 890.440404c-20.557576 7.628283-43.70101-2.585859-51.2-23.272727l-102.270708-273.325253c-7.628283-20.557576 2.585859-43.70101 23.272728-51.2L1149.672792 133.171717c20.29899-7.628283 43.183838 2.844444 51.070707 23.40202zM390.335418 123.345455C570.440469-5.30101 808.727337 9.050505 971.765721 143.127273l28.573738-10.731313C828.25057-18.230303 569.276832-36.848485 375.208145 101.753535 257.422287 185.923232 186.828347 311.337374 168.727337 444.121212l28.315152-10.731313C216.9536 312.630303 283.15158 199.757576 390.335418 123.345455zM929.616226 668.70303c-20.945455 34.779798-49.131313 66.19798-84.29899 91.410101-81.713131 58.440404-182.561616 70.593939-271.644444 41.761616l-37.882828 14.222223c103.046465 44.606061 226.521212 35.684848 324.525252-34.391919 47.321212-33.874747 83.393939-77.963636 106.925253-126.965657L929.616226 668.70303zM729.987943 879.062626l-27.280808-1.680808 9.69697 24.824243-11.119192 24.953535 27.410101-2.327273 20.428283 17.19596 7.240404-26.246465 23.660606-14.610101-22.884848-13.575757-5.430303-26.246465-21.721213 17.713131z m180.105051-28.185858l25.341414 7.757575-3.749495-27.022222 16.032323-22.755555-26.50505-4.008081-15.256566-21.591919L893.414206 808.080808l-25.6 9.309091 18.488889 18.876768-0.387879 27.668687 24.177778-13.058586z m-369.907071 59.474747l27.79798 1.551515-11.119192-24.436363 10.214142-24.565657-27.668687 2.327273-21.59192-16.808081-6.076767 25.858586-23.40202 14.351515 23.789899 13.446465 6.981818 25.729293 21.074747-17.454546z m405.204041-9.69697C765.414206 1029.30101 527.127337 1014.949495 364.088954 880.614141l-28.573738 10.731314c171.959596 150.49697 431.062626 169.244444 625.131313 30.642424C1078.432388 837.818182 1149.026327 712.40404 1167.127337 579.620202l-28.315151 10.731313c-19.911111 120.759596-85.979798 233.632323-193.422222 310.30303zM1045.074812 709.818182l26.634344-0.387879-11.765657-24.565657 8.274747-26.50505-26.246464 4.525252-21.591919-16.290909-4.39596 27.410101L994.262691 690.424242l23.40202 12.541415 7.886869 26.50505 19.523232-19.652525z m0 0" p-id="9331" fill="#d81e06"></path><path d="M407.014206 615.692929c38.787879 26.246465 94.513131 45.769697 139.248485 48.09697-2.456566 5.042424-5.818182 14.480808-7.111111 20.29899-44.088889-4.525253-98.133333-24.694949-139.248485-52.234344l40.468687 107.571718-19.006061 7.111111-39.822222-105.890909c-12.670707 47.450505-39.692929 96.581818-69.559596 128.90505-4.913131-3.10303-13.446465-8.145455-19.006061-10.472727 32.193939-31.288889 61.155556-81.971717 72.533334-127.741414L266.989964 668.444444l-6.852526-18.10101 109.511111-41.115151-18.618181-49.519192-89.987879 33.874747-6.723232-17.842424 89.987878-33.874747L327.240469 496.484848l19.00606-7.111111L363.313196 534.49697l92.961616-34.909091 6.723232 17.842424-92.961616 34.909091 18.618182 49.519192L500.363701 559.838384l6.852525 18.10101-100.20202 37.753535zM784.808145 476.315152l-61.931313 23.272727 44.218182 117.527273-18.747475 6.981818-44.218181-117.527273-80.032324 30.125252c12.8 44.864646 14.480808 92.832323-24.436363 143.903031-4.525253-2.715152-13.446465-6.593939-19.264647-7.886869 35.814141-46.80404 35.814141-89.470707 24.953536-129.034343l-65.163637 24.565656-6.593939-17.583838 66.327273-24.953535c-1.292929-4.266667-2.844444-8.40404-4.39596-12.541415l-25.470707-67.620202-56.113131 21.074748-6.59394-17.583839 225.357576-84.686868 6.593939 17.583838-53.139394 19.911111 30.125253 80.032323 61.931313-23.272727 6.593939 17.713132z m-87.272727 12.670707l-30.125252-80.032324-78.99798 29.737374 25.470707 67.620202c1.551515 4.137374 3.10303 8.274747 4.39596 12.541414l79.256565-29.866666zM855.919257 327.369697l-77.834344 29.220202-5.688889-15.127273 236.347475-88.824242 5.688889 15.127273-77.834344 29.220202 8.533334 22.496969 64.646464-24.30707 23.402021 62.189899-206.610101 77.70505-23.402021-62.189899 61.414142-23.014141-8.662626-22.49697z m-17.842425 87.014141l44.347475-16.678787-12.670707-33.616162-44.347475 16.678788 12.670707 33.616161z m233.890909-9.309091l5.688889 15.127273-113.131313 42.537374 18.747475 49.777778c3.749495 9.955556 3.232323 15.385859-3.361616 21.074747-6.981818 5.688889-19.264646 10.731313-39.563637 18.359596-2.844444-4.913131-8.016162-10.472727-12.412121-14.480808 16.420202-5.559596 29.349495-10.472727 33.616162-12.282828 3.878788-1.422222 4.266667-2.844444 2.973737-6.206061l-18.488889-49.260606-112.614141 42.278788-5.688889-15.127273 244.234343-91.79798z m-218.375757 58.828283l-5.559596-14.868687 177.389899-66.715151 5.559596 14.868687-177.389899 66.715151z m62.189899 32.452526c-8.921212 26.246465-28.185859 55.466667-46.416162 76.153535-4.137374-1.939394-13.705051-5.559596-18.618182-6.852525 19.652525-19.652525 37.882828-45.381818 46.028283-68.783839l19.006061-0.517171z m3.490909-192.775758l-46.157576 17.325253 8.533333 22.496969 46.157576-17.325252-8.533333-22.49697z m-19.781818 87.789899l46.157575-17.325253-12.670707-33.616161-46.157575 17.325252 12.670707 33.616162z m50.941414-57.406061l12.670707 33.616162 46.545454-17.454545-12.670707-33.616162-46.545454 17.454545z m61.931313 120.50101c27.151515 3.620202 63.224242 11.119192 83.135354 18.101011l-9.955556 16.290909c-18.747475-7.369697-54.820202-15.515152-82.747475-19.781819l9.567677-14.610101z" p-id="9332" fill="#d81e06"></path>  //红色
        </svg>);
        break;
      case 'pageprev':
      case 'pageprior':
        html.push(<svg key={id} width={width || '14px'} height={height || '14px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4260" style={{ marginLeft: -8 }} >
          <path d="M366.819556 510.293333c0 9.500444 3.527111 17.976889 9.443555 24.462223l2.503111 2.503111 24.462222 24.462222 188.302223 188.302222a36.636444 36.636444 0 0 0 51.427555 0 36.636444 36.636444 0 0 0 0-51.484444L454.542222 510.236444l188.302222-188.416a36.636444 36.636444 0 0 0 0-51.484444 36.408889 36.408889 0 0 0-51.370666 0.113778l-188.302222 188.302222-24.746667 24.746667-2.048 2.048a35.669333 35.669333 0 0 0-9.557333 24.803555z" fill="#2c2c2c" p-id="7718"></path><path d="M510.236444 1019.904a506.595556 506.595556 0 0 1-198.428444-40.106667 506.595556 506.595556 0 0 1-161.905778-109.226666 506.595556 506.595556 0 0 1-109.226666-161.962667A506.595556 506.595556 0 0 1 0.568889 510.293333a508.302222 508.302222 0 0 1 149.333333-360.448A507.562667 507.562667 0 0 1 510.236444 0.568889a508.302222 508.302222 0 0 1 360.448 149.333333 507.050667 507.050667 0 0 1 109.226667 162.019556 506.595556 506.595556 0 0 1 40.106667 198.428444 506.595556 506.595556 0 0 1-149.447111 360.220445 507.050667 507.050667 0 0 1-162.019556 109.226666 505.628444 505.628444 0 0 1-198.314667 40.106667z m0-945.493333c-240.355556 0-435.768889 195.470222-435.768888 435.768889 0 240.412444 195.413333 435.825778 435.768888 435.825777s435.768889-195.413333 435.768889-435.768889-195.413333-435.768889-435.768889-435.768888z" fill="#2c2c2c" p-id="7719"></path>
        </svg>);
        break;
      case 'pagenext':
        html.push(<svg key={id} width={width || '14px'} height={height || '14px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4260" style={{ marginTop: 2 }} >
          <path d="M512 1024C229.232 1024 0 794.768 0 512 0 229.232 229.232 0 512 0c282.768 0 512 229.232 512 512 0 282.768-229.232 512-512 512z m0-64c247.424 0 448-200.576 448-448S759.424 64 512 64 64 264.576 64 512s200.576 448 448 448z m-118.624-243.104L596.512 513.76 393.376 310.624a32 32 0 0 1 45.248-45.248l225.76 225.76a32 32 0 0 1 0 45.264l-225.76 225.76a32 32 0 0 1-45.248-45.264z" fill="#000000" p-id="12663"></path>
        </svg>);
        break;
      case 'backup':
        html.push(<svg width={width || '16px'} height={height || '16px'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4260" style={{ marginLeft: -8 }} >
          <path d="M716.16 835.84H497.28c-17.92 0-32-14.08-32-32s14.08-32 32-32h218.88c88.96 0 163.84-70.4 167.04-156.8 1.28-44.8-14.72-87.04-45.44-119.04-30.72-32-72.32-49.92-117.12-49.92-7.68 0-16 0.64-23.68 1.92-25.6 3.84-49.92-13.44-53.76-39.04C627.2 314.24 542.72 247.68 445.44 256c-87.68 7.04-158.08 75.52-167.68 162.56-3.2 30.08 0 59.52 10.88 87.04 3.84 10.24 2.56 21.76-4.48 30.72-6.4 8.96-17.28 13.44-28.16 12.8h-1.28c-2.56 0-4.48-0.64-7.04-0.64-30.72 0-59.52 12.16-80.64 34.56-21.12 22.4-32 51.84-30.72 82.56 2.56 58.24 54.4 106.24 115.2 106.24H339.2c17.92 0 32 14.08 32 32s-14.08 32-32 32H252.16c-96 0-174.72-73.6-179.2-167.04-2.56-48.64 14.72-94.72 48.64-129.92 26.24-27.52 59.52-45.44 96-51.84-5.12-24.96-5.76-49.92-3.2-76.16 12.8-117.12 108.16-209.28 225.92-218.88 122.88-10.24 235.52 72.96 263.04 191.36 5.76-0.64 12.16-0.64 17.92-0.64 62.08 0 119.68 24.32 163.2 69.12 42.88 44.8 65.28 103.68 63.36 165.76-5.12 120.32-108.8 218.24-231.68 218.24z" fill="#2c2c2c" p-id="4261"></path><path d="M496 821.12c-17.92 0-32-14.08-32-32V599.04l-54.4 46.72c-13.44 11.52-33.92 10.24-45.44-3.2-11.52-13.44-10.24-33.92 3.2-45.44l107.52-92.16c9.6-8.32 23.04-10.24 33.92-5.12 11.52 5.12 18.56 16.64 18.56 28.8v260.48c0.64 17.92-13.44 32-31.36 32zM622.72 652.8c-7.04 0-14.08-2.56-20.48-7.04l-42.24-34.56c-13.44-11.52-15.36-31.36-4.48-44.8 11.52-13.44 31.36-15.36 44.8-4.48l42.24 34.56c13.44 11.52 15.36 31.36 4.48 44.8-5.76 7.68-15.36 11.52-24.32 11.52z" fill="#2c2c2c" p-id="4262"></path>
        </svg>)
    }
    return (<>
      {html}
    </>
    )
  }
}