import React, { useContext, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Apis from "../../../Apis";
import ModalSimples from "../../../components/ModalSimples";
import { ContextGlobal } from "../../../context/GlobalContext";
import ButtonModal from "../../../components/ButtonModal";
import Loading from "../../../components/Loading";
import {
  alterarClienteSinc,
  readClientesSincronizar,
} from "../../../database/servicesClientes";
const SincronizarClientes = () => {
  const [openModal, setOpenModal] = useState(true);
  const [textoModal, setTextoModal] = useState(
    "Clique em confirmar para enviar os clientes para o servidor"
  );
  const [loading, setLoading] = useState(false);
  const { tokenLocal, clientesLocal, handleRedirect } =
    useContext(ContextGlobal);

  const handleOpenModal = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };

  // sincronizar clientesLocal com o servidor
  const sincronizarCliente = async () => {
    var clientesBd = [];
    await readClientesSincronizar()
      .then((response) => {
        clientesBd = response;
      })
      .catch((erro) => {
        console.log(erro);
      });
    if (clientesBd?.length > 0) {
      setLoading(true);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenLocal,
        },
        body: JSON.stringify(clientesBd),
      };
      fetch(Apis.urlCreateClientes, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.clientes_sincronizados) {
            // for para para percorrer o array de idUnico vindo do servidor para verificar quais pedidos foram sincronizados com sucesso
            for (var j = 0; j < result.clientes_sincronizados.length; j++) {
              alterarClienteSinc(
                result.clientes_sincronizados[j].id,
                result.clientes_sincronizados[j].idUnico
              )
                .then((response) => {
                  console.log(response);
                })
                .catch((erro) => {
                  console.log(erro);
                });
            }
            // mostra reposta do servidor
            handleOpenModal(result.retorno.mensagem, true);
            setLoading(false);
          } else {
            handleOpenModal(result.retorno.mensagem, true);
            setLoading(false);
          }
        });
    } else {
      handleOpenModal("Todas os clientes estão sincronizados.", true);
    } 
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ModalSimples
        texto={textoModal}
        btnFechar={true}
        imagem={null}
        visivel={openModal}
        onPress={() => handleRedirect("SincronizarDados")}
      >
        {textoModal ==
          "Clique em confirmar para enviar os clientes para o servidor" && (
          <ButtonModal
            color="red"
            texto="confirmar"
            funcao={sincronizarCliente}
          />
        )}
      </ModalSimples>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#174c4f",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SincronizarClientes;
