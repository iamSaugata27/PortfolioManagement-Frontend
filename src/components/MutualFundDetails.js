import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MutualFundDetails = ({ mutualFundDetails, portfolioId }) => {
  const [mutualFundPrice, setmutualFundPrice] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("mutualFundDetails", mutualFundDetails);
    const findFullmutualFund = () => {
      const mutualFundValues = [];
      mutualFundDetails.forEach(async (mutualFund) => {
        const eachmutualFund = await axios.get(
          `http://localhost:55953/api/MutualFundNAV/${mutualFund.mutualFundName}`
        );
        if (eachmutualFund.data.mutualFundName === mutualFund.mutualFundName)
          mutualFundValues.push(eachmutualFund.data.mutualFundValue);
        setmutualFundPrice(mutualFundValues);
      });
    };
    findFullmutualFund();
    console.log(mutualFundDetails);
  }, []);
  console.log("********mutualFundDetails", mutualFundDetails);

  const sellMutualFundHandler = (mutualFundName, portfolioId) => {
    localStorage.setItem(
      "mutualFundDetails",
      JSON.stringify({ mutualFundName, portfolioId })
    );
    navigate("/portfolio/sellMutualFund");
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>MutualFund Name</th>
            <th>MutualFund Price</th>
            <th>MutualFund Count</th>
            <th>Sell</th>
          </tr>
        </thead>
        <tbody>
          {mutualFundDetails.map((mutualFund, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{mutualFund.mutualFundName}</td>
                <td>{mutualFundPrice[index]}</td>
                <td>{mutualFund.mutualFundUnits}</td>
                <td>
                  <button
                    onClick={() =>
                      sellMutualFundHandler(
                        mutualFund.mutualFundName,
                        portfolioId
                      )
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

export default MutualFundDetails;
