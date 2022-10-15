import isFunction from "./isFunction";

export default function isFunctionComponent(vnode) {
  const type = vnode.type;
  return type && isFunction(type) && !(type.prototype && type.prototype.render);
}
