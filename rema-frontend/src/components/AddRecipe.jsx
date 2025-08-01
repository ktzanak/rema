import { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";
import IngredientsList from "./IngredientsList";
import InstructionsList from "./InstructionsList";
import RecipeInfo from "./RecipeInfo";
import styles from "../css/addrecipe.module.css";
import Button from "@mui/material/Button";

export default function AddRecipe() {
  const [saveStatus, setSaveStatus] = useState({ message: "", type: "" });
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [recipeinfo, setRecipeinfo] = useState({
    title: "",
    description: "",
    cooking_time: "",
    portions: "",
  });

  const saveRecipe = async () => {
    if (!recipeinfo.title.trim()) {
      setSaveStatus({
        message: "Title is required for saving the recipe!",
        type: "error",
      });
      return;
    }

    const recipeData = {
      title: recipeinfo.title,
      description: recipeinfo.description,
      cooking_time: recipeinfo.cooking_time,
      portions: recipeinfo.portions,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      ingredients: ingredients,
      instructions: instructions,
      category: category,
      tags: tags,
    };

    try {
      const response = await fetch("http://localhost:8000/api/addrecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveStatus({
          message: "Recipe saved successfully!",
          type: "success",
        });
        setRecipeinfo({
          title: "",
          description: "",
          cooking_time: "",
          portions: "",
        });
        setIngredients([]);
        setInstructions([]);
        setTags([]);
        setCategory([]);
      } else {
        setSaveStatus({ message: `Error: ${data.error}`, type: "error" });
      }
    } catch (error) {
      setSaveStatus({
        message: "Failed to save the recipe. Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <Container>
      <RecipeInfo
        recipeinfo={recipeinfo}
        setRecipeinfo={setRecipeinfo}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
      />
      <div className={styles.spacer}></div>
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
      <Row className={styles.saveStatusContainer}>
        <Col className="text-center">
          {saveStatus.message && (
            <p
              className={
                saveStatus.type === "success"
                  ? styles.saveStatusSuccess
                  : styles.saveStatusError
              }
            >
              {saveStatus.message}
            </p>
          )}
        </Col>
      </Row>
      <Row className={styles.inputcontainerbutton}>
        <Col className={styles.ingredientsinstructionsbutton}>
          <Button variant="contained" color="primary" onClick={saveRecipe}>
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
