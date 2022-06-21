import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StockDetails = ({ stockDetails, portfolioId }) => {
  const [stockPrice, setStockPrice] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Stockdetails", stockDetails);
    const findFullStock = () => {
      const stockValues = [];
      stockDetails.forEach(async (stock) => {
        const eachStock = await axios.get(
          `https://localhost:44367/api/Stock/${stock.stockName}`
        );
        if (eachStock.data.stockName === stock.stockName)
          stockValues.push(eachStock.data.stockValue);
        setStockPrice(stockValues);
      });
    };
    findFullStock();
    console.log(stockDetails);
  }, []);

  console.log("********stockDetails", stockDetails);

  const sellStockHandler = (stockName, portfolioId) => {
    localStorage.setItem(
      "stockDetails",
      JSON.stringify({ stockName, portfolioId })
    );
    navigate("/portfolio/sellStock");
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Stock Name</th>
            <th>Stock Price</th>
            <th>Stock Count</th>
            <th>Sell</th>
          </tr>
        </thead>
        <tbody>
          {stockDetails.map((stock, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.stockName}</td>
                {/* <td>{stock.stockPrice}</td> */}
                <td>{stockPrice[index]}</td>
                <td>{stock.stockCount}</td>
                <td>
                  {/* <Link
                    to={`/sellStock/${stock.stockName}/${stockPrice[index]}/${stock.stockCount}`}
                  >
                    <button>Sell</button>
                  </Link> */}
                  <button
                    onClick={() =>
                      sellStockHandler(stock.stockName, portfolioId)
                    }
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockDetails;
