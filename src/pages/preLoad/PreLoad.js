import React, { useCallback, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { ContextGlobal } from "../../context/GlobalContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  alterTableItemsPedidos,
  alterTablePedidos,
  alterarTableClientes,
  alterarTableClientes2,
  createTableFormaPgto,
  createTablesClientes,
  createTablesItemsPedidos,
  createTablesItensTabelaPrecos,
  createTablesMotivoVisitas,
  createTablesPedidos,
  createTablesProdutos,
  createTablesTabelaPrecos,
  createTablesVisitas,
} from "../../database/createTables";
const PreLoad = () => {
  const { logout } = useContext(ContextGlobal);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      createTablesClientes();
      createTablesTabelaPrecos();
      createTableFormaPgto();
      createTablesMotivoVisitas();
      createTablesPedidos();
      createTablesItemsPedidos();
      alterTableItemsPedidos();
      alterarTableClientes();
      alterarTableClientes2();
      createTablesProdutos();
      createTablesVisitas();
      createTablesItensTabelaPrecos();
      alterTablePedidos();
      handleVerificaVersao();
    }, [])
  );

  const handleVerificaVersao = async () => {
    var token = await AsyncStorage.getItem("@ge_pedido_online_token");
    if (token) {
      navigation.reset({
        index: 1,
        routes: [{ name: "Drawer" }],
      });
    } else {
      logout();
    }
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color="#fff" />
      <Text style={{ color: "#fff" }}>validando credênciais, aguarde</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#174c4f",
  },
});

export default PreLoad;
