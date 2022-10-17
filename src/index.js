import TinyReact from "./TinyReact";

const app = document.querySelector("#app");

const virtualDOM = (
  <div className="container">
    <h1 className="title" id="tt">
      你好 Tiny React
    </h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
    </ul>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3<label htmlFor="input">label</label>
    <input id="input" type="text" value="13" />
  </div>
);

const modifyDOM = (
  <div className="container">
    <h1 id="tt">你好 Tiny React</h1>
    <h2 data-test="test123">(编码必杀技)</h2>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h2>(观察: 这个将会被改变)</h2>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段被修改过的内容</span>
    <button onClick={() => alert("你好！！！！！！！！")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3<label>label</label>
    <input type="text" />
    <input type="checkbox" checked={true} />
  </div>
);

function Demo() {
  return <div>Demo</div>;
}
function Heart({ title }) {
  return (
    <div>
      &hearts;
      <Demo />
      <h1>{title}</h1>
      <Alert name="zs" age={20} />
    </div>
  );
}

class Alert extends TinyReact.Component {
  render() {
    const { name, age } = this.props;
    return (
      <div>
        hello class component, {name}, {age}
      </div>
    );
  }
}

TinyReact.render(virtualDOM, app);

setTimeout(() => {
  TinyReact.render(modifyDOM, app);
}, 2000);

// console.log(virtualDOM);
