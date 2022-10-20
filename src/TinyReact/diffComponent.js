import mountElement from "./mountElement";
import unMountNode from "./unMountNode";
import updateComponent from "./updateComponent";

export default function diffComponent(vnode, component, oldEle, container) {
  if (!isSameComponent(vnode, component)) {
    // 不同的组件更新
    unMountNode(oldEle);
    mountElement(vnode, container);
  } else {
    // 相同的组件更新
    updateComponent(vnode, component, oldEle, container);
  }
}

function isSameComponent(vnode, component) {
  return (
    component &&
    (vnode.type === component.constructor || vnode.type === component)
  );
}
