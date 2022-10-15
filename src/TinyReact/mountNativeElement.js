import createDOMElement from "./createDOMElement";
import mountElement from "./mountElement";

export default function mountNativeElement(vnode, container) {
  if (!vnode || !container) {
    return null;
  }
  const element = createDOMElement(vnode);
  vnode.children.forEach((child) => {
    mountElement(child, element);
  });
  container.appendChild(element);
}
