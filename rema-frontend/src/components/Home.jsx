import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../css/home.module.css";

export default function Home() {
  const [quotesAvailable, setQuotesAvailable] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quotesAvailable) return;

      try {
        const res = await fetch("http://localhost:8000/api/foodQuote");
        const data = await res.json();
        setQuote(data.quote);
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      }
    };

    fetchQuote();
  }, [quotesAvailable]);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if (!navigator.onLine) {
          setQuotesAvailable(false);
          return;
        }

        const res = await fetch("http://localhost:8000/api/hasFoodQuotesKey");
        const data = await res.json();
        setQuotesAvailable(data.ok);
      } catch (error) {
        console.error("Error checking quotes availability:", error);
        setQuotesAvailable(false);
      }
    };

    checkAvailability();
  }, []);

  return (
    <div className={styles.container}>
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={styles.homeContent}
      >
        <div className={styles.coloredSection}>
          <div className={styles.fullWidthTextFrame}>
            <h1>Welcome to ReMa!</h1>
            <h4>
              A simple application for creating recipes. <br />
              It can be used for any type of recipe, main courses, cocktails,
              desserts and many more!
            </h4>

            <blockquote>
              <em>{quote === null ? `"..."` : `"${quote}"`}</em>
            </blockquote>
          </div>
        </div>
      </motion.div>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h5 style={{ margin: "0 0 0.5rem 0" }}>User Tips</h5>
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.2rem",
            color: "#555",
            fontSize: "1rem",
          }}
        >
          <li>
            Drag and drop recipes to your meal planner for easy scheduling.
          </li>
          <li>
            Search recipes by ingredient, tag, or category using the search bar.
          </li>
          <li>Click "View" on any recipe to see details and instructions.</li>
          <li>
            Generate a shopping list for your planned meals with one click.
          </li>
          <li>Use the calendar to organize meals by day and time.</li>
        </ul>
      </div>
    </div>
  );
}
