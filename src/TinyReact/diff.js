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
    // 首次渲染 or 新元素多
    mountElement(vnode, container);
  } else if (oldVnode.type !== vnode.type && !isFunction(vnode.type)) {
    // 新旧节点类型不同，且为普通节点
    const newElement = createDOMElement(vnode);
    oldEle.parentNode.replaceChild(newElement, oldEle);
  } else if (isFunction(vnode.type)) {
    // 组件节点更新
    diffComponent(vnode, oldVnode.component, oldEle, container);
  } else if (oldVnode.type === vnode.type) {
    // 新旧节点相同
    if (vnode.type === "text") {
      // 都为文本节点
      updateTextNode(vnode, oldVnode, oldEle);
    } else {
      // 都为元素节点
      updateNodeElement(oldEle, vnode, oldVnode);
    }
    const oldChildNodes = oldEle.childNodes;
    const newChildren = vnode.children;
    // 构造 keyedElements
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
      // 根据 key 更新
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
        // 无 key， 删除多余元素
        for (
          let i = oldChildNodes.length - 1;
          i > newChildren.length - 1;
          i--
        ) {
          oldEle.removeChild(oldChildNodes[i]);
        }
      } else {
        // 有 key，遍历旧节点没有使用到的旧节点删掉
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
