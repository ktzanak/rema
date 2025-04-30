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
import styles from "../css/viewrecipe.module.css";

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
      maxWidth="md"
      fullWidth
      disableEnforceFocus
      disableRestoreFocus
    >
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", mb: 0, pb: 0 }}
      >
        {recipe.title}
      </DialogTitle>
      {recipe.description && (
        <Typography sx={{ mb: 1 }} variant="body1" textAlign="center">
          {recipe.description}
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <DialogContent sx={{ pt: 0, mt: 0 }}>
        <Box mb={2} textAlign="center">
          <Typography variant="subtitle1" color="textSecondary">
            Cooking Time: {recipe.cooking_time || "-"}
            <span style={{ margin: "0 3rem" }}></span>
            Portions: {recipe.portions || "-"}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          <Box sx={{ width: "30%" }}>
            <Typography variant="h6">Ingredients</Typography>
            {recipe.ingredients?.length > 0 ? (
              <ul>
                {recipe.ingredients.map((ingredientrow, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">
                      {ingredientrow.ingredient}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography
                variant="body2"
                fontStyle="italic"
                color="textSecondary"
              >
                No ingredients
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            <Typography variant="h6">Instructions</Typography>
            {recipe.instructions?.length > 0 ? (
              <ul className={styles.nobullets}>
                {recipe.instructions
                  .sort((a, b) => a.step_number - b.step_number)
                  .map((instructionrow, idx) => (
                    <li key={`${idx}_${instructionrow.step_number}`}>
                      <Typography variant="body2">
                        {instructionrow.step_number}.{" "}
                        {instructionrow.instruction}
                      </Typography>
                    </li>
                  ))}
              </ul>
            ) : (
              <Typography
                variant="body2"
                fontStyle="italic"
                color="textSecondary"
              >
                No instructions
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 4 }}>
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
