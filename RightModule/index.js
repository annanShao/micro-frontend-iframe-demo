"use strict";

const e = React.createElement;
import eventEmitter from "../EventEmitter.js";

class TomPocket extends React.Component {
  constructor(props) {
    super(props);
    this.state = { coins: 0 };
    eventEmitter.subscribe("sendCoin", this.handleSolveMessage.bind(this));
  }

  handleSolveMessage() {
    this.setState({
      coins: this.state.coins + 1,
    });
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }
    return e(
      "div",
      null,
      e("img", {
        src: "../statics/react.png",
      }),
      e(
        "div",
        {
          style: {
            color: "white",
          },
        },
        `Tom have ${this.state.coins} coin${this.state.coins > 1 ? "s" : ""}`
      )
    );
  }
}

const domContainer = document.querySelector("#reactApp");
const root = ReactDOM.createRoot(domContainer);
root.render(e(TomPocket));
