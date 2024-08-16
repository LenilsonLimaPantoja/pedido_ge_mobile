import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const Button = ({ texto, funcao, color, textColor, validar, left }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={funcao}
      style={[
        styles.button,
        {
          backgroundColor: color ? color : "#6464f8",
          borderWidth: validar ? 1.5 : 0,
          borderColor: "red",
          alignItems: left ? "flex-start" : "center",
        },
      ]}
    >
      <Text style={{ color: textColor ? textColor : "#fff" }}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 70,
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 5,
    padding: 10,
  },
});

export default Button;
