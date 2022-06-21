import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PortfolioDetails from "./components/PortfolioDetails";
import SellStock from "./components/SellStock";
import AssetReceipt from "./components/AssetReceipt";
import SellMutualFund from "./components/SellMutualFund";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="" element={<Navigate to="/login" />} />
        <Route exact path="/portfolio" element={<PortfolioDetails />}></Route>
        <Route exact path="/portfolio/sellStock" element={<SellStock />} />
        <Route
          exact
          path="portfolio/sellMutualFund"
          element={<SellMutualFund />}
        />
        <Route path="/portfolio/sellAssetReceipt" element={<AssetReceipt />} />
      </Routes>
    </Router>
  );
}

export default App;
