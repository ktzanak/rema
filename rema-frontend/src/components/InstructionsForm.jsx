import { useState } from "react";
import styles from "../css/instructionsform.module.css";

export default function IngredientsInstructionsForm({
  instructions,
  setInstructions,
}) {
  const [instruction, setInstruction] = useState({
    name: "",
    id: "",
  });

  function handleSubmit2(e) {
    e.preventDefault();
    if (!instruction.name.trim()) return;
    setInstructions([
      ...instructions,
      { name: instruction.name, id: Date.now() },
    ]);
    setInstruction({ name: "", id: "" });
  }
  return (
    <form className={styles.instructionsform} onSubmit={handleSubmit2}>
      <div className={styles.inputcontainer}>
        <input
          required
          className={styles.moderninput}
          onChange={(e) =>
            setInstruction({ name: e.target.value, id: instruction.id })
          }
          type="text"
          value={instruction.name}
          placeholder="Add each instruction"
        />
        <button className={styles.modernbutton} type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
