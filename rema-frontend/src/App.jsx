import Header from "./components/Header";
import AddRecipe from "./components/AddRecipe";
import ListRecipes from "./components/ListRecipes";
import PlanShop from "./components/PlanShop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/app.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/*<Route path="/" element={<Home />} for future purposes/>*/}
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/list" element={<ListRecipes />} />
        <Route path="/planshop" element={<PlanShop />} />
      </Routes>
    </Router>
  );
}

export default App;
