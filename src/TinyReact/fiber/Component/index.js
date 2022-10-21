export default class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState(state) {
    this.state = Object.assign({}, this.state, state);
    // const oldEle = this.getDOM();
    // diff(this.render(), oldEle.parentNode, oldEle);
  }
  setDOM(dom) {
    this._dom = dom;
  }
  getDOM() {
    return this._dom;
  }
  render() {
    return null;
  }
  updateProps(props) {
    this.props = props;
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
}
