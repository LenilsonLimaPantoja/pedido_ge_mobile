import React, { useCallback, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import FabButtonsSemAdd from "../../../components/FabButtonsSemAdd";
import Loading from "../../../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import Appbar from "../../../components/Appbar";
import ModalSimples from "../../../components/ModalSimples";
import ButtonModal from "../../../components/ButtonModal";
import {
  limparDadosProdutos,
  readProdutos,
} from "../../../database/servicesProdutos";

import { ContextGlobal } from "../../../context/GlobalContext";

const Produto = ({ item }) => (
  <TouchableOpacity activeOpacity={0.5} style={styles.produtoItem}>
    <View style={styles.containerLeft}>
      {/* <FontAwesome name="cubes" size={40} color="#6464f8" /> */}
      <Image
        source={{ uri: item?.url_imagem }}
        style={{ width: 70, height: 70, borderRadius: 5 }}
      />
      <View style={styles.containerProd}>
        <Text
          style={[
            styles.textProd,
            { color: "#174c4f", textTransform: "capitalize" },
          ]}
        >
          {item?.descricao?.length < 40
            ? item?.descricao
            : item?.descricao?.substring(0, 40)}
        </Text>
        <Text style={styles.textProd}>
          Preço: R$ {parseFloat(item?.preco).toFixed(2)}
        </Text>
        {item?.sigla && <Text style={styles.textProd}>Unidade: {item?.sigla}</Text>}
        <Text style={styles.textProd}>
          Estoque: {parseFloat(item?.estoque).toFixed(2)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);
const ListaProdutos = () => {
  const renderProduto = ({ item, index }) => (
    <Produto item={item} index={index} />
  );
  const { handleRedirect, pedidosLocal } = useContext(ContextGlobal);
  const [pesquisar, setPesquisar] = useState("");
  const [openModalRemoveProdutos, setOpenModalRemoveProdutos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [textoModal, setTextoModal] = useState("");

  // buscar os produtos no banco de dados
  useFocusEffect(
    useCallback(() => {
      const dataProd = async () => {
        setLoading(true);
        await readProdutos(pesquisar, 30)
          .then((response) => {
            setProdutos(response);
          })
          .catch((erro) => {
            console.log(erro);
          });
        setLoading(false);
      };
      dataProd();
    }, [pesquisar, reload])
  );

  // ao clicar na opção limpar produtos
  const alertLimparProdutos = (texto, open) => {
    // se houver pedidos criados
    if (pedidosLocal?.length > 0) {
      setTextoModal(
        "Há dados vinculados aos produtos, remover a tabela de produtos pode ocasionar erros, limpe os dados vinculados e tente novamente"
      );
    } else {
      setTextoModal(texto);
    }
    setOpenModalRemoveProdutos(open);
  };

  // confirmar remover lista d produtos caso não haja pedidos criados
  const removerListaProdutos = async () => {
    setOpenModalRemoveProdutos(false);
    setLoading(true);
    await limparDadosProdutos()
      .then((response) => {
        alertLimparProdutos(response, true);
      })
      .catch((erro) => {
        alertLimparProdutos(erro, true);
      });
    setLoading(false);
    setReload(!reload);
  };

  return (
    <>
      <Appbar
        rota={`lista de produtos (${produtos?.length})`}
        valor={pesquisar}
        setValor={setPesquisar}
      />

      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loading />
        ) : produtos?.length > 0 ? (
          <FlatList
            style={styles.lista}
            data={produtos}
            renderItem={renderProduto}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>
              Nenhum produto foi encontrado!
            </Text>
          </View>
        )}
      </SafeAreaView>

      <ModalSimples
        btnFechar={true}
        imagem={null}
        texto={textoModal}
        visivel={openModalRemoveProdutos}
        onPress={() => setOpenModalRemoveProdutos(false)}
      >
        {textoModal ==
          "Ao clicar em confirmar, toda a base de dados de produtos presente no seu aparelho será removida permanentemente." && (
          <ButtonModal
            color="red"
            texto="confirmar"
            funcao={removerListaProdutos}
          />
        )}
      </ModalSimples>
      <FabButtonsSemAdd
        recarregar={() => setReload(!reload)}
        limpar={() =>
          alertLimparProdutos(
            "Ao clicar em confirmar, toda a base de dados de produtos presente no seu aparelho será removida permanentemente.",
            true
          )
        }
        baixar={() => handleRedirect("BaixarProdutos")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
    padding: 10,
  },
  lista: {
    width: "100%",
  },
  produtoItem: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRightWidth: 10,
    borderColor: "green",
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerProd: {
    marginLeft: 10,
  },
  textProd: {
    color: "gray",
  },
});

export default ListaProdutos;
