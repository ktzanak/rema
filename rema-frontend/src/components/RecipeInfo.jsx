import { Row, Col } from "react-bootstrap";
import styles from "../css/recipeinfo.module.css";

export default function RecipeInfo({
  recipeinfo,
  setRecipeinfo,
  tags,
  setTags,
  categories,
  setCategories,
}) {
  const handleCategoryChange = (event) => {
    setCategories([event.target.value]);
  };

  const handleTagsChange = (event) => {
    setTags(
      event.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    );
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
                onChange={handleTagsChange}
                type="text"
                value={tags.join(", ")}
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
                value={categories[0] || ""}
                onChange={handleCategoryChange}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  width: "100%",
                  margin: "5px",
                }}
              >
                <option value="">Select...</option>
                <option value="appetizer">Appetizer</option>
                <option value="sauce">Sauce</option>
                <option value="maincourse">Main course</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
                <option value="other">Other</option>
              </select>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
