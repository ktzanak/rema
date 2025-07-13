import { Row, Col } from "react-bootstrap";
import styles from "../css/recipeinfo.module.css";
import { useState } from "react";

export default function RecipeInfo({
  recipeinfo,
  setRecipeinfo,
  tags,
  setTags,
  category,
  setCategory,
}) {
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().replace(/,+$/, "").toLowerCase();
      if (value && !tags.find((t) => t.tag === value)) {
        setTags([...tags, { tag: value }]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <Row className={styles.inputcontainer}>
      <Col className={styles.recipeinfocol}>
        <Row className={styles.recipeinforowleft}>
          <span className={styles.recipeinfolabel}>Title</span>
          <div className={styles.inputcontainer}>
            <input
              className={styles.moderninput}
              onChange={(e) =>
                setRecipeinfo({
                  ...recipeinfo,
                  title: e.target.value,
                })
              }
              type="text"
              value={recipeinfo?.title || ""}
              placeholder="Title (required)"
            />
          </div>
        </Row>
        <Row className={styles.recipeinforowleft}>
          <span className={styles.recipeinfolabel}>Description</span>
          <div className={styles.inputcontainer}>
            <input
              className={styles.moderninput}
              onChange={(e) =>
                setRecipeinfo({
                  ...recipeinfo,
                  description: e.target.value,
                })
              }
              type="text"
              value={recipeinfo?.description || ""}
              placeholder="Description (optional)"
            />
          </div>
        </Row>
      </Col>
      <Col className={styles.recipeinfocol}>
        <Row className={styles.recipeinforowright}>
          <Col className={styles.recipeinfocolleft}>
            <span className={styles.recipeinfolabel}>Portions</span>
            <div className={styles.inputcontainer}>
              <input
                className={styles.moderninput}
                onChange={(e) =>
                  setRecipeinfo({
                    ...recipeinfo,
                    portions: e.target.value,
                  })
                }
                type="text"
                value={recipeinfo?.portions || ""}
                placeholder="Portions (optional)"
              />
            </div>
          </Col>

          <Col className={styles.recipeinfocolright}>
            <span className={styles.recipeinfolabel}>Time</span>
            <div className={styles.inputcontainer}>
              <input
                className={styles.moderninput}
                onChange={(e) =>
                  setRecipeinfo({
                    ...recipeinfo,
                    cooking_time: e.target.value,
                  })
                }
                type="text"
                value={recipeinfo?.cooking_time || ""}
                placeholder="Time (optional)"
              />
            </div>
          </Col>
        </Row>
        <Row className={styles.recipeinforowright}>
          <Col className={styles.recipeinfocolleft}>
            <span className={styles.recipeinfolabel}>Category</span>
            <div className={styles.inputcontainer}>
              <select
                id="dropdown"
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  width: "100%",
                  margin: "5px",
                }}
              >
                <option value="">Select... (optional)</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Sauce">Sauce</option>
                <option value="Side Dish">Side Dish</option>
                <option value="Main Dish">Main Dish</option>
                <option value="Dessert">Dessert</option>
                <option value="Drink">Drink</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </Col>

          <Col className={styles.recipeinfocolright}>
            <span className={styles.recipeinfolabel}>Tags</span>
            <div className={styles.inputcontainer}>
              <div
                className={styles.moderninput + " " + styles.chipInputWrapper}
              >
                {tags.map((t, index) => (
                  <span key={index} className={styles.tagChip}>
                    {t.tag}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => removeTag(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className={styles.chipInput}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={
                    tags.length === 0 ? "Comma-separated tags (optional)" : ""
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
