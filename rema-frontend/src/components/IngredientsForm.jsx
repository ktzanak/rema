import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../css/ingredientsform.module.css";

export default function IngredientsInstructionsForm({
  ingredients,
  setIngredients,
}) {
  const [ingredient, setIngredient] = useState({
    name: "",
    id: "",
  });

  function handleSubmit1(e) {
    e.preventDefault();
    if (!ingredient.name.trim()) return;
    setIngredients([...ingredients, { name: ingredient.name, id: uuidv4() }]);
    setIngredient({ name: "", id: "" });
  }
  return (
    <form className={styles.ingredientsform} onSubmit={handleSubmit1}>
      <div className={styles.inputcontainer}>
        <input
          required
          className={styles.moderninput}
          onChange={(e) =>
            setIngredient({ name: e.target.value, id: ingredient.id })
          }
          type="text"
          value={ingredient.name}
          placeholder="Add each ingredient and quantity"
        />
        <button className={styles.modernbutton} type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
