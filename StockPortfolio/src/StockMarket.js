import React, { Component } from "react";

class StockMarket extends Component {
  purchase(e) {
    console.log(
      e.currentTarget.parentNode.previousSibling.firstElementChild.value
    );
    var value =
      e.currentTarget.parentNode.previousSibling.firstElementChild.value;
    // invalid input
    if (value === null || value === "") {
      alert("Purchase Amount Needed");
      e.currentTarget.parentNode.previousSibling.firstElementChild.value = "";
      return;
    }
    this.props.purchase(this.props.stock.symbol, value);
    e.currentTarget.parentNode.previousSibling.firstElementChild.value = "";
  }

  render() {
    return (
      <tr id="rowMarket">
        <td id="symbolMarket" style={{ width: "15%" }}>
          {this.props.stock.symbol}
        </td>
        <td style={{ width: "25%" }}>{this.props.stock.company}</td>
        <td style={{ width: "15%" }}>${this.props.stock.price}</td>
        <td id="market-input" style={{ width: "15%" }}>
          <input
            id="market-input-1"
            type="number"
            className="inputField"
            min="1"
          ></input>
        </td>
        <td id="submitPurchase" style={{ width: "15%" }}>
          <button
            type="button"
            className="btn-outline-secondary"
            style={{ textAlign: "center", marginLeft: "5px", width: "80%" }}
            onClick={e => this.purchase(e)}
          >
            Purchase
          </button>
        </td>
      </tr>
    );
  }
}

export default StockMarket;
