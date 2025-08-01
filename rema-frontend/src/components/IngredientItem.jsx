import styles from "../css/ingredientitem.module.css";
import Button from "@mui/material/Button";

export default function IngredientItem({
  ingredientitem,
  ingredients,
  setIngredients,
}) {
  function handledelete(ingredientitem) {
    setIngredients(
      ingredients.filter((ingitem) => ingitem.id !== ingredientitem.id)
    );
  }

  return (
    <div className={styles.ingredientitem}>
      <div className={styles.ingredientitemname}>
        {ingredientitem.ingredient}
        <span>
          <Button
            onClick={() => handledelete(ingredientitem)}
            disableElevation
            variant="contained"
            color="success"
            sx={{
              minWidth: "unset",
              paddingX: 1.5,
              paddingY: 0.5,
              borderRadius: 1,
              backgroundColor: "#82b366",
            }}
          >
            x
          </Button>
        </span>
      </div>
      <hr className={styles.line} />
    </div>
  );
}
