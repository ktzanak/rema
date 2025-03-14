import { Container } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function ListRecipes() {
  return (
    <Container>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: 600, margin: "auto", mt: 4, boxShadow: 3 }}
      >
        <Table>
          <TableBody>
            {recipes.map((recipe, index) => (
              <TableRow key={index} hover>
                <TableCell>1{/*one var*/}</TableCell>
                <TableCell>
                  <span
                    style={{
                      background: "#2196F3",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    2{/*one var*/}
                  </span>
                </TableCell>
                <TableCell>3{/*one var*/}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
