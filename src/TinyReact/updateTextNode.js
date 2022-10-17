export default function updateTextNode(vnode, oldVnode, ele) {
  if (vnode.props.textContent !== oldVnode.props.textContent) {
    ele.textContent = vnode.props?.textContent;
    ele._vnode = vnode;
  }
}
