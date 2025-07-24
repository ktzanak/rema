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
          padding: "1.5rem",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5
          style={{
            margin: "0 0 2.5rem 0",
            fontSize: "1.8rem",
            fontWeight: 700,
            textAlign: "center",
            color: "#111",
            letterSpacing: "1px",
          }}
        >
          User Tips
        </h5>

        <div style={{ width: "100%", maxWidth: 800 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                borderRadius: "10px",
                padding: "0.5rem 1rem",
                minWidth: "160px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#222",
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
                <li>Create your own recipes with ingredients and steps.</li>
                <li>Add tags and categories for easy searching.</li>
              </ul>
            </div>
            <div
              style={{
                borderRadius: "10px",
                padding: "0.5rem 1rem",
                minWidth: "160px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#222",
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
                <li>Browse and edit your saved recipes.</li>
                <li>Search by ingredient, tag, or category.</li>
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
                <li>Generate a shopping list for your planned meals.</li>
                <li>Organize meals by day and time using the calendar.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
