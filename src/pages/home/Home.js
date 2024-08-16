import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import app from "../../../package.json";
import { useNetInfo } from "@react-native-community/netinfo";
import ModalSimples from "../../components/ModalSimples";
import ModalComprovante from "../../components/ModalComprovante";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  Ionicons,
} from "react-native-vector-icons";

import logo from "../../img/logo.png";
import imgSemRede from "../../img/semRede.gif";
import Squeleton from "../../components/Squeleton";
import { ContextGlobal } from "../../context/GlobalContext";
import Loading from "../../components/Loading";
import ButtonModal from "../../components/ButtonModal";
import { print, printToFile } from "../../components/ComprovanteVenda";
import { cancelarPedidoId } from "../../database/servicesPedidos";
import axios from "axios";

const Dashboard = (routes) => {
  const {
    handleData,
    pedidosLocal10,
    totalVisitasPendentes,
    qtdClientesPendentes,
    handleRedirect,
    totalPedidosPendentes,
    totalPedidosSincronizados,
    load,
    parametrosLocal,
    semRede,
    setSemRede, tokenLocal
  } = useContext(ContextGlobal);

  const [textoModal, setTextoModal] = useState("");
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const netInformacao = useNetInfo();
  const [openModalComprovante, setOpenModalComprovante] = useState(false);
  const [dadosComprovante, setDadosComprovante] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      handleData();
      const d = async () => {
        const requestOptions = {
          headers: {
            'Content-Type': 'application/json', Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTg5MDYwNTIsInVpZCI6MSwiaXNzIjoibG9jYWxob3N0IiwidGtlIjoiOGQ3NTgwZDYtOTk3My00YmRmLTk3NjgtOTc5ZDQyZmY4YzMxIiwibmFtZSI6Imdlc3Vwb3J0ZWxvZ2ljbyIsImVtYWlsIjoiZWxpYXNkaWNvbnRpQGdtYWlsLmNvbSJ9.BX2gBFubYpEu6bBBFHJQ+D2TzsBHG0/8iNNtKl7NAbc='
          }
        };
        await axios.get('https://gesuportelogico.com.br/api/manutencao/buscar_obj_cli', requestOptions)
          .then((response) => {
            console.log(JSON.parse(response.data.dados));
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }
      d()
    }, [reload])
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

  // abre o modal de comprovante de vendas
  const handleModalComprovante = (dados) => {
    if (dados.situacao == 1) {
      setTextoModal(
        "Pedido finalizado, o comprovante de venda já está disponivel."
      );
    } else {
      setTextoModal(
        "Pedido não sincronizado, verifique as opções na listagem de pedidos."
      );
    }
    setOpenModalComprovante(!openModalComprovante);
    setDadosComprovante(dados);
  };

  // abrir modal simples de informações
  const showModalInfo = () => {
    setTextoModal(
      `Olá, você está logado com o usuário ${parametrosLocal[0]?.representante?.nome
      } do estabelecimento ${parametrosLocal[0]?.empresa?.nome
      }, a versão atual instalada é ${app?.version}, ${netInformacao?.isConnected
        ? `tipo de conexão utilizado ${netInformacao?.type == "wifi"
          ? `${netInformacao?.type}, IP do dispositivo ${netInformacao?.details?.ipAddress}`
          : ""
        } ${netInformacao?.type == "cellular"
          ? `${netInformacao?.details?.cellularGeneration}, operadora ${netInformacao?.details?.carrier}`
          : ""
        }`
        : "não há conexão de rede"
      }`
    );
    setOpenModalInfo(!openModalInfo);
  };

  const menuHorizontal = [
    { name: "ajuda", icone: "whatsapp", rota: "ajuda" },
    { name: "baixar", icone: "cloud-download", rota: "BaixarDados" },
    { name: "sincronizar", icone: "cloud-upload", rota: "SincronizarDados" },
    { name: "pedidos", icone: "shopping-cart", rota: "ListaPedidos" },
    { name: "visitas", icone: "handshake-o", rota: "ListaVisitas" },
    { name: "clientes", icone: "user", rota: "ListaClientes" },
    { name: "produtos", icone: "cubes", rota: "ListaProdutos" },
    { name: "formas pgto", icone: "credit-card", rota: "FormaPagamento" },
  ];

  const infoHorizontal = [
    {
      name: "vendas não sincronizadas",
      valor: `R$ ${totalPedidosPendentes?.totalPendente > 0
        ? totalPedidosPendentes?.totalPendente?.toFixed(2)
        : "0.00"
        } (${totalPedidosPendentes?.qtdPendente})`,
      textFooter: "ver todas as vendas",
      rota: "ListaPedidos",
    },
    {
      name: "vendas sincronizadas",
      valor: `R$ ${totalPedidosSincronizados?.totalSincronizado > 0
        ? totalPedidosSincronizados?.totalSincronizado?.toFixed(2)
        : "0.00"
        } (${totalPedidosSincronizados?.qtdSincronizado})`,
      textFooter: "ver todas as vendas",
      rota: "ListaPedidos",
    },
    {
      name: "visitas não sincronizadas",
      valor: `${totalVisitasPendentes} registros`,
      textFooter: "ver todas as visitas",
      rota: "ListaVisitas",
    },
    {
      name: "clientes não sincronizados",
      valor: `${qtdClientesPendentes} registros`,
      textFooter: "ver todos os clientes",
      rota: "ListaClientes",
    },
  ];

  const handleCancelarPedido = async (item) => {
    setOpenModalComprovante(false);
    await cancelarPedidoId(item.id_pedido)
      .then((response) => {
        setTextoModal(response);
        setOpenModalInfo(true);
        setReload(!reload);
      })
      .catch((erro) => {
        showModalInfo(erro);
      });
  };

  if (load || loading) {
    return <Loading />;
  }
  return (
    <>
      <View style={[styles.appBar, { elevation: 4 }]}>
        <Ionicons
          onPress={() => navigation.openDrawer()}
          name="menu"
          size={30}
          color="#fff"
        />
        <TouchableOpacity onPress={showModalInfo} style={styles.geLogo}>
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 70, height: 70 }}
          />
        </TouchableOpacity>
        <MaterialCommunityIcons
          onPress={handleData}
          name="reload"
          size={30}
          color="#fff"
        />
      </View>

      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={[styles.container, { elevation: 10 }]}>
          <TouchableOpacity
            onPress={() => handleRedirect("AltSenha")}
            activeOpacity={0.5}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 35,
                borderColor: "#6464f8",
              }}
            >
              <FontAwesome name="user" size={30} color="#fff" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  color: "#fff",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                Olá {parametrosLocal[0]?.representante.nome}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "#fff" }}>acessar perfil</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={22}
                  color="#fff"
                />
              </View>
            </View>
          </TouchableOpacity>
          <ScrollView horizontal>
            {infoHorizontal?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRedirect(item.rota)}
                activeOpacity={0.5}
                style={[
                  styles.buttonScroll,
                  { marginLeft: index == 0 ? 0 : 15 },
                ]}
              >
                <View style={styles.titulo}>
                  <Text style={styles.tituloText}>{item.name}</Text>
                </View>
                <View style={styles.valorScroll}>
                  <Text style={styles.valorScrollText}>{item.valor}</Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={25}
                    color="#fff"
                  />
                </View>
                <View style={styles.footerScroll}>
                  <Text style={styles.footerScrollText}>{item.textFooter}</Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={25}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            style={{ position: "relative", marginBottom: -60, marginTop: 30 }}
          >
            {menuHorizontal?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRedirect(item.rota)}
                activeOpacity={0.5}
                style={[
                  styles.btMenuScroll,
                  { marginLeft: index == 0 ? 0 : 15 },
                ]}
              >
                <View style={styles.iconBtMenuScroll}>
                  <FontAwesome name={item.icone} size={30} color="#fff" />
                </View>
                <View style={styles.textBtMenuScroll}>
                  <Text style={styles.textBtScroll}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.listaPedidos}>
          <TouchableOpacity
            onPress={() => handleRedirect("CadastrarPedido")}
            activeOpacity={0.5}
            style={[styles.addPedido, { elevation: 4 }]}
          >
            <FontAwesome name="plus" size={25} color="#fff" />
            <Text style={styles.textAddPedido}>Adicionar Pedido</Text>
          </TouchableOpacity>

          <View style={styles.containerPedido}>
            <Text style={styles.destaques}>
              {pedidosLocal10?.length > 0 ? "destaque" : "nenhum destaque"}
            </Text>

            {pedidosLocal10?.length > 0 ? (
              pedidosLocal10?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleModalComprovante(item)}
                  activeOpacity={0.5}
                  style={[
                    styles.btPedido,
                    {
                      elevation: 4,
                      backgroundColor: item.numPedido > 0 ? "#fff" : "#fff3c8",
                      borderRightWidth: 10,
                      borderColor: item.numPedido < 1 ? "red" : "green",
                    },
                  ]}
                >
                  <View style={[styles.containerBtPedido, { flexWrap: 'wrap' }]}>
                    <View style={styles.iconPedido}>
                      <FontAwesome
                        name="shopping-cart"
                        size={25}
                        color="#fff"
                      />
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={styles.nomeClientePedido}>{item?.nome_cliente ? item?.nome_cliente : item?.apelido || item?.nome}</Text>
                      <Text style={styles.subtitlePedido}>
                        Total: {parseFloat(item.liquido).toFixed(2)}
                      </Text>
                      <Text style={styles.subtitlePedido}>
                        Data: {item.data.split("-").reverse().join("/")}
                      </Text>
                      <Text style={styles.subtitlePedido}>
                        Situação: {item.situacao === 0 && "Pendente"}
                        {item.situacao === 1 && "Finalizado"}
                        {item.situacao === 2 && "Cancelado"}
                      </Text>
                      {item?.motivo ? (
                        <Text style={styles.subtitlePedido}>
                          Motivo:{" "}
                          {item.motivo == 1
                            ? "produto sem estoque"
                            : item.motivo}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <>
                <Squeleton qtd={3} />
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* modal simples de informações */}
      <ModalSimples
        visivel={openModalInfo}
        onPress={showModalInfo}
        imagem={null}
        texto={textoModal}
        btnFechar={true}
      />

      {/* modal de comprovante de venda */}
      <ModalComprovante
        visivel={openModalComprovante}
        onPress={() => setOpenModalComprovante(false)}
        imagem={null}
        texto={textoModal}
        pedido={dadosComprovante}
      >
        <ButtonModal
          texto="entendi"
          funcao={() => setOpenModalComprovante(false)}
        />
        {textoModal ===
          "Pedido finalizado, o comprovante de venda já está disponivel." && (
            <>
              <ButtonModal
                texto="visualizar comprovante"
                color="orange"
                funcao={() => selectedVerComprovante(dadosComprovante)}
              />
              <ButtonModal
                texto="enviar comprovante"
                color="green"
                funcao={() => selectedEnviarComprovante(dadosComprovante)}
              />

              {dadosComprovante?.numPedido <= 0 && (
                <ButtonModal
                  texto="cancelar pedido"
                  color="red"
                  funcao={() => handleCancelarPedido(dadosComprovante)}
                />
              )}
            </>
          )}
      </ModalComprovante>

      {semRede && (
        <ModalSimples
          btnFechar
          visivel={semRede}
          imagem={imgSemRede}
          texto="Você não possui conexão de rede, verifique sua internet e tente novamente"
          onPress={() => setSemRede(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    backgroundColor: "#174c4f",
    width: "100%",
    height: 90,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  geLogo: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#174c4f",
    width: "100%",
    padding: 10,
    paddingTop: 30,
  },

  // menu 1
  btMenuScroll: {
    backgroundColor: "#6464f8",
    width: 120,
    height: 120,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
  },
  iconBtMenuScroll: {
    width: "100%",
    alignItems: "flex-end",
  },
  textBtMenuScroll: {
    width: "100%",
    alignItems: "flex-start",
  },
  textBtScroll: {
    color: "#fff",
    fontWeight: "bold",
  },

  // menu 2
  buttonScroll: {
    backgroundColor: "#339197",
    height: 150,
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 50,
    flexDirection: "column",
  },
  titulo: {
    width: "100%",
    padding: 10,
  },
  tituloText: {
    color: "#fff",
  },
  valorScroll: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  valorScrollText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  footerScroll: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#fff",
  },
  footerScrollText: {
    color: "#fff",
  },

  // butão add pedido
  listaPedidos: {
    padding: 10,
    marginTop: 70,
  },
  addPedido: {
    backgroundColor: "#339197",
    // marginTop: 20,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textAddPedido: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  // pedido lista
  containerPedido: {
    marginTop: 20,
  },
  destaques: {
    color: "#174c4f",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
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
  },
  nomeClientePedido: {
    color: "#174c4f",
    fontWeight: "bold",
  },
  subtitlePedido: {
    color: "gray",
  },
});

export default Dashboard;
