import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import bwLogo from "../assets/bw_remalogo.png";

function RecipePdf(recipeinfoingredientsinstructions) {
  const styles = StyleSheet.create({
    page: { backgroundColor: "white", margin: 10, fontFamily: "Times-Roman" },
    section: { color: "black", textAlign: "center" },
    title: {
      fontSize: 20,
      fontFamily: "Times-Bold",
      minWidth: 435,
      maxWidth: 435,
    },
    image: { width: 100, height: 88, opacity: 0.3, position: "absolute" },
    textdescription: {
      fontSize: 12,
      marginVertical: 15,
      minWidth: 435,
      maxWidth: 435,
    },
    texttimeportions: {
      fontSize: 12,
      marginVertical: 10,
      minWidth: 435,
      maxWidth: 435,
    },
    textlabelleft: {
      fontSize: 14,
      marginVertical: 10,
      fontFamily: "Times-Bold",
      minWidth: 150,
      maxWidth: 150,
    },
    textlabelright: {
      fontSize: 14,
      marginVertical: 10,
      fontFamily: "Times-Bold",
      minWidth: 360,
      maxWidth: 360,
    },
    textingredients: {
      fontSize: 12,
      marginVertical: 5,
      minWidth: 150,
      maxWidth: 150,
    },
    textinstructions: {
      fontSize: 12,
      marginVertical: 5,
      minWidth: 360,
      maxWidth: 360,
    },
    inlinetop1: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      margin: 20,
    },
    inlinetop2: { flexDirection: "column" },

    inlinedown1: {
      flexDirection: "row",
      marginVertical: 25,
      marginHorizontal: 20,
    },

    inlinedown2right: {
      flexDirection: "column",
      alignItems: "center",
    },
    instructionsContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "left",
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
              <Text style={styles.title}>
                {recipeinfoingredientsinstructions.recipeinfo.title}
              </Text>
              <Text style={styles.textdescription}>
                {recipeinfoingredientsinstructions.recipeinfo.description}
              </Text>
              <Text style={styles.texttimeportions}>
                <Text style={{ fontFamily: "Times-Bold" }}>Category: </Text>
                {recipeinfoingredientsinstructions.category}
                {"                       "}
                <Text style={{ fontFamily: "Times-Bold" }}>Tags: </Text>
                {recipeinfoingredientsinstructions.tags.map((tagrow, index) => (
                  <Text style={styles.texttimeportions} key={index}>
                    {tagrow.tag}
                    {index < recipeinfoingredientsinstructions.tags.length - 1
                      ? ", "
                      : ""}
                  </Text>
                ))}
              </Text>
              <Text style={styles.texttimeportions}>
                <Text style={{ fontFamily: "Times-Bold" }}>Time: </Text>
                {recipeinfoingredientsinstructions.recipeinfo.cooking_time}
                {"                       "}
                <Text style={{ fontFamily: "Times-Bold" }}>Portions: </Text>
                {recipeinfoingredientsinstructions.recipeinfo.portions}
              </Text>
            </View>
          </View>

          <View style={styles.inlinedown1}>
            <View style={styles.inlinedown2left}>
              <Text style={styles.textlabelleft}>Ingredients</Text>
              {recipeinfoingredientsinstructions.ingredients.map(
                (ingredientrow, index) => (
                  <Text style={styles.textingredients} key={index}>
                    {ingredientrow.ingredient}
                  </Text>
                )
              )}
            </View>
            <View style={styles.inlinedown2right}>
              <Text style={styles.textlabelright}>Instructions</Text>
              <View style={styles.instructionsContainer}>
                {recipeinfoingredientsinstructions.instructions.map(
                  (instructionrow, index) => (
                    <Text
                      style={styles.textinstructions}
                      key={`${index}_${instructionrow.step_number}`}
                    >
                      {index + 1}
                      {". "}
                      {instructionrow.instruction}
                    </Text>
                  )
                )}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
export default RecipePdf;
