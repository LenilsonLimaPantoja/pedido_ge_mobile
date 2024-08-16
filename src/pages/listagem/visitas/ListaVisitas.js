import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ButtonModalFiltro from "../../../components/ButtonModalFiltro";
import FabButtons from "../../../components/FabButtons";
import ModalSimples from "../../../components/ModalSimples";
import { FontAwesome } from "react-native-vector-icons";
import Loading from "../../../components/Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ButtonModal from "../../../components/ButtonModal";
import AppbarComFiltros from "../../../components/AppbarComFiltros";

import {
  limparDadosVisitas,
  readVisitas,
  removeVisitaId,
} from "../../../database/servicesVisitas";

const Cliente = ({ item, funcao }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={[
      styles.visitaItem,
      { backgroundColor: item.status_visita < 1 ? "#fff3c8" : "white", borderColor: item.status_visita < 1 ? "red" : "green", borderRightWidth: 10},
    ]}
    onPress={() => funcao(item)}
  >
    <View style={styles.containerLeft}>
      <FontAwesome name="handshake-o" size={30} color="#6464f8" />
      <View style={styles.containerVisita}>
        <Text
          style={[
            styles.textVisita,
            { color: "#174c4f", textTransform: "capitalize" },
          ]}
        >
          {item?.nome?.length < 40 ? item?.nome : item?.nome?.substring(0, 40)}
        </Text>
        <Text style={styles.textVisita}>
          Data: {item.data_hora.split("-").reverse().join("/")}
        </Text>
        <Text style={styles.textVisita}>Motivo: {item.obs}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
const ListaVisitas = () => {
  const renderCliente = ({ item, index }) => (
    <Cliente item={item} index={index} funcao={handleOpenModalOpcoesVisitas} />
  );
  const [pesquisar, setPesquisar] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [openModa, setOpenModal] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [filtroPorStatus, setFiltroPorStatus] = useState(-1);
  const [visitas, setVisitas] = useState([]);
  const [dadosAltVisita, setDadosAltVisita] = useState([]);
  const navigation = useNavigation();
  const data = new Date();
  const [diaFiltro, setDiaFiltro] = useState("01");
  const [anoFiltro, setAnoFiltro] = useState(`${data.getFullYear()}`);
  const [mesFiltro, setMesFiltro] = useState(
    String(data.getMonth() + 1).padStart(2, "0")
  );

  // open close modal
  const handleOpenModal = (texto, open) => {
    setTextoModal(texto);
    setOpenModal(open);
  };

  //   buscar as visitas
  useFocusEffect(
    useCallback(() => {
      const handleDados = async () => {
        setLoading(true);
        await readVisitas(
          pesquisar,
          anoFiltro,
          mesFiltro,
          diaFiltro,
          filtroPorStatus
        )
          .then((response) => {
            setVisitas(response);
          })
          .catch((erro) => {
            handleOpenModal(erro, true);
          });
        setLoading(false);
      };
      handleDados();
    }, [reload, anoFiltro, mesFiltro, diaFiltro, pesquisar, filtroPorStatus])
  );

  // ao clicar sobre a visita
  const handleOpenModalOpcoesVisitas = (dado) => {
    // se a visita já estiver estiver sincronizada
    if (dado.status_visita > 0) {
      return handleOpenModal(
        "Visita já sicronizada com o servidor não poderá ser alterada ou excluída!",
        true
      );
    }
    // se a visita não estiver sincronizada
    setDadosAltVisita(dado);
    handleOpenModal(
      "A visita ainda não foi sincronizada, opções de alteração e exclusão estão disponíveis!",
      true
    );
  };

  // exclusão de visitas local usando o da id_visita
  const excluirVisita = async (id_visita) => {
    setOpenModal(false);
    setLoading(true);
    await removeVisitaId(id_visita)
      .then((response) => {
        handleOpenModal(response, true);
      })
      .catch((erro) => {
        handleOpenModal(erro, true);
      });
    setLoading(false);
    setReload(!reload);
  };

  //   altera o filtro de status
  const filtrarPorStatus = (statusFilter) => {
    setOpenModal(false);
    setFiltroPorStatus(statusFilter);
  };

  //   ao clicar na opção para limpar as visitas
  const alertConfirmarLimparVisitas = () => {
    handleOpenModal(
      "Ao clicar em confirmar, toda a base de dados de visitas presente no seu aparelho será removida permanentemente.",
      true
    );
  };

  // função para remover todas as visitas do banco de dados
  const removerVisitas = async () => {
    setOpenModal(false);
    setLoading(true);
    await limparDadosVisitas()
      .then((response) => {
        handleOpenModal(response, true);
      })
      .catch((erro) => {
        handleOpenModal(erro, true);
      });
    setLoading(false);
    setReload(!reload);
  };

  return (
    <>
      <AppbarComFiltros
        setAnoFiltro={setAnoFiltro}
        anoFiltro={anoFiltro}
        setMesFiltro={setMesFiltro}
        mesFiltro={mesFiltro}
        setDiaFiltro={setDiaFiltro}
        diaFiltro={diaFiltro}
        valor={pesquisar}
        rota={`LISTA DE VISITAS (${visitas.length})`}
        setValor={setPesquisar}
        funFilter={() =>
          handleOpenModal(
            "Selecione uma da opções para aplicar o filtro.",
            true
          )
        }
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loading />
        ) : visitas?.length > 0 ? (
          <FlatList
            style={styles.lista}
            data={visitas}
            renderItem={renderCliente}
            keyExtractor={(item) => item.id_visita}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>
              Nenhuma visita foi encontrada!
            </Text>
          </View>
        )}
      </SafeAreaView>

      <ModalSimples
        btnFechar={false}
        onPress={() => setOpenModal(false)}
        imagem={null}
        texto={textoModal}
        visivel={openModa}
      >
        {textoModal == "Selecione uma da opções para aplicar o filtro." ? (
          <>
            <ButtonModalFiltro
              texto="Mostrar Todos"
              filtroPorStatus={filtroPorStatus == -1 ? 0 : 1}
              funcao={() => filtrarPorStatus(-1)}
            />
            <ButtonModalFiltro
              texto="Somente Pendentes"
              filtroPorStatus={filtroPorStatus == 0 ? 0 : 1}
              funcao={() => filtrarPorStatus(0)}
            />
            <ButtonModalFiltro
              texto="Somente Sincronizados"
              filtroPorStatus={filtroPorStatus == 1 ? 0 : 1}
              funcao={() => filtrarPorStatus(1)}
            />
          </>
        ) : textoModal ==
          "A visita ainda não foi sincronizada, opções de alteração e exclusão estão disponíveis!" ? (
          <>
            <ButtonModal
              color="orange"
              texto="alterar"
              funcao={() =>
                navigation.navigate("AlterarVisita", {
                  id_visita: dadosAltVisita.id_visita,
                })
              }
            />
            <ButtonModal
              color="red"
              funcao={() => excluirVisita(dadosAltVisita.id_visita)}
              texto="excluir"
            />
          </>
        ) : (
          <>
            <ButtonModal texto="entendi" funcao={() => setOpenModal(false)} />
            {textoModal ==
              "Ao clicar em confirmar, toda a base de dados de visitas presente no seu aparelho será removida permanentemente." && (
              <ButtonModal
                texto="confirmar"
                color="red"
                funcao={removerVisitas}
              />
            )}
          </>
        )}
      </ModalSimples>
      <FabButtons
        recarregar={() => setReload(!reload)}
        cadastrar={() => navigation.navigate("CadastrarVisita")}
        limpar={alertConfirmarLimparVisitas}
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
  visitaItem: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerVisita: {
    marginLeft: 10,
  },
  textVisita: {
    color: "gray",
  },
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListaVisitas;
