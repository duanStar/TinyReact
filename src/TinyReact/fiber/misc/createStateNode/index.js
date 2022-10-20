import { createDOMElement } from "../../DOM";

export default function createStateNode(fiber) {
  if (fiber.tag === "hostComponent") {
    return createDOMElement(fiber);
  }
}
