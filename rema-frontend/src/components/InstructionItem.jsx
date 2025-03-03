import styles from "../css/instructionitem.module.css";

export default function InstructionItem({
  instructionitem,
  instructions,
  setInstructions,
  index,
}) {
  function handledelete(instructionitem) {
    setInstructions(
      instructions.filter((insitem) => insitem.id !== instructionitem.id)
    );
  }

  return (
    <div className={styles.instructionitem}>
      <div className={styles.instructionitemname}>
        {index}. {instructionitem.name}
        <span>
          <button
            onClick={() => handledelete(instructionitem)}
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
