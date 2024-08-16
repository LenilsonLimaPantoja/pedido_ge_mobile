import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const Input = ({ securo, tipo, label, icone, valor, setValor, validar }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.containerInput,
        { borderWidth: validar ? 1.5 : 0, borderColor: "red" },
      ]}
    >
      <Text style={styles.labelInput}>{label}</Text>
      <View style={styles.inputAndIcone}>
        <TextInput
          value={valor}
          onChangeText={setValor}
          secureTextEntry={securo}
          keyboardType={tipo}
          style={styles.input}
        />
      </View>
      <FontAwesome style={styles.icone} name={icone} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerInput: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 10,
  },
  labelInput: {
    color: "#174c4f",
  },
  inputAndIcone: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
  },
  icone: {
    position: "absolute",
    right: 10,
    fontSize: 25,
    color: "#174c4f",
  },
});

export default Input;
