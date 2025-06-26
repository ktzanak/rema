import Header from "./components/Header";
import AddRecipe from "./components/AddRecipe";
import ListRecipes from "./components/ListRecipes";
import PlanShop from "./components/PlanShop";
import Home from "./components/Home";
import IntroOverlay from "./components/IntroOverlay";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/app.css";

function AppContent({ introFinished }) {
  const location = useLocation();

  //const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <>
      <AnimatePresence>
        {introFinished && (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Header />
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/list" element={<ListRecipes />} />
        <Route path="/planshop" element={<PlanShop />} />
      </Routes>
    </>
  );
}

function App() {
  const [introFinished, setIntroFinished] = useState(() => {
    return !!sessionStorage.getItem("introShown");
  });

  useEffect(() => {
    if (!introFinished) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("introShown", "true");
        setIntroFinished(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [introFinished]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("introShown");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <motion.div key={introFinished ? "app" : "intro"}>
          {!introFinished ? <IntroOverlay /> : <AppContent introFinished />}
        </motion.div>
      </AnimatePresence>
    </Router>
  );
}

export default App;
