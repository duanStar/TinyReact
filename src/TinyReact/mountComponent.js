import isFunctionComponent from "./isFunctionComponent";
import mountElement from "./mountElement";
import isFunction from "./isFunction";

export default function mountComponent(vnode, container, oldEle) {
  let nextVNode, component;
  // 判断类组件 or 函数组件
  if (isFunctionComponent(vnode)) {
    nextVNode = buildFunctionComponent(vnode);
  } else {
    nextVNode = buildClassComponent(vnode);
    component = nextVNode.component;
  }
  mountElement(nextVNode, container, oldEle);
  if (component) {
    component.componentDidMount();
    if (vnode.props?.ref) {
      isFunction(vnode.props.ref)
        ? vnode.props.ref(component)
        : (vnode.props.ref.current = component);
    }
  }
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
