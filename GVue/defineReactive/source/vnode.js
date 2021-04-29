export class Vnode {
  constructor(tag, attrs, value, type) {
    this.tagName = tag && tag.toLowerCase; // 标签名
    this.attrs = attrs; // 标签属性
    this.value = value; // 标签插值
    this.type = type; // 标签类型
    this.children = [];
  }

  addChildren(vnode) {
    this.children.push(vnode);
  }
}

export function getVNode(node) {
  // 将模板转换为带坑的vnode（带插值表达式）

  const nodeType = node.nodeType;
  let _vnode = null;
  if (nodeType === 1) {
    // 元素节点 没有nodeValue属性
    let _attrs = {};
    let attrs = node.attributes;
    /* node.attributes.forEach((attr) => {
      _attrs[attr.nodeName] = attr.nodeValue
    }) */
    for (let i = 0; i < attrs.length; i++) {
      // attrs[ i ] 属性节点 ( nodeType == 2 )
      _attrs[attrs[i].nodeName] = attrs[i].nodeValue;
    }
    _vnode = new Vnode(node.nodeName, _attrs, undefined, nodeType);

    // 子元素

    node.childNodes.forEach((child) => {
      _vnode.addChildren(getVNode(child));
    });
  } else if (nodeType === 3) {
    // 文本节点
    _vnode = new Vnode(undefined, undefined, node.nodeValue, nodeType);
    return _vnode;
  }

  return _vnode;
}

export function parseVnode(vnode) {
  // 虚拟dom转换为真实dom
  let type = vnode.type;
  let _node = null;
  if (type === 1) {
    _node = document.createElement(vnode.tagtagName);
    Object.keys(vnode.attrs).forEach((attr) => {
      _node.setAttribute(attr, vnode.attrs[attr]);
    });
    // 子元素
    vnode.children.forEach((subVnode) => {
      _node.appendChild(parseVnode(subVnode));
    });
  } else if (type === 3) {
    return document.createTextNode(vnode.value); // 文本节点的其他属性?
  }

  return _node;
}
