import mountElement from "./mountElement";
import updateComponent from "./updateComponent";

export default function diffComponent(vnode, component, oldEle, container) {
  if (!isSameComponent(vnode, component)) {
    mountElement(vnode, container, oldEle);
  } else {
    updateComponent(vnode, component, oldEle, container);
  }
}

function isSameComponent(vnode, component) {
  return (
    component &&
    (vnode.type === component.constructor || vnode.type === component)
  );
}
