import diff from "./diff";

export default function render(vnode, container, oldVnode) {
  diff(vnode, container, oldVnode);
}
