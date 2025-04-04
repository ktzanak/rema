import { useEffect, useState } from "react";
import { Container, InputGroup, FormControl, Card } from "react-bootstrap";
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
  Paper,
  Button,
} from "@mui/material";

export default function ListRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

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
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <TableContainer
        component={Paper}
        sx={{ width: "80%", margin: "auto", mt: 4, boxShadow: 3 }}
      >
        <Card className="text-center mt-4">
          <Card.Body>
            <Card.Title>No recipes yet</Card.Title>
            <Card.Text>Add some recipes to see them listed here.</Card.Text>
          </Card.Body>
        </Card>
        <Table>
          <TableBody>
            {filteredRecipes.map((recipe) => (
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              showFirstButton
              showLastButton
              //count={pageCount || 0}
              //rowsPerPage={pagination?.pageSize || 10}
              //page={pagination?.pageIndex || 0}
            />
          </TableBody>
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
