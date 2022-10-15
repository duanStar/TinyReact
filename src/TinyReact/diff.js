import mountElement from "./mountElement";

export default function diff(vnode, container, oldVnode) {
  if (!oldVnode) {
    mountElement(vnode, container);
  }
}
