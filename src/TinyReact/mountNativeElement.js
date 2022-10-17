import createDOMElement from "./createDOMElement";

export default function mountNativeElement(vnode, container) {
  if (!vnode || !container) {
    return null;
  }
  const element = createDOMElement(vnode);
  container.appendChild(element);
}
