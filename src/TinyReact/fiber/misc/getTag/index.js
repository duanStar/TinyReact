export default function getTag(vnode) {
  if (typeof vnode.type === "string") {
    return "hostComponent";
  }
}
