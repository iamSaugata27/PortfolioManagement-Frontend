import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AssetReceipt = () => {
  const navigate = useNavigate();
  console.log(localStorage.getItem("sellStatus"));
  const receiptStatus = JSON.parse(localStorage.getItem("sellStatus"));
  const [loginStatus, setLoginStatus] = useState(true);
  const tokenDetails = JSON.parse(localStorage.getItem("tokenDetails"));

  useEffect(() => {
    if (!receiptStatus) navigate("/login");
    const isTokenExpired = Date.now() <= tokenDetails.expiryTime * 1000;
    setLoginStatus(isTokenExpired);
    if (!loginStatus) {
      localStorage.clear();
      navigate("/");
    }
  }, [loginStatus]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ paddingLeft: "40px" }}>
      <h3>CustomerPortal</h3>
      <br />
      <hr />
      <div style={{ paddingLeft: "550px" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1>Receipt</h1>
      <br />
      <h4>
        SaleStatus:{" "}
        {receiptStatus && localStorage.getItem("sellStatus").slice(14, 18)}
      </h4>
      <h4>New NetWorth: Rs/-{receiptStatus && receiptStatus.networth}</h4>
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("sellStatus");
          navigate("/portfolio");
        }}
      >
        Back To PortFolioDetails
      </button>
    </div>
  );
};

export default AssetReceipt;
