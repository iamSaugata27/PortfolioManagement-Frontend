import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const SellStock = () => {
  const [noOfStocksToBeSell, setNoOfStocksToBeSell] = useState(0);
  const [isStockSold, setIsStocksold] = useState(false);
  const navigate = useNavigate();
  const stockToBeSell = JSON.parse(localStorage.getItem("stockDetails"));
  const [loginStatus, setLoginStatus] = useState(true);
  const tokenDetails = JSON.parse(localStorage.getItem("tokenDetails"));
  console.log(localStorage.getItem("stockDetails"));
  //   const params = useParams();
  //   console.log(params);

  useEffect(() => {
    const isTokenExpired = Date.now() <= tokenDetails.expiryTime * 1000;
    setLoginStatus(isTokenExpired);
    if (!loginStatus) {
      localStorage.clear();
      navigate("/");
    }
    if (isStockSold) navigate("/portfolio/sellAssetReceipt");
    if (!stockToBeSell) {
      localStorage.clear();
      navigate("/login");
    }
  }, [isStockSold, loginStatus]);

  const sellStockHandler = async (e) => {
    e.preventDefault();
    const currentPortfolioDetails = await axios.get(
      `https://localhost:44375/api/NetWorth/GetPortFolioDetailsByID/${stockToBeSell.portfolioId}`
    );
    const sellingStocks = {
      portFolioId: stockToBeSell.portfolioId,
      stockList: [
        {
          stockName: stockToBeSell.stockName,
          stockCount: noOfStocksToBeSell,
        },
      ],
      mutualFundList: [],
    };
    const sellStockReceipt = await axios.post(
      "https://localhost:44375/api/NetWorth/SellAssets",
      [currentPortfolioDetails.data, sellingStocks],
      { headers: { "Content-Type": "application/json" } }
    );
    localStorage.setItem("sellStatus", JSON.stringify(sellStockReceipt.data));
    setIsStocksold(sellStockReceipt.data.saleStatus);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ paddingLeft: "40px" }}>
      <h3>CustomerPortal</h3>
      <br />
      <hr />
      <h1>Sell Your Stock</h1>
      <span style={{ paddingLeft: "550px" }}>
        <button onClick={handleLogout}>Logout</button>
      </span>
      <form onSubmit={sellStockHandler}>
        <label>StockName </label>
        <input
          type="text"
          readOnly
          value={stockToBeSell && stockToBeSell.stockName}
        />
        <br />
        <br />
        <label>StockCount </label>
        <input
          type="number"
          onChange={(e) =>
            setNoOfStocksToBeSell(Number.parseInt(e.target.value))
          }
        />
        <br />
        <button type="submit">Sell</button>
      </form>
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("stockDetails");
          navigate("/portfolio");
        }}
      >
        Back To PortFolioDetails
      </button>
    </div>
  );
};

export default SellStock;
