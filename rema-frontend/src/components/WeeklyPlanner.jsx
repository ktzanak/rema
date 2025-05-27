import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Paper, Typography } from "@mui/material";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyPlanner({ mealPool, setMealPool }) {
  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Weekly Planner
      </Typography>
      {days.map((day) => (
        <Droppable droppableId={`day-${day}`} key={day}>
          {(provided, snapshot) => (
            <Paper
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                mb: 2,
                p: 2,
                minHeight: "100px",
                backgroundColor: snapshot.isDraggingOver ? "#f0f0f0" : "#fff",
              }}
              elevation={3}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {day}
              </Typography>
              {(mealPool?.[`day-${day}`] || []).map((meal, index) => (
                <Paper
                  key={meal.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    backgroundColor: "#e0ffe0",
                  }}
                  elevation={1}
                >
                  {meal.title}
                </Paper>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable>
      ))}
    </div>
  );
}
