import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../css/ingredientsform.module.css";
import Button from "@mui/material/Button";

export default function IngredientsInstructionsForm({
  ingredients,
  setIngredients,
}) {
  const [ingredient, setIngredient] = useState({
    ingredient: "",
    id: "",
  });

  function handleSubmit1(e) {
    e.preventDefault();
    if (!ingredient.ingredient.trim()) return;
    setIngredients([
      ...ingredients,
      { ingredient: ingredient.ingredient, id: uuidv4() },
    ]);
    setIngredient({ ingredient: "", id: "" });
  }
  return (
    <form className={styles.ingredientsform} onSubmit={handleSubmit1}>
      <div className={styles.inputcontainer}>
        <input
          required
          className={styles.moderninput}
          onChange={(e) =>
            setIngredient({ ingredient: e.target.value, id: ingredient.id })
          }
          type="text"
          value={ingredient.ingredient}
          placeholder="Add each ingredient and quantity"
        />

        <Button
          type="submit"
          disableElevation
          variant="contained"
          color="success"
          sx={{
            paddingX: 2,
            paddingY: 0.6,
            borderRadius: 1,
          }}
        >
          Add
        </Button>
      </div>
    </form>
  );
}
