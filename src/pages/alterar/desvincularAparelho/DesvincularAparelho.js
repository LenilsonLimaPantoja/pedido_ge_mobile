import axios from "axios";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import Apis from "../../../Apis";
import AppbarSimples from "../../../components/AppbarSimples";
import Button from "../../../components/Button";
import ModalSimples from "../../../components/ModalSimples";
import ButtonModal from "../../../components/ButtonModal";
import Loading from "../../../components/Loading";
import { ContextGlobal } from "../../../context/GlobalContext";
const DesvincularAparelho = () => {
  const {
    representanteId,
    totalPedidosPendentes,
    handleLimparDados,
    handleData,
    load,
    totalVisitasPendentes,
    parametrosLocal,
    qtdClientesPendentes
  } = useContext(ContextGlobal);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const handleOpenModal = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };
  const handleDesvincular = async () => {
    if (
      totalPedidosPendentes?.qtdPendente > 0 ||
      qtdClientesPendentes > 0 ||
      totalVisitasPendentes > 0
    ) {
      return handleOpenModal(
        "Existem dados com sincronização pendente, sincronize ou remova os dados e tente novamente",
        true
      );
    }
    setLoading(true);
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: parametrosLocal[0].token,
      },
    };
    const body = { representante_id: representanteId };
    await axios
      .patch(Apis.urlDesvincularDispositivo, body, requestOptions)
      .then((response) => {
        if (response.data.retorno.sucesso) {
          setOpenModal(false);
          handleLimparDados();
          handleData();
          setLoading(false);
          return;
        }
        handleOpenModal(response.data.retorno.mensagem, true);
        setLoading(false);
      })
      .catch((erro) => {
        console.log(erro.response.data);
        handleOpenModal(erro.response.data.retorno.mensagem, true);
        setOpenModal(true);
        setLoading(false);
      });
  };
  if (loading || load) {
    return <Loading />;
  }
  return (
    <>
      <AppbarSimples rota="desvicular aparelho" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.texto}>
          ATENÇÃO - Ao clicar em desvincular aparelho, você concorda que
          desvinculará esse dispositivo do usuário
          <Text style={{ textTransform: "uppercase", fontWeight: "bold" }}>
            {" "}
            {parametrosLocal[0].representante.nome}{" "}
          </Text>
          e removerá todos os dados presente no aplicativo, (somente os dados
          sincronizados poderão ser consultados em outros dispositivos).
        </Text>
        <Button
          texto="desvincular aparelho"
          funcao={() =>
            handleOpenModal(
              "Clique em confirmar para desvincular o aparelho",
              true
            )
          }
        />
      </SafeAreaView>
      <ModalSimples
        btnFechar
        imagem={null}
        texto={textoModal}
        visivel={openModal}
        onPress={() => setOpenModal(false)}
      >
        {textoModal == "Clique em confirmar para desvincular o aparelho" && (
          <ButtonModal
            funcao={handleDesvincular}
            texto="confirmar"
            color="red"
          />
        )}
      </ModalSimples>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#174c4f",
    padding: 10,
    justifyContent: "center",
  },
  texto: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 15,
  },
});

export default DesvincularAparelho;
