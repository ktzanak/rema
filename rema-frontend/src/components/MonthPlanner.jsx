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
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import ShoppingList from "./ShoppingList";

function getStartOfWeek(date) {
  const day = date.getDay(); // Sunday = 0
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

export default function MonthPlanner({ mealPool }) {
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

  const downloadPdf = async () => {
    // TODO: Implement logic to generate/show shopping list based on meals in the calendar for the week
    const fileName = "ReMa_shopping_list_" + today + ".pdf";
    const blob = await pdf(<ShoppingList />).toBlob();
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
                color: isToday(day) ? "#1976d2" : "#666",
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
              <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    elevation={snapshot.isDraggingOver ? 6 : 1}
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
                      <Tooltip
                        key={meal.id}
                        title={
                          <React.Fragment>
                            <Typography fontWeight="bold">
                              {meal.title}
                            </Typography>
                            <Typography variant="body2">
                              {meal.description || "No description"}
                            </Typography>
                          </React.Fragment>
                        }
                        arrow
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            p: 1,
                            backgroundColor: "#ffcdd2",
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            cursor: "grab",
                            "&:hover": {
                              backgroundColor: "#ef9a9a",
                            },
                          }}
                        >
                          {meal.title}
                        </Paper>
                      </Tooltip>
                    ))}

                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
