import FabButtons from "../../../components/FabButtons";
import AppbarComFiltros from "../../../components/AppbarComFiltros";
import { MaterialCommunityIcons, FontAwesome } from "react-native-vector-icons";
import React, { useCallback, useContext, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
} from "react-native";
import Loading from "../../../components/Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { print, printToFile } from "../../../components/ComprovanteVenda";

import {
  cancelarPedidoId,
  deletePedidoId,
  limparPedidos,
  readPedidos,
  readPedidosRelatorio,
} from "../../../database/servicesPedidos";

import ModalSimples from "../../../components/ModalSimples";
import { ContextGlobal } from "../../../context/GlobalContext";
import axios from "axios";
import Apis from "../../../Apis";
import Data from "../../../components/Data";
import Button from "../../../components/Button";
import { printRelatorioPedidos } from "../../../components/RelatorioPedidos";

// função para montar e redenrizar a lista de pedidos
const Item = ({ item, index, handleOpcoesPedidos }) => (
  <TouchableOpacity
    key={index}
    onPress={() => handleOpcoesPedidos(item)}
    activeOpacity={0.5}
    style={[
      styles.btPedido,
      {
        elevation: 4,
        backgroundColor: item.numPedido > 0 ? "#fff" : "#fff3c8",
        borderRightWidth: 10,
        borderColor: item.numPedido > 0 ? "green" : "red",
      },
    ]}
  >
    <View style={styles.containerBtPedido}>
      <View style={styles.iconPedido}>
        <FontAwesome name="shopping-cart" size={25} color="#fff" />
      </View>
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.nomeClientePedido}>{item.nome_cliente || item.cliente?.nome || item?.nome}</Text>
        {item.num_pedido_cli ? <Text style={styles.subtitlePedido}>Nº Pedido do Cliente: {item.num_pedido_cli}</Text> : ""}
        <Text style={styles.subtitlePedido}>
          Total: {parseFloat(item.liquido).toFixed(2)}
        </Text>
        <Text style={styles.subtitlePedido}>
          Data: {item.data?.split("-").reverse().join("/")}
        </Text>
        <Text style={styles.subtitlePedido}>
          Situação: {item.situacao == 0 && "Pendente"}
          {item.situacao == 1 && "Finalizado"}
          {item.situacao == 2 && "Cancelado"}
        </Text>
        {item?.motivo ? (
          <Text style={styles.subtitlePedido}>
            {item.motivo == 1 ? "produto sem estoque" : item.motivo}
          </Text>
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);
const ListaPedido = () => {
  // função para renderizar a lista de pedidos
  const renderItem = ({ item, index }) => (
    <Item item={item} index={index} handleOpcoesPedidos={handleOpcoesPedidos} />
  );
  const {
    parametrosLocal,
    handleRedirect,
    tokenLocal,
    representanteId,
    semRede,
  } = useContext(ContextGlobal);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [openModalOpcoes, setOpenModalOpcoes] = useState(false);
  const [openModalSimples, setOpenModalSimples] = useState(false);
  const [openModalEntendi, setOpenModalEntendi] = useState(false);
  const [openModalComprovante, setOpenModalComprovante] = useState(false);
  const [modalFiltro, setModalFiltro] = useState(false);
  const [modalDataRelatorioPedidos, setModalDataRelatorioPedidos] = useState(false);
  const [filtroPorSitucao, setFiltroPorSituacao] = useState(-1);
  const [textoModal, setTextoModal] = useState("");
  const [imgModal, setImgModal] = useState("");
  const [pesquisar, setPesquisar] = useState("");
  const [dadosComprovante, setDadosComprovante] = useState([]);
  const [pedidosLocal, setPedidosLocal] = useState([]);
  const [pedidoClicado, setPedidoClicado] = useState("");
  const dataId = new Date();
  const [FiltroRelatarioPedido, setFiltroRelatarioPedido] = useState();
  const [FiltroRelatarioPedidoFinal, setFiltroRelatarioPedidoFinal] = useState();
  const [diaFiltro, setDiaFiltro] = useState("01");
  const [anoFiltro, setAnoFiltro] = useState(`${dataId.getFullYear()}`);
  const [mesFiltro, setMesFiltro] = useState(
    String(dataId.getMonth() + 1).padStart(2, "0")
  );

  // visualizar comprovante de vendas
  const selectedVerComprovante = async () => {
    setLoading(true);
    await print(dadosComprovante, parametrosLocal);
    setLoading(false);
  };

  // enviar comprovante de vendas
  const selectedEnviarComprovante = async () => {
    setLoading(true);
    await printToFile(dadosComprovante, parametrosLocal);
    setLoading(false);
  };

  const handleDataRelatorioPedidos = () => {
    setModalDataRelatorioPedidos(!modalDataRelatorioPedidos);
  }

  const handleGerarRelatorioPedidos = async () => {
    setModalDataRelatorioPedidos(false);
    await readPedidosRelatorio(FiltroRelatarioPedido, FiltroRelatarioPedidoFinal)
      .then((response) => {
        // setModalDataRelatorioPedidos(false);
        console.log(response);
        printRelatorioPedidos(response, FiltroRelatarioPedido, FiltroRelatarioPedidoFinal, parametrosLocal);

      })
      .catch((error) => {
        // setModalDataRelatorioPedidos(false);
        console.log(error);
      })
  }
  //exexutar função após o usuario passar 1 segundo sem digitar

  useFocusEffect(
    useCallback(() => {
      if (filtroPorSitucao === 2) {
        handleDataPedidos();
      }
      if (
        filtroPorSitucao === 1 ||
        filtroPorSitucao === 0 ||
        filtroPorSitucao === -1
      ) {
        handleDataPedidosLocal();
      }
    }, [
      pesquisar,
      anoFiltro,
      mesFiltro,
      diaFiltro,
      filtroPorSitucao,
      reload,
    ])
  );

  // buscar pedidos e filtrar
  const handleDataPedidosLocal = async () => {
    setLoading(true);
    await readPedidos(
      pesquisar,
      anoFiltro,
      mesFiltro,
      diaFiltro,
      filtroPorSitucao
    )
      .then((response) => {
        setPedidosLocal(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const handleDataPedidos = async () => {
    setLoading(true);
    const ultimoDia = new Date(anoFiltro, mesFiltro, 0);
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenLocal,
      },
    };
    await axios
      .post(
        Apis.urlListarPedidos,
        {
          representante_id: representanteId,
          data_inicial: `${anoFiltro}-${mesFiltro}-${diaFiltro}`,
          data_final: `${anoFiltro}-${mesFiltro}-${String(
            ultimoDia.getDate()
          ).padStart(2, "0")}`,
          qt_registros: 30,
          texto: pesquisar,
        },
        requestOptions
      )
      .then((response) => {
        setPedidosLocal(response.data.registros);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  // open/close modal opções
  const showModalOpcoes = (texto) => {
    setTextoModal(texto);
    setOpenModalOpcoes(!openModalOpcoes);
  };

  // open/close modal filtro
  const showModalFiltro = () => {
    setModalFiltro(!modalFiltro);
  };

  // alterar o filtro de situacao
  const filtrarPorSituacao = (statusFilter) => {
    setModalFiltro(false);
    NetInfo.fetch().then(async (state) => {
      if (statusFilter === 2 && !state.isInternetReachable) {
        showModalEntendi(
          "Você não possui conexão de rede, tente novamente!",
        );
        setFiltroPorSituacao(-1);
        return;
      }
    });
    setFiltroPorSituacao(statusFilter);
  };

  // open close modal simples
  const showModalSimples = (texto) => {
    setTextoModal(texto);
    setOpenModalSimples(!openModalSimples);
  };

  // open close modal entendi
  const showModalEntendi = (texto) => {
    setTextoModal(texto);
    setOpenModalEntendi(!openModalEntendi);
  };

  // open close modal comprovante
  const showModalComprovante = (texto) => {
    setTextoModal(texto);
    setOpenModalComprovante(!openModalComprovante);
  };

  // função para limpar todos o pedidos do aparelho, obs essa função executa outra função (limparPedidos()) caso o usuário clique em confirmar
  const handleOpcaoLimparPedidos = () => {
    showModalSimples(
      "Ao clicar em CONFIRMAR, toda a base de dados de pedidos presente no seu aparelho será removida permanentemente!",
    );
  };

  // função para limpar todos os pedidos do aparelho, obs essa função é executada pela função handleOpcaoLimparPedidos()
  const limparPedidosFunc = async () => {
    setLoading(true);
    setOpenModalSimples(false);
    await limparPedidos()
      .then((response) => {
        showModalEntendi(response);
      })
      .catch((erro) => {
        showModalEntendi(erro);
      });
    setReload(!reload);
  };

  // função que verifica se o pedido pode ou não ser editado ou removido, obs situação 0 e 2, poderá ser alterado ou excluido
  const handleOpcoesPedidos = (item) => {
    setPedidoClicado(item);
    // se estiver pendente ou canelado
    if (item.situacao === 2 || item.situacao === 0) {
      showModalOpcoes(
        "Pedido não sincronizado, opções de alteração e exclusão estão disponíveis!",
      );
    }
    // se estiver finalizado e não sincronizado
    // if (item.situacao == 1 && item.numPedido < 1) {
    //   showModalEntendi(
    //     `Pedido com situação ${
    //       item.situacao == 1 && "FINALIZADO"
    //     } não pode ser alterado ou excluído!`,
    //   );
    // }

    // se estiver finalizado e sincronizado
    if (item.situacao == 1) {
      setDadosComprovante(item);
      showModalComprovante(
        "Pedido finalizado, o comprovante de venda já está disponivel.",
      );
    }
  };

  // função para exclusão de pedido do banco de dados pelo id
  const excluirPedido = async (item) => {
    setOpenModalOpcoes(false);
    setLoading(true);
    await deletePedidoId(item.id_pedido)
      .then((response) => {
        showModalEntendi(response);
      })
      .catch((erro) => {
        showModalEntendi(erro);
      });
    setReload(!reload);
  };

  // função para alterar dados do pedido, recebe como parametro os dados do pedido que será alterado e envia para a tela de alterar pedido
  const alterarPedido = (item) => {
    setOpenModalOpcoes(false);
    navigation.navigate("AlterarPedido", {
      pedido: item,
    });
  };

  const handleCancelarPedido = async (item) => {
    setOpenModalComprovante(false);
    setLoading(true);
    await cancelarPedidoId(item.id_pedido)
      .then((response) => {
        showModalEntendi(response);
        setReload(!reload);
      })
      .catch((erro) => {
        showModalEntendi(erro);
      });
  };

  return (
    <>
      {/* tela principal de listagem de pedidos */}
      <AppbarComFiltros
        setAnoFiltro={setAnoFiltro}
        anoFiltro={anoFiltro}
        setMesFiltro={setMesFiltro}
        mesFiltro={mesFiltro}
        setDiaFiltro={setDiaFiltro}
        diaFiltro={diaFiltro}
        rota={`LISTA DE PEDIDOS (${pedidosLocal.length})`}
        valor={pesquisar}
        setValor={setPesquisar}
        funFilter={showModalFiltro}
      />

      <SafeAreaView
        style={{ backgroundColor: "#174c4f", flex: 1, padding: 10 }}
      >
        {loading ? (
          <Loading />
        ) : pedidosLocal?.length > 0 ? (
          <FlatList
            data={pedidosLocal}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <SafeAreaView
            style={{ backgroundColor: "#174c4f", flex: 1, padding: 10 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>
                Nenhum pedido foi localizado
              </Text>
            </View>
          </SafeAreaView>
        )}
      </SafeAreaView>

      <ModalSimples
        visivel={openModalSimples}
        onPress={() => setOpenModalSimples(false)}
        btnFechar
        imagem={imgModal}
        texto={textoModal}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            height: 40,
            width: "100%",
            marginBottom: 10,
          }}
          onPress={limparPedidosFunc}
        >
          <Text style={{ color: "#fff" }}>confirmar</Text>
        </TouchableOpacity>
      </ModalSimples>

      <ModalSimples
        btnFechar
        visivel={openModalOpcoes}
        onPress={() => setOpenModalOpcoes(false)}
        imagem={imgModal}
        texto={textoModal}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            height: 40,
            width: "100%",
            marginBottom: 10,
          }}
          onPress={() => alterarPedido(pedidoClicado)}
        >
          <Text style={{ color: "#fff" }}>alterar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            height: 40,
            width: "100%",
            marginBottom: 10,
          }}
          onPress={() => excluirPedido(pedidoClicado)}
        >
          <Text style={{ color: "#fff" }}>excluir</Text>
        </TouchableOpacity>
      </ModalSimples>
      {!loading && (
        <ModalSimples
          imagem={imgModal}
          onPress={() => setOpenModalComprovante(false)}
          texto={textoModal}
          visivel={openModalComprovante}
          btnFechar
        >
          <TouchableOpacity
            style={{
              backgroundColor: "orange",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              height: 40,
              width: "100%",
              marginBottom: 10,
            }}
            onPress={() => selectedVerComprovante(dadosComprovante)}
          >
            <Text style={{ color: "#fff" }}>visualizar comprovante</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              height: 40,
              width: "100%",
              marginBottom: 10,
              backgroundColor: "green",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => selectedEnviarComprovante(dadosComprovante)}
          >
            <Text style={{ marginLeft: 3, color: "#fff" }}>
              enviar comprovante
            </Text>
          </TouchableOpacity>
          {dadosComprovante?.numPedido <= 0 && (
            <TouchableOpacity
              style={{
                borderRadius: 5,
                height: 40,
                width: "100%",
                marginBottom: 10,
                backgroundColor: "red",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => handleCancelarPedido(dadosComprovante)}
            >
              <Text style={{ marginLeft: 3, color: "#fff" }}>
                cancelar pedido
              </Text>
            </TouchableOpacity>
          )}
        </ModalSimples>
      )}
      {/* modal data relatorio */}
      <ModalSimples
        imagem={null}
        onPress={() => setModalDataRelatorioPedidos(false)}
        texto="Selecione um intervalo de data para gerar o relatório"
        visivel={modalDataRelatorioPedidos}
      >
        <Data color='red' setValor={setFiltroRelatarioPedido} textColor='white' valor={FiltroRelatarioPedido} />
        <Data color='red' setValor={setFiltroRelatarioPedidoFinal} textColor='white' valor={FiltroRelatarioPedidoFinal} />
        <Button texto='Gerar Relatório' funcao={handleGerarRelatorioPedidos} />
      </ModalSimples>
      <ModalSimples
        imagem={null}
        onPress={() => setModalFiltro(false)}
        texto="Selecione uma das opções para aplicar o filtro."
        visivel={modalFiltro}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            padding: 10,
            borderColor: "gray",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 5,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => filtrarPorSituacao(-1)}
        >
          <Text style={{ color: "black", textTransform: "capitalize" }}>
            MOSTRAR TODOS
          </Text>
          {filtroPorSitucao === -1 ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              color="#174c4f"
              size={20}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              color="#174c4f"
              size={20}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            padding: 10,
            borderColor: "gray",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 5,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => filtrarPorSituacao(0)}
        >
          <Text style={{ color: "black", textTransform: "capitalize" }}>
            SOMENTE PENDENTES
          </Text>
          {filtroPorSitucao === 0 ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              color="#174c4f"
              size={20}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              color="#174c4f"
              size={20}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            padding: 10,
            borderColor: "gray",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 5,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => filtrarPorSituacao(1)}
        >
          <Text style={{ color: "black", textTransform: "capitalize" }}>
            SOMENTE SINCRONIZADOS
          </Text>
          {filtroPorSitucao === 1 ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              color="#174c4f"
              size={20}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              color="#174c4f"
              size={20}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            padding: 10,
            borderColor: "gray",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 5,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => filtrarPorSituacao(2)}
        >
          <Text style={{ color: "black", textTransform: "capitalize" }}>
            SOMENTE PEDIDOS DO SERVIDOR
          </Text>
          {filtroPorSitucao === 2 ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              color="#174c4f"
              size={20}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              color="#174c4f"
              size={20}
            />
          )}
        </TouchableOpacity>
      </ModalSimples>

      <ModalSimples
        btnFechar
        imagem={imgModal}
        onPress={() => setOpenModalEntendi(false)}
        texto={textoModal}
        visivel={openModalEntendi}
      />

      <FabButtons
        cadastrar={() => handleRedirect("CadastrarPedido")}
        limpar={handleOpcaoLimparPedidos}
        recarregar={() => setReload(!reload)}
        dataPedidos={handleDataRelatorioPedidos}
      />
    </>
  );
};
const styles = StyleSheet.create({
  btPedido: {
    backgroundColor: "#fff3c8",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconPedido: {
    backgroundColor: "#6464f8",
    padding: 10,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBtPedido: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap'
  },
  nomeClientePedido: {
    color: "#174c4f",
    fontWeight: "bold",
  },
  subtitlePedido: {
    color: "gray",
  },
});
export default ListaPedido;
