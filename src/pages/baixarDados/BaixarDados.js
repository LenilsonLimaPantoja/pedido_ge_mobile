import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Button from "../../components/Button";
import AppbarSimples from "../../components/AppbarSimples";
import { useNavigation } from "@react-navigation/native";
import { addTabelaPreco } from "../../database/servicesItensTabelaPrecos";
const BaixarDados = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#174c4f'}}>
      <AppbarSimples rota="baixar dados" />
      <View style={styles.container}>
        <Button
          texto="baixar clientes"
          funcao={() => navigation.navigate("BaixarClientes")}
        />
        <Button
          color="#9c28b1"
          texto="baixar produtos"
          funcao={() => navigation.navigate("BaixarProdutos")}
        />
        <Button
          color="#607d8b"
          texto="baixar formas de pagamento"
          funcao={() => navigation.navigate("BaixarFormasPgto")}
        />
        <Button
          color="red"
          texto="baixar tabela de preços"
          funcao={() => navigation.navigate("BaixarTabelaPrecos")}
        />
        <Button
          color="red"
          texto="baixar itens da tabela de preços"
          funcao={() => navigation.navigate("BaixarItensTabelaPrecos")}
        />
        <Button
          color="#607d8b"
          texto="baixar motivo da visita"
          funcao={() => navigation.navigate("BaixarMotivoVisitas")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
    padding: 10,
  },
  containerImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  imgBaixarDados: {
    width: 300,
    height: 300,
  },
});

export default BaixarDados;
