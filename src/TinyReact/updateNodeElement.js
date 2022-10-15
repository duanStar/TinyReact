import updateAttributes from "./updateAttributes";

export default function updateNodeElement(element, vnode) {
  if (!vnode.props) {
    return;
  }
  const props = vnode.props;
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      updateAttributes(element, key, props[key]);
    }
  });
}
