import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import styles from "../css/recipeinfo.module.css";

export default function RecipeInfo({ recipeinfo, setRecipeinfo }) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
                  name: e.target.value,
                })
              }
              type="text"
              value={recipeinfo?.name || ""}
              placeholder="Add a title"
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
              placeholder="Add a description (optional)"
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
                    totaltime: e.target.value,
                  })
                }
                type="text"
                value={recipeinfo?.totaltime || ""}
                placeholder="Add time in total (optional)"
              />
            </div>
          </Col>

          <Col className={styles.recipeinfocol}>
            <span className={styles.recipeinfolabel}>Tags</span>
            <div className={styles.inputcontainer}>
              <input
                className={styles.moderninput}
                onChange={(e) =>
                  setRecipeinfo({
                    ...recipeinfo,
                    tags: e.target.value,
                  })
                }
                type="text"
                value={recipeinfo?.tags || ""}
                placeholder="Add search tags or keywords (optional)"
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
                    nrportions: e.target.value,
                  })
                }
                type="text"
                value={recipeinfo?.nrportions || ""}
                placeholder="Add number of portions (optional)"
              />
            </div>
          </Col>

          <Col className={styles.recipeinfocol}>
            <span className={styles.recipeinfolabel}>Category</span>
            <div className={styles.inputcontainer}>
              <select
                id="dropdown"
                value={selectedValue}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  width: "100%",
                  margin: "5px",
                }}
              >
                <option>Select...</option>
                <option value="appetizer">Appetizer</option>
                <option value="dessert">Sauce</option>
                <option value="maindish">Main dish</option>
                <option value="dessert">Dessert</option>
                <option value="dessert">Drink</option>
              </select>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
