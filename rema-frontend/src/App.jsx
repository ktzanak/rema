import Header from "./components/Header";
import AddRecipe from "./components/AddRecipe";
import ListRecipes from "./components/ListRecipes";
import PlanShop from "./components/PlanShop";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import "./css/app.css";

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/home";
  const [showHeader, setShowHeader] = useState(!isHome); // show header by default unless home

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={<Home onIntroEnd={() => setShowHeader(true)} />}
        />
        <Route
          path="/home"
          element={<Home onIntroEnd={() => setShowHeader(true)} />}
        />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/list" element={<ListRecipes />} />
        <Route path="/planshop" element={<PlanShop />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
