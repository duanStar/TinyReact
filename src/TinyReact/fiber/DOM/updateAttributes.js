export default function updateAttributes(
  element,
  key,
  value,
  oldValue,
  isRemove = false
) {
  if (value !== oldValue) {
    if (key.startsWith("on")) {
      if (isRemove) {
        return element.removeEventListener(eventName, oldValue);
      }
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
      if (oldValue) {
        element.removeEventListener(eventName, oldValue);
      }
    } else if (key === "value" || key === "checked") {
      if (isRemove) {
        element[key] = null;
        return;
      }
      element[key] = value;
    } else {
      if (key === "className") {
        if (isRemove) {
          return element.removeAttribute("class");
        }
        element.className = value;
      } else if (key === "htmlFor") {
        if (isRemove) {
          return element.removeAttribute("for");
        }
        element.setAttribute("for", value);
      } else {
        element.setAttribute(key, value);
      }
      if (isRemove) {
        element.removeAttribute(key);
      }
    }
  }
}
