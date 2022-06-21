import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StockDetails from "./StockDetails";
import MutualFundDetails from "./MutualFundDetails";

const PortfolioDetails = () => {
  const [loginStatus, setLoginStatus] = useState(true);
  const [netWorth, setNetWorth] = useState(0);
  const [portfolioId, setPortfolioId] = useState(0);
  const [stockDeatilsPerPortfolio, setStockDeatilsPerPortfolio] = useState([]);
  const [mutualfundDeatilsPerPortfolio, setMutualfundDeatilsPerPortfolio] =
    useState([]);
  const navigate = useNavigate();
  const tokenDetails = JSON.parse(localStorage.getItem("tokenDetails"));

  useEffect(() => {
    const isTokenExpired = Date.now() <= tokenDetails.expiryTime * 1000;
    setLoginStatus(isTokenExpired);
    if (!loginStatus) {
      localStorage.clear();
      navigate("/");
    }
    if (!tokenDetails) navigate("/login");
    const handleNetWorth = async () => {
      const portfolioId = tokenDetails.portfolioId;
      const portfolioNetDetails = await axios.get(
        `https://localhost:44375/api/NetWorth/GetPortFolioDetailsByID/${portfolioId}`
      );
      setPortfolioId(Number.parseInt(portfolioId));
      console.log(portfolioNetDetails.data);
      portfolioNetDetails.data.stockList.forEach(async (stock) => {
        const eachStock = await axios.get(
          `https://localhost:44367/api/Stock/${stock.stockName}`
        );
        stock.stockPrice = eachStock.data.stockValue;
      });
      setStockDeatilsPerPortfolio(portfolioNetDetails.data.stockList);
      portfolioNetDetails.data.mutualFundList.forEach(async (mutualFund) => {
        const eachmutualFund = await axios.get(
          `http://localhost:55953/api/MutualFundNAV/${mutualFund.mutualFundName}`
        );
        mutualFund.mutualFundValue = eachmutualFund.data.mutualFundValue;
      });
      setMutualfundDeatilsPerPortfolio(portfolioNetDetails.data.mutualFundList);
      const netWorthData = await axios.post(
        "https://localhost:44375/api/NetWorth/GetNetWorth",
        portfolioNetDetails.data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(netWorthData.data);
      console.log(stockDeatilsPerPortfolio);
      console.log(mutualfundDeatilsPerPortfolio);
      setNetWorth(netWorthData.data.networth);
    };
    handleNetWorth();
  }, [netWorth, loginStatus]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ paddingLeft: "40px" }}>
      <h3>CustomerPortal</h3>
      <br />
      <h1>
        PortfolioDetails
        <span style={{ paddingLeft: "550px" }}>
          <button onClick={handleLogout}>Logout</button>
        </span>
      </h1>
      <hr />
      <h3>PortfolioId : {tokenDetails.portfolioId}</h3>
      <hr />
      <h3>NetWorth: Rs/-{netWorth}</h3>
      <hr />
      <h2>Stock List</h2>
      {stockDeatilsPerPortfolio.length > 0 ? (
        <StockDetails
          stockDetails={stockDeatilsPerPortfolio}
          portfolioId={portfolioId}
        />
      ) : (
        <h1>Loading Stocks...</h1>
      )}
      <h2>MutualFund List</h2>
      {mutualfundDeatilsPerPortfolio.length > 0 ? (
        <MutualFundDetails
          mutualFundDetails={mutualfundDeatilsPerPortfolio}
          portfolioId={portfolioId}
        />
      ) : (
        <h1>Loading MutualFunds...</h1>
      )}
    </div>
  );
};

export default PortfolioDetails;
