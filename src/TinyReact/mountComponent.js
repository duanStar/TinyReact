import isFunctionComponent from "./isFunctionComponent";
import mountElement from "./mountElement";

export default function mountComponent(vnode, container, oldEle) {
  let nextVNode;
  // 判断类组件 or 函数组件
  if (isFunctionComponent(vnode)) {
    nextVNode = buildFunctionComponent(vnode);
  } else {
    nextVNode = buildClassComponent(vnode);
  }
  mountElement(nextVNode, container, oldEle);
}

export function buildFunctionComponent(vnode) {
  const nextVNode = vnode.type(vnode.props || {});
  nextVNode.component = vnode.type;
  return nextVNode;
}

export function buildClassComponent(vnode) {
  const component = new vnode.type(vnode.props || {});
  const nextVNode = component.render();
  nextVNode.component = component;
  return nextVNode;
}
