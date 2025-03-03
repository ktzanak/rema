import styles from "../css/ingredientitem.module.css";

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
        {ingredientitem.name}
        <span>
          <button
            onClick={() => handledelete(ingredientitem)}
            className={styles.deletebutton}
          >
            x
          </button>
        </span>
      </div>
      <hr className={styles.line} />
    </div>
  );
}
