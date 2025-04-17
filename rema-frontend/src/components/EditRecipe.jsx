import React from "react";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";
import IngredientsList from "./IngredientsList";
import InstructionsList from "./InstructionsList";
import RecipeInfo from "./RecipeInfo";
import styles from "../css/addrecipe.module.css";
import { Row, Col, Container } from "react-bootstrap";

export default function EditRecipe({ open, recipe, onClose, onSave }) {
  const [editedRecipe, setEditedRecipe] = React.useState({ ...recipe });

  React.useEffect(() => {
    setEditedRecipe({ ...recipe });
  }, [recipe]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe((prev) => ({ ...prev, [name]: value }));
  };
  const handleIngredientChange = (e, index) => {
    const updatedIngredients = [...editedRecipe.ingredients];
    updatedIngredients[index] = e.target.value;
    setEditedRecipe((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleInstructionChange = (e, index) => {
    const updatedInstructions = [...editedRecipe.instructions];
    updatedInstructions[index].instruction = e.target.value;
    setEditedRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const handleEditSave = () => {
    // Save the changes to the parent component or API
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

        {/*<TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          name="title"
          value={editedRecipe.title || ""}
          onChange={handleEditChange}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={editedRecipe.description || ""}
          onChange={handleEditChange}
        />
        <TextField
          label="Cooking Time"
          variant="outlined"
          fullWidth
          margin="normal"
          name="cooking_time"
          value={editedRecipe.cooking_time || ""}
          onChange={handleEditChange}
        />
        <TextField
          label="Portions"
          variant="outlined"
          fullWidth
          margin="normal"
          name="portions"
          value={editedRecipe.portions || ""}
          onChange={handleEditChange}
        />
        <Typography variant="h6">Ingredients:</Typography>
        {editedRecipe.ingredients?.map((ingredient, index) => (
          <TextField
            key={`ing-${index}`}
            label="Ingredient"
            variant="outlined"
            fullWidth
            margin="normal"
            name="ingredients"
            value={ingredient}
            onChange={(e) => handleIngredientChange(e, index)}
          />
        ))}
        <Typography variant="h6">Instructions:</Typography>
        {editedRecipe.instructions?.map((instruction, index) => (
          <TextField
            key={`ins-${index}`}
            label={`Step ${instruction.step_number}`}
            variant="outlined"
            fullWidth
            margin="normal"
            value={instruction.instruction}
            onChange={(e) => handleInstructionChange(e, index)}
          />
        ))}*/}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{ backgroundColor: "#E5E5E5", color: "#000000" }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button onClick={handleEditSave} color="success" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
