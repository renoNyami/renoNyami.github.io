/*
用于page806, page1102
*/
import ajax from './ajax'
import React, { Component } from 'react';
import { useEffect, useRef, useImperativeHandle } from 'react';
import { Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate } from 'antd'
import { myParseAntFormItemProps, myParseTableColumns, myParseTags, myDoFiles, myLocalTime, reqdoTree, reqdoSQL, myStr2JsonArray, myStr2Json, myDatetoStr } from './functions.js'
import { MyFormComponent } from './antdFormMethod.js'
import { parseParams, parseData, parseSQLParams } from './antdParseProperty.js'
import { AntdInputBox } from './antdClass.js';
import { BlockOutlined, DownOutlined, UpOutlined, FileOutlined, TagOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Tree, Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const sys = { ...React.sys };

export const toTreeData = (data) => {
  //data为空时或data不是json数组时，返回空数据
  if (!data || data.length == 0 || !Array.isArray(data)) return [];
  let result = []; //最后输出的结果
  let map = {};  //
  data.forEach(item => {
    //将每个结点的json对象值以map.A、map.A1、...形式存储。一个id编码指向一个json对象，用于快速找到一个节点的父结点对象。
    //例如;map.A1={englishname: 'Non-alcoholic beverages', categoryname: '非酒精饮料', _sysrowno: '39', id: 'A1', key: "A1", parentnodeid: "A",text: "A1 非酒精饮料"}
    map[item.id] = item;
    if (item.key === undefined) item.key = item.id;
    item.isparentflag = 0;
  });
  //console.log(11,map);
  //console.log(12, data);
  data.forEach(item => {
    let parent = map[item.parentnodeid];  //获取父结点编码所对应的那个结点json对象
    if (parent && parent.id != '') { //如果是一个子结点，则在父结点的children属性的数组中追加一个子结点
      //(parent.children || (parent.children = [])).push(item);
      //这是一个逻辑表达式。检查父元素是否已经有子元素数组。如果parent.children为真（即存在），则使用现有的子元素数组；如果为假（即不存在或为假值），则创建一个空数组并将其赋值给 parent.children。
      //相当于：
      if (!parent.children) parent.children = [];
      parent.isparentflag = 1;
      item.level = parent.level + 1;
      item.ancestor = parent.ancestor + parent.id + '#';
      item.isparentflag = 0;
      parent.children.push(item);
    } else {
      item.level = 1;
      item.ancestor = '';
      result.push(item); //如果没有父节点，则直接追加到result中成为第一层根结点
    }
  });
  return result;
}


export const treeDataSumup = (data, field) => {
  let parents = {};
  if (field == undefined) field = 'amount';
  for (let i = 0; i < data.length; i++) {
    if (data[i].isparentflag > 0) {
      data[i][field] = 0;  //初始化各个父节点的值
      parents[data[i].key] = i;   //记录行号
    }
  }
  for (let i = data.length - 1; i > 0; i--) {
    let s = data[i].parentnodeid;
    if (s !== '') {
      let n = parents[s];   //找到父节点对应的行号
      data[n][field] += parseFloat(data[i][field]);
      //data[n][field] = Math.round(data[n][field], 2);
      //console.log(999, data[i].key, i, s, n, data[i][field], data[n][field])
    }
  }
  return data;
}

export const findTreeNode = (nodes, key, parents = []) => {
  //递归查找一个节点
  for (let node of nodes) {
    if (node.key === key || node.id === key) {
      //处理节点并返回
      node._ancestors = parents;  //添加一个祖先节点属性
      if (parents && parents.length > 0) {  //获取父节点和父节点的子节点
        node._parentnode = parents[parents.length - 1];
        node._children = node._parentnode?.children;
      } else {
        node._parentnode = null;
        node._children = nodes; //兄弟节点为整个数组
      }
      if (node._children) {
        let index = node._children.findIndex(item => item.key == node.key); //找到自己的下标
        node._nextnode = node._children.length > 1 + index ? node._children[index + 1] : null;
        node._priornode = node._children.length > 0 ? node._children[index - 1] : null;
      }
      return node;
    }
    if (node.children && node.children.length > 0) {
      const treeNode = findTreeNode(node.children, key, parents.concat(node));
      if (treeNode) {
        return treeNode;
      }
    }
  }
  return null;
};

//定位到树节点。用在page1102
export const selectTreeNode = (tree1, node, scroll) => {
  if (!scroll) scroll = false;
  let tree = { ...tree1 };
  if (tree1.AntdTree) tree = tree1.AntdTree;
  tree.setState({ selectedKeys: [node.key] }, () => {
    //定位到这个结点，使用原生的js语句
    if (scroll) {
      this.scrollTreeNode();
      //tree1.scrollTo({key: rows[0].id});//没有效果
    }
  });
}

export const expandTreeNode = (tree1, key) => {
  //强制用语句展开结点
  if (tree1.state?.expandedKeys.indexOf(key) < 0) tree1.setExpandedKeys([...tree1.state?.expandedKeys, ...[key]]);
  return;
}

//删除一个antdtree树节点，其他树节点可能不适合，需要验证。用在page1102
export const removeTreeNode = (tree1, node, focus) => {
  if (focus === undefined) focus = false;
  //console.log(889,tree1.state.data);
  let xdata = [...tree1.state.data];
  node = findTreeNode(xdata, node.key);
  let newnode = node._nextnode;
  if (!newnode) newnode = node._priornode;
  if (!newnode) newnode = node._parentnode;
  if (node._parentnode != null) {
    let pnode = findTreeNode(xdata, node._parentnode.key);  //找到与data关联的父节点
    let children = pnode.children;
    //删除节点
    pnode.children = children.filter(item => item.key != node.key);
  } else {
    xdata = xdata.filter(item => item.key != node.key);
  }
  if (focus && newnode) {  //聚焦到新节点
    tree1.setState({ data: xdata, node: newnode }, () => {
      selectTreeNode(tree1, newnode, false);  //选中节点但不滚动光标
    });
  } else {
    tree1.setState({ data: xdata }, () => {
      //只删除节点，聚焦到新节点
    });
  }
  return newnode;
}

export const focusTreeNode = async (tree1, node, flag) => {  //ffffffffffffff
  //给定节点的key，ancestor值，展开这个节点的所有父节点，最后聚焦选中这个节点。
  if (!tree1) return;
  //if (flag === undefined) flag = false;
  let keys;
  if (!tree1.AntdTree) {
    //Tree组件，一次性生成节点
    keys = await focusFullTreeNode(tree1, node, flag);
  } else {
    //antdtree组件，不管是否一次性加载节点
    keys = await tree1.focusTreeNode(node, flag);
  }
  //console.log(9999111,keys);
  return keys;
}

export const focusFullTreeNode = (tree1, node, flag) => {
  //给定节点的key和ancestors节点，一次性加载节点时分层展开节点，最后选中这个节点
  if (!node || !tree1) return null;
  if (flag === undefined) flag = false;
  let keys = [];
  let { treeData } = tree1.state;
  if (!node.ancestor || node.ancestor === '') node = findTreeNode(treeData, node.key);
  if (node) {
    let ancestor = node.ancestor;
    keys = node.ancestor.split('#');
    keys.push(node.key)
    if (keys.length > 0) {
      if (tree1.AntdTree) tree1.AntdTree.setExpandedKeys(keys);
      else tree1.setExpandedKeys(keys);
      //tree.setState({ checkedKeys: keys.concat(key) }); //???
    }
    if (tree1.AntdTree) tree1.AntdTree.setState({ selectedKeys: [node.key] }, () => { if (flag) scrollTreeNode() });
    else tree1.setState({ selectedKeys: [node.key] }, () => { if (flag) scrollTreeNode() });
  }
  return keys;
}

export const scrollTreeNode = () => {  //移动树结点到指定的位置
  setTimeout(() => {  //必须加settimeout
    const selectedNodes = document.getElementsByClassName('ant-tree-treenode-selected');
    if (selectedNodes.length > 0) {
      for (let node of selectedNodes) {  //可能有多个选中节点，例如2个树组件myTree1和myTree2
        node.scrollIntoView();
        //node.scrollIntoView({ behavior: 'smooth', block: 'center' });  //慢慢滚动
      };
    }
  });
}

export const addTreeChildrenData = (data, pnode, children) => {
  //一个父节点替换其所有子节点
  var s = searchTreeNode(data, pnode).path; //找到当前节点的下标
  //console.log(children);
  //console.log('data'+s+'.children = children');
  if (s != '') eval('data' + s + '.children = children');  //获取数组下标，例如data[0].children[1].children[1].children
  return data;
}

export const updateTreeNodeData = (data, node, row) => {
  //替换一个节点的子节点
  var s = searchTreeNode(data, node).path; //找到当前节点的下标
  if (s != '') eval('data' + s + ' = row');  //获取数组下标，例如data[0].children[1].children[1].children
  return data;
}

export const removeTreeNodeData = (data, node) => {
  //替换一个节点的子节点
  var xnode = searchTreeNode(data, node); //找到当前节点的下标
  let s = xnode.path;
  let index = xnode.index;
  if (s != '' && index >= 0) console.log('data' + s + '.splice(index,1)');  //获取数组下标，例如data[0].children[1].children[1].children
  return data;
}

export const searchNodeInRows = (data, key) => {  //antcomponents中使用
  //在线性表中找到这个节点的父节点
  //console.log(12345, data)
  if (!data) return null;
  let index = data.findIndex(item => item.id == key);
  if (index >= 0) {
    return data[index];
  } else {
    return null;
  }
}


//obj传入多层json格式数据,targetId需要插入数据的id, targetChildren插入的数据
export const searchTreeNode = (data, node) => {
  //console.log(111,data);
  //console.log(112,node);
  /*找到这个节点的父节点、上一个节点、下一个节点、当前理解点和在父节点数组中的位置,
  返回在数组中的下标位置,返回各级父节点、兄弟节点、
  */
  let json = {}
  json.nextnode = null;
  json.priornode = null;
  json.currentnode = {};
  json.path = '';
  json.parents = [];
  let parentnode = null;
  let index = -1;  //子节点在父节点中的序号
  let rs = '';
  if (node.ancestor != undefined && node.ancestor != '') {
    var tmp = node.ancestor.split('#');
    var xdata = [...data];
    for (var i = 0; i < tmp.length - 1; i++) {
      index = xdata.findIndex(item => item.id == tmp[i]);
      if (index >= 0) {
        rs += '[' + index + '].children';
        parentnode = xdata[index];
        json.parents.push(parentnode);
        xdata = xdata[index].children;
      } else {
        break;
      }
    }
  }
  if (parentnode != null && parentnode.children != undefined) {
    index = xdata.findIndex(item => item.id == node.id);
    if (index < xdata.length - 1) json.nextnode = xdata[index + 1];
    if (xdata.length > 1 && index > 0) json.priornode = xdata[index - 1];
    if (index >= 0) json.currentnode = xdata[index];
  } else {
    //根节点处理
    index = data.findIndex(item => item.id == node.id);
    if (index < data.length - 1) json.nextnode = data[index + 1];
    if (data.length > 1 && index > 0) json.priornode = data[index - 1];
    if (index >= 0) json.currentnode = data[index];
  }
  json = { ...json, ...json.currentnode };  //将json.currentnode属性赋值、替换到json
  json.parentnode = parentnode;
  json.index = index;
  if (index >= 0) rs += '[' + index + ']';
  json.path = rs;
  return json;
}

export function searchAllTreeNodes(arr) {
  arr.forEach((item) => {
    console.log(item)
    if (item.children?.length > 0) {
      searchAllTreeNodes(item.children);
    }
  })
}

/*
export const useDate = () => {
  const locale = 'en';
  const [today, setDate] = React.useState(new Date()); // Save the current date to be able to trigger an update
  React.useEffect(() => {
      const timer = setInterval(() => { // Creates an interval which will update the current data every minute
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, []);
  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, { month: 'long' })}\n\n`;
  const hour = today.getHours();
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });
  return (
    <div> {time}  </div>
  )
};
*/

//公用函数定义结束，自定义树组件开始

export class AntdCascader1 extends React.Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr = parseParams(props);
    attr = parseData(attr);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      id: attr.id,
      page: attr.page,
      form: attr.form,
      value: '',
      row: [],
      data: attr.data,
      antclass: attr.antclass,
      visible: true,
      editable: attr.editable,
      display: 'block',
    }
  }

  async componentDidMount() {
    let { sqlprocedure, sqlparams, data } = this.state.attr;
    let { page, form, id } = this.state;
    let rows;
    if (sqlprocedure !== '') {
      let p = { ...sqlparams };
      p.sqlprocedure = sqlprocedure;
      let rs = await reqdoSQL(p);
      rows = toTreeData(rs.rows);
    }
    let value = page[form].getFieldValue(id);
    if (form && value === undefined || value === '') //当没有给初值时，从树形数据中获取第一个数据赋值
      page[form].setFieldValue(id, this.findFirst(rows))
    else if (value != '' && !Array.isArray(value) && typeof (value) === 'string')  ////判断是不是已经是数组
      page[form].setFieldValue(id, this.findTreeNode(rows, value))
    this.setState({ data: rows });
  }

  async componentDidUpdate(prevProps, prevState) {  //当父组件的state中的sqlparams变化时，触发
    //prevState 是处理过的state  prevProps 是传过来原来的属性
    let { page, form, id } = this.state;
    if (prevProps.sqlparams !== this.props.sqlparams) {
      let { sqlprocedure, sqlparams } = this.props;
      if (sqlprocedure !== '') {
        let p = { ...sqlparams };
        p.sqlprocedure = sqlprocedure;
        let rs = await reqdoSQL(p);
        let rows = toTreeData(rs.rows);
        if (form) page[form].setFieldValue(id, this.findFirst(rows))
        this.setState({ data: rows });
      }
    }
  }

  /*
  findTreeNode = (data, key, path = []) => { //找一个节点的祖先节点
    for (const node of data) {
      if (node.id == key) {
        path.push(key);
        return path;
      }
      if (node.children) {
        const result = this.findTreeNode(node.children, key, path.concat(node.id)); //必须用concat
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  }
  */

  findFirst = (tree) => {   //，从树形数据中获取第一个数据
    if (!Array.isArray(tree) || tree.length === 0) {
      return [];
    }
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i];
        if (item.children && item.children.length > 0) {
          const childValue = this.findFirst(item.children);
          if (childValue.length > 0) {
            return [item.id, ...childValue];
          }
        } else {
          return [item.id];
        }
      }
    }
    return [];
  }

  handleChange = async (value, row) => {
    if (value && value.length > 0) {
      let lastValue = row[value.length - 1].text;
      this.setState({ value: lastValue, row });
    } else {
      this.setState({ value: '', row });
    }
  };

  render() {
    let { onChange, rules } = this.props;
    let { label, labelwidth, top, left, height, width, style, hidden, textfield, message, labelfield, valuefield } = this.state.attr;
    let { id, value, editable, data, visible } = this.state;
    return (
      <Form.Item name={id} label={label} className='labelStyle'
        style={{ ...style, display: visible ? 'block' : 'none' }} {...this.props}>
        <Cascader
          {...this.props}
          id={id}
          style={{ width: width }}
          options={data}
          fieldNames={{ value: 'id', label: 'text' }}
          onChange={(value, row) => { this.handleChange(value, row); onChange?.(value, row) }}
        />
      </Form.Item>
    );
  }
}

export class AntdCascader extends React.Component {
  //不考虑初值设置，在setformvalue设置初值
  //<AntComboTree params='subcategoryid,类别编码,82,0,14,0,300,cascader,,categoryname' top={16+rowheight*5} ref={ref=>this.subcategoryid=ref} sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} /> 
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'cascader';  //不同控件参数解析不同
    attr = parseParams(attr);
    attr = parseData(attr);
    this.state = {
      attr: attr,
      page: attr.page,
      form: attr.form,
      id: attr.id,
      value: attr.value,
      readOnly: attr.readOnly,
      disabled: attr.disabled,
      antclass: attr.antclass,
      data: [],
      selectedKeys: [],
      targetNode: null,
      display: 'block',
      visible: attr.visible,
    }
  }

  async componentDidMount() {
    let { id, page, form } = this.state;
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      p.style = 'full';
      //let rs = await reqdoTree(p);
      //let data = rs.rows; 
      let rs = await reqdoSQL(p);
      let data = toTreeData(rs.rows);  //转成树型结构
      let { attr } = this.state;
      attr.data = data;
      attr.nodes = rs.rows;
      this.setState({ attr, data }, () => {
        this.setValue(rs.rows); //设置cascader的初值，变成一个数组
      });
    }
  }

  setValue = (data) => {
    let { id, page, form } = this.state;
    if (!page || !page[form]) return;
    let value = page[form].getFieldValue(id);  //initialvalue之后
    //console.log(23451,value,page,page[form])
    if (value && value != '' && !Array.isArray(value) && typeof (value) === 'string') {  //判断是不是已经是数组
      //线性表中查节点
      let node = data.find((item) => item.id === value || item.key == value);  //线性表中找到这个结点
      if (node) {
        let pnodes = node.ancestor.split('#');
        if (pnodes.length > 0) pnodes.pop();
        pnodes.push(value);
        //console.log(23456,pnodes,page,page[form])
        page[form].setFieldValue(id, pnodes);  //重新设置值
      }
      //树形结构递归找节点
      /*
      let node = findTreeNode(data,value);  //找到这个结点
      if (node?.node){
        let pnodes = node.node.ancestor.split('#');
        if (pnodes.length>0) pnodes.pop();
        pnodes.push(value);
        page[form].setFieldValue(id, pnodes);  //重新设置值
      }
      */
    }
  }
  render() {
    let { onChange, rules } = this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, valuefield, textfield, editable, data, message, buttontype, panelheight } = this.state.attr;
    let { readOnly } = this.state;
    //console.log(888,data);
    let htmlstr;
    htmlstr = <Cascader id={id} key={id} ref={ref => this[id] = ref} fieldNames={{ value: valuefield, label: textfield }}
      options={data} style={{ width: width }} disabled={readOnly}
      onChange={(value, row) => { this.setState({ value, row }); onChange?.(value, row) }}
      {...this.props} />
    return (
      <Form.Item label={label} name={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' style={{ position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} rules={[{ required: this.state.attr.required, message: message }]}>
        {htmlstr}
      </Form.Item>
    )
  }
}

//antdTree   tttttttttttttttree
export class AntdTree extends Component {
  constructor(props) {
    super(props);
    let attr = parseParams(props);
    //console.log(11111111, attr.id, attr);
    if (attr.loadstyle === undefined || attr.loadstyle === '') attr.loadstyle = 'full';
    if (attr.loadstyle === 'all') attr.loadstyle = 'full';
    if (attr.loadstyle !== 'expand' && attr.loadstyle !== 'table') attr.loadstyle = 'full';

    if (typeof attr.autoload !== 'boolean') {
      if (!attr.autoload || attr.autoload.toLowerCase() == 'true' || attr.autoload === '1') attr.autoload = true;
      else attr.autoload = false;
    }
    if (typeof attr.autofocus !== 'boolean') {
      if (!attr.autofocus || attr.autofocus.toLowerCase() == 'true' || attr.autofocus === '1') attr.autofocus = true;
      else attr.autofocus = false;
    }

    if (typeof attr.filter !== 'boolean') {
      if (attr.filter && (attr.filter.toLowerCase() === 'true' || attr.filter === '1')) attr.filter = true;
      else attr.filter = false;
    }

    //console.log(112, attr.id,attr.filter, attr.loadstyle,attr.autoload);
    this.state = {
      attr: attr,
      sqlprocedure: attr.sqlprocedure,
      filterprocedure: attr.filterprocedure,
      loadstyle: attr.loadstyle,
      filter: attr.filter,
      data: [],
      node: null,
      filteredData: [],
      filterno: -1,
      root: attr.root,
      autoload: attr.autoload,   //是否自动加载，默认值为true
      autofocus: attr.autofocus, //是否自动聚焦到第一个节点，默认值为true
      expandedKeys: [],
    }
  }

  async componentDidMount() {
    //提取节点
    //console.log(33333, this.state.node,this.state.attr)
    if (this.state.autoload) {
      await this.loadTreeData();
    }
  }

  loadTreeData = async () => {
    //target为null或undefined时自动定位节点，target.key=''时不定位节点
    let p = parseSQLParams(this.state.attr);
    if (p == null) return;
    let { attr, loadstyle, sqlprocedure, root, node, autofocus } = this.state;
    let { afterLoadData, beforeLoadData } = attr;
    beforeLoadData?.();  //加载数据之前执行的事件
    let rows;
    let rs;
    if (loadstyle !== 'table') {
      p.style = loadstyle;
      p.sqlprocedure = sqlprocedure;
      p.parentnodeid = "";
      rs = await reqdoTree(p);
      rows = rs.rows;
      rows.forEach((item) => {
        if (item.isparentflag == 0) item.isLeaf = true;
      });
    } else {
      p.sqlprocedure = sqlprocedure;
      p.parentnodeid = "";
      rs = await reqdoSQL(p);
      rows = rs.rows;
      rows.forEach((item) => {
        if (item.isparentflag == 0) item.isLeaf = true;
      });
      rows = toTreeData(rows);
    }
    let rootnode;
    if (root && root != '') {  //如果不要添加一个根节点，那么把原来的根节点变成它的children
      rootnode = { id: '_root', key: '_root', text: root, level: 0, parentnodeid: '', ancestor: '', isparentflag: 1, isLeaf: false, children: rows };
      rows = [rootnode];
    }
    //console.log(1111199999, p, autofocus, node);
    if (autofocus && !node) node = rows[0]; //初始状态下才设置node
    this.AntdTree?.setExpandedKeys([]);  //收缩所有节点，点击后才展开
    this.setState({ expandedKeys: [], data: rows, node }, () => {
      setTimeout(() => {
        if (autofocus) node = this.focusTreeNode(node, autofocus);
        afterLoadData?.();  //加载数据之后执行的事件
      });
    })
    //没有自动聚焦时node为空值
    return rows;
  }

  expandTreeNode = (key) => {
    //强制用语句展开结点
    if (this.AntdTree.state.expandedKeys.indexOf(key) < 0) this.AntdTree.setExpandedKeys([...this.AntdTree.state.expandedKeys, ...[key]]);
    return;
    //强制用语句展开结点
    // let {expandedKeys} = this.state;
    // if (expandedKeys.indexOf(key) < 0) this.setState({expandedKeys: expandedKeys.concat(key)});
  }


  handleExpand = async (key, e) => {
    this.handleLoadNodes(e.node);
    //if (!e.expanded) return;
  }

  focusTreeNode = async (node, flag) => {  //ffffffffffffff
    //给定节点的key，ancestor值，展开这个节点的所有父节点，最后聚焦选中这个节点。
    if (!node) return;
    if (flag === undefined) flag = false;
    let { data, loadstyle, root } = this.state;
    let setFlag = 0;
    //console.log(1100, node, data)
    let pnode;
    let key = node.key;
    let keys = [];
    if (root != undefined && root != '') keys.push('_root');  //root出现两次
    let ancestor = node.ancestor || '';
    console.log(66661101, node.key, ancestor, root, node)
    node = findTreeNode(data, key);
    if (node && node.ancestor) {  //如果节点存在，直接取祖先节点
      ancestor = node.ancestor.trim();  //一次性加载节点只需要指定key就可以找到ancestor
      ancestor = ancestor.trim();
    }
    //console.log(66661102, key, ancestor, keys, node)
    if (ancestor != '') {
      let tmp = ancestor.split('#');
      if (tmp.length > 0) tmp = tmp.filter((item) => item != '_root' && item != '');
      //keys = keys.concat(ancestor.split('#'));
      keys = keys.concat(tmp);
    }
    keys = keys.concat([key]);
    if (node && loadstyle !== 'expand') {
      this.AntdTree.setExpandedKeys(keys);
      pnode = node;  //选中节点变量一致
    } else {  //展开节点
      console.log(666661003, keys, ancestor, key, node);
      for (let i = 0; i < keys.length; i++) {
        pnode = findTreeNode(data, keys[i]);
        //console.log(666661004, i, keys[i], pnode?.key, pnode);
        if (pnode && loadstyle == 'expand' && pnode?.isparentflag > 0) {
          //console.log(1005, i, keys[i], pnode.key, pnode.key, pnode);
          setFlag = 1;
          //分层加载节点
          //data = await this.loadTreeNodes(data, pnode);  //加载这个节点的
          this.expandTreeNode(pnode.key);
          data = await this.handleLoadNodes(pnode);  //加载这个节点的
        }
      }
    } //for
    //选中节点
    if (pnode) {
      console.log(110005, pnode?.key, setFlag, flag, this.AntdTree.state.selectedKeys, this.AntdTree.state.expandedKeys);
      if (setFlag == 1) {
        this.setState({ data: data }, () => {
          setTimeout(() => {
            console.log(110006, pnode.key, setFlag, flag, this.AntdTree.state.selectedKeys, this.AntdTree.state.expandedKeys);
          });
        });
      } else {
        //this.setState({ node: pnode });
      }
      this.AntdTree.setState({ selectedKeys: [pnode.key] }, () => {
        setTimeout(() => {
          console.log(110007, pnode.key, setFlag, flag, this.AntdTree.state.selectedKeys, this.AntdTree.state.expandedKeys);
          if (flag) scrollTreeNode();  //第一次聚焦节点不滚动光标
        });
      });
    }
    console.log(6666666, setFlag, pnode);
    return pnode;
  }

  loadTreeNodes = async (data, node) => {
    let { sqlprocedure, loadstyle, root } = this.state;
    let p = parseSQLParams(this.state.attr);
    if (p == null) return;
    //节点展开时加载数据时触发
    //console.log(1008, node.children?.length, node.children[0].key, node.children[0].text, node.key)
    //if (node?.children[0].id=='_'+node.id && node?.children[0].text.trim()==''){
    if (node.children && node.children.length > 0 && (!node.children[0].key || node.children[0].key == '_' + node.key) && node.children[0].text.trim() == '') {
      p.style = "expand";
      p.parentnodeid = node.key;
      p.sqlprocedure = sqlprocedure;
      //console.log(1109, JSON.stringify(p))
      let rs = await reqdoTree(p);
      //必须设置叶子节点的isLeaf属性为true
      let rows = rs.rows;
      rows.forEach((item) => {
        if (item.isparentflag == 0) item.isLeaf = true;
      })
      //data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
      let pnode = findTreeNode(data, node.id);
      //console.log(1109, rs.rows)
      if (pnode) {
        //console.log(1110, rs.rows)
        pnode.children = rows; //替换原数组data中的children值
        pnode.isLeaf = false;
      }
    }
    return data;
  }

  handleLoadNodes = async (pnode) => {
    //加载一个父节点的子节点
    let data = [...this.state.data];
    data = await this.loadTreeNodes(data, pnode);
    this.setState({ data: data }, () => {
      //this.AntdTree.setState({selectedKeys: [node.id]});
    });
    return data;
  }

  // handleSelect = (key, e) => {
  //   let { onSelect } = this.props;
  //   console.log(887, e.node);
  //   this.setState({ node: e.node }, (e, key) => { console.log('selectednode=', e.node); onSelect?.(key, e) });   //执行父组件的onselect事件
  // }

  handleDoubleClick = (e, node) => {
    //双节结点时选中这个结点，注意需要使用数组
    //this.AntdTree.setState({ selectedKeys: [node.id] }, () => scrollTreeNode());
    this.AntdTree.setState({ selectedKeys: [node.id] });  //双击结点时不需要滚动光标
  }

  handleSearchFilter = async () => {
    let { filterno, filterprocedure } = this.state;
    filterno = 0;
    let p = {};
    p.filter = this.filtertext.state.value;
    p.sqlprocedure = filterprocedure;
    let rs = await reqdoSQL(p);  //提取全部的满足条件的记录
    this.setState({ filteredData: rs.rows, filterno }, () => this.locateNode());
  }

  locateNode = async () => {
    let { filterno, filteredData } = this.state;
    let data = [...this.state.data];  //不能放到上面解构
    if (filteredData.length > 0) {
      if (filterno >= filteredData.length) filterno = filteredData.length - 1;
      if (filterno < 0) filterno = 0;
      let row = filteredData[filterno];
      //找到各层父节点，展开父节点
      if (row.ancestor.trim() != '') {
        let array = row.ancestor.split('#');
        for (let i = 0; i < array.length - 1; i++) {
          let node = findTreeNode(data, array[i]);
          data = await this.loadTreeNodes(data, node);
          this.expandTreeNode(node.id);
        } //for
      }
      this.setState({ data: data, filterno }, () => {
        setTimeout(() => {
          this.AntdTree.setState({ selectedKeys: [row.id] }, () => {
            // if (document.getElementsByClassName('ant-tree-treenode-selected').length > 0) {
            //   document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
            // }
            scrollTreeNode();
            //this.AntdTree.scrollTo({key: rs.rows[0].id});  //没有效果                    
          });//选中结点    
        })
      });
    }
  }

  handleMoveClick = async (id) => {
    let { filterno, data, filteredData } = this.state;
    if (id == 'movedown') filterno++;
    else if (id == 'moveup' && filterno > 0) filterno--;
    this.setState({ filterno }, () => this.locateNode());
  }

  render() {
    let { width, onSelectNode, onSelect } = this.state.attr;
    let { loadstyle, filter } = this.state;
    //console.log(666,filter);
    return (
      <Layout style={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
        {filter && <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='treefilterbar'>
            <AntdInputBox id='filtertext' ref={ref => this.filtertext = ref} top='2' left='6' width={width - 80} type='search' onSearch={this.handleSearchFilter.bind(this)} />
            <Button type='link' id='moveup' style={{ position: 'absolute', top: 1, right: 30, width: 20 }} onClick={(e) => this.handleMoveClick('moveup')}>{<UpOutlined />}</Button>
            <Button type='link' id='movedown' style={{ position: 'absolute', top: 1, right: 6, width: 20 }} onClick={(e) => this.handleMoveClick('movedown')}>{<DownOutlined />}</Button>
          </Form>
        </Header>}
        <Content style={{ overflow: 'auto', position: 'relative', height: '100%' }}>
          <Tree ref={ref => this.AntdTree = ref} {...this.props} treeData={this.state.data}
            style={{ margin: 0, paddingTop: 4, overflow: 'hidden', width: width, position: 'relative' }}
            fieldNames={{ title: 'text', key: 'id' }} showLine={true} checkable={false}
            blockNode={this.props.blockNode === undefined ? true : this.props.blockNode}
            className='textdiv'  //两边都要加，render中也要加写
            showIcon={true}
            //expandedKeys={this.state.expandedKeys}
            //switcherIcon={<DownOutlined /> }
            //autoExpandParent virtual             
            expandAction="doubleClick"
            //onSelect={this.handleSelect.bind(this)} 
            onSelect={(key, e) => { this.setState({ node: e.node }, () => onSelectNode?.(key, e)) }} //换个事件名称，不用onSelect,否则这里事件就被跳过
            onDoubleClick={this.handleDoubleClick.bind(this)}
            onExpand={this.handleExpand.bind(this)}
            loadData={loadstyle === 'full' ? undefined : this.handleLoadNodes.bind(this)}
            titleRender={(node) => {
              return (<span style={{ marginLeft: 4 }} className='textdiv'>{node.text}</span>)
              //   //   let html
              //   //   if (node.isLeaf) html=<span style={{marginLeft:8}}><FileOutlined style={{marginRight:2}} />{node.text}</span>
              //   //   else html=<span style={{marginLeft:8}}><BlockOutlined style={{marginRight:2}} />{node.text}</span>                  
              //   //   return(html)
            }}
          >
          </Tree>
        </Content>
      </Layout>
    )
  }
}
