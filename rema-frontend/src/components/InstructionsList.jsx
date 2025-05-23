import InstructionItem from "./InstructionItem";
import styles from "../css/instructionslist.module.css";

export default function InstructionsList({ instructions, setInstructions }) {
  const sortedInstructions = [...instructions].sort((a, b) => {
    if (a.step_number != null && b.step_number != null) {
      return a.step_number - b.step_number;
    }
    return 0;
  });
  return (
    <div className={styles.list}>
      {sortedInstructions.map((instructionitem, index) => (
        <InstructionItem
          key={instructionitem.id ?? index}
          instructionitem={instructionitem}
          instructions={instructions}
          setInstructions={setInstructions}
          index={
            instructionitem.step_number != null
              ? instructionitem.step_number
              : index + 1
          }
        />
      ))}
    </div>
  );
}
