export default function updateAttributes(element, key, value) {
  if (key.startsWith("on")) {
    const eventName = key.substring(2).toLowerCase();
    element.addEventListener(eventName, value);
  } else if (key === "value" || key === "checked") {
    element[key] = value;
  } else {
    if (key === "className") {
      element.className = value;
    } else if (key === "htmlFor") {
      element.setAttribute("for", value);
    } else {
      element.setAttribute(key, value);
    }
  }
}
