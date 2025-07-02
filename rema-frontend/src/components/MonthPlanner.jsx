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
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  return start;
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

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    return day;
  });

  const firstMonth = days[0].getMonth();
  const lastMonth = days[6].getMonth();
  const yearDisplayed = days[3].getFullYear();

  const isToday = (date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

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

  const getIngredientsCurrentWeek = () => {
    const ingredientsCurrentWeek = [];
    days.forEach((day) => {
      const droppableId = `day-${day.getFullYear()}-${
        day.getMonth() + 1
      }-${day.getDate()}`;
      const meals = mealPool?.[droppableId] || [];
      meals.forEach((meal) => {
        if (meal.id) {
          const ingredientNames = meal.ingredients.map((ing) => ing.ingredient);
          ingredientsCurrentWeek.push(...ingredientNames);
        }
      });
    });
    return ingredientsCurrentWeek;
  };

  const downloadPdf = async () => {
    const formatteddate1 = `${today.getDate()}_${
      today.getMonth() + 1
    }_${today.getFullYear()}`;
    const formatteddate2 = `${today.getDate()}.${
      today.getMonth() + 1
    }.${today.getFullYear()}`;
    const fileName = "ReMa_shopping_list_" + formatteddate1 + ".pdf";

    const ingredients = getIngredientsCurrentWeek();
    const blob = await pdf(
      <ShoppingListPdf todaydate={formatteddate2} ingredients={ingredients} />
    ).toBlob();
    saveAs(blob, fileName);
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box
        sx={{
          position: "sticky",
          top: "62.5px",
          zIndex: 100,
          backgroundColor: "white",
          paddingTop: "17.5px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0,
            pb: 2,
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

        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box sx={{ width: "30px", pr: 1 }} />
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
      </Box>
      {/* Droppable areas for 7 days */}
      <Box
        display="flex"
        Add
        commentMore
        actions
        width="100%"
        pt={1}
        sx={{ position: "relative", height: "1200px" }}
      >
        {/* Y-Axis with time labels */}
        <Box
          sx={{
            width: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            pr: 1,
          }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i;
            const suffix = hour < 12 ? "AM" : "PM";
            const label = `${hour % 12 === 0 ? 12 : hour % 12}${suffix}`;
            const topPercent = i * 50;
            return (
              <Typography
                key={i}
                variant="caption"
                sx={{
                  position: "absolute",
                  top: `${topPercent}px`,
                  fontSize: "0.7rem",
                  color: "#555",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Typography>
            );
          })}
        </Box>

        {days.map((day, idx) => {
          return (
            <Box key={idx} flex="1 1 0" minWidth={0}>
              {Array.from({ length: 24 }, (_, hour) => {
                const slotId = `day-${day.getFullYear()}-${
                  day.getMonth() + 1
                }-${day.getDate()}-hour-${hour}`;

                return (
                  <React.Fragment key={slotId}>
                    <Droppable key={slotId} droppableId={slotId}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            height: "50px",
                            overflowX: "hidden",
                            borderTop: "1px solid rgb(191, 191, 191)",
                            alignItems: "center",
                            boxSizing: "border-box",
                            borderRight:
                              idx < 6 ? "1px solid rgb(191, 191, 191)" : "none",
                            backgroundColor: snapshot.isDraggingOver
                              ? "#d7e1fc"
                              : "#fff",
                            opacity: !isPastDay(day) ? 1 : 0.6,
                            transition: "background-color 0.2s ease",
                            display: "flex",
                            flexDirection: "column",
                            px: 0.2,
                            py: 0.2,
                            gap: 0.5,
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                              cursor: "pointer",
                            },
                          }}
                        >
                          {(mealPool?.[slotId] || []).map((meal) => (
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
                                      Description: {meal.description || "-"}
                                    </Typography>
                                    <Typography variant="body2">
                                      Time: {meal.cooking_time || "-"}
                                    </Typography>
                                    <Typography variant="body2">
                                      Portions: {meal.portions || "-"}
                                    </Typography>
                                  </>
                                }
                                arrow
                              >
                                <Paper
                                  sx={{
                                    pl: 0.5,
                                    height: "20px",
                                    backgroundColor: "#ffcdd2",
                                    borderRadius: 1,
                                    fontSize: "0.7rem",
                                    cursor: "grab",
                                    flexGrow: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    "&:hover": {
                                      backgroundColor: "#ef9a9a",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      flex: 1,
                                      pr: 0,
                                    }}
                                  >
                                    {meal.title}
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      onRemoveMeal(slotId, meal.id)
                                    }
                                  >
                                    <Close fontSize="small" />
                                  </IconButton>
                                </Paper>
                              </Tooltip>
                            </Box>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </React.Fragment>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
