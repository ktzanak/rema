import React, { useState, useEffect } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Paper, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

// Get day of week (0 = Sunday)
/*function getWeekdayIndex(date) {
  return date.getDay();
}*/
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

// Main planner
export default function MonthPlanner({ year, month, mealPool, onMonthChange }) {
  /*const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = getWeekdayIndex(firstDay);
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });*/
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const baseDate = new Date(today); // use today to calculate the actual current week
  baseDate.setDate(baseDate.getDate() + weekOffset * 7); // apply week offset
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

  return (
    <Box>
      <Box
        sx={{
          justifyContent: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 0,
          mb: 2,
        }}
      >
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
      {/*<Box
        sx={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton onClick={() => onMonthChange?.(year, month - 1)}>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        <Typography variant="h6">
          {monthNames[month]} {year}
        </Typography>
        <IconButton onClick={() => onMonthChange?.(year, month + 1)}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>*/}

      {/* Day headers */}
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
            <Box key={idx} flex="1 1 0" px={0.5}>
              <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    elevation={snapshot.isDraggingOver ? 6 : 1}
                    sx={{
                      p: 1,
                      minHeight: "150px",
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
                            backgroundColor: "#e8f5e9",
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            cursor: "grab",
                            "&:hover": {
                              backgroundColor: "#d0f0d4",
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

      {/*
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          p: 2,
          backgroundColor: "#fafafa",
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        {weekNames.map((dayName) => (
          <Typography
            key={dayName}
            variant="body2"
            align="center"
            sx={{ fontWeight: "bold", color: "#666" }}
          >
            {dayName}
          </Typography>
        ))}

        {cells.map((dayNumber, idx) => {
          if (dayNumber === null) return <Box key={idx} />;

          const droppableId = `day-${year}-${month + 1}-${dayNumber}`;

          return (
            <Droppable key={droppableId} droppableId={droppableId}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  elevation={snapshot.isDraggingOver ? 6 : 1}
                  sx={{
                    p: 1,
                    minHeight: "80px",
                    minWidth: "50px",
                    backgroundColor: snapshot.isDraggingOver
                      ? "#f0f4ff"
                      : "#ffffff",
                    borderRadius: 2,
                    border: isToday(dayNumber)
                      ? "2px solid #2196f3"
                      : "1px solid #e0e0e0",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      color: isToday(dayNumber) ? "#2196f3" : "#888",
                      textAlign: "right",
                    }}
                  >
                    {dayNumber}
                  </Typography>

                  {(mealPool?.[droppableId] || []).map((meal) => (
                    <Tooltip
                      key={meal.id}
                      title={
                        <React.Fragment>
                          <Typography fontWeight="bold">
                            {meal.title}
                          </Typography>
                          <Typography variant="body2">
                            {meal.description || "No description provided."}
                          </Typography>
                        </React.Fragment>
                      }
                      arrow
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1,
                          backgroundColor: "#e8f5e9",
                          borderRadius: 1,
                          fontSize: "0.85rem",
                          cursor: "grab",
                          "&:hover": {
                            backgroundColor: "#d0f0d4",
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
          );
        })}
      </Box>*/}
    </Box>
  );
}
