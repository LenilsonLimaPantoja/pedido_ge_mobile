import axios from "axios";
import React, { useContext, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Apis from "../../../Apis";
import ModalSimples from "../../../components/ModalSimples";
import { ContextGlobal } from "../../../context/GlobalContext";
import ButtonModal from "../../../components/ButtonModal";
import Loading from "../../../components/Loading";
import {
  alterarPedidoSinc,
  readItensPedidos,
  readPedidosSincronizar,
} from "../../../database/servicesPedidos";
import { readClientesId } from "../../../database/servicesClientes";
const SincronizarPedidos = () => {
  const [openModal, setOpenModal] = useState(true);
  const [textoModal, setTextoModal] = useState(
    "Clique em confirmar para enviar os pedidos para o servidor"
  );
  const [loading, setLoading] = useState(false);
  const { tokenLocal, handleRedirect, qtdClientesPendentes } =
    useContext(ContextGlobal);

  const handleOpenModal = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };

  // sincronizar pedidosBd com o servidor
  const handleSincronizarPedidos = async () => {
    if (qtdClientesPendentes > 0) {
      return handleOpenModal(
        "Existem clientes pendentes, todos os clientes devem ser sincronizados antes dos pedidos",
        true
      );
    }
    var pedidosBd = [];
    await readPedidosSincronizar()
      .then((response) => {
        pedidosBd = response;
      })
      .catch((erro) => {
        console.log(erro);
      });
    for (let i = 0; i < pedidosBd?.length; i++) {
      await readItensPedidos(pedidosBd[i].id)
        .then((response) => {
          pedidosBd[i].produtos = response;
        })
        .catch((erro) => {
          console.log(erro);
        });

      await readClientesId(pedidosBd[i].cliente_id)
        .then((response) => {
          pedidosBd[i].cliente = response[0];
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenLocal,
      },
    };
    // se existir produtos para sincronizar entra no if
    if (pedidosBd.length > 0) {
      setLoading(true);
      // console.log(JSON.stringify(pedidosBd));
      await axios
        .post(Apis.urlCreatePedidos, pedidosBd, requestOptions)
        .then((response) => {
          if (response.data.pedidos_sincronizados) {
            for (
              var j = 0;
              j < response.data.pedidos_sincronizados.length;
              j++
            ) {
              alterarPedidoSinc({
                idUnico: response.data.pedidos_sincronizados[j].idUnico,
                numPedido: response.data.pedidos_sincronizados[j].numPedido,
                motivo: "",
              })
                .then((response) => {
                  console.log('pedido', response);
                })
                .catch((erro) => {
                  console.log(erro.response);
                });
            }
            // mostra reposta do servidor
            handleOpenModal(response.data.retorno?.mensagem, true);
            // handleOpenModal(JSON.stringify(response.data), true);
          }

          if (response.data.pedidos_rejeitados) {
            for (var j = 0; j < response.data.pedidos_rejeitados.length; j++) {
              alterarPedidoSinc({
                idUnico: response.data.pedidos_rejeitados[j].idUnico,
                numPedido: 0,
                motivo: response.data.pedidos_rejeitados[j].motivo,
              })
                .then((response) => {
                  console.log('pedido', response);
                })
                .catch((erro) => {
                  console.log('hhhhh',erro);
                });
            }
            // mostra reposta do servidor
            handleOpenModal(response.data.retorno?.mensagem, true);
            // handleOpenModal(JSON.stringify(response.data), true);
            // return
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log('Erro',error.response.data);
          setLoading(false);
          handleOpenModal(error.response.data.retorno?.mensagem, true);
          console.log(tokenLocal);
        });

      // se não existir pedidos para sincronizar entra no else
    } else {
      handleOpenModal("Todos os pedidos estão sincronizados.", true);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ModalSimples
        btnFechar
        imagem={null}
        texto={textoModal}
        visivel={openModal}
        onPress={() => handleRedirect("SincronizarDados")}
      >
        {textoModal ==
          "Clique em confirmar para enviar os pedidos para o servidor" && (
            <ButtonModal
              color="red"
              texto="confirmar"
              funcao={handleSincronizarPedidos}
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

export default SincronizarPedidos;
