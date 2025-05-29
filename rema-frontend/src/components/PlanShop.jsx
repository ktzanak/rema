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
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());

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

    if (destination.droppableId.startsWith("day-")) {
      const droppedRecipe = recipes.find(
        (recipe) => recipe.id.toString() === draggableId
      );

      setMealPool((prev) => {
        const updated = { ...prev };
        const day = destination.droppableId;

        if (!updated[day]) updated[day] = [];
        updated[day].push(droppedRecipe);

        return updated;
      });
    }
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row style={{ display: "flex", alignItems: "stretch" }}>
          <Col style={{ width: "25%" }}>
            <TextField
              label="Search recipes by title, description, ingredient, tags or category"
              variant="outlined"
              fullWidth
              sx={{ margin: "2rem 1rem" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 3, margin: "0rem 1rem" }}
            >
              <Table>
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
                                  <Typography variant="h6">
                                    {recipe.title}
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
                                    {recipe.cooking_time || "-"}
                                  </div>
                                  <div style={{ color: "gray" }}>
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
                margin: "1rem 1rem",
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
          <Col style={{ width: "43%", margin: "2rem 3rem" }}>
            <MonthPlanner
              year={selectedDate.getFullYear()}
              month={selectedDate.getMonth()}
              mealPool={mealPool}
              setMealPool={setMealPool}
            />
            <Button onClick={handlePrevMonth}>Previous</Button>
            <Button onClick={handleNextMonth}>Next</Button>
          </Col>
          <Col style={{ width: "25%" }}>
            <ShoppingList />
          </Col>

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
