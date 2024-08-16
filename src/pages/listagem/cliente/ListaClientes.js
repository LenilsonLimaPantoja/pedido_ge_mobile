import React, { useCallback, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { ContextGlobal } from "../../../context/GlobalContext";
import FabButtons from "../../../components/FabButtons";
import Loading from "../../../components/Loading";
import ModalSimples from "../../../components/ModalSimples";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ButtonModal from "../../../components/ButtonModal";
import ButtonModalFiltro from "../../../components/ButtonModalFiltro";
import AppbarComFiltros from "../../../components/AppbarComFiltros";

import {
  limparDados,
  readClientes,
  removeClienteId,
} from "../../../database/servicesClientes";

import { readPedidosIdCliente } from "../../../database/servicesPedidos";
import { readVisitaIdCliente } from "../../../database/servicesVisitas";

const Cliente = ({ item, funcao }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={[
      styles.clienteItem,
      {
        backgroundColor: item?.id_cliente_servidor < 1 ? "#fff3c8" : "white",
        borderRightWidth: 10,
        borderColor: item?.id_cliente_servidor < 1 ? "red" : "green",
      },
    ]}
    onPress={() => funcao(item)}
  >
    <View style={styles.containerLeft}>
      <FontAwesome name="user-circle-o" size={40} color="#6464f8" />
      <View style={styles.containerUser}>
        <Text
          style={[
            styles.textUser,
            { color: "#174c4f", textTransform: "capitalize" },
          ]}
        >
          {item?.nome?.length < 40 || item?.apelido?.length < 40
            ? item?.apelido
              ? item?.apelido
              : item?.nome
            : item?.apelido
            ? item?.apelido?.substring(0, 40)
            : item?.nome?.substring(0, 40)}
        </Text>
        {item?.email && <Text style={styles.textUser}>{item?.email}</Text>}
        <Text style={styles.textUser}>CNPJ: {item?.cnpj_cpf}</Text>
        <Text style={styles.textUser}>Telefone: {item?.fone1}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
const ListaClientes = () => {
  const renderCliente = ({ item }) => (
    <Cliente item={item} funcao={handleOpenModalOpcoesClientes} />
  );
  const { pedidosLocal, visitasLocal } = useContext(ContextGlobal);
  const [pesquisar, setPesquisar] = useState("");
  const { handleRedirect } = useContext(ContextGlobal);
  const [openModalOpcoesClientes, setOpenModalOpcoesClientes] = useState(false);
  const [openModalFiltro, setOpenModalFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [filtroPorStatus, setFiltroPorStatus] = useState(-1);
  const [clienteClicado, setClienteClicado] = useState([]);
  const navigation = useNavigation();
  const [clientesBd, setClientesBd] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const dataBd = async () => {
        setLoading(true);
        await readClientes(pesquisar, filtroPorStatus, 30)
          .then((response) => {
            setClientesBd(response);
          })
          .catch((erro) => {
            console.log(erro);
          });
        setLoading(false);
      };
      dataBd();
    }, [pesquisar, filtroPorStatus, reload])
  );

  // altera o filtro de status
  const filtrarPorStatus = (statusFilter) => {
    setOpenModalFiltro(false);
    setFiltroPorStatus(statusFilter);
  };

  // open/close modal de filtro
  const handleOpenModalFiltro = (texto, open) => {
    setTextoModal(texto);
    setOpenModalFiltro(open);
  };

  // open/close o modal de opções
  const handleOpenCloseModalOpcoesClientes = (texto, open) => {
    setTextoModal(texto);
    setOpenModalOpcoesClientes(open);
  };

  // abre o modal de opções ao clicar sobre o cliente de acordo com as codilçoes
  const handleOpenModalOpcoesClientes = async (item) => {
    // se o cliente ja estiver sincronizado
    if (item?.id_cliente_servidor > 0) {
      handleOpenCloseModalOpcoesClientes(
        "Cliente já sicronizado com o servidor não poderá ser alterado ou excluído!.",
        true
      );
      return;
    }

    // verifica se o cliente esta vinculado à pedidos
    var clientePedidos = [];
    await readPedidosIdCliente(item?.id)
      .then((response) => {
        clientePedidos = response;
      })
      .catch((erro) => {
        return handleOpenCloseModalOpcoesClientes(erro, true);
      });

    // verifica se o cliente esta vinculado à visitas
    var clienteVisitas = [];
    await readVisitaIdCliente(item?.id)
      .then((response) => {
        clienteVisitas = response;
      })
      .catch((erro) => {
        return handleOpenCloseModalOpcoesClientes(erro, true);
      });

    // se o cliente estiver vinculado à pedidos ou visitas
    if (clientePedidos > 0 || clienteVisitas > 0) {
      return handleOpenCloseModalOpcoesClientes(
        "ERRO - há dados vinculados a esse cliente, limpe os dados e tente novamente.",
        true
      );
    } else {
      // se o cliente não estiver vinculado à pedidos ou visitas
      // abre o modal com as opções de alterar ou excluir
      handleOpenCloseModalOpcoesClientes(
        "O cliente ainda não foi sincronizado, opções de alteração e exclusão estão disponíveis!",
        true
      );
    }
    setClienteClicado(item);
    setOpenModalOpcoesClientes(!openModalOpcoesClientes);
  };

  // ao clicar na opção de limpar dados
  const alertLimparClientes = () => {
    // se houver pedidos ou visitas criados
    if (pedidosLocal?.length > 0 || visitasLocal?.length > 0) {
      return handleOpenCloseModalOpcoesClientes(
        "Há dados vinculados aos clientes, remover a tabela de clientes pode ocasionar erros, limpe os dados vinculados e tente novamente",
        true
      );
    }
    // se não houver visitas nem pedidos criados abre o modal para confirmar a remoção de todos os clientes
    handleOpenCloseModalOpcoesClientes(
      "Ao clicar em confirmar, toda a base de dados de clientes presente no seu aparelho será removida permanentemente.",
      true
    );
  };

  // função para confirmar a remoção de todos os clientes do banco
  const limparClientes = async () => {
    setOpenModalOpcoesClientes(false);
    setLoading(true);
    await limparDados()
      .then((response) => {
        handleOpenCloseModalOpcoesClientes(response, true);
      })
      .catch((erro) => {
        handleOpenCloseModalOpcoesClientes(erro, true);
      });
    setLoading(false);
    setReload(!reload);
  };

  // função para remover um cliente pelo id
  const handleExcluirClienteId = async () => {
    setLoading(true);
    setOpenModalOpcoesClientes(false);
    await removeClienteId(clienteClicado)
      .then((response) => {
        handleOpenCloseModalOpcoesClientes(response, true);
      })
      .catch((erro) => {
        handleOpenCloseModalOpcoesClientes(
          "Erro, tente novamente",
          true
        );
        console.log(erro);
      });
    setReload(!reload);
  };
  return (
    <>
      <AppbarComFiltros
        rota={
          clientesBd
            ? `lista de clientes (${clientesBd?.length})`
            : "lista de clientes"
        }
        valor={pesquisar}
        setValor={setPesquisar}
        funFilter={() =>
          handleOpenModalFiltro(
            "Selecione uma da opções para aplicar o filtro.",
            true
          )
        }
        filtroData={false}
      />
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView style={styles.container}>
          {clientesBd?.length > 0 ? (
            <FlatList
              style={styles.lista}
              data={clientesBd}
              renderItem={renderCliente}
              keyExtractor={(item) => item?.id}
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
                Nenhum cliente foi encontrado!
              </Text>
            </View>
          )}
        </SafeAreaView>
      )}
      <ModalSimples
        visivel={openModalOpcoesClientes}
        imagem={null}
        onPress={() => setOpenModalOpcoesClientes(false)}
        texto={textoModal}
        btnFechar={true}
      >
        {textoModal ==
          "O cliente ainda não foi sincronizado, opções de alteração e exclusão estão disponíveis!" && (
          <>
            <ButtonModal
              color="orange"
              texto="alterar"
              funcao={() =>
                navigation.navigate("AlterarCliente", { id: clienteClicado.id })
              }
            />
            <ButtonModal
              color="red"
              texto="excluir"
              funcao={handleExcluirClienteId}
            />
          </>
        )}
        {textoModal ==
          "Ao clicar em confirmar, toda a base de dados de clientes presente no seu aparelho será removida permanentemente." && (
          <ButtonModal
            color="red"
            funcao={() => limparClientes()}
            texto="confirmar"
          />
        )}
      </ModalSimples>

      <ModalSimples
        visivel={openModalFiltro}
        imagem={null}
        onPress={() => setOpenModalFiltro(false)}
        texto={textoModal}
      >
        <ButtonModalFiltro
          texto="mostrar todos"
          funcao={() => filtrarPorStatus(-1)}
          filtroPorStatus={filtroPorStatus == -1 ? 0 : 1}
        />
        <ButtonModalFiltro
          texto="somente pendentes"
          funcao={() => filtrarPorStatus(0)}
          filtroPorStatus={filtroPorStatus == 0 ? 0 : 1}
        />
        <ButtonModalFiltro
          texto="somente sincronizados"
          funcao={() => filtrarPorStatus(1)}
          filtroPorStatus={filtroPorStatus == 1 ? 0 : 1}
        />
      </ModalSimples>

      <FabButtons
        cadastrar={() => navigation.navigate("CadastrarCliente")}
        recarregar={() => setReload(!reload)}
        limpar={alertLimparClientes}
        baixar={() => handleRedirect("BaixarClientes")}
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
  clienteItem: {
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
    maxWidth: 270
  },
  containerUser: {
    marginLeft: 10,
  },
  textUser: {
    color: "gray",
  },
});

export default ListaClientes;
