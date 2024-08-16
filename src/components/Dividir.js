import React from "react";
import { View, StyleSheet } from "react-native";

const Dividir = () => {
  return <View style={styles.linha} />;
};

const styles = StyleSheet.create({
  linha: {
    borderBottomWidth: 1,
    borderColor: "#fff",
  },
});

export default Dividir;
