import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import ParticlesBg from "particles-bg";
import CurrentStocks from "./CurrentStocks";
import StockMarket from "./StockMarket";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hold: [],
      market: [],
      totalShareValue: 0.0,
      sorted: { symbol: 1, price: 1, totalValue: 1, company: 1, numOfShare: 1 },
      sortedMarket: { symbol: 1, price: 1, company: 1 }
    };
  }

  componentDidMount() {
    console.log(localStorage.getItem("market"));
    //console.log(localStorage.getItem("market").length);
    if (
      localStorage.getItem("market") === null ||
      localStorage.getItem("market").length < 5
    ) {
      console.log("market is null");
      const symbols = [
        "CSCO",
        "ADBE",
        "NEW",
        "BAC",
        "A",
        "F",
        "C",
        "D",
        "X",
        "O",
        "K",
        "I",
        "V",
        "ATVI",
        "TXN",
        "AA",
        "DIS",
        "AMZN",
        "GOOGL",
        "XOM",
        "JNJ",
        "GE",
        "REAL",
        "MMM"
      ];
      var all = [];
      for (var i = 0; i < symbols.length; i++) {
        const url = this.urlForStockInfo(symbols[i]);
        fetch(url)
          .then(r => r.json())
          .then(data => {
            var stocks = {};
            stocks["symbol"] = data.symbol;
            stocks["company"] = data.companyName;
            stocks["numOfShares"] = 0;
            stocks["price"] = data.latestPrice;
            stocks["totalValue"] = 0;
            all.push(stocks);
            this.setState({ market: all });
          });
      }
      localStorage.setItem("market", JSON.stringify(all));
      if (localStorage.getItem("hold") != null) {
        this.setState({
          hold: JSON.parse(localStorage.getItem("hold"))
        });
      }
      if (localStorage.getItem("totalShareValue") != null) {
        this.setState({
          totalShareValue: parseFloat(localStorage.getItem("totalShareValue"))
        });
      }
    } else {
      this.setState({
        hold: JSON.parse(localStorage.getItem("hold"))
      });
      this.setState({
        market: JSON.parse(localStorage.getItem("market"))
      });
      this.setState({
        totalShareValue: parseFloat(localStorage.getItem("totalShareValue"))
      });
    }
  }

  sortHold(e) {
    const target = e.currentTarget.getAttribute("value");
    var sorted = this.state.sorted;
    if (this.state.sorted[target] === -1) {
      this.state.hold.sort(function(o1, o2) {
        return o1[target] < o2[target] ? 1 : -1;
      });
      sorted[target] = 1;
    } else {
      this.state.hold.sort(function(o1, o2) {
        return o1[target] < o2[target] ? -1 : 1;
      });
      sorted[target] = -1;
    }
    this.setState({ sorted: sorted });
    this.setState({ hold: this.state.hold });
  }

  sortMarket(e) {
    const target = e.currentTarget.getAttribute("value");
    var sortedMarket = this.state.sorted;
    if (this.state.sortedMarket[target] === -1) {
      this.state.market.sort(function(o1, o2) {
        return o1[target] < o2[target] ? 1 : -1;
      });
      sortedMarket[target] = 1;
    } else {
      this.state.market.sort(function(o1, o2) {
        return o1[target] < o2[target] ? -1 : 1;
      });
      sortedMarket[target] = -1;
    }
    this.setState({ sortedMarket: sortedMarket });
    this.setState({ market: this.state.market });
  }

  purchaseStock = (symbol, numOfShares) => {
    var market = this.state.market,
      hold = this.state.hold;
    var newStock = {};
    for (var i = 0; i < this.state.market.length; i++) {
      if (this.state.market[i]["symbol"] === symbol) {
        newStock["symbol"] = symbol;
        newStock["company"] = this.state.market[i]["company"];
        newStock["price"] = this.state.market[i]["price"];
        newStock["numOfShares"] = numOfShares;
        newStock["totalValue"] =
          parseFloat(numOfShares) * parseFloat(this.state.market[i]["price"]);
      }
    }
    var hasStock = false;
    if (this.state.hold != null) {
      for (var i = 0; i < this.state.hold.length; i++) {
        if (this.state.hold[i]["symbol"] === newStock["symbol"]) {
          hasStock = true;
          hold[i]["numOfShares"] =
            parseInt(newStock["numOfShares"]) +
            parseInt(hold[i]["numOfShares"]);
          hold[i]["totalValue"] += newStock["totalValue"];
        }
      }
    }
    if (hasStock === false) {
      hold.push(newStock);
    }
    localStorage.setItem("market ", JSON.stringify(market));
    this.setState({ hold: hold });
    localStorage.setItem("hold", JSON.stringify(hold));
    var totalShareValue =
      parseFloat(this.state.totalShareValue) +
      parseFloat(newStock["totalValue"]);
    totalShareValue = totalShareValue.toFixed(2);
    this.setState({ totalShareValue: totalShareValue });
    localStorage.setItem("totalShareValue", totalShareValue.toString());
  };

  stockOperations = (symbol, count) => {
    var initNum;
    count = parseInt(count);
    var curStock;
    var hold = this.state.hold;
    for (var i = 0; i < this.state.hold.length; i++) {
      if (this.state.hold[i]["symbol"] === symbol) {
        curStock = this.state.hold[i];
        initNum = parseInt(curStock.numOfShares);
        const curNum = initNum + count;
        var totalValue =
          parseFloat(curStock.price) * parseFloat(curNum).toFixed(2);
        curStock.totalValue = totalValue;
        curStock.numOfShares = curNum;
        if (curNum === 0) {
          hold.splice(i, 1);
        }

        var totalShareValue =
          parseFloat(this.state.totalShareValue) +
          parseFloat(count * curStock.price);
        //totalShareValue = parseFloat(totalShareValue).toFixed(2);
        this.setState({ totalShareValue: totalShareValue.toFixed(2) });
        localStorage.setItem(
          "totalShareValue",
          totalShareValue.toFixed(2).toString()
        );
      }
    }

    this.setState({ hold: hold });
    localStorage.setItem("hold", JSON.stringify(hold));
  };

  render() {
    let config = {
      num: [4, 7],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [0.1, 0.4],
      position: "all",
      color: ["random", "#ff0000"],
      cross: "dead",
      // emitter: "follow",
      random: 15
    };

    if (Math.random() > 0.85) {
      config = Object.assign(config, {
        onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(
            particle.p.x,
            particle.p.y,
            particle.radius * 2,
            particle.radius * 2
          );
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
        }
      });
    }

    const recommends = this.state.market.map(stock => {
      return <StockMarket stock={stock} purchase={this.purchaseStock} />;
    });

    const ownedStocks = this.state.hold.map(stock => {
      return <CurrentStocks stock={stock} change={this.stockOperations} />;
    });

    return (
      <div className="container">
        <ParticlesBg type="custom" config={config} bg={true} />

        <div className="content">
          <div id="header-title">
            <div
              id="header-title-1"
              data-text="Stock Portfolio"
              contenteditable
            >
              Stock Portfolio
            </div>
            <div id="header-title-2"> Time to make some money</div>
            <div class="gradient"></div>
            <div class="spotlight"></div>
          </div>
          <div
            id="market-title"
            className="row"
            style={{ marginTop: "40px", color: "white", textAlign: "left" }}
          >
            Owned Shares
          </div>
          <div id="totalValue">
            Your total portfolio value : ${this.state.totalShareValue}
          </div>
          <div
            className="row currentPortfolio"
            style={{ marginBottom: "40px" }}
          >
            <div className="col" style={{ width: "100%" }}>
              <div
                id="market-all"
                style={{
                  height: "350px",
                  width: "100%",
                  marginBottom: "5px",
                  padding: "0px"
                }}
              >
                <table
                  id="curTable"
                  className="table table-hover table-responsive table-dark table-fixed"
                  style={{ width: "100%" }}
                >
                  <thead style={{ width: "100%", color: "white" }}>
                    <tr>
                      <th
                        style={{ width: "10%" }}
                        onClick={e => this.sortHold(e)}
                        value="symbol"
                      >
                        Symbol
                      </th>
                      <th
                        style={{ width: "22%" }}
                        onClick={e => this.sortHold(e)}
                        value="company"
                      >
                        Company Name
                      </th>
                      <th
                        style={{ width: "19%" }}
                        onClick={e => this.sortHold(e)}
                        value="numOfShares"
                      >
                        Num of Shares
                      </th>
                      <th
                        style={{ width: "16%" }}
                        onClick={e => this.sortHold(e)}
                        value="price"
                      >
                        Current Price
                      </th>
                      <th
                        style={{ width: "14%" }}
                        onClick={e => this.sortHold(e)}
                        value="totalValue"
                      >
                        Total Share Value
                      </th>
                      <th style={{ width: "10%" }}>Amount</th>
                      <th style={{ width: "10%" }}>Operation</th>
                    </tr>
                  </thead>

                  <div
                    id="market-tbody"
                    className="scroll"
                    style={{ width: "100%" }}
                  >
                    <tbody>{ownedStocks}</tbody>
                  </div>
                </table>
              </div>
            </div>
          </div>

          <div
            id="market-title"
            className="row"
            style={{ marginTop: "40px", color: "white", textAlign: "left" }}
          >
            Stock Market
          </div>

          <div className="row markets">
            <div
              className="col"
              id="market-table"
              style={{
                height: "300px",
                width: "100%",
                marginBottom: "15px",
                padding: "0px"
              }}
            >
              <table
                id="market"
                className="table table-hover table-responsive table-dark table-fixed"
                style={{ width: "100%" }}
              >
                <thead style={{ width: "100%", color: "white" }}>
                  <tr id="market-tr">
                    <th
                      style={{ width: "20%" }}
                      onClick={e => this.sortMarket(e)}
                      value="symbol"
                    >
                      Symbol
                    </th>
                    <th
                      style={{ width: "28%" }}
                      onClick={e => this.sortMarket(e)}
                      value="company"
                    >
                      Company Name
                    </th>
                    <th
                      style={{ width: "21%" }}
                      onClick={e => this.sortMarket(e)}
                      value="price"
                    >
                      Current Price
                    </th>
                    <th style={{ width: "20%" }}>Amount</th>
                    <th id="submit" style={{ width: "20%" }}>
                      Operation
                    </th>
                  </tr>
                </thead>

                <div
                  id="market-tbody"
                  className="scroll"
                  style={{ width: "100%" }}
                >
                  <tbody>{recommends}</tbody>
                </div>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  urlForStockInfo = stockSymbol => {
    const api_key_param = "token=pk_0450ab0ad32942a480c3e7330fd353c5 ";
    const base_url = "https://cloud.iexapis.com/stable/stock/";
    const api_url = `${base_url}${stockSymbol}/quote?${api_key_param}`;
    return api_url;
  };
}

export default App;
