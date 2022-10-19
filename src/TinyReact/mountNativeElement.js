import createDOMElement from "./createDOMElement";
import isFunction from "./isFunction";

export default function mountNativeElement(vnode, container, oldEle) {
  if (!vnode || !container) {
    return null;
  }
  const element = createDOMElement(vnode);
  if (vnode.component && vnode.component.setDOM) {
    vnode.component.setDOM(element);
  }
  if (vnode.props.ref) {
    isFunction(vnode.props.ref)
      ? vnode.props.ref(element)
      : (vnode.props.ref.current = element);
  }
  if (oldEle) {
    container.insertBefore(element, oldEle);
  } else {
    container.appendChild(element);
  }
}
