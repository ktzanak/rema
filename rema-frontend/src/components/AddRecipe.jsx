import { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PdfDocu from "./PdfDocu";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";
import IngredientsList from "./IngredientsList";
import InstructionsList from "./InstructionsList";
import RecipeInfo from "./RecipeInfo";
import styles from "../css/addrecipe.module.css";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function AddRecipe() {
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [recipeinfo, setRecipeinfo] = useState({
    name: "",
    description: "",
    totaltime: "",
    nrportions: "",
  });

  const downloadPdf = async () => {
    const fileName = "ReMa_recipe.pdf";
    const blob = await pdf(
      <PdfDocu
        recipeinfo={recipeinfo}
        ingredients={ingredients}
        instructions={instructions}
      />
    ).toBlob();
    saveAs(blob, fileName);
  };

  const saveRecipe = async () => {
    if (!recipeinfo.name.trim()) {
      alert("Title is required for saving the recipe!");
      return;
    }
  };

  return (
    <Container>
      <RecipeInfo recipeinfo={recipeinfo} setRecipeinfo={setRecipeinfo} />
      <br />
      <br />
      <br />
      <Row className={styles.inputcontainer}>
        <Col className={styles.ingredientsinstructionslabelcol}>
          <span className={styles.ingredientsinstructionslabel}>
            Ingredients
          </span>
        </Col>
        <Col className={styles.ingredientsinstructionslabelcol}>
          <span className={styles.ingredientsinstructionslabel}>
            Instructions
          </span>
        </Col>
      </Row>
      <Row className={styles.inputcontainer}>
        <Col className={styles.ingredientsform}>
          <IngredientsForm
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
        </Col>
        <Col className={styles.instructionsform}>
          <InstructionsForm
            instructions={instructions}
            setInstructions={setInstructions}
          />
        </Col>
      </Row>
      <Row className={styles.inputcontainer}>
        <Col className={styles.ingredientslist}>
          <IngredientsList
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
        </Col>

        <Col className={styles.instructionslist}>
          <InstructionsList
            instructions={instructions}
            setInstructions={setInstructions}
          />
        </Col>
      </Row>
      <br />
      <br />
      <Row className={styles.inputcontainerbutton}>
        <Col className={styles.ingredientsinstructionsbutton}>
          <button onClick={saveRecipe} className={styles.modernbuttonsave}>
            Save
          </button>
        </Col>
        <span className={styles.orText}>-or-</span>
        <Col className={styles.ingredientsinstructionsbutton}>
          <button onClick={downloadPdf} className={styles.modernbuttonexport}>
            Export to pdf
          </button>
        </Col>
      </Row>
      <br />
    </Container>
  );
}
