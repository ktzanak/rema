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
          marginTop: "1rem",
          padding: "1.5rem",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5
          style={{
            margin: "0 0 1.5rem 0",
            fontSize: "1.5rem",
            fontWeight: 700,
            textAlign: "center",
            color: "#111",
            letterSpacing: "1px",
          }}
        >
          User Tips
        </h5>

        <div style={{ width: "100%", maxWidth: 1100 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8rem",
              marginBottom: "1.5rem",
              width: "100%",
            }}
          >
            <div
              style={{
                borderRadius: "10px",
                padding: "0.5rem 1rem",
                flex: "none",
                minWidth: "260px",
                maxWidth: "450px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#222",
                boxSizing: "border-box",
              }}
            >
              New recipe
              <ul
                style={{
                  margin: "1rem 0 0 0",
                  paddingLeft: "1.2rem",
                  color: "#555",
                  fontSize: "1.05rem",
                  textAlign: "left",
                  listStyle: "disc",
                }}
              >
                <li>
                  Create your own recipes with ingredients and instructions.
                </li>
                <li>Add tags and categories for easier searching.</li>
              </ul>
            </div>
            <div
              style={{
                borderRadius: "10px",
                padding: "0.5rem 1rem",
                flex: "none",
                minWidth: "260px",
                maxWidth: "450px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#222",
                boxSizing: "border-box",
              }}
            >
              My recipes
              <ul
                style={{
                  margin: "1rem 0 0 0",
                  paddingLeft: "1.2rem",
                  color: "#555",
                  fontSize: "1.05rem",
                  textAlign: "left",
                  listStyle: "disc",
                }}
              >
                <li>Browse, edit and rate your saved recipes.</li>
                <li>
                  Create healthier versions of your recipes using the AI
                  feature.
                </li>
                <li>
                  Search by title, description, ingredient, tag, or category.
                </li>
              </ul>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                borderRadius: "10px",
                padding: "0.5rem 1rem",
                minWidth: "200px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#222",
              }}
            >
              Plan &amp; Shop
              <ul
                style={{
                  margin: "1rem 0 0 0",
                  paddingLeft: "1.2rem",
                  color: "#555",
                  fontSize: "1.05rem",
                  textAlign: "left",
                  listStyle: "disc",
                }}
              >
                <li>Drag and drop recipes to your meal planner.</li>
                <li>Organize meals by day and time using the calendar.</li>
                <li>Move meals between different days and time slots.</li>
                <li>
                  Generate a pdf with the weekly shopping list for your planned
                  meals.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
