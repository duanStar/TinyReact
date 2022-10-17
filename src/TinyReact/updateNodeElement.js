import updateAttributes from "./updateAttributes";

export default function updateNodeElement(element, vnode, oldVnode) {
  if (!vnode.props) {
    return;
  }
  const props = vnode.props || {};
  const oldProps = (oldVnode && oldVnode.props) || {};
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      updateAttributes(element, key, props[key], oldProps[key]);
    }
  });
  Object.keys(oldProps).forEach((key) => {
    if (key !== "children") {
      const value = props[key];
      if (!value) {
        updateAttributes(element, key, value, oldProps[key], true);
      }
    }
  });
  oldVnode && (element._vnode = vnode);
}
