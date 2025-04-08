import React from "react";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

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
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
      disableEnforceFocus
      disableRestoreFocus
    >
      <DialogTitle id="edit-dialog-title">Edit Recipe</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          name="title"
          value={editedRecipe.title}
          onChange={handleEditChange}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={editedRecipe.description}
          onChange={handleEditChange}
        />
        <TextField
          label="Cooking Time"
          variant="outlined"
          fullWidth
          margin="normal"
          name="cooking_time"
          value={editedRecipe.cooking_time}
          onChange={handleEditChange}
        />
        <TextField
          label="Portions"
          variant="outlined"
          fullWidth
          margin="normal"
          name="portions"
          value={editedRecipe.portions}
          onChange={handleEditChange}
        />
        <Typography variant="h6">Ingredients:</Typography>
        {editedRecipe.ingredients.map((ingredient, index) => (
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
        {editedRecipe.instructions.map((instruction, index) => (
          <TextField
            key={`ins-${index}`}
            label={`Step ${instruction.step_number}`}
            variant="outlined"
            fullWidth
            margin="normal"
            value={instruction.instruction} // Value for each TextField
            onChange={(e) => handleInstructionChange(e, index)} // Handle change for each TextField
          />
        ))}
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
