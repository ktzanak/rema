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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/list" element={<ListRecipes />} />
          <Route path="/planshop" element={<PlanShop />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  return (
    <>
      <Header />
      <AnimatedRoutes />
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
        {!introFinished ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <IntroOverlay />
          </motion.div>
        ) : (
          <AppContent />
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
