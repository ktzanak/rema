import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ViewRecipe from "./Viewrecipe";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  Typography,
  TablePagination,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import MonthPlanner from "./MonthPlanner";

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

  const handleOpenDialog = (recipe, mode) => {
    setDialogMode(mode);
    setSelectedRecipe(recipe);
  };
  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedRecipe(null);
  };

  const filteredRecipes = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return recipes.filter(
      (recipe) =>
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
  }, [recipes, searchTerm]);

  const displayedRecipes = useMemo(() => {
    return filteredRecipes.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredRecipes, page, rowsPerPage]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const droppedRecipe = recipes.find(
      (recipe) => recipe.id.toString() === draggableId
    );
    if (!droppedRecipe) return;

    setMealPool((prev) => {
      const updated = { ...prev };

      if (
        source.droppableId === "recipeList" &&
        destination.droppableId.startsWith("day-")
      ) {
        if (!updated[destination.droppableId])
          updated[destination.droppableId] = [];

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

      if (
        source.droppableId.startsWith("day-") &&
        destination.droppableId.startsWith("day-")
      ) {
        if (updated[source.droppableId]) {
          updated[source.droppableId] = updated[source.droppableId].filter(
            (meal) => meal.id.toString() !== draggableId
          );
        }

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

  const handleRemoveMeal = (dayId, mealId) => {
    setMealPool((prev) => {
      const updated = { ...prev };
      updated[dayId] = updated[dayId].filter((meal) => meal.id !== mealId);
      return updated;
    });
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row style={{ display: "flex", alignItems: "stretch" }}>
          <Col
            style={{
              width: "25%",
              padding: "0rem 1rem",
              position: "sticky",
              top: "62.5px",
              alignSelf: "flex-start",
              height: "fit-content",
              paddingTop: "25.5px",
              zIndex: 100,
            }}
          >
            <Box display="flex" justifyContent="flex-end">
              <Tooltip
                title={
                  <Typography sx={{ fontSize: "1rem" }}>
                    Drag and drop recipes from the list to the calendar on the
                    right
                  </Typography>
                }
              >
                <InfoOutlinedIcon
                  color="action"
                  fontSize="medium"
                  sx={{ cursor: "help", mb: 1 }}
                />
              </Tooltip>
            </Box>
            <TextField
              label="Search recipes by title, description, ingredient, tags or category"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "0.75rem",
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  fontSize: "1rem",
                },
              }}
            />

            <Box
              sx={{
                boxShadow: 3,
                margin: "1rem 0rem",
                borderRadius: 2,
              }}
            >
              <Droppable droppableId="recipeList">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    display="flex"
                    flexDirection="column"
                    gap={1}
                  >
                    {displayedRecipes.length === 0 ? (
                      <Typography align="center" color="textSecondary">
                        No recipes...
                      </Typography>
                    ) : (
                      displayedRecipes.map((recipe, index) => (
                        <React.Fragment key={recipe.id}>
                          <Draggable
                            draggableId={recipe.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <>
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    px: 1,
                                    py: 0,
                                    backgroundColor: "#fafafa",
                                    "&:hover": {
                                      backgroundColor: "#f0f0f0",
                                      cursor: "grab",
                                    },
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                    >
                                      {recipe.title}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        color: "gray",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                      >
                                        Rating:
                                      </Typography>
                                      <Rating
                                        name={`readonly-rating-${recipe.id}`}
                                        value={recipe.rating}
                                        precision={0.1}
                                        size="small"
                                        readOnly
                                      />
                                      <Typography variant="body2">
                                        (
                                        {recipe.rating?.toFixed(1) ||
                                          "No rating"}
                                        )
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" color="gray">
                                      <strong>Time:</strong>{" "}
                                      {recipe.cooking_time || "-"} |{" "}
                                      <strong>Portions:</strong>{" "}
                                      {recipe.portions || "-"}
                                    </Typography>
                                  </Box>
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    onClick={() =>
                                      handleOpenDialog(recipe, "view")
                                    }
                                  >
                                    View
                                  </Button>
                                </Box>
                                {index !== displayedRecipes.length - 1 &&
                                  !snapshot.isDragging && (
                                    <Box
                                      sx={{
                                        width: "90%",
                                        px: 2,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          height: "1px",
                                          backgroundColor: "#ddd",
                                          my: 0,
                                        }}
                                      />
                                    </Box>
                                  )}
                              </>
                            )}
                          </Draggable>
                        </React.Fragment>
                      ))
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              mt={0}
              sx={{
                width: "100%",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                backgroundColor: "white",
                margin: 0,
                padding: 0,
              }}
            >
              <TablePagination
                component="div"
                rowsPerPageOptions={[]}
                count={filteredRecipes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => handleChangePage(newPage)}
                labelRowsPerPage=""
                showFirstButton
                showLastButton
                labelDisplayedRows={({ from, to, count }) =>
                  `Showing ${from}-${to} out of ${count}`
                }
                sx={{
                  display: "table",
                  margin: 0,
                  padding: 0,
                  "& .MuiTablePagination-toolbar": {
                    minHeight: "32px",
                    height: "32px",
                    padding: 0,
                  },
                  "& .MuiToolbar-root": {
                    minHeight: "22px",

                    padding: 0,
                    margin: 0,
                    justifyContent: "center",
                  },
                  "& .MuiTablePagination-actions": {
                    margin: 0,
                    padding: 0,
                  },
                  "& .MuiTablePagination-selectLabel": {
                    margin: 0,
                    padding: 0,
                    display: "none",
                  },
                  "& .MuiTablePagination-select": {
                    margin: 0,
                    padding: 0,
                    display: "none",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    fontSize: "0.8rem",
                    margin: 0,
                    padding: 0,
                  },
                }}
              />
            </Box>
          </Col>
          <Col
            style={{
              width: "70%",
              padding: "0rem 1rem",
            }}
          >
            <MonthPlanner mealPool={mealPool} onRemoveMeal={handleRemoveMeal} />
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
