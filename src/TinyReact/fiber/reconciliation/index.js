import { createTaskQueue, createStateNode, getTag } from "../misc";

const taskQueue = createTaskQueue();
let subTask = null;
let pendingCommit = null;

const commitAllWork = (fiber) => {
  console.log(fiber.effects);
  fiber.effects.forEach((item) => {
    if (item.effectTag === "placement") {
      item.parent.stateNode.appendChild(item.stateNode);
    }
  });
};

const getFirstTask = () => {
  const task = taskQueue.pop();
  return {
    props: task.props,
    stateNode: task.dom,
    tag: "hostRoot",
    effects: [],
    child: null,
  };
};

const reconcileChildren = (fiber, children) => {
  let index = 0;
  let len = children.length;
  let element = null;
  let newFiber = null;
  let prevFiber = null;

  while (index < len) {
    element = children[index];
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
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }
    prevFiber = newFiber;
    index++;
  }
};

const executeTask = (fiber) => {
  reconcileChildren(fiber, fiber.props.children);
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
