export default function updateTextNode(vnode, oldVnode) {
  if (vnode.parent.type !== oldVnode.parent.type) {
    vnode.parent.stateNode.appendChild(
      document.createTextNode(vnode.props.textContent)
    );
  } else if (vnode.props.textContent !== oldVnode.props.textContent) {
    vnode.parent.stateNode.replaceChild(
      document.createTextNode(vnode.props.textContent),
      oldVnode.stateNode
    );
  }
}
