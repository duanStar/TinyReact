export default function createElement(type, props, ...children) {
  const childElements = [].concat(...children).reduce((children, child) => {
    if (child !== false && child !== true && child != null) {
      if (typeof child === "object") {
        children.push(child);
      } else {
        children.push(createElement("text", { textContent: child }));
      }
    }
    return children;
  }, []);
  return {
    type,
    props: Object.assign({ children: childElements }, props),
    children: childElements,
  };
}
