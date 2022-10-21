import { createDOMElement } from "../../DOM";
import { createReactInstance } from "../../misc";

export default function createStateNode(fiber) {
  if (fiber.tag === "hostComponent") {
    return createDOMElement(fiber);
  } else {
    return createReactInstance(fiber);
  }
}
