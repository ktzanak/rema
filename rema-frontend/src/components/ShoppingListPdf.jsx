import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import bwLogo from "../assets/bw_remalogo.png";

export default function ShoppingListPdf(dateAndIngredients) {
  const MAX_LINES_FIRST_COLUMN = 27;
  const ingredients = dateAndIngredients.ingredients;

  const firstColumn =
    ingredients.length > MAX_LINES_FIRST_COLUMN
      ? ingredients.slice(0, MAX_LINES_FIRST_COLUMN)
      : ingredients;

  const secondColumn =
    ingredients.length > MAX_LINES_FIRST_COLUMN
      ? ingredients.slice(MAX_LINES_FIRST_COLUMN)
      : [];

  const styles = StyleSheet.create({
    page: { backgroundColor: "white", margin: 10, fontFamily: "Times-Roman" },
    section: { color: "black", textAlign: "center" },
    title: {
      fontSize: 18,
      fontFamily: "Times-Bold",
      minWidth: 435,
      maxWidth: 435,
    },
    image: { width: 100, height: 88, opacity: 0.3, position: "absolute" },
    textdate: {
      fontSize: 12,
      marginVertical: 15,
      minWidth: 435,
      maxWidth: 435,
    },
    inlinetop1: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      margin: 20,
    },
    inlinetop2: { flexDirection: "column" },
    columnsContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingHorizontal: 40,
      gap: 40,
    },
    column: {
      flexDirection: "column",
      flex: 1,
    },
    textingredients: {
      fontSize: 12,
      marginVertical: 5,
    },
  });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.inlinetop1}>
            <Text style={styles.inlinetop2}>
              <Image style={styles.image} src={bwLogo} />
            </Text>
            <View style={styles.inlinetop2}>
              <Text style={styles.title}>Shopping list</Text>
              <Text style={styles.textdate}>
                <Text style={{ fontFamily: "Times-Bold" }}>Date: </Text>
                {dateAndIngredients.todaydate}
              </Text>
            </View>
          </View>

          <View style={styles.columnsContainer}>
            <View style={styles.column}>
              {firstColumn.map((ingredient, index) => (
                <Text style={styles.textingredients} key={index}>
                  {ingredient}
                </Text>
              ))}
            </View>
            {secondColumn.length > 0 && (
              <View style={styles.column}>
                {secondColumn.map((ingredient, index) => (
                  <Text
                    style={styles.textingredients}
                    key={index + firstColumn.length}
                  >
                    {ingredient}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
