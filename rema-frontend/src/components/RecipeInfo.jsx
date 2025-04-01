import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import styles from "../css/recipeinfo.module.css";

export default function RecipeInfo({ recipeinfo, setRecipeinfo }) {
  return (
    <Row className={styles.inputcontainer}>
      <Col className={styles.recipeinfocol1}>
        <Row className={styles.recipeinforow}>
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
        <Row className={styles.recipeinforow}>
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
      <Col className={styles.recipeinfocol2}>
        <Row className={styles.recipeinforow}>
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
        </Row>
        <Row className={styles.recipeinforow}>
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
        </Row>
      </Col>
    </Row>
  );
}
