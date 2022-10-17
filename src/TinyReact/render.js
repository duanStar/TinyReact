import diff from "./diff";

export default function render(
  vnode,
  container,
  oldEle = container.firstChild
) {
  diff(vnode, container, oldEle);
}
