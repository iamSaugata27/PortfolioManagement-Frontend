import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellMutualFund = () => {
  const [noOfMutualFundsToBeSell, setNoOfMutualFundsToBeSell] = useState(0);
  const [isMutualFundSold, setIsMutualFundsold] = useState(false);
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(true);
  const tokenDetails = JSON.parse(localStorage.getItem("tokenDetails"));
  const mutualFundToBeSell = JSON.parse(
    localStorage.getItem("mutualFundDetails")
  );
  console.log(localStorage.getItem("mutualFundDetails"));

  useEffect(() => {
    const isTokenExpired = Date.now() <= tokenDetails.expiryTime * 1000;
    setLoginStatus(isTokenExpired);
    if (!loginStatus) {
      localStorage.clear();
      navigate("/");
    }
    if (isMutualFundSold) navigate("/portfolio/sellAssetReceipt");
    if (!mutualFundToBeSell) {
      localStorage.clear();
      navigate("/login");
    }
  }, [isMutualFundSold, loginStatus]);

  const sellMutualFundHandler = async (e) => {
    e.preventDefault();
    const currentPortfolioDetails = await axios.get(
      `https://localhost:44375/api/NetWorth/GetPortFolioDetailsByID/${mutualFundToBeSell.portfolioId}`
    );
    const sellingMutualFunds = {
      portFolioId: mutualFundToBeSell.portfolioId,
      stockList: [],
      mutualFundList: [
        {
          mutualFundName: mutualFundToBeSell.mutualFundName,
          mutualFundUnits: noOfMutualFundsToBeSell,
        },
      ],
    };
    const sellMutualFundsReceipt = await axios.post(
      "https://localhost:44375/api/NetWorth/SellAssets",
      [currentPortfolioDetails.data, sellingMutualFunds],
      { headers: { "Content-Type": "application/json" } }
    );
    localStorage.setItem(
      "sellStatus",
      JSON.stringify(sellMutualFundsReceipt.data)
    );
    setIsMutualFundsold(sellMutualFundsReceipt.data.saleStatus);
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
      <h1>Sell Your MutualFund</h1>
      <span style={{ paddingLeft: "550px" }}>
        <button onClick={handleLogout}>Logout</button>
      </span>
      <form onSubmit={sellMutualFundHandler}>
        <label>MutualFundName </label>
        <input type="text" readOnly value={mutualFundToBeSell.mutualFundName} />
        <br />
        <br />
        <label>MutualFundUnits </label>
        <input
          type="number"
          onChange={(e) =>
            setNoOfMutualFundsToBeSell(Number.parseInt(e.target.value))
          }
        />
        <br />
        <button type="submit">Sell</button>
      </form>
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("mutualFundDetails");
          navigate("/portfolio");
        }}
      >
        Back To PortFolioDetails
      </button>
    </div>
  );
};

export default SellMutualFund;
