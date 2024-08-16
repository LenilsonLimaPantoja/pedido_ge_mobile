import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ModalSimples from "../../../components/ModalSimples";
import Loading from "../../../components/Loading";
import { addCliente } from "../../../database/servicesClientes";
import { ContextGlobal } from "../../../context/GlobalContext";
const BaixarClientes = () => {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [loading, setLoading] = useState(false);
  const { qtdClientesPendentes, totalVisitasPendentes, totalPedidosPendentes } =
    useContext(ContextGlobal);
  const handleOpenModal = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };

  useFocusEffect(
    useCallback(() => {
      if (
        totalPedidosPendentes.qtdPendente > 0 ||
        qtdClientesPendentes > 0 ||
        totalVisitasPendentes > 0
      ) {
        return handleOpenModal('ERRO, há dados pedentes, todas as informações devem ser sincronizadas antes de qualquer operação de download.', true);
      }
      const dataClientes = async () => {
        setLoading(true);
        await addCliente()
          .then((response) => {
            handleOpenModal(response, true);
          })
          .catch((erro) => {
            console.log(erro);
          });
        setLoading(false);
      };
      dataClientes();
    }, [])
  );

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
        onPress={() => navigation.goBack()}
      />
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

export default BaixarClientes;
