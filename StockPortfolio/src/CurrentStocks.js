import React, { Component } from "react";

class CurrentStocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfShares: null,
      sell: true,
      selected: true
    };
  }

  amountChange(e) {
    const num = e.currentTarget.value;
    this.setState({ numOfShares: num });
  }

  confirm(e) {
    var value =
      e.currentTarget.parentNode.previousSibling.firstElementChild.value;
    // invalid input
    if (value === null || value === "") {
      alert("Sell Amount Needed");
      e.currentTarget.parentNode.previousSibling.firstElementChild.value = "";
      return;
    }

    var numOfShares = parseInt(this.state.numOfShares);
    if (this.state.sell === true) {
      if (numOfShares > this.props.stock.numOfShares) {
        alert("You cannot sell more than what you own");
        e.currentTarget.parentNode.previousSibling.firstElementChild.value = "";
        return;
      }

      numOfShares = -Math.abs(numOfShares);
    }
    this.setState({ numOfShares: numOfShares });

    //e.currentTarget.previousSibling.value = "";
    e.currentTarget.parentNode.previousSibling.firstElementChild.value = "";
    this.props.change(this.props.stock.symbol, numOfShares);
  }

  render() {
    return (
      <tr id="rowMarket">
        <td id="symbol" style={{ width: "10%" }}>
          {this.props.stock.symbol}
        </td>
        <td style={{ width: "25%" }}>{this.props.stock.company}</td>
        <td style={{ width: "14%" }}>{this.props.stock.numOfShares}</td>
        <td style={{ width: "16%" }}>${this.props.stock.price}</td>
        <td style={{ width: "16%" }}>
          ${this.props.stock.totalValue.toFixed(2)}
        </td>
        <td
          id="cur-input"
          style={{ width: "10%", padding: "3px", paddingRight: "6px" }}
        >
          <input
            type="number"
            className="form-control"
            aria-label="Text input with dropdown button"
            min="1"
            onChange={e => this.amountChange(e)}
            style={{ marginLeft: "1px" }}
          />
        </td>
        <td tyle={{ width: "10%", padding: "3px", paddingRight: "6px" }}>
          <button
            className="btn-outline-secondary"
            type="button"
            style={{ width: "90%" }}
            onClick={e => this.confirm(e)}
          >
            Sell
          </button>
        </td>
      </tr>
    );
  }
}

export default CurrentStocks;
