import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ModalSimples from "../../../components/ModalSimples";
import Loading from "../../../components/Loading";
import { addProdutos } from "../../../database/servicesProdutos";
import { ContextGlobal } from "../../../context/GlobalContext";
const BaixarProdutos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { totalPedidosPendentes, qtdClientesPendentes, totalVisitasPendentes } =
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
        return handleOpenModal(
          "ERRO, há dados pedentes, todas as informações devem ser sincronizadas antes de qualquer operação de download.",
     
          true
        );
      }
      const dataProd = async () => {
        setLoading(true);
        await addProdutos()
          .then((response) => {
            handleOpenModal(response, true);
          })
          .catch((erro) => {
            handleOpenModal(erro, true);
          });
        setLoading(false);
      };
      dataProd();
    }, [])
  );

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

export default BaixarProdutos;
