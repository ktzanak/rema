import IngredientItem from "./IngredientItem";
import styles from "../css/ingredientslist.module.css";

export default function IngredientsList({ ingredients, setIngredients }) {
  return (
    <div className={styles.list}>
      {ingredients.map((ingredientitem, index) => (
        <IngredientItem
          key={index}
          ingredientitem={ingredientitem}
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
      ))}
    </div>
  );
}
