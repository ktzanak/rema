import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

export default function ListRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/listrecipes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/recipes/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Refresh the recipes list after deletion
        fetchRecipes();
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  return (
    <Container>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: 600, margin: "auto", mt: 4, boxShadow: 3 }}
      >
        <Table>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id} hover>
                <TableCell>
                  <div style={{ fontWeight: "bold" }}>{recipe.title}</div>
                  <div style={{ marginTop: "4px", color: "gray" }}>
                    Time: {recipe.cooking_time} | Portions: {recipe.portions}
                  </div>
                </TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>AI</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {/*   {recipes.map((recipe, index) => (
              <TableRow key={index} hover>
                <TableCell>1</TableCell>
                <TableCell>
                  <span
                    style={{
                      background: "#2196F3",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    2
                  </span>
                </TableCell>
                <TableCell>3</TableCell>
              </TableRow>
            ))}*/}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
