import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";
import IngredientsList from "./IngredientsList";
import InstructionsList from "./InstructionsList";
import RecipeInfo from "./RecipeInfo";
import styles from "../css/editrecipe.module.css";
import { Row, Col, Container } from "react-bootstrap";

export default function EditRecipe({ open, recipe, onClose, onSave }) {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [saveStatus, setSaveStatus] = useState({ message: "", type: "error" });

  useEffect(() => {
    setEditedRecipe({ ...recipe });
  }, [recipe]);

  const handleEditSave = () => {
    if (!editedRecipe.title.trim()) {
      setSaveStatus({
        message: "Title is required for saving the recipe!",
        type: "error",
      });
      return;
    }
    setSaveStatus({ message: "", type: "" });
    onSave(editedRecipe);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
      disableEnforceFocus
      disableRestoreFocus
      fullWidth
      maxWidth="lg"
    >
      <DialogContent>
        <Container>
          <RecipeInfo
            recipeinfo={editedRecipe}
            setRecipeinfo={(info) =>
              setEditedRecipe((prev) => ({
                ...prev,
                ...info,
              }))
            }
          />

          <div className={styles.spacer}></div>

          <Row className={styles.inputcontainer}>
            <Col className={styles.ingredientsinstructionslabelcol}>
              <span className={styles.ingredientsinstructionslabel}>
                Ingredients
              </span>
            </Col>
            <Col className={styles.ingredientsinstructionslabelcol}>
              <span className={styles.ingredientsinstructionslabel}>
                Instructions
              </span>
            </Col>
          </Row>

          <Row className={styles.inputcontainer}>
            <Col className={styles.ingredientsform}>
              <IngredientsForm
                ingredients={editedRecipe.ingredients}
                setIngredients={(ings) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    ingredients: ings,
                  }))
                }
              />
            </Col>
            <Col className={styles.instructionsform}>
              <InstructionsForm
                instructions={editedRecipe.instructions}
                setInstructions={(inst) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    instructions: inst,
                  }))
                }
              />
            </Col>
          </Row>

          <Row className={styles.inputcontainer}>
            <Col className={styles.ingredientslist}>
              <IngredientsList
                ingredients={editedRecipe.ingredients}
                setIngredients={(ings) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    ingredients: ings,
                  }))
                }
              />
            </Col>

            <Col className={styles.instructionslist}>
              <InstructionsList
                instructions={editedRecipe.instructions}
                setInstructions={(inst) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    instructions: inst,
                  }))
                }
              />
            </Col>
          </Row>
          <br />
          <Row className={styles.saveStatusContainer}>
            <Col className="text-center">
              {saveStatus.message && (
                <Row className="text-center mt-3">
                  <Col>
                    <p className={styles.saveStatusError}>
                      {saveStatus.message}
                    </p>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 4 }}>
        <Button
          onClick={onClose}
          style={{ backgroundColor: "#E5E5E5", color: "#000000" }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button onClick={handleEditSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
