import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ButtonModalFiltro = ({ texto, filtroPorStatus, funcao, tamanho }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: tamanho ? `${tamanho}%` : "100%" }]}
      onPress={funcao}
    >
      <Text style={styles.textButton}>{texto}</Text>
      {filtroPorStatus == 0 ? (
        <MaterialCommunityIcons
          name="checkbox-marked"
          color="#174c4f"
          size={20}
        />
      ) : (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          color="#174c4f"
          size={20}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  textButton: {
    textTransform: "capitalize",
  },
});

export default ButtonModalFiltro;
