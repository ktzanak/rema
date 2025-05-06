import { Row, Col } from "react-bootstrap";
import styles from "../css/recipeinfo.module.css";
import { useEffect, useState } from "react";

export default function RecipeInfo({
  recipeinfo,
  setRecipeinfo,
  tags,
  setTags,
  category,
  setCategory,
}) {
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    // Sync the tag input with the props when tags change externally.
    setTagInput(tags?.map((t) => t.tag).join(", ") || "");
  }, [tags]);

  const handleTagInputChange = (e) => {
    const input = e.target.value;
    setTagInput(input);

    // Only process when a comma is typed
    if (input.endsWith(",")) {
      const tagArray = input
        .split(",")
        .map((tag, index) => ({ id: index, tag: tag.trim() }))
        .filter((tagObj) => tagObj.tag.length > 0);

      setTags(tagArray);
    }
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
          <Col className={styles.recipeinfocol}>
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
                placeholder="Time in total (optional)"
              />
            </div>
          </Col>

          <Col className={styles.recipeinfocol}>
            <span className={styles.recipeinfolabel}>Tags</span>
            <div className={styles.inputcontainer}>
              <input
                className={styles.moderninput}
                onChange={handleTagInputChange}
                type="text"
                value={tagInput}
                placeholder="Comma-separated keywords (optional)"
              />
            </div>
          </Col>
        </Row>
        <Row className={styles.recipeinforowright}>
          <Col className={styles.recipeinfocol}>
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
                placeholder="Number of portions (optional)"
              />
            </div>
          </Col>

          <Col className={styles.recipeinfocol}>
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
                <option value="">Select...</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Sauce">Sauce</option>
                <option value="Main course">Main course</option>
                <option value="Dessert">Dessert</option>
                <option value="Drink">Drink</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
