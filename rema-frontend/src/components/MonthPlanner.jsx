import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import {
  Paper,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Close } from "@mui/icons-material";
import ShoppingListPdf from "./ShoppingListPdf";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

function getStartOfWeek(date) {
  const day = date.getDay(); // Sunday = 0
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  return start;
}

function getIngredientsForRecipes(recipeIds) {
  return allIngredients.filter((item) => recipeIds.includes(item.recipe_id));
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthPlanner({ mealPool, onRemoveMeal }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const baseDate = new Date(today);
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const currentWeekStart = getStartOfWeek(baseDate);

  const isToday = (date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    return day;
  });

  const firstMonth = days[0].getMonth();
  const lastMonth = days[6].getMonth();
  const yearDisplayed = days[3].getFullYear();

  const isPastDay = (date) => {
    const todayNoTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return checkDate < todayNoTime;
  };

  const downloadPdf = async () => {
    const formatteddate1 = `${today.getDate()}_${
      today.getMonth() + 1
    }_${today.getFullYear()}`;
    const formatteddate2 = `${today.getDate()}.${
      today.getMonth() + 1
    }.${today.getFullYear()}`;
    const fileName = "ReMa_shopping_list_" + formatteddate1 + ".pdf";

    const recipeIdsCurrentWeek = [];
    days.forEach((day) => {
      const droppableId = `day-${day.getFullYear()}-${
        day.getMonth() + 1
      }-${day.getDate()}`;
      const meals = mealPool?.[droppableId] || [];
      meals.forEach((meal) => {
        if (meal.recipe_id) recipeIdsCurrentWeek.push(meal.recipe_id);
      });
    });

    // Deduplicate recipe IDs
    const uniqueRecipeIdsCurrentWeek = [...new Set(recipeIdsCurrentWeek)];
    const ingredients = getIngredientsForRecipes(uniqueRecipeIdsCurrentWeek);

    const blob = await pdf(
      <ShoppingListPdf todaydate={formatteddate2} ingredients={ingredients} />
    ).toBlob();
    saveAs(blob, fileName);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 0,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <IconButton onClick={() => setWeekOffset((prev) => prev - 1)}>
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton onClick={() => setWeekOffset((prev) => prev + 1)}>
            <ArrowForwardIos fontSize="small" />
          </IconButton>
          <Typography variant="h6">
            {firstMonth === lastMonth
              ? `${monthNames[firstMonth]} ${days[3].getFullYear()}`
              : `${monthNames[firstMonth]} – ${monthNames[lastMonth]} ${yearDisplayed}`}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={downloadPdf}
        >
          Weekly shopping list
        </Button>
      </Box>

      <Box display="flex" width="100%">
        {days.map((day, idx) => (
          <Box key={idx} flex="1 1 0" px={0.5}>
            <Typography
              variant="body2"
              align="center"
              sx={{
                fontWeight: "bold",
                color: isToday(day)
                  ? "#1976d2"
                  : isPastDay(day)
                  ? "#aaa"
                  : "#666",
                opacity: isPastDay(day) ? 0.6 : 1,
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              {weekNames[idx]} {day.getDate()}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Droppable areas for 7 days */}
      <Box display="flex" width="100%" mt={1}>
        {days.map((day, idx) => {
          const droppableId = `day-${day.getFullYear()}-${
            day.getMonth() + 1
          }-${day.getDate()}`;

          return (
            <Box key={idx} flex="1 1 0" px={0.5} minWidth={0}>
              {!isPastDay(day) ? (
                <Droppable droppableId={droppableId}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      elevation={snapshot.isDraggingOver ? 6 : 2}
                      sx={{
                        p: 1,
                        minHeight: "400px",
                        backgroundColor: snapshot.isDraggingOver
                          ? "#f0f4ff"
                          : "#fff",
                        border: isToday(day)
                          ? "2px solid #2196f3"
                          : "1px solid #e0e0e0",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {(mealPool?.[droppableId] || []).map((meal) => (
                        <Box
                          key={meal.id}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          width="100%"
                        >
                          <Tooltip
                            title={
                              <>
                                <Typography fontWeight="bold">
                                  {meal.title}
                                </Typography>
                                <Typography variant="body2">
                                  {meal.description || "No description"}
                                </Typography>
                              </>
                            }
                            arrow
                          >
                            <Paper
                              elevation={2}
                              sx={{
                                p: 0.5,
                                pr: 0,
                                backgroundColor: "#ffcdd2",
                                borderRadius: 1,
                                fontSize: "0.85rem",
                                cursor: "grab",
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                "&:hover": {
                                  backgroundColor: "#ef9a9a",
                                },
                              }}
                            >
                              {meal.title}
                              <IconButton
                                size="small"
                                onClick={() =>
                                  onRemoveMeal(droppableId, meal.id)
                                }
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            </Paper>
                          </Tooltip>
                        </Box>
                      ))}
                      {provided.placeholder}
                    </Paper>
                  )}
                </Droppable>
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 1,
                    minHeight: "400px",
                    backgroundColor: "#f5f5f5",
                    border: "1px dashed #ccc",
                    borderRadius: 2,
                    opacity: 0.6,
                    pointerEvents: "none",
                  }}
                >
                  {(mealPool?.[droppableId] || []).map((meal) => (
                    <Paper
                      key={meal.id}
                      elevation={1}
                      sx={{
                        p: 0.5,
                        backgroundColor: "#ddd",
                        fontSize: "0.85rem",
                        mb: 1,
                      }}
                    >
                      {meal.title}
                    </Paper>
                  ))}
                </Paper>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
