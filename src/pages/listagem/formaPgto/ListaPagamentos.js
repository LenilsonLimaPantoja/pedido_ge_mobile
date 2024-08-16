import React, { useCallback, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import Appbar from "../../../components/Appbar";
import { FontAwesome } from "react-native-vector-icons";
import FabButtonsSemAdd from "../../../components/FabButtonsSemAdd";
import Loading from "../../../components/Loading";
import ModalSimples from "../../../components/ModalSimples";
import ButtonModal from "../../../components/ButtonModal";
import { useFocusEffect } from "@react-navigation/native";

import {
  limparDadosFormaPgto,
  readFormaPgto,
} from "../../../database/servicesFormasPgto";

import { ContextGlobal } from "../../../context/GlobalContext";

const FormaPagamento = ({ item }) => (
  <TouchableOpacity activeOpacity={0.5} style={styles.pagamentoItem}>
    <View style={styles.containerLeft}>
      <FontAwesome name="credit-card" size={30} color="#6464f8" />
      <View style={styles.containerPagamento}>
        <Text
          style={[
            styles.textPagamento,
            { color: "#174c4f", textTransform: "capitalize" },
          ]}
        >
          {item.descricao}
        </Text>
        <Text style={styles.textPagamento}>
          Parcelamento: {item.parcelamento == 1 ? "Sim" : "Não"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);
const ListaPagamentos = () => {
  const renderFormaPagamento = ({ item }) => <FormaPagamento item={item} />;
  const { handleRedirect, pedidosLocal } = useContext(ContextGlobal);
  const [formasPagamentos, setformasPagamentos] = useState([]);
  const [pesquisar, setPesquisar] = useState("");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [textoModal, setTextoModal] = useState("");

  // open/close modal limpar dados
  const handleOpenCloseModalLimpar = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };

  // buscar dados das formas de pagamento
  useFocusEffect(
    useCallback(() => {
      const dataFormaPgto = async () => {
        setLoading(true);
        await readFormaPgto(pesquisar, 30)
          .then((response) => {
            setformasPagamentos(response);
          })
          .catch((erro) => {
            alert(erro);
          });
        setLoading(false);
      };
      dataFormaPgto();
    }, [pesquisar, reload])
  );

  // ao clicar na opção para limpar dados
  const removerListaProdutos = () => {
    // se houver pedidos criados
    if (pedidosLocal?.length > 0) {
      handleOpenCloseModalLimpar(
        "Há dados vinculados as formas de pagamento, remover a tabela de formas de pagamento pode ocasionar erros, limpe os dados vinculados e tente novamente",
        true
      );
      return;
    }
    // se não houver pedido criados, abre o modal para confirmar a remoção das formas de pagamento
    handleOpenCloseModalLimpar(
      "Ao clicar em confirmar, toda a base de dados de formas de pagamento presente no seu aparelho será removida permanentemente.",
      true
    );
  };

  // função para limpar as formas de pagamento
  const removerFormasPagamento = async () => {
    setOpenModal(false);
    setLoading(true);
    await limparDadosFormaPgto()
      .then((response) => {
        handleOpenCloseModalLimpar(response, true);
      })
      .catch((erro) => {
        handleOpenCloseModalLimpar(erro, true);
      });
    setLoading(false);
    setReload(!reload);
  };
  return (
    <>
      <Appbar
        valor={pesquisar}
        setValor={setPesquisar}
        rota={`Formas de Pgto (${formasPagamentos?.length})`}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <SafeAreaView style={styles.container}>
            {formasPagamentos?.length > 0 ? (
              <FlatList
                data={formasPagamentos}
                renderItem={renderFormaPagamento}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>
                  Nenhum forma de pagamento foi encontrada!
                </Text>
              </View>
            )}
          </SafeAreaView>
          <FabButtonsSemAdd
            recarregar={() => setReload(!reload)}
            limpar={removerListaProdutos}
            baixar={() => handleRedirect("BaixarFormasPgto")}
          />
        </>
      )}

      <ModalSimples
        btnFechar={true}
        imagem={null}
        visivel={openModal}
        texto={textoModal}
        onPress={() => setOpenModal(false)}
      >
        {textoModal ==
          "Ao clicar em confirmar, toda a base de dados de formas de pagamento presente no seu aparelho será removida permanentemente." && (
          <ButtonModal
            color="red"
            texto="confirmar"
            funcao={removerFormasPagamento}
          />
        )}
      </ModalSimples>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
    padding: 10,
  },
  pagamentoItem: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRightWidth: 10,
    borderColor: 'green'
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerPagamento: {
    marginLeft: 10,
  },
  textPagamento: {
    color: "gray",
  },
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListaPagamentos;
