import mountElement from "./mountElement";
import updateComponent from "./updateComponent";

export default function diffComponent(vnode, component, oldEle, container) {
  if (!isSameComponent(vnode, component)) {
    container.removeChild(oldEle);
    mountElement(vnode, container);
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
