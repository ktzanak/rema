import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Paper, Typography, Box, Tooltip } from "@mui/material";

// Get day of week (0 = Sunday)
function getWeekdayIndex(date) {
  return date.getDay();
}

// Main planner
export default function MonthPlanner({ year, month, mealPool, setMealPool }) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = getWeekdayIndex(firstDay);
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  const today = new Date();
  const isToday = (day) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  return (
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
      {/* Day headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
        <Typography
          key={dayName}
          variant="body2"
          align="center"
          sx={{ fontWeight: "bold", color: "#666" }}
        >
          {dayName}
        </Typography>
      ))}

      {/* Days */}
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
                        <Typography fontWeight="bold">{meal.title}</Typography>
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
    </Box>
  );
}
