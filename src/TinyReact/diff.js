import createDOMElement from "./createDOMElement";
import isFunction from "./isFunction";
import mountElement from "./mountElement";
import diffComponent from "./diffComponent";
import updateNodeElement from "./updateNodeElement";
import updateTextNode from "./updateTextNode";
import unMountNode from "./unMountNode";

export default function diff(vnode, container, oldEle) {
  const oldVnode = oldEle && oldEle._vnode;
  if (!oldVnode) {
    mountElement(vnode, container);
  } else if (oldVnode.type !== vnode.type && !isFunction(vnode.type)) {
    const newElement = createDOMElement(vnode);
    oldEle.parentNode.replaceChild(newElement, oldEle);
  } else if (isFunction(vnode.type)) {
    diffComponent(vnode, oldVnode.component, oldEle, container);
  } else if (oldVnode.type === vnode.type) {
    if (vnode.type === "text") {
      updateTextNode(vnode, oldVnode, oldEle);
    } else {
      updateNodeElement(oldEle, vnode, oldVnode);
    }
    const oldChildNodes = oldEle.childNodes;
    const newChildren = vnode.children;
    const keyedElements = {};
    for (let i = 0, len = oldChildNodes.length; i < len; i++) {
      const ele = oldChildNodes[i];
      if (ele.nodeType === 1) {
        const key = ele.getAttribute("key");
        if (key) {
          keyedElements[key] = ele;
        }
      }
    }

    const hasNoKey = Object.keys(keyedElements).length === 0;
    if (hasNoKey) {
      vnode.children?.forEach((child, index) => {
        diff(child, oldEle, oldChildNodes[index]);
      });
    } else {
      newChildren?.forEach((child, index) => {
        const key = child.props.key;
        if (key) {
          const ele = keyedElements[key];
          if (ele) {
            if (oldChildNodes[index] && oldChildNodes[index] !== ele) {
              diff(child, oldEle, ele);
              oldEle.insertBefore(ele, oldChildNodes[index]);
            } else {
              diff(child, oldEle, ele);
            }
          } else {
            mountElement(child, oldEle, oldChildNodes[index]);
          }
        }
      });
    }
    if (oldChildNodes.length > newChildren.length) {
      if (hasNoKey) {
        for (
          let i = oldChildNodes.length - 1;
          i > newChildren.length - 1;
          i--
        ) {
          oldEle.removeChild(oldChildNodes[i]);
        }
      } else {
        for (let i = 0; i < oldChildNodes.length; i++) {
          const oldChild = oldChildNodes[i];
          let oldChildKey = oldChild._vnode.props.key;
          let found = false;
          if (oldChildKey) {
            for (let i = 0; i < newChildren.length; i++) {
              if (oldChildKey === newChildren[i].props.key) {
                found = true;
                break;
              }
            }
            if (!found) {
              unMountNode(oldChild);
            }
          }
        }
      }
    }
  }
}
