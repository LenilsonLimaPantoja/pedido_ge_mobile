import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const ButtonModal = ({ color, funcao, texto }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.button, { backgroundColor: color ? color : "#6464f8" }]}
      onPress={funcao}
    >
      <Text style={styles.textButton}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 40,
    width: "100%",
    marginBottom: 10,
  },
  textButton: {
    color: "#fff",
    fontSize: 15,
  },
});

export default ButtonModal;
