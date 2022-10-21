import Component from "../../Component";

export default function getTag(vnode) {
  if (typeof vnode.type === "string") {
    return "hostComponent";
  } else if (Object.getPrototypeOf(vnode.type) === Component) {
    return "classComponent";
  } else {
    return "functionComponent";
  }
}
