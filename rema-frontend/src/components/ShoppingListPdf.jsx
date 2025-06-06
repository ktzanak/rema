import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import bwLogo from "../assets/bw_remalogo.png";

export default function ShoppingListPdf(formatteddate2) {
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
                {formatteddate2.todaydate}
              </Text>
            </View>
          </View>
          {/*add ingredient list*/}
        </View>
      </Page>
    </Document>
  );
}
