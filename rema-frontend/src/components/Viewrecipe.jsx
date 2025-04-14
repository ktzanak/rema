import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PdfDocu from "./PdfDocu";

export default function ViewRecipe({ open, onClose, recipe }) {
  const downloadPdf = async () => {
    const fileName = "ReMa_recipe.pdf";
    const blob = await pdf(
      <PdfDocu
        recipeinfo={{
          title: recipe.title,
          cooking_time: recipe.cooking_time,
          portions: recipe.portions,
          description: recipe.description,
        }}
        ingredients={recipe.ingredients}
        instructions={recipe.instructions}
      />
    ).toBlob();
    saveAs(blob, fileName);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
      disableRestoreFocus
    >
      <DialogTitle>{recipe.title}</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="subtitle1" color="textSecondary">
            Cooking Time: {recipe.cooking_time} | Portions: {recipe.portions}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box mb={2}>
          <Typography variant="h6">Description</Typography>
          <Typography variant="body1">{recipe.description}</Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h6">Ingredients</Typography>
          <ul style={{ marginLeft: "1rem" }}>
            {recipe?.ingredients.map((ing, idx) => (
              <li key={idx}>
                <Typography variant="body2">{ing}</Typography>
              </li>
            ))}
          </ul>
        </Box>

        {recipe?.instructions.length > 0 && (
          <Box>
            <Typography variant="h6">Instructions</Typography>
            <ol style={{ marginLeft: "1rem" }}>
              {recipe.instructions.map((instructionrow, idx) => (
                <li key={`${idx}_${instructionrow.step_number}`}>
                  <Typography variant="body2">
                    {instructionrow.instruction}
                  </Typography>
                </li>
              ))}
            </ol>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
        <Button onClick={downloadPdf} variant="contained" color="error">
          Export to pdf
        </Button>
      </DialogActions>
    </Dialog>
  );
}
