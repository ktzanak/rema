import React from "react";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";
import IngredientsList from "./IngredientsList";
import InstructionsList from "./InstructionsList";
import RecipeInfo from "./RecipeInfo";
import styles from "../css/editrecipe.module.css";
import { Row, Col, Container } from "react-bootstrap";

export default function EditRecipe({ open, recipe, onClose, onSave }) {
  const [editedRecipe, setEditedRecipe] = React.useState({ ...recipe });

  React.useEffect(() => {
    setEditedRecipe({ ...recipe });
  }, [recipe]);

  const handleEditSave = () => {
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
