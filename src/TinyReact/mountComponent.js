import isFunctionComponent from "./isFunctionComponent";
import mountElement from "./mountElement";

export default function mountComponent(vnode, container) {
  let nextVNode;
  // 判断类组件 or 函数组件
  if (isFunctionComponent(vnode)) {
    nextVNode = buildFunctionComponent(vnode);
  } else {
    nextVNode = buildClassComponent(vnode);
  }
  mountElement(nextVNode, container);
}

function buildFunctionComponent(vnode) {
  return vnode.type(vnode.props || {});
}

function buildClassComponent(vnode) {
  return new vnode.type(vnode.props || {}).render();
}
