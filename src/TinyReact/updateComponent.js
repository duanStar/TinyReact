import diff from "./diff";
import isFunctionComponent from "./isFunctionComponent";

export default function updateComponent(vnode, component, oldEle, container) {
  if (!isFunctionComponent(vnode)) {
    component.componentWillReceiveProps(vnode.props);
    if (!component.shouldComponentUpdate(vnode.props)) {
      return;
    }
    let prevProps = component.props;
    component.componentWillUpdate(vnode.props);
    component.updateProps(vnode.props || {});
    const nextVNode = component.render();
    nextVNode.component = component;
    diff(nextVNode, container, oldEle);
    component.componentDidUpdate(prevProps);
  } else {
    const nextVNode = vnode.type(vnode.props || {});
    nextVNode.component = component;
    diff(nextVNode, container, oldEle);
  }
}
