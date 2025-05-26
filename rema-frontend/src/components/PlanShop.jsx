import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ViewRecipe from "./Viewrecipe";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  TableFooter,
  Paper,
  Button,
  TextField,
  Rating,
} from "@mui/material";
//import ShoppingList from "./ShoppingList"; // if used
//import WeeklyPlanner from "./WeeklyPlanner"; // if used

export default function PlanShop() {
  const [mealPool, setMealPool] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogMode, setDialogMode] = useState(null);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/listrecipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setMealPool(data);
    } catch (error) {
      console.error("Error fetching meal pool:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (recipe, mode) => {
    setDialogMode(mode);
    setSelectedRecipe(recipe);
  };
  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedRecipe(null);
  };

  const filteredRecipes = mealPool.filter((recipe) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(lowerSearch) ||
      recipe.ingredients?.some((ingredientrow) =>
        ingredientrow.ingredient.toLowerCase().includes(lowerSearch)
      ) ||
      recipe.description?.toLowerCase().includes(lowerSearch) ||
      recipe.tags?.some((tagrow) =>
        tagrow.tag.toLowerCase().includes(lowerSearch)
      ) ||
      recipe.category?.toLowerCase().includes(lowerSearch)
    );
  });

  const displayedRecipes = filteredRecipes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container>
      <TextField
        label="Search recipes by title, description, ingredient, tags or category"
        variant="outlined"
        fullWidth
        sx={{ width: "30%", margin: "2rem auto", display: "block" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer
        component={Paper}
        sx={{ width: "30%", margin: "auto", mt: 4, boxShadow: 3 }}
      >
        <Table>
          <TableBody>
            {displayedRecipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No recipes...
                </TableCell>
              </TableRow>
            ) : (
              mealPool.map((recipe) => (
                <TableRow key={recipe.id} hover>
                  <TableCell sx={{ width: "90%" }}>
                    <Typography variant="h6">{recipe.title}</Typography>
                    <div
                      style={{
                        color: "gray",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <strong>Rating:</strong>
                      <div
                        onClick={() => handleOpenDialog(recipe, "rate")}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Rating
                          name={`rating-${recipe.id}`}
                          value={recipe.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                      </div>
                      ({recipe.rating?.toFixed(1) || "No rating"})
                    </div>
                    <div style={{ color: "gray" }}>
                      <strong>Category:</strong> {recipe.category || "-"} |
                      <strong>Time:</strong> {recipe.cooking_time || "-"} |
                      <strong>Portions:</strong> {recipe.portions || "-"}
                    </div>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleOpenDialog(recipe, "view")}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                count={filteredRecipes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showFirstButton
                showLastButton
                labelRowsPerPage="Recipes per page"
                labelDisplayedRows={({ from, to, count }) =>
                  `Showing ${from}-${to} of ${count}`
                }
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {dialogMode === "view" && (
        <ViewRecipe
          open={true}
          onClose={handleCloseDialog}
          recipe={selectedRecipe}
        />
      )}
    </Container>
  );
}
