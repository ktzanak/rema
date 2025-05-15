import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import styles from "../css/airecipe.module.css";
import { useEffect, useState } from "react";

export default function AIRecipe({ open, onClose, recipe }) {
  const [aiRecipe, setAIRecipe] = useState(null);
  const [aimode, setAIMode] = useState("healthier");

  useEffect(() => {
    if (open && recipe) {
      fetch(`http://localhost:8000/api/askai/${recipe.id}?aimode=${aimode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      })
        .then((res) => res.json())
        .then((data) => setAIRecipe(data))
        .catch((err) => {
          console.error("Failed to fetch AI suggestion:", err);
          setAIRecipe(null);
        });
    }
  }, [open, recipe, aimode]);

  const handleModeChange = (event, newMode) => {
    if (newMode && newMode !== aimode) {
      setAIMode(newMode);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableEnforceFocus
      disableRestoreFocus
    >
      <DialogContent sx={{ pt: 2 }}>
        <Box display="flex" flexDirection="row" gap={4}>
          <Box flex={1} sx={{ pr: 2, borderRight: "1px solid #ccc" }}>
            <Typography
              variant="subtitle1"
              fontStyle="italic"
              textAlign="center"
              gutterBottom
            >
              Original Recipe
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              {recipe.title}
            </Typography>

            {recipe.description && (
              <Typography variant="body1" textAlign="center" sx={{ mb: 1 }}>
                {recipe.description}
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            <Box mb={1} textAlign="center">
              <Typography variant="subtitle1" color="textSecondary">
                Category:{" "}
                {recipe.category ? (
                  <Chip label={recipe.category} size="small" />
                ) : (
                  "-"
                )}
                <span style={{ margin: "0 3rem" }}></span>
                Tags:{" "}
                {recipe.tags?.length > 0
                  ? recipe.tags.map((tagrow) => (
                      <Chip
                        key={tagrow.id}
                        label={tagrow.tag}
                        size="small"
                        sx={{ mx: 0.5 }}
                      />
                    ))
                  : "-"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box mb={1} textAlign="center">
              <Typography variant="subtitle1" color="textSecondary">
                Cooking Time: {recipe.cooking_time || "-"}
                <span style={{ margin: "0 3rem" }}></span>
                Portions: {recipe.portions || "-"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
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

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
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

          {aiRecipe ? (
            <Box flex={1} sx={{ pl: 2 }}>
              <Typography
                variant="subtitle1"
                fontStyle="italic"
                textAlign="center"
                gutterBottom
              >
                AI Recipe ({aimode.charAt(0).toUpperCase() + aimode.slice(1)})
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
              >
                {aiRecipe.title}
              </Typography>
              {aiRecipe?.description && (
                <Typography variant="body1" textAlign="center" sx={{ mb: 1 }}>
                  {aiRecipe.description}
                </Typography>
              )}

              <Divider sx={{ my: 1 }} />

              <Box mb={1} textAlign="center">
                <Typography variant="subtitle1" color="textSecondary">
                  Category:{" "}
                  {aiRecipe?.category ? (
                    <Chip label={aiRecipe.category} size="small" />
                  ) : (
                    "-"
                  )}
                  <span style={{ margin: "0 3rem" }}></span>
                  Tags:{" "}
                  {aiRecipe?.tags?.length > 0
                    ? aiRecipe.tags.map((tagrow) => (
                        <Chip
                          key={tagrow.id}
                          label={tagrow.tag}
                          size="small"
                          sx={{ mx: 0.5 }}
                        />
                      ))
                    : "-"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box mb={1} textAlign="center">
                <Typography variant="subtitle1" color="textSecondary">
                  Cooking Time: {aiRecipe?.cooking_time || "-"}
                  <span style={{ margin: "0 3rem" }}></span>
                  Portions: {aiRecipe?.portions || "-"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              {aiRecipe?.ingredients?.length > 0 ? (
                <ul>
                  {aiRecipe.ingredients.map((ingredientrow, idx) => (
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

              <Divider sx={{ my: 1 }} />

              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              {aiRecipe?.instructions?.length > 0 ? (
                <ul className={styles.nobullets}>
                  {aiRecipe.instructions
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
          ) : (
            <Box
              flex={1}
              sx={{
                pl: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                fontStyle="italic"
                color="textSecondary"
              >
                Loading AI suggestion...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ mx: 1 }}
        >
          Close
        </Button>
        <Button
          onClick={() => setAIMode("healthier")}
          variant={aimode === "healthier" ? "contained" : "outlined"}
          color="secondary"
          sx={{ mx: 1 }}
        >
          Healthier
        </Button>
        <Button
          onClick={() => setAIMode("tastier")}
          variant={aimode === "tastier" ? "contained" : "outlined"}
          color="secondary"
          sx={{ mx: 1 }}
        >
          Tastier
        </Button>
      </DialogActions>
    </Dialog>
  );
}
