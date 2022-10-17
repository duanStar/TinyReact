import mountNativeElement from "./mountNativeElement";
import isFunction from "./isFunction";
import mountComponent from "./mountComponent";

export default function mountElement(vnode, container, oldEle) {
  // 判断组件 or 原生元素
  if (isFunction(vnode.type)) {
    mountComponent(vnode, container, oldEle);
  } else mountNativeElement(vnode, container, oldEle);
}
