import createDOMElement from "./createDOMElement";

export default function mountNativeElement(vnode, container, oldEle) {
  if (!vnode || !container) {
    return null;
  }
  const element = createDOMElement(vnode);
  if (vnode.component && vnode.component.setDOM) {
    vnode.component.setDOM(element);
  }
  if (oldEle) {
    container.removeChild(oldEle);
  }
  container.appendChild(element);
}
