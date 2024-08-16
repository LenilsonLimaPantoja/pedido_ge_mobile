import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import AppbarSimples from "../../components/AppbarSimples";
import { ContextGlobal } from "../../context/GlobalContext";
const SincronizarDados = () => {
  const { handleRedirect } = useContext(ContextGlobal);
  return (
    <>
      <AppbarSimples rota="sincronizar dados" />
      <View style={styles.container}>
        <Button
          texto="sincronizar clientes"
          funcao={() => handleRedirect("SincronizarClientes")}
        />
        <Button
          color="#9c28b1"
          texto="sincronizar pedidos"
          funcao={() => handleRedirect("SincronizarPedidos")}
        />
        <Button
          color="red"
          texto="sincronizar visitas"
          funcao={() => handleRedirect("SincronizarVisitas")}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  containerImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  imgSincronizarDados: {
    width: 300,
    height: 300,
  },
});

export default SincronizarDados;
