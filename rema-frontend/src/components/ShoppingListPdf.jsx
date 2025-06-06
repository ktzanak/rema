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
    textingredients: {
      fontSize: 12,
      marginVertical: 5,
      minWidth: 200,
      maxWidth: 200,
    },
    inlinedown1: {
      flexDirection: "row",
      marginVertical: 25,
      marginHorizontal: 20,
    },
    ingredientslabel: {
      fontSize: 14,
      marginVertical: 10,
      fontFamily: "Times-Bold",
      minWidth: 150,
      maxWidth: 150,
    },
    inlinedown2left: {
      flexDirection: "column",
      alignItems: "left",
      textAlign: "left",
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

          <View style={styles.inlinedown1}>
            <Text style={styles.ingredientslabel}>Ingredients</Text>
            <View style={styles.inlinedown2left}>
              {dateAndIngredients.ingredients.map((ingredient, index) => (
                <Text style={styles.textingredients} key={index}>
                  {ingredient}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
