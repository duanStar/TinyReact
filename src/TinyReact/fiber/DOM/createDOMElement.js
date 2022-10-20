import updateNodeElement from "./updateNodeElement";

export default function createDOMElement(vnode) {
  let element = null;
  if (vnode.type === "text") {
    // 文本节点
    element = document.createTextNode(vnode.props?.textContent);
  } else {
    // 元素节点
    element = document.createElement(vnode.type);
    updateNodeElement(element, vnode);
  }
  return element;
}
