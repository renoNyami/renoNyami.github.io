import React, { Component } from 'react';
import { reqdoSQL, myIsArray } from '../api/functions.js';
import modalStyle from '../css/modal.module.css';

export class MyInput extends React.Component {  
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    let attr = {...props}
    this.inputRef = React.createRef();
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中
    let {id, type, label, labelwidth, top, left, height, width, value} = attr;
    //console.log(551,attr.top,attr.style)
    if (!height || height == 0) height = 28;
    if (!width || width == 0)  width = 200;
    if (!labelwidth || labelwidth == 0) labelwidth = 80;
    if (!value) value = '';
    if (!type) type = 'text';
    if (top && left && !isNaN(top) && !isNaN(left)){
      if (!attr.style) attr.style={};
      attr.style.position='absolute';
      attr.style.top = parseInt(top);
      attr.style.left = parseInt(left);
    }
    attr.value = value;
    attr.width = parseInt(width);
    attr.height = parseInt(height);
    attr.labelwidth = parseInt(labelwidth);
    if (attr.readOnly === undefined && attr.readonly === undefined) attr.readOnly = false;
    if (attr.disabled === undefined) attr.disabled = false;
    attr.classtype = type; 
    this.state = {      
      attr: attr,
      id: attr.id,
      value: attr.value,
      classtype: attr.classtype,
      readOnly: attr.readOnly
    }
    //console.log(555,attr)
    //console.log(55556,props)
  }
  onfocus1 = (e) => {
    console.log(e.target.id)
    this.inputRef.select();
  }
  focusAndSelect = () => {
    this.inputRef.current.focus();
    this.inputRef.current.select();
  };
  render(){
    let {id, type, height, width, value, label, labelwidth, onChange, style} = this.state.attr;
    return (      
      <div key={id+'_div'} id={id+'_div'} style={style} >
        <label key={id+'_label'} id={id+'_label'} style={{display: 'inline-block', width:labelwidth}} className='labelStyle' htmlFor={id}>{label}：</label>
        <input {...this.props} key={id} id={id} type={type} 
         className='textboxStyle' 
         style={{height: height, width: width}} 
         //onFocus={(e)=>{document.getElementById(id).select()}}
         onFocus={(e)=>e.target.select()} ref={this.inputRef} 
         //onFocus={this.focus1} ref={ref=>this.inputRef=ref}
         readOnly={this.state.readOnly} disabled={this.state.readOnly}
         value={this.state.value} 
         onChange={(e)=>{this.setState({value: e.target.value}); onChange?.(e);}}         
         />
      </div>
    );
  }
}


export class MyDropDown extends React.Component {  
  // <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="85" width="200" className='selectStyle' style={{marginTop:10}} sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={this.handleSelect.bind(this)} />
  // <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="85" width="200" className='selectStyle' style={{marginTop:10}} sqlprocedure="demo305a" onChange={this.handleSelect.bind(this)} />
  // <MyCombobox id="districtid" ref={ref=>this.districtid=ref} label="所辖市区" labelwidth="85" width="200" className='selectStyle' sqlprocedure="demo305a" style={{marginTop:10}}  />
  //要求items或数据库中数据转成label和value两个列，
  //sqlparams没有参数时写sqlparams={null}或sqlparams={{}}，无params定义时不追星存储过程
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    let attr = {...props} ;   
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中。这段程序只执行一次
    let {id, type, label, labelwidth, top, left, height, width, value} = attr;
    if (!height || height == 0) height = 30;
    if (!width || width == 0)  width = 200;
    if (!labelwidth || labelwidth == 0) labelwidth = 80;
    if (!value) value = '';
    if (!attr.readOnly && !attr.readonly) attr.readOnly = false;
    if (top && left && !isNaN(top) && !isNaN(left)){
      if (!attr.style) attr.style={};
      attr.style.position='absolute';
      attr.style.top = parseInt(top);
      attr.style.left = parseInt(left);
    }
    console.log(119,value,attr.items);
    if ((value && value =='') && attr.items?.length>0) value = attr.items[0].value;
    attr.value = value;
    attr.width = parseInt(width);
    attr.height = parseInt(height);
    attr.labelwidth = parseInt(labelwidth);    
    attr.classtype = 'combobox';     
    this.state = {
      attr: attr,    
      id: attr.id,
      data: attr.data,
      //不单独设置属性，在父类组件setstate时无法渲染这个组件
      readOnly: attr.readOnly,
      value: attr.value,
      items: attr.items,
      classtype: attr.classtype,
      sqlprocedure: attr.sqlprocedure,
      sqlparams: attr.sqlparams
    }
  };

  async componentDidMount(){ //页面启动渲染之后会执行
    //适用于静态下拉框，不从数据库中提取选项数据
    let rs = this.setInitValue();
    this.setState({items:rs.data, value:rs.value})
  }

  loadData = async() => {
    let {sqlprocedure, sqlparams} = this.props;
    if (sqlparams === undefined || sqlparams === null) sqlparams={};
    let p = {... sqlparams};
    p.sqlprocedure = sqlprocedure;
    //console.log(218, this.state.id, sqlprocedure, sqlparams)
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    let {value, attr} = this.state;
    //let value = '';
    console.log('load:', this.state.attr.id, rs.rows[0], this.state.value)
    if (rs?.rows && rs.rows.length>0){
      if (!value || value ==='') value = rs.rows[0].value; //[attr.id];
      this.setState({items: rs.rows, value});
    }
    //return rs.rows;
  }

  handleChange = (e) => {  //输入时触发，赋值时不触发
    let value = e.target.value;
    if (value === '' && this.state.items?.length>0){
      value = this.state.items[0].value;
    }
    this.setState({value});
  }

  setInitValue = () =>{
    let {id, type, height, width, label, labelwidth, onChange, style} = this.state.attr;
    let {sqlprocedure, sqlparams, value, items, attr} = this.state;
    let data;
    //console.log(217, id, sqlprocedure, sqlparams, items, id)
    if ((items === undefined || items === null) && sqlprocedure !== undefined && sqlparams !== undefined){
      this.loadData(sqlprocedure, sqlparams);
    }else if (typeof items === 'string'){
      let array = items.split(';');
      data = array.map((item)=>({"label":item, "value":item}));
    }else if (Array.isArray(items)){
      data = items;
    }
    if (!Array.isArray(data)) data=[];
    if ((value === undefined || value==='') && data.length>0){
      value = data[0].value;
    }else if (value!=='' && data?.length>0){
      //如果选项的value值找不到，文本默认取第一个选项的值，但value值为空，所以要处理给它赋值
      let index = data.findIndex((item)=>item.value == value);
      if (index < 0) value = data[0].value;
    }
    return {data, value}
  }

  componentDidUpdate(prevProps, prevState) {
    //if (this.state.id=='cityid') console.log(999,prevState.value, this.state.value, prevState.items, this.state.items)
    if (prevState.value !== this.state.value || prevState.items !== this.state.items) {
      let rs = this.setInitValue();
      if (prevState.value !== rs.value || prevState.data !== rs.data) {
        this.setState({ items: rs.data, value: rs.value });
      }
    }
  }
  
  render(){
    let { id, type, height, width, label, labelwidth, onChange, data, style} = this.state.attr;
    let { sqlprocedure, sqlparams, value, items, attr} = this.state;
    //console.log(221,id,sqlprocedure,sqlparams,items,attr.items)
    let rs = this.setInitValue();
    data = rs.data;
    value = rs.value;
    attr.value =value;
    //console.log(223,id, data, value, this.state.value, data)
    return (<div key={id+'_div'} id={id+'_div'} style={style}>
      <label key={id+'_label'} id={id+'_label'} style={{display: 'inline-block', width:labelwidth}} className='labelStyle' htmlFor={id}>{label}：</label>
      <select {...this.state.attr} key={id} id={id} ref={this.selectRef} style={{height: height, width: width}} disabled={this.state.readOnly}
       className='comboboxStyle' value={value} onChange={(e)=>{this.handleChange(e); onChange?.(e);}}>
       {data.map((item, index) => <option key={id+'_'+index} value={item.value}>{item.label}</option> )}
      </select>
    </div>)  
  }
}

export class MyCombobox extends React.Component {  
  // <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="85" width="200" className='selectStyle' style={{marginTop:10}} sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={this.handleSelect.bind(this)} />
  // <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="85" width="200" className='selectStyle' style={{marginTop:10}} sqlprocedure="demo305a" onChange={this.handleSelect.bind(this)} />
  // <MyCombobox id="districtid" ref={ref=>this.districtid=ref} label="所辖市区" labelwidth="85" width="200" className='selectStyle' sqlprocedure="demo305a" style={{marginTop:10}}  />
  //要求items或数据库中数据转成label和value两个列，
  //sqlparams没有参数时写sqlparams={null}或sqlparams={{}}，无params定义时不追星存储过程
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    this.selectRef = React.createRef(); 
    let attr = {...props} ;   
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中。这段程序只执行一次
    let {id, type, label, labelwidth, top, left, height, width, value} = attr;
    if (!height || height == 0) height = 30;
    if (!width || width == 0)  width = 200;
    if (!labelwidth || labelwidth == 0) labelwidth = 80;
    if (!value) value = '';
    if (!attr.readOnly && !attr.readonly) attr.readOnly = false;
    if (top && left && !isNaN(top) && !isNaN(left)){
      if (!attr.style) attr.style={};
      attr.style.position='absolute';
      attr.style.top = parseInt(top);
      attr.style.left = parseInt(left);
    }
    console.log(119,value,attr.items);
    if ((value && value =='') && attr.items?.length>0) value = attr.items[0].value;
    attr.value = value;
    attr.width = parseInt(width);
    attr.height = parseInt(height);
    attr.labelwidth = parseInt(labelwidth);    
    attr.classtype = 'combobox';     
    this.state = {
      attr: attr,    
      id: attr.id,
      data: attr.data,
      //不单独设置属性，在父类组件setstate时无法渲染这个组件
      readOnly: attr.readOnly,
      value: attr.value,
      items: attr.items,
      classtype: attr.classtype,
      sqlprocedure: attr.sqlprocedure,
      sqlparams: attr.sqlparams
    }
  };

  async componentDidMount(){ //页面启动渲染之后会执行
    //适用于静态下拉框，不从数据库中提取选项数据
    let rs = this.setInitValue();
    this.setState({items:rs.data, value:rs.value})
  }

  loadData = async(sqlprocedure, sqlparams) => {
    if (sqlparams === undefined || sqlparams === null) sqlparams={};
    let p = {... sqlparams};
    p.sqlprocedure = sqlprocedure;
    //console.log(218, this.state.id, sqlprocedure, sqlparams)
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    let {value, attr} = this.state;
    //let value = '';
    //console.log('load:', this.state.attr.id, rs.rows[0], this.state.value)
    if (rs?.rows && rs.rows.length>0){
      if (!value || value ==='') value = rs.rows[0].value; //[attr.id];
      this.setState({items: rs.rows, value});
    }
    //return rs.rows;
  }

  handleChange = (e) => {  //输入时触发，赋值时不触发
    let value = e.target.value;
    //console.log(444,e.target.id,value);
    if (value === '' && this.state.items.length>0){
      value = this.state.items[0].value;
    }
    this.setState({value: e.target.value});
  }

  setInitValue = () =>{
    let { id, type, height, width, label, labelwidth, onChange, style} = this.state.attr;
    let { sqlprocedure, sqlparams, value, items, attr} = this.state;
    let data;
    //console.log(217, id, sqlprocedure, sqlparams, items, id)
    if ((items === undefined || items === null) && sqlprocedure !== undefined && sqlparams !== undefined){
      this.loadData(sqlprocedure, sqlparams);
    }else if (typeof items === 'string'){
      let array = items.split(';');
      data = array.map((item)=>({"label":item, "value":item}));
    }else if (myIsArray(items)){
      data = items;
    }
    if (!myIsArray(data)) data=[];
    //console.log(219,id, data, value)
    if ((value === undefined || value==='') && data.length>0){
      value = data[0].value;
      //console.log(220,id, data, value)
      //this.triggerChange(value)
    }else if (value!=='' && data?.length>0){
      //如果选项的value值找不到，文本默认取第一个选项的值，但value值为空，所以要处理给它赋值
      let index = data.findIndex((item)=>item.value == value);
      if (index < 0) value = data[0].value;
    }
    return {data, value}
  }

  componentDidUpdate(prevProps, prevState) {
    //if (this.state.id=='cityid') console.log(999,prevState.value, this.state.value, prevState.items, this.state.items)
    if (prevState.value !== this.state.value || prevState.items !== this.state.items) {
      let rs = this.setInitValue();
      if (prevState.value !== rs.value || prevState.data !== rs.data) {
        this.setState({ items: rs.data, value: rs.value });
      }
    }
  }
  
  triggerChange = (newValue) => {
    if (!this.selectRef) return;
    // this.selectRef.current.value = newValue; // 更新下拉框的值
    // const event = new Event('change', { bubbles: true });
    // this.selectRef.current.dispatchEvent(event); // 分发事件
    // const event = new Event('change', { bubbles: true }); // 创建一个模拟的事件对象
    // const selectElement = document.getElementById(this.state.attr.id); // 获取下拉框元素
    // selectElement.value = newValue;
    // selectElement.dispatchEvent(event);
    //console.log(999,this.categoryid, newValue);
  };  

  render(){
    let { id, type, height, width, label, labelwidth, onChange, data, style} = this.state.attr;
    let { sqlprocedure, sqlparams, value, items, attr} = this.state;
    //console.log(221,id,sqlprocedure,sqlparams,items,attr.items)
    let rs = this.setInitValue();
    data = rs.data;
    value = rs.value;
    attr.value =value;
    //console.log(223,id, data, value, this.state.value, data)
    return (<div key={id+'_div'} id={id+'_div'} style={style}>
      <label key={id+'_label'} id={id+'_label'} style={{display: 'inline-block', width:labelwidth}} className='labelStyle' htmlFor={id}>{label}：</label>
      <select {...this.state.attr} key={id} id={id} ref={this.selectRef} style={{height: height, width: width}} disabled={this.state.readOnly}
       className='comboboxStyle' value={value} onChange={(e)=>{this.handleChange(e); onChange?.(e);}}>
       {data.map((item, index) => <option key={id+'_'+index} value={item.value}>{item.label}</option> )}
      </select>
    </div>)  
  }
}

export class MyRadiogroup extends React.Component {  
  //<MyRadiogroup id="gender" ref={ref=>this.gender=ref} label="性别" labelwidth="80" width="20" items="男;女;妖" style={{marginTop:10}} />
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    let attr = {...props}
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中
    let {id, type, label, labelwidth, top, left, height, width, value} = attr;
    if (height === undefined || height == 0) height = 28;
    if (width === undefined || isNaN(width) || width < 0)  width = 20;
    if (labelwidth === undefined || isNaN(labelwidth) || labelwidth < 0) labelwidth = 80;
    if (value === undefined) value = '';
    if (attr.readOnly === undefined && attr.readonly === undefined) attr.readOnly = false;
    if (top !== undefined && left !== undefined && !isNaN(top) && !isNaN(left)){
      if (attr.style===undefined) attr.style={};
      attr.style.position='absolute';
      attr.style.top = parseInt(top);
      attr.style.left = parseInt(left);
    }
    attr.value = value;
    attr.width = parseInt(width);
    attr.height = parseInt(height);
    attr.labelwidth = parseInt(labelwidth);
    attr.classtype = 'radio'; 
    this.state = {
      attr: attr,
      value: attr.value,
      classtype: attr.classtype,
      readOnly: attr.readOnly,
    }
  };
  render(){
    let {id, type, height, width, value, label, labelwidth, items, onChange, style} = this.state.attr;
    let data = items.split(';');
    return (
    <div {...this.props} key={id+'_div'} id={id+'_div'} style={style} >
      <label key={id+'_label'} id={id+'_label'} style={{display: 'inline-block', width:labelwidth}} className='labelStyle' htmlFor={id}>{label}：</label>
      {data.map((item, index)=>(  //男 女 妖
       <label key={id+'_labelx'+index} style={{marginRight: width, display: 'inline-block'}}>
         <input type="radio" id={id+'_'+index} key={id+'_'+index} name={id} value={item} disabled={this.state.readOnly}
          checked={this.state.value === item}  //this.state.value女
          onChange={(e)=>{this.setState({value: e.target.value});}}
         />
         {item}
       </label>))}
    </div>)
  }
}

export class MyCheckbox extends React.Component {  
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    let attr = {...props}
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中
    let {id, label, labelwidth, top, left, height, width, value} = attr;
    if (height === undefined || height == 0) height = 28;
    if (width === undefined || isNaN(width) || width < 0)  width = 20;
    if (labelwidth === undefined || isNaN(labelwidth) || labelwidth < 0) labelwidth = 80;
    if (value === undefined) value = '';
    if (attr.readOnly === undefined && attr.readonly === undefined) attr.readOnly = false;
    if (top !== undefined && left !== undefined && !isNaN(top) && !isNaN(left)){
      if (attr.style===undefined) attr.style={};
      attr.style.position='absolute';
      attr.style.top = parseInt(top);
      attr.style.left = parseInt(left);
    }
    attr.value = value;
    attr.width = parseInt(width);
    attr.height = parseInt(height);
    attr.labelwidth = parseInt(labelwidth);
    attr.classtype = 'checkbox'; 
    this.state = {
      attr: attr,
      value: attr.value,
      classtype: attr.classtype,
      readOnly: attr.readOnly,
    }
  };
  render(){
    let {id, height, width, value, label, labelwidth, items, onChange, style} = this.state.attr;
    let data = items.split(';');  
    /* <MyCheckbox id="hobby" ref={ref=>this.hobby=ref} label= "个人兴趣" labelwidth="80" width="20" 
    items="下棋;钓鱼;书法;唱歌;编程;舞蹈" style={{marginTop:10}} />
    */
   //data= ['下棋','钓鱼','书法','唱歌','编程','舞蹈']
   //value=['下棋','唱歌','编程','舞蹈']  //初值
    return (
      <div {...this.props} key={id+'_div'} id={id+'_div'} style={style} >
      <label key={id+'_label'} id={id+'_label'} style={{display: 'inline-block', width:labelwidth}} className='labelStyle' htmlFor={id}>{label}：</label>
      {data.map((item, index)=>(
        <label key={id+'_x'+index} htmlFor={id+'_'+index} style={{marginRight: width, display: 'inline-block'}}>
          <input key={id+'_'+index} id={id+'_'+index} name={id} type="checkbox" value={item} disabled={this.state.readOnly}
          checked={this.state.value?.includes(item)} {...this.attr}
          onChange={(e)=>{
            let data=[...this.state.value];
            if (typeof data==='string') data = eval(data);
            var index = data.indexOf(e.target.value);
            if (e.target.checked){ //选中时
              if (index === -1) data.push(e.target.value); //原来不存在时添加元素
            }else{
              if (index !== -1) data.splice(index, 1); //不选中时删除元素
            }
            console.log(data)
            this.setState({value: data});
          }}
          />
          {item}
        </label>
      ))}
  </div>)
  }
}

//创建一个modal窗体弹出框
//可能还要安装依赖包才行  npm install --save-dev css-loader
export class MyModal extends Component {
  constructor(props) {
    super(props);
    let attr = {...props}
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中
    let {id, height, width, open} = attr;
    if (!height || isNaN(height) || height == 0) height = 140;
    if (!width || isNaN(width) || width < 0)  width = 400;
    attr.width = parseInt(width);
    attr.height = parseInt(height);
    if (!attr.okText && !attr.oktext) attr.okText = '确定';
    if (!attr.cancelText && !attr.canceltext) attr.cancelText = '取消';
    if (!attr.title) attr.title = '系统提示';
    if (!attr.message) attr.message = '系统提示';
    if (!open) attr.open = false;
    attr.classtype = 'modal';
    this.state = {...
       attr,
       //open: attr.open
    }
  }
  componentDidUpdate =(prevProps,prevState) => {
   if (this.props.open !== prevState.open) {
     console.log(32131,prevState.open)
     this.setState({
       open: this.props.open
     });
   }
 }
  closeModal = () => {
   this.setState({open:false})
  }
   render() {
     let {children, width, height, title, message, onConfirm, okText, cancelText} = this.state;
     return (
       <div>
         <div className={modalStyle.background} style={{display:this.state.open?'block' : 'none'}} onClick={()=>this.closeModal()}></div>
         <div className={modalStyle.Modal} style={{display:this.state.open?'block' : 'none',width:width,height:height}}>
           <div className={modalStyle.ModalHeader}>
             <h3>{title}</h3>
             <span onClick={() => this.closeModal()}><svg t="1693827544488"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1471" width="12" height="12"><path d="M1022.583467 127.803733 894.779733 0 511.291733 383.4624 127.8464 0 0 127.803733 383.496533 511.274667 0 894.737067 127.8464 1022.5408 511.291733 639.0784 894.779733 1022.5408 1022.583467 894.737067 639.138133 511.274667Z" fill="#707070" p-id="1472"></path></svg></span>
           </div>
           <div className={modalStyle.ModalContent} >
              {message}
              {children}
           </div>
           <div className={modalStyle.ModalFooter}>
             <button onClick={()=>{onConfirm();this.setState({open:false})}}>确定</button>
             <button onClick={()=>this.closeModal()}>取消</button>
           </div>
         </div>
       </div>
   );
 }
}
