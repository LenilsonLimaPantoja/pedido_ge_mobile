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
import { ContextGlobal } from "../../../context/GlobalContext";
import { limparDadosTabelaPrecos, readTabelaPrecos } from "../../../database/servicesTabelaPrecos";

const TabelaPrecosItem = ({ item }) => (
  <TouchableOpacity activeOpacity={0.5} style={styles.tabelaPrecosItem}>
    <View style={styles.containerLeft}>
      <FontAwesome name="table" size={30} color="#6464f8" />
      <View style={styles.containerTabelaPrecos}>
        <Text
          style={[
            styles.textTabelaPrecos,
            { color: "#174c4f", textTransform: "capitalize" },
          ]}
        >
          {item.descricao}
        </Text>
        <Text style={styles.textTabelaPrecos}>
          Tabela custo: {item.tabela_custo}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);
const ListaTabelaPrecos = () => {
  const renderTabelaPrecos = ({ item }) => <TabelaPrecosItem item={item} />;
  const { handleRedirect, pedidosLocal } = useContext(ContextGlobal);
  const [tabelaPrecos, setTabelaPrecos] = useState([]);
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

  // buscar dados das tabela de preços
  useFocusEffect(
    useCallback(() => {
      const dataTabelaPrecos = async () => {
        setLoading(true);
        await readTabelaPrecos(pesquisar, 30)
          .then((response) => {
            setTabelaPrecos(response);
          })
          .catch((erro) => {
            alert(erro);
          });
        setLoading(false);
      };
      dataTabelaPrecos();
    }, [pesquisar, reload])
  );

  // ao clicar na opção para limpar dados
  const removerTabelaPrecosOpenModal = () => {
    // se houver pedidos criados
    if (pedidosLocal?.length > 0) {
      handleOpenCloseModalLimpar(
        "Há dados vinculados as tabela de preços, remover a tabela de tabela de preços pode ocasionar erros, limpe os dados vinculados e tente novamente",
        true
      );
      return;
    }
    // se não houver pedido criados, abre o modal para confirmar a remoção das tabela de preços
    handleOpenCloseModalLimpar(
      "Ao clicar em confirmar, toda a base de dados de tabela de preços presente no seu aparelho será removida permanentemente.",
      true
    );
  };

  // função para limpar as tabela de preços
  const removerTabelaPrecos = async () => {
    setOpenModal(false);
    setLoading(true);
    await limparDadosTabelaPrecos()
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
        rota={`Tabela de Preços (${tabelaPrecos?.length})`}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <SafeAreaView style={styles.container}>
            {tabelaPrecos?.length > 0 ? (
              <FlatList
                data={tabelaPrecos}
                renderItem={renderTabelaPrecos}
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
                  Nenhuma tabela de preços foi encontrada!
                </Text>
              </View>
            )}
          </SafeAreaView>
          <FabButtonsSemAdd
            recarregar={() => setReload(!reload)}
            limpar={removerTabelaPrecosOpenModal}
            baixar={() => handleRedirect("BaixarTabelaPrecos")}
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
          "Ao clicar em confirmar, toda a base de dados de tabela de preços presente no seu aparelho será removida permanentemente." && (
            <ButtonModal
              color="red"
              texto="confirmar"
              funcao={removerTabelaPrecos}
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
  tabelaPrecosItem: {
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
  containerTabelaPrecos: {
    marginLeft: 10,
  },
  textTabelaPrecos: {
    color: "gray",
  },
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListaTabelaPrecos;
