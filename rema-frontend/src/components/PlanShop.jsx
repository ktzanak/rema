import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ViewRecipe from "./Viewrecipe";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box } from "@mui/material";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Paper,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import MonthPlanner from "./MonthPlanner";
import ShoppingList from "./ShoppingList";

export default function PlanShop() {
  const [mealPool, setMealPool] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/listrecipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);
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

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const droppedRecipe = recipes.find(
      (recipe) => recipe.id.toString() === draggableId
    );
    if (!droppedRecipe) return;

    setMealPool((prev) => {
      const updated = { ...prev };

      // Case 1: Drag from recipeList to a day droppable
      if (
        source.droppableId === "recipeList" &&
        destination.droppableId.startsWith("day-")
      ) {
        if (!updated[destination.droppableId])
          updated[destination.droppableId] = [];

        // Check if meal already exists in the day and insert at destination index to preserve order
        const alreadyExists = updated[destination.droppableId].some(
          (meal) => meal.id === droppedRecipe.id
        );
        if (!alreadyExists) {
          updated[destination.droppableId].splice(
            destination.index,
            0,
            droppedRecipe
          );
        }

        return updated;
      }

      // Case 2: Drag within calendar days (reorder or move)
      if (
        source.droppableId.startsWith("day-") &&
        destination.droppableId.startsWith("day-")
      ) {
        // Remove from source
        if (updated[source.droppableId]) {
          updated[source.droppableId] = updated[source.droppableId].filter(
            (meal) => meal.id.toString() !== draggableId
          );
        }

        // Add to destination
        if (!updated[destination.droppableId])
          updated[destination.droppableId] = [];
        updated[destination.droppableId].splice(
          destination.index,
          0,
          droppedRecipe
        );

        return updated;
      }

      return prev;
    });
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row style={{ display: "flex", alignItems: "stretch" }}>
          <Col style={{ width: "25%", margin: "1.5rem 1rem" }}>
            <TextField
              label="Search recipes by title, description, ingredient, tags or category"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 3, margin: "1rem 0rem" }}
            >
              <Table size="small">
                <Droppable droppableId="recipeList">
                  {(provided) => (
                    <TableBody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {displayedRecipes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No recipes...
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayedRecipes.map((recipe, index) => (
                          <Draggable
                            key={recipe.id}
                            draggableId={recipe.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                hover
                              >
                                <TableCell>
                                  <Typography variant="subtitle1">
                                    <strong>{recipe.title}</strong>
                                  </Typography>
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
                                      name={`readonly-rating-${recipe.id}`}
                                      value={recipe.rating}
                                      precision={0.1}
                                      size="small"
                                      readOnly
                                    />
                                    ({recipe.rating?.toFixed(1) || "No rating"})
                                  </div>
                                  <div style={{ color: "gray" }}>
                                    <strong> Time:</strong>{" "}
                                    {recipe.cooking_time || "-"} |{" "}
                                    <strong>Portions:</strong>{" "}
                                    {recipe.portions || "-"}
                                  </div>
                                </TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() =>
                                      handleOpenDialog(recipe, "view")
                                    }
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="center"
              mt={2}
              sx={{
                width: "100%",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                backgroundColor: "white",
              }}
            >
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 20]}
                count={filteredRecipes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => handleChangePage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage=""
                showFirstButton
                showLastButton
                labelDisplayedRows={({ from, to, count }) =>
                  `Showing ${from}-${to} of ${count}`
                }
                sx={{
                  display: "table",
                  "& .MuiToolbar-root": {
                    paddingLeft: 0,
                    paddingRight: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    justifyContent: "center",
                  },
                  "& .MuiTablePagination-actions": {
                    margin: 0,
                    padding: 0,
                  },
                  "& .MuiTablePagination-selectLabel": {
                    margin: 0,
                    padding: 0,
                  },
                  "& .MuiTablePagination-select": {
                    margin: 0,
                    padding: 0,
                  },
                  "& .MuiTablePagination-displayedRows": {
                    margin: 0,
                    padding: 0,
                  },
                }}
              />
            </Box>
          </Col>
          <Col style={{ width: "70%", margin: "1.5rem 1rem" }}>
            <MonthPlanner mealPool={mealPool} />
          </Col>
          {/*<Col style={{ width: "25%", margin: "1.5rem 1rem" }}>
            <ShoppingList />
          </Col>*/}

          {dialogMode === "view" && (
            <ViewRecipe
              open={true}
              onClose={handleCloseDialog}
              recipe={selectedRecipe}
            />
          )}
        </Row>
      </DragDropContext>
    </Container>
  );
}
