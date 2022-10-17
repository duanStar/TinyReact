import createDOMElement from "./createDOMElement";
import isFunction from "./isFunction";
import mountElement from "./mountElement";
import mountNativeElement from "./mountNativeElement";
import updateNodeElement from "./updateNodeElement";
import updateTextNode from "./updateTextNode";

export default function diff(vnode, container, oldEle) {
  const oldVnode = oldEle && oldEle._vnode;
  if (!oldVnode) {
    mountElement(vnode, container);
  } else if (oldVnode.type === vnode.type) {
    if (vnode.type === "text") {
      updateTextNode(vnode, oldVnode, oldEle);
    } else {
      updateNodeElement(oldEle, vnode, oldVnode);
    }
    vnode.children?.forEach((child, index) => {
      diff(child, oldEle, oldEle.childNodes[index]);
    });
    const oldChildNodes = oldEle.childNodes;
    const newChildren = vnode.children;
    for (let i = oldChildNodes.length - 1; i > newChildren.length - 1; i--) {
      oldEle.removeChild(oldChildNodes[i]);
    }
  } else if (!isFunction(vnode)) {
    const newElement = createDOMElement(vnode);
    oldEle.parentNode.replaceChild(newElement, oldEle);
  }
}
