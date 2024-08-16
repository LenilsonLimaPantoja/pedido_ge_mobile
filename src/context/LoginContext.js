import axios from "axios";
import React, { createContext, useState } from "react";
import Apis from "../Apis";
import * as Application from "expo-application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
export const ContextLogin = createContext({});
const LoginContext = ({ children }) => {
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [load, setLoad] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigation = useNavigation();

  const handleOpenModal = (texto) => {
    setTextoModal(texto);
    setOpenModal(!openModal);
  };

  const login = async () => {
    if (cnpj != "" && email != "" && senha != "") {
      setLoad(true);
      const options = {
        headers: { "Content-Type": "application/json" },
      };
      const body = {
        cnpj_empresa: cnpj,
        emailUsuario: email,
        senha: senha,
        id_dispositivo: Application.androidId,
      };
      await axios
        .post(Apis.urlLogin, body, options)
        .then((response) => {
          if (response.data.retorno.sucesso) {
            AsyncStorage.setItem(
              "@ge_pedido_online_empresa",
              JSON.stringify(response.data.retorno.empresa)
            );
            AsyncStorage.setItem(
              "@ge_pedido_online_representante_id",
              response.data.retorno.representante_id
            );
            AsyncStorage.setItem(
              "@ge_pedido_online_representante_nome",
              response.data.retorno.representante_nome
            );
            AsyncStorage.setItem(
              "@ge_pedido_online_permite_desconto",
              response.data.retorno.permite_desconto
            );
            AsyncStorage.setItem(
              "@ge_pedido_online_token",
              response.data.retorno.token
            );
            AsyncStorage.setItem(
              "@ge_pedido_online_financeiro_venda",
              response.data.retorno.financeiro_venda
            );
            setCnpj("");
            setEmail("");
            setSenha("");
            setLoad(false);
            navigation.reset({
              index: 1,
              routes: [{ name: "Drawer" }],
            });
            return;
          }
          setLoad(false);
          handleOpenModal(response.data.retorno.mensagem);
        })
        .catch((erro) => {
          setLoad(false);
          console.log(erro);
          handleOpenModal(erro.response.data.retorno.mensagem);
        });
    } else {
      handleOpenModal("Todos os campos devem ser preenchidos!");
    }
  };
  return (
    <ContextLogin.Provider
      value={{
        cnpj,
        setCnpj,
        email,
        setEmail,
        senha,
        setSenha,
        login,
        load,
        textoModal,
        openModal,
        handleOpenModal,
      }}
    >
      {children}
    </ContextLogin.Provider>
  );
};
export default LoginContext;
