import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Button from "../../components/Button";
import Dividir from "../../components/Dividir";
import Input from "../../components/Input";
import logoGe from "../../../assets/logo.png";
import { ContextLogin } from "../../context/LoginContext";
import Loading from "../../components/Loading";
import ModalSimples from "../../components/ModalSimples";

const Login = () => {
  const {
    cnpj,
    setCnpj,
    email,
    setEmail,
    senha,
    setSenha,
    login,
    load,
    textoModal,
    imgModal,
    openModal,
    handleOpenModal,
  } = useContext(ContextLogin);
  if (load) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerImg}>
        <Image source={logoGe} resizeMode="contain" style={styles.logoTopo} />
      </View>
      <Text style={styles.titulo}>
        Preencha os campos para realizar o login no sistema
      </Text>
      <Dividir />
      <Input
        valor={cnpj}
        setValor={setCnpj}
        securo={false}
        tipo="numeric"
        label="CNPJ da empresa"
        icone="building-o"
      />
      <Input
        valor={email}
        setValor={setEmail}
        securo={false}
        label="Email de usuário"
        icone="at"
      />
      <Input
        valor={senha}
        setValor={setSenha}
        securo={true}
        label="Senha"
        icone="user-secret"
      />
      <Button texto="ENTRAR" funcao={login} />
      <ModalSimples
        btnFechar
        visivel={openModal}
        imagem={imgModal}
        onPress={handleOpenModal}
        texto={textoModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  containerImg: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoTopo: {
    width: 100,
    height: 100,
  },
  titulo: {
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Login;
