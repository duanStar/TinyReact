import isFunction from "./isFunction";

export default function unMountNode(element) {
  const vnode = element._vnode;
  if (vnode.type === "text") {
    vnode.remove();
    return;
  }
  const component = vnode.component;
  if (!isFunction(component)) {
    component.componentWillUnmount();
    component = null;
  }
  if (vnode.props && vnode.props.ref) {
    isFunction(vnode.props.ref)
      ? vnode.props.ref(null)
      : (vnode.props.ref.current = null);
  }
  for (let key in vnode.props) {
    if (key.startsWith("on")) {
      const eventName = key.substring(2).toLowerCase();
      const eventHandler = vnode.props[key];
      element.removeEventListener(eventName, eventHandler);
    }
  }
  if (element.childNodes.length > 0) {
    element.childNodes.forEach((child) => {
      unMountNode(child);
    });
  }
  element.remove();
}
