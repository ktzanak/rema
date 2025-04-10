import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import EditRecipe from "./EditRecipe";
import ViewRecipe from "./Viewrecipe";
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
} from "@mui/material";

export default function ListRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipeIdToDelete, setSelectedRecipeIdToDelete] =
    useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDelete = (id) => {
    setSelectedRecipeIdToDelete(id);
    setOpenDeleteDialog(true);
  };
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedRecipeIdToDelete(null);
  };
  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenEditDialog(true);
  };
  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenViewDialog(true);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedRecipe(null);
  };
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedRecipe(null);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(lowerSearch) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(lowerSearch)
      ) ||
      recipe.description?.toLowerCase().includes(lowerSearch)
      //recipe.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch)) ||
      //recipe.categories?.some((category) => category.toLowerCase().includes(lowerSearch)) ||
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
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Edit failed:", error);
    } finally {
      setOpenEditDialog(false);
      setSelectedRecipe(null);
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

  const handleDeleteConfirmation = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/deleterecipe/${selectedRecipeIdToDelete}`,
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
    } finally {
      setOpenDeleteDialog(false);
      setSelectedRecipeIdToDelete(null);
    }
  };

  return (
    <Container>
      <TextField
        label="Search recipes by title, description or ingredient"
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
                    <div style={{ marginTop: "4px", color: "gray" }}>
                      Cooking Time: {recipe.cooking_time} | Portions:{" "}
                      {recipe.portions}
                    </div>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleView(recipe)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(recipe)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button variant="contained" color="secondary">
                      AI
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "8%" }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(recipe.id)}
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

      <EditRecipe
        open={openEditDialog}
        recipe={selectedRecipe}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEditedRecipe}
      />
      <ViewRecipe
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        recipe={selectedRecipe}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this recipe?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            variant="contained"
            style={{ backgroundColor: "#E5E5E5", color: "#000000" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
