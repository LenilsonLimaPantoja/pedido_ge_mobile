import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DataFiltro from "./DataFiltro";

const AppbarComFiltros = ({
  valor,
  setValor,
  funFilter,
  rota,
  setAnoFiltro,
  anoFiltro,
  setMesFiltro,
  mesFiltro,
  setDiaFiltro,
  diaFiltro,
  filtroData,
}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const inputVisible = () => {
    setValor("");
    setVisible(!visible);
  };
  return (
    <View style={styles.container}>
      {!visible ? (
        <>
          <View style={styles.containerBtGoBack}>
            <TouchableOpacity>
              <Ionicons
                onPress={() => navigation.goBack()}
                style={styles.icones}
                name="arrow-back"
              />
            </TouchableOpacity>
            <Text
              style={{
                color: "#fff",
                marginLeft: 10,
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              {rota}
            </Text>
          </View>
          <View style={styles.containerBtRight}>
            <TouchableOpacity onPress={inputVisible}>
              <Ionicons
                style={[styles.icones, { marginRight: 20 }]}
                name="search"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={funFilter}>
              <Ionicons style={styles.icones} name="filter" />
            </TouchableOpacity>
            {filtroData == false ? null : (
              <TouchableOpacity>
                <DataFiltro
                  setAnoFiltro={setAnoFiltro}
                  setDiaFiltro={setDiaFiltro}
                  setMesFiltro={setMesFiltro}
                  anoFiltro={anoFiltro}
                  mesFiltro={mesFiltro}
                  diaFiltro={diaFiltro}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View style={styles.containerInput}>
          <TextInput
            autoFocus
            onChangeText={setValor}
            value={valor}
            style={styles.input}
            placeholder="Pesquisar"
            placeholderTextColor="#fff"
          />
          <Ionicons
            onPress={inputVisible}
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
  containerBtRight: {
    flexDirection: "row",
  },
  icones: {
    fontSize: 25,
    color: "#fff",
  },
  containerInput: {
    flexDirection: "row",
  },
  input: {
    backgroundColor: "transparent",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#fff",
    color: "#fff",
  },
});

export default AppbarComFiltros;
