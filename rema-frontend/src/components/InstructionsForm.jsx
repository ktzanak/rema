import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../css/instructionsform.module.css";
import Button from "@mui/material/Button";

export default function IngredientsInstructionsForm({
  instructions,
  setInstructions,
}) {
  const [instruction, setInstruction] = useState({
    instruction: "",
    id: "",
  });

  function handleSubmit2(e) {
    e.preventDefault();
    if (!instruction.instruction.trim()) return;
    setInstructions([
      ...instructions,
      {
        step_number: instructions.length + 1,
        instruction: instruction.instruction,
        id: uuidv4(),
      },
    ]);
    setInstruction({ step_number: "", instruction: "", id: "" });
  }
  return (
    <form className={styles.instructionsform} onSubmit={handleSubmit2}>
      <div className={styles.inputcontainer}>
        <input
          required
          className={styles.moderninput}
          onChange={(e) =>
            setInstruction({ instruction: e.target.value, id: instruction.id })
          }
          type="text"
          value={instruction.instruction}
          placeholder="Add each instruction"
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
