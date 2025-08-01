import styles from "../css/instructionitem.module.css";
import Button from "@mui/material/Button";

export default function InstructionItem({
  instructionitem,
  instructions,
  setInstructions,
  index,
}) {
  function handledelete(instructionitem) {
    setInstructions(
      instructions
        .filter((insitem) => insitem.id !== instructionitem.id)
        .map((item, idx) => ({
          ...item,
          step_number: idx + 1,
        }))
    );
  }

  return (
    <div className={styles.instructionitem}>
      <div className={styles.instructionitemname}>
        {instructionitem.step_number != null
          ? instructionitem.step_number
          : index}
        . {instructionitem.instruction}
        <span>
          <Button
            onClick={() => handledelete(instructionitem)}
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
