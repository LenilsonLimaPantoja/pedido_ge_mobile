import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AppbarModal = ({ rota, valor, setValor, funcFechar, bottonRight }) => {
  const navigation = useNavigation();
  const [showPesquisar, setShowPesquisar] = useState(false);
  const handleShowPesquisar = () => {
    setValor("");
    setShowPesquisar(!showPesquisar);
  };
  return (
    <View style={styles.container}>
      {!showPesquisar ? (
        <>
          <View style={styles.containerBtGoBack}>
            <TouchableOpacity>
              <Ionicons
                onPress={funcFechar}
                style={styles.icones}
                name="arrow-back"
              />
            </TouchableOpacity>
            <Text
              style={{
                color: "#fff",
                marginLeft: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {rota}
            </Text>
          </View>
          {!bottonRight && (
            <View style={styles.containerBtGoBack}>
              <TouchableOpacity onPress={handleShowPesquisar}>
                <Ionicons style={styles.icones} name="search" />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.containerPesquisar}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar"
            autoFocus
            placeholderTextColor="#fff"
            onChangeText={setValor}
            value={valor}
          />
          <Ionicons
            onPress={handleShowPesquisar}
            style={[styles.icones, { position: "absolute", right: 0 }]}
            name="close"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    padding: 20,
  },
  containerBtGoBack: {
    flexDirection: "row",
    alignItems: "center",
  },
  icones: {
    fontSize: 25,
    color: "#fff",
  },
  containerPesquisar: {
    width: "100%",
    flexDirection: "row",
  },
  input: {
    backgroundColor: "transparent",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
  },
});

export default AppbarModal;
