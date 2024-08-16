import React, { useContext, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Apis from "../../../Apis";
import ModalSimples from "../../../components/ModalSimples";
import { ContextGlobal } from "../../../context/GlobalContext";
import ButtonModal from "../../../components/ButtonModal";
import Loading from "../../../components/Loading";
import {
  alterarVisitaSinc,
  readVisitasSincronizar,
} from "../../../database/servicesVisitas";
import { readClientesId } from "../../../database/servicesClientes";
const SincronizarVisitas = () => {
  const [openModal, setOpenModal] = useState(true);
  const [textoModal, setTextoModal] = useState(
    "Clique em confirmar para enviar as visitas para o servidor"
  );
  const [loading, setLoading] = useState(false);
  const { tokenLocal, handleRedirect, qtdClientesPendentes } =
    useContext(ContextGlobal);

  const handleOpenModal = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };

  // sincronizar visitas com o servidor
  const sincronizarVisitas = async () => {
    if (qtdClientesPendentes > 0) {
      return handleOpenModal(
        "Existem clientes pendentes, todos os clientes devem ser sincronizados antes dos pedidos",
        true
      );
    }
    var visitasBd = [];
    await readVisitasSincronizar()
      .then((response) => {
        visitasBd = response;
      })
      .catch((erro) => {
        console.log(erro);
      });
    for (let i = 0; i < visitasBd.length; i++) {
      await readClientesId(visitasBd[i].cliente_id)
        .then((response) => {
          visitasBd[i].nome = response[0].nome;
          visitasBd[i].cliente_id = response[0].id_cliente_servidor;
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
    if (visitasBd?.length > 0) {
      setLoading(true);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenLocal,
        },
        body: JSON.stringify(visitasBd),
      };
      fetch(Apis.urlCreateVisitas, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.visitas) {
            // for para para percorrer o array de idUnico vindo do servidor para verificar quais pedidos foram sincronizados com sucesso
            for (var j = 0; j < result.visitas.length; j++) {
              alterarVisitaSinc(result.visitas[j].idUnico)
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
          }
        });
    } else {
      handleOpenModal("Todas as visitas estão sincronizados.", true);
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
          "Clique em confirmar para enviar as visitas para o servidor" && (
          <ButtonModal
            color="red"
            texto="confirmar"
            funcao={sincronizarVisitas}
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

export default SincronizarVisitas;
