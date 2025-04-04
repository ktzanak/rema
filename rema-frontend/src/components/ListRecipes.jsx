import { useEffect, useState } from "react";
import { Row, Container, InputGroup, FormControl, Card } from "react-bootstrap";
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
} from "@mui/material";

export default function ListRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDeleteClick = (id) => {
    setSelectedRecipeId(id);
    setOpenDialog(true);
  };
  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedRecipeId(null);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedRecipes = filteredRecipes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const handleDeleteConfirmation = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/deleterecipe/${selectedRecipeId}`,
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
      setOpenDialog(false);
      setSelectedRecipeId(null);
    }
  };

  return (
    <Container>
      {/*place search field in table="Search a recipe..."*/}

      <TableContainer
        component={Paper}
        sx={{ width: "80%", margin: "auto", mt: 4, boxShadow: 3 }}
      >
        {/*No recipes yet*/}
        <Table>
          <TableBody>
            {displayedRecipes.map((recipe) => (
              <TableRow key={recipe.id} hover>
                <TableCell sx={{ width: "70%" }}>
                  <Typography variant="h5">{recipe.title}</Typography>
                  <div>{recipe.description}</div>
                  <div style={{ marginTop: "4px", color: "gray" }}>
                    Time: {recipe.cooking_time} | Portions: {recipe.portions}
                  </div>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Button variant="contained" color="primary">
                    Edit
                  </Button>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Button variant="contained" color="secondary">
                    AI
                  </Button>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(recipe.id)}
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
      <Dialog
        open={openDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this recipe?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
