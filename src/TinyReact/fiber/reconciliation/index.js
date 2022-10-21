import { updateNodeElement, updateTextNode } from "../DOM";
import { createTaskQueue, createStateNode, getTag } from "../misc";

const taskQueue = createTaskQueue();
let subTask = null;
let pendingCommit = null;

const commitAllWork = (fiber) => {
  fiber.effects.forEach((item) => {
    if (item.effectTag === "placement") {
      const fiber = item;
      let parentFiber = item.parent;
      // 组件节点不能直接添加到DOM上，寻找普通节点的父级
      while (
        parentFiber.tag === "classComponent" ||
        parentFiber.tag === "functionComponent"
      ) {
        parentFiber = parentFiber.parent;
      }
      if (fiber.tag === "hostComponent") {
        parentFiber.stateNode.appendChild(fiber.stateNode);
      }
    } else if (item.effectTag === "update") {
      if (item.type === item.alternate.type) {
        if (item.type === "text") {
          updateTextNode(item, item.alternate);
        } else {
          updateNodeElement(item.stateNode, item, item.alternate);
        }
      } else {
        let parentFiber = item.parent;
        // 组件节点不能直接添加到DOM上，寻找普通节点的父级
        while (
          parentFiber.tag === "classComponent" ||
          parentFiber.tag === "functionComponent"
        ) {
          parentFiber = parentFiber.parent;
        }
        if (parentFiber.stateNode.contains(item.alternate.stateNode)) {
          parentFiber.stateNode.replaceChild(
            item.stateNode,
            item.alternate.stateNode
          );
        } else {
          parentFiber.stateNode.appendChild(item.stateNode);
        }
      }
    } else if (item.effectTag === "delete") {
      let parentFiber = item.parent;
      // 组件节点不能直接添加到DOM上，寻找普通节点的父级
      while (
        parentFiber.tag === "classComponent" ||
        parentFiber.tag === "functionComponent"
      ) {
        parentFiber = parentFiber.parent;
      }
      if (fiber.tag === "hostComponent") {
        parentFiber.stateNode.removeChild(fiber.stateNode);
      }
    }
  });
  // 备份旧的fiber节点
  fiber.stateNode.__rootFiberContainer = fiber;
  pendingCommit = null;
};

const getFirstTask = () => {
  const task = taskQueue.pop();
  return {
    props: task.props,
    stateNode: task.dom,
    tag: "hostRoot",
    effects: [],
    child: null,
    alternate: task.dom.__rootFiberContainer,
  };
};

const reconcileChildren = (fiber, children) => {
  if (!Array.isArray(children)) {
    children = [children];
  }
  let index = 0;
  let len = children.length;
  let element = null;
  let newFiber = null;
  let prevFiber = null;
  let alternate = null;
  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child;
  }

  while (index < len || alternate) {
    element = children[index];
    if (!element && alternate) {
      alternate.effectTag = "delete";
      fiber.effects.push(alternate);
    } else if (element && !alternate) {
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: "placement",
        stateNode: null,
        parent: fiber,
        child: null,
        sibling: null,
      };
      newFiber.stateNode = createStateNode(newFiber);
    } else if (element && alternate) {
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: "update",
        stateNode: null,
        parent: fiber,
        child: null,
        sibling: null,
        alternate,
      };
      if (element.type === alternate.type) {
        newFiber.stateNode = alternate.stateNode;
      } else {
        newFiber.stateNode = createStateNode(newFiber);
      }
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else if (element) {
      prevFiber.sibling = newFiber;
    }
    if (alternate && alternate.sibling) {
      alternate = alternate.sibling;
    } else {
      alternate = null;
    }
    prevFiber = newFiber;
    index++;
  }
};

const executeTask = (fiber) => {
  if (fiber.tag === "classComponent") {
    reconcileChildren(fiber, fiber.stateNode.render());
  } else if (fiber.tag === "functionComponent") {
    reconcileChildren(fiber, fiber.stateNode(fiber.props));
  } else {
    reconcileChildren(fiber, fiber.props.children);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let currentExecuteFiber = fiber;
  while (currentExecuteFiber.parent) {
    // 构建 effects
    currentExecuteFiber.parent.effects =
      currentExecuteFiber.parent.effects.concat(
        currentExecuteFiber.effects.concat([currentExecuteFiber])
      );
    if (currentExecuteFiber.sibling) {
      return currentExecuteFiber.sibling;
    }
    currentExecuteFiber = currentExecuteFiber.parent;
  }
  // fiber 树构建完毕
  pendingCommit = currentExecuteFiber;
};

const workLoop = (deadline) => {
  // 子任务是否存在，不存在就去查找
  if (!subTask) {
    subTask = getFirstTask();
  }
  // 有子任务并且有空余时间
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask);
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
};

const performTask = (deadline) => {
  workLoop(deadline);
  // 任务被中止
  if (subTask && !taskQueue.isEmpty()) {
    requestIdleCallback(performTask);
  }
};

function render(vnode, dom) {
  const task = {
    dom,
    props: {
      children: [vnode],
    },
  };
  taskQueue.push(task);
  // 调度
  requestIdleCallback(performTask);
}

export default render;
