import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

function PdfDocu(recipeinfoingredientsinstuctions) {
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
      textAlign: "center",
      alignItems: "center",
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
              <Image style={styles.image} src="/images/bw_remalogo.png" />
            </Text>
            <View style={styles.inlinetop2}>
              <Text style={styles.title}>
                {recipeinfoingredientsinstuctions.recipeinfo.name}
              </Text>
              <Text style={styles.textdescription}>
                {recipeinfoingredientsinstuctions.recipeinfo.description}
              </Text>
              <Text style={styles.texttimeportions}>
                <Text style={{ fontFamily: "Times-Bold" }}>Time: </Text>
                {recipeinfoingredientsinstuctions.recipeinfo.totaltime}
                {"                       "}
                <Text style={{ fontFamily: "Times-Bold" }}>Portions: </Text>
                {recipeinfoingredientsinstuctions.recipeinfo.nrportions}
              </Text>
            </View>
          </View>

          <View style={styles.inlinedown1}>
            <View style={styles.inlinedown2left}>
              <Text style={styles.textlabelleft}>Ingredients</Text>
              {recipeinfoingredientsinstuctions.ingredients.map(
                (ingredient) => (
                  <Text style={styles.textingredients} key={ingredient.id}>
                    {ingredient.name}
                  </Text>
                )
              )}
            </View>
            <View style={styles.inlinedown2right}>
              <Text style={styles.textlabelright}>Instructions</Text>
              {recipeinfoingredientsinstuctions.instructions.map(
                (instruction, index) => (
                  <Text style={styles.textinstructions} key={instruction.id}>
                    {index + 1}
                    {". "}
                    {instruction.name}
                  </Text>
                )
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
export default PdfDocu;
