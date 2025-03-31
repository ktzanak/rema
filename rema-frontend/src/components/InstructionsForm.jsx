import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
      {
        step_number: instructions.length + 1,
        name: instruction.name,
        id: uuidv4(),
      },
    ]);
    setInstruction({ step_number: "", name: "", id: "" });
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
