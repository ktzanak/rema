import InstructionItem from "./InstructionItem";
import styles from "../css/instructionslist.module.css";

export default function InstructionsList({ instructions, setInstructions }) {
  return (
    <div className={styles.list}>
      {instructions.map((instructionitem, index) => (
        <InstructionItem
          key={index}
          instructionitem={instructionitem}
          instructions={instructions}
          setInstructions={setInstructions}
          index={index + 1}
        />
      ))}
    </div>
  );
}
