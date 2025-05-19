import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import EditRecipe from "./EditRecipe";
import ViewRecipe from "./Viewrecipe";
import AIRecipe from "./AIRecipe";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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

export default function ListRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dialogMode, setDialogMode] = useState(null); // view, edit, askai, delete or null
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if (!navigator.onLine) {
          setAiAvailable(false);
          return;
        }

        const res = await fetch("http://localhost:8000/api/hasOpenaiKey");
        const data = await res.json();
        setAiAvailable(data.ok);
      } catch (error) {
        console.error("Error checking AI availability:", error);
        setAiAvailable(false);
      }
    };

    checkAvailability();
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

  const filteredRecipes = recipes.filter((recipe) => {
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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSaveEditedRecipe = async (updatedRecipe) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/updaterecipe/${updatedRecipe.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRecipe),
        }
      );

      if (!response.ok) throw new Error("Failed to update recipe");

      fetchRecipes();
    } catch (error) {
      console.error("Edit failed:", error);
    } finally {
      handleCloseDialog();
    }
  };

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

  const handleDeleteConfirmation = async (selectedRecipe) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/deleterecipe/${selectedRecipe.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleRatingChange = async (raterecipeId, newRating) => {
    try {
      await fetch(`http://localhost:8000/api/raterecipe/${raterecipeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRating }),
      });
      fetchRecipes();
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  return (
    <Container>
      <TextField
        label="Search recipes by title, description, ingredient, tags or category"
        variant="outlined"
        fullWidth
        sx={{ width: "80%", margin: "2rem auto", display: "block" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer
        component={Paper}
        sx={{ width: "80%", margin: "auto", mt: 4, boxShadow: 3 }}
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
              displayedRecipes.map((recipe) => (
                <TableRow key={recipe.id} hover>
                  <TableCell sx={{ width: "68%" }}>
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
                      <Rating
                        name={`rating-${recipe.id}`}
                        value={recipe.rating}
                        precision={0.1}
                        size="small"
                        onChange={(event, newValue) =>
                          handleRatingChange(recipe.id, newValue)
                        }
                      />
                      ({recipe.rating?.toFixed(1) || "No rating"})
                    </div>
                    <div style={{ color: "gray" }}>
                      <strong>Category:</strong> {recipe.category || "-"} |
                      <strong> Cooking Time:</strong>{" "}
                      {recipe.cooking_time || "-"} |<strong> Portions:</strong>{" "}
                      {recipe.portions || "-"}
                    </div>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleOpenDialog(recipe, "view")}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog(recipe, "edit")}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenDialog(recipe, "askai")}
                      disabled={!aiAvailable}
                    >
                      AI
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDialog(recipe, "delete")}
                    >
                      Delete
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

      {dialogMode === "edit" && (
        <EditRecipe
          open={true}
          recipe={selectedRecipe}
          onClose={handleCloseDialog}
          onSave={handleSaveEditedRecipe}
        />
      )}
      {dialogMode === "view" && (
        <ViewRecipe
          open={true}
          onClose={handleCloseDialog}
          recipe={selectedRecipe}
        />
      )}
      {dialogMode === "askai" && (
        <AIRecipe
          open={true}
          recipe={selectedRecipe}
          onClose={handleCloseDialog}
        />
      )}
      {dialogMode === "delete" && (
        <Dialog
          open={true}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableEnforceFocus
          disableRestoreFocus
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this recipe?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 4 }}>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              style={{ backgroundColor: "#E5E5E5", color: "#000000" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteConfirmation(selectedRecipe)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}
