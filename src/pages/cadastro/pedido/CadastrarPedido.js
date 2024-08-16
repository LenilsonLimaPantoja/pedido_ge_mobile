import ModalSimples from "../../../components/ModalSimples";
import React, { useCallback, useContext, useState } from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ModalTelaCheia from "../../../components/ModalTelaCheia";
import AppbarSimples from "../../../components/AppbarSimples";
import FabReload from "../../../components/FabReload";
import Loading from "../../../components/Loading";
import Data from "../../../components/Data";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { readFormaPgto } from "../../../database/servicesFormasPgto";
import { readClientes } from "../../../database/servicesClientes";
import { readProdutos } from "../../../database/servicesProdutos";
import { createPedido } from "../../../database/servicesPedidos";
import { ContextGlobal } from "../../../context/GlobalContext";
import uuid from "react-uuid";
import ButtonModal from "../../../components/ButtonModal";
import { readTabelaPrecosId } from "../../../database/servicesTabelaPrecos";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis from "../../../Apis";
import { readItensTabelaPrecos } from "../../../database/servicesItensTabelaPrecos";
// função para montar e redenrizar a lista de produtos
const Item = ({ item, handleProdutoPedido }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={styles.buttonItem}
    onPress={() => handleProdutoPedido(item)}
  >
    <View style={styles.containerLeft}>
      {/* <FontAwesome name="cubes" size={40} color="#6464f8" /> */}
      <Image
        source={{ uri: item?.url_imagem }}
        style={{ width: 70, height: 70, borderRadius: 5, borderStyle: 'solid', borderWidth: 1, borderColor: "#2f4f4f", }}
      />
      <View style={styles.containerItem}>
        <Text
          style={[
            styles.textItem,
            { color: "#174c4f", textTransform: "capitalize" },
          ]}
        >
          {item?.descricao?.length < 40
            ? item?.descricao
            : item?.descricao?.substring(0, 40)}
        </Text>
        <Text style={styles.textItem}>
          Preço: R$ {parseFloat(item?.preco).toFixed(2)}
        </Text>
        <Text style={styles.textItem}>Unidade: {item?.sigla}</Text>
        <Text style={styles.textItem}>
          Estoque: {parseFloat(item?.estoque).toFixed(2)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// função para montar e redenrizar a lista de clientes
const ItemCliente = ({ item, openModal }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={[
      styles.buttonItem,
      {
        backgroundColor: item.id_cliente_servidor < 1 ? "#fff3c8" : "white",
        borderColor: item.id_cliente_servidor < 1 ? "red" : "green",
        borderRightWidth: 10,
      },
    ]}
    onPress={() => openModal(item)}
  >
    <View style={styles.containerLeft}>
      <FontAwesome name="user-circle-o" size={40} color="#6464f8" />
      <View style={styles.containerItem}>
        <Text
          style={[
            styles.textItem,
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
        {item.email && <Text style={styles.textItem}>{item.email}</Text>}
        <Text style={styles.textItem}>CNPJ: {item.cnpj_cpf}</Text>
        <Text style={styles.textItem}>Telefone: {item.fone1}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const CadastrarPedido = () => {
  // função para renderizar a lista de produtos
  const renderItem = ({ item }) => (
    <Item item={item} handleProdutoPedido={handleProdutoPedido} />
  );

  // função para renderizar a lista de clientes
  const renderItemCliente = ({ item }) => (
    <ItemCliente item={item} openModal={openModal} />
  );
  const [observacoesPedido, setObservacoesPedido] = useState("");
  const [numPedidoCli, setNumPedidoCli] = useState("");
  const [clientes, setClientes] = useState([]);
  const [tabelaPrecosProdutos, setTabelaPrecosProdutos] = useState([]);
  const [nomeclientes, setNomeClientes] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [cliente, setCliente] = useState("");
  const [situacao, setSituacao] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState(0);
  const [permiteParcelas, setPermiteParcelas] = useState(0);
  const [qtdParcelas, setQtdParcelas] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [showModalProdutos, setShowModalProdutos] = useState(false);
  const [showModalDadosProdutosPedido, setShowModalDadosProdutosPedido] =
    useState(false);
  const [produtoTemporarioPedido, setProdutoTemporarioPedido] = useState([]);
  const [produtosPedido, setProdutosPedido] = useState([]);
  const [quantidadeProdPedido, setQuantidadeProdPedido] = useState("");
  const [descricaoComplementar, setDescricaoComplementar] = useState("");
  const [descontoProdPedido, setDescontoProdPedido] = useState("0");
  const [showModalItens, setShowModalItens] = useState("0");
  const [precoProdPedido, setPrecoProdPedido] = useState("");
  const [totalPedido, setTotalPedido] = useState("0");
  const [totalDesconto, setTotalDesconto] = useState("0");
  const [pesquisarCliente, setPesquisarCliente] = useState("");
  const [pesquisarProdutos, setPesquisarProdutos] = useState("");
  const [openModalErro, setOpenModalErro] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [idExcluirProdPedido, setIdExcluirProdPedido] = useState();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { parametrosLocal, handleRedirect } = useContext(ContextGlobal);
  const [pagamentosLocal, setPagamentosLocal] = useState([]);

  const showModalErro = (texto) => {
    setTextoModal(texto);
    setOpenModalErro(!openModalErro);
  };
  const dataId = new Date();
  var dia = String(dataId.getDate()).padStart(2, "0");
  var mes = String(dataId.getMonth() + 1).padStart(2, "0");
  var ano = dataId.getFullYear();
  const navigation = useNavigation();
  // data atual no formato americano
  const [dataPedido, setDataPedido] = useState("");

  // modal para mostrar os itens que estão sendo inseridos no pedido
  const modalItens = () => {
    setShowModalItens(!showModalItens);
  };

  useFocusEffect(
    useCallback(() => {
      const dataBd = async () => {
        setLoading(true);
        await readFormaPgto("")
          .then((response) => {
            setPagamentosLocal(response);
            if (response?.length < 1) {
              setOpenModalErro(true);
            }
          })
          .catch((erro) => {
            showModalErro(erro,);
          });
        setLoading(false);
      };
      dataBd();
    }, [reload])
  );

  useFocusEffect(
    useCallback(() => {
      const dataBd = async () => {
        setLoading(true);
        await readClientes(pesquisarCliente, -1, 30)
          .then((response) => {
            setClientes(response);
            if (response?.length < 1 && pesquisarCliente == "") {
              setOpenModalErro(true);
            }
          })
          .catch((erro) => {
            showModalErro(erro,);
          });
        setLoading(false);
      };
      dataBd();
    }, [pesquisarCliente, reload])
  );

  useFocusEffect(
    useCallback(() => {
      const dataBd = async () => {
        setLoading(true);
        let produtosAndTabelaPreco = [];
        await readProdutos(pesquisarProdutos, 30)
          .then((response) => {
            console.log('hhh', tabelaPrecosProdutos);

            response.forEach((item1) => {
              // Iterando sobre o array2
              tabelaPrecosProdutos.forEach((item2) => {
                  // Se os códigos dos produtos forem iguais
                  if (item1.codigo === item2.codpro) {
                      // Substitui o preço no array1 pelo preço correspondente no array2
                      item1.preco = item2.preco;
                  }
              });
          });

            setProdutos(response);
            // if (response?.length < 1 && pesquisarProdutos == "") {
            //   setOpenModalErro(true);
            // }
          })
          .catch((erro) => {
            showModalErro(erro,);
          });
        setLoading(false);
      };
      dataBd();
    }, [pesquisarProdutos, reload, tabelaPrecosProdutos])
  );

  // buscar os clientes gravados locais
  useFocusEffect(
    useCallback(() => {
      if (formaPagamento > 0) {
        setPermiteParcelas(
          pagamentosLocal?.filter(
            (item) => item.id_pagamento_servidor === formaPagamento
          )
        );
      } else {
        setPermiteParcelas([{ parcelamento: "0" }]);
      }
    }, [formaPagamento])
  );

  // função para adicionar produto ao pedido, obs se ja houver produtos ele entra no if e mantem oq tem e grava outro objeto
  const addProdPedido = () => {
    console.log(produtoTemporarioPedido);
    if (
      quantidadeProdPedido !== "" &&
      precoProdPedido !== "" &&
      quantidadeProdPedido > 0 &&
      precoProdPedido > 0
    ) {
      setTotalPedido(
        (
          parseFloat(precoProdPedido) * parseFloat(quantidadeProdPedido) -
          parseFloat(descontoProdPedido) +
          parseFloat(totalPedido)
        ).toFixed(2)
      );
      setTotalDesconto(
        (parseFloat(descontoProdPedido) + parseFloat(totalDesconto)).toFixed(2)
      );
      if (produtosPedido.length > 0) {
        setProdutosPedido([
          ...produtosPedido,
          {
            produto_id: produtoTemporarioPedido.id,
            id_unico: `${dataId.getMilliseconds()}${dataId.getTime()}`,
            unidade: produtoTemporarioPedido.unidade,
            desconto: descontoProdPedido,
            descricao: produtoTemporarioPedido.descricao,
            qt: quantidadeProdPedido,
            descricao_complementar: descricaoComplementar,
            preco: precoProdPedido,
            url_imagem: produtoTemporarioPedido.url_imagem,
          },
        ]);
        openModalDadosProdutosPedido(false);
      } else {
        setProdutosPedido([
          {
            produto_id: produtoTemporarioPedido.id,
            id_unico: `${dataId.getMilliseconds()}${dataId.getTime()}`,
            unidade: produtoTemporarioPedido.unidade,
            desconto: descontoProdPedido,
            descricao: produtoTemporarioPedido.descricao,
            qt: quantidadeProdPedido,
            descricao_complementar: descricaoComplementar,
            preco: precoProdPedido,
            url_imagem: produtoTemporarioPedido.url_imagem,
          },
        ]);
        openModalDadosProdutosPedido(false);
      }
      setPrecoProdPedido("");
      setQuantidadeProdPedido("");
      setDescricaoComplementar("");
      setProdutoTemporarioPedido("");
      setDescontoProdPedido("0");
    } else {
      showModalErro(
        "Os campos QUANTIDADE e PREÇO devem ser preenchidos e devem ser maior que zero!",

      );
    }
  };

  // função para gravar os pedidos no localStorage, obs se não houver pedidos anteriores a variavel pedidos é criada no local e grava o pedido atual
  const handleGravarDadosLocal = async () => {
    if (dataPedido != `${ano}-${mes}-${dia}`) {
      return showModalErro(
        "O pedido não pode ser criado na data informada, altere a data e tente novamente",

      );
    }
    const data = {
      forma_pagamento_id: formaPagamento,
      vendedor_id: parametrosLocal[0].representante.idRepresentante,
      qt_parcelas: parseInt(qtdParcelas),
      total: parseFloat(totalPedido) + parseFloat(totalDesconto),
      total_desconto: totalDesconto,
      liquido: totalPedido,
      data: dataPedido,
      obs: observacoesPedido,
      num_pedido_cli: numPedidoCli,
      numPedido: "0",
      situacao: situacao,
      cliente_id: cliente.id,
      produtos: produtosPedido,
      idUnico: uuid(),
      nome_cliente: cliente?.generico == 1 ? nomeclientes : "",
    };

    if (
      cliente &&
      produtosPedido.length > 0 &&
      situacao !== "" &&
      dataPedido !== ""
    ) {
      setLoading(true);
      await createPedido(data)
        .then((response) => {
          navigation.goBack();
        })
        .catch((erro) => {
          showModalErro(erro,);
        });
      setCliente("");
      setTotalPedido("0");
      setProdutosPedido("");
      setSituacao(0);
      setObservacoesPedido("");
      setNumPedidoCli("");
      setTotalDesconto("0");
      setQtdParcelas("1");
      setFormaPagamento(0);
      setLoading(false);
    } else {
      showModalErro(
        "Preencha todos os campos para finalizar o pedido!",

      );
    }
  };

  // função para open/close do modal de produtos
  const openModalProdutos = () => {
    setShowModalProdutos(!showModalProdutos);
  };

  // função para adicionar produtos, obs essa função recebe como parametro o produto que será adicionado e grava na variavel produtoTemporarioPedido
  const handleProdutoPedido = (produto) => {
    setProdutoTemporarioPedido(produto);
    setPrecoProdPedido(produto.preco);
    openModalDadosProdutosPedido();
  };

  // função para open/close do modal para a inserir os valores do produto
  const openModalDadosProdutosPedido = () => {
    setShowModalProdutos(false);
    setShowModalDadosProdutosPedido(!showModalDadosProdutosPedido);
  };


  // função para open/close do modal de clientes, obs essa função recebe como parametro o cliente que será inserido e grava na variavel clientes
  const openModal = async (dado) => {
    setShowModal(!showModal);
    if (dado) {
      console.log(dado?.tabela_preco_id);
      await readItensTabelaPrecos(dado?.tabela_preco_id)
        .then((response) => {
          setTabelaPrecosProdutos(response);
          console.log(response);
        })
        .catch((erro) => {
          console.log(erro);
          setTabelaPrecosProdutos([]);
          console.log(erro);
        })

      setNomeClientes(dado.nome);
      setCliente({ id: dado.id, nome: dado.nome, generico: dado?.generico });
      setFormaPagamento(dado.forma_pagto_id);
    }
  };

  // função para remover um produto do pedido, obs essa função recebe como parametro o id_unico do produto que será removido
  const delProdPedido = (id_unico) => {
    setOpenModalErro(false);
    for (var i = 0; i < produtosPedido.length; i++) {
      if (produtosPedido[i].id_unico === id_unico) {
        setTotalPedido(
          (
            parseFloat(totalPedido) -
            (parseFloat(produtosPedido[i].qt) *
              parseFloat(produtosPedido[i].preco) -
              parseFloat(produtosPedido[i].desconto))
          ).toFixed(2)
        );
        setTotalDesconto(
          (
            parseFloat(totalDesconto) - parseFloat(produtosPedido[i].desconto)
          ).toFixed(2)
        );
      }
    }
    setProdutosPedido(
      produtosPedido?.filter((item) => item.id_unico !== id_unico)
    );
  };

  // função para o usuário confirmar a remoção do item do idPedido
  const confirmarDelProdPedido = (id_unico, produto) => {
    setIdExcluirProdPedido(id_unico);
    showModalErro(`Deseja excluir o item ${produto} do pedido?`,);
  };

  if (
    (pesquisarCliente == "" && clientes?.length < 1) ||
    pagamentosLocal.length < 1
  ) {
    return (
      <View style={{ flex: 1, backgroundColor: "#174c4f" }}>
        <Loading />
        <ModalSimples
          visivel={openModalErro}
          btnFechar
          texto="Para realizar um novo pedido é necessário dados de forma de pagamento, clientes e produtos, baixe os dados e tente novamente"
          onPress={() => {
            setOpenModalErro(false), navigation.goBack();
          }}
        >
          <ButtonModal
            texto="baixar dados"
            color="green"
            funcao={() => {
              setOpenModalErro(false), handleRedirect("BaixarDados");
            }}
          />
        </ModalSimples>
      </View>
    );
  }
  return (
    <>
      <AppbarSimples rota="CADASTRAR PEDIDO" />
      {/* tela principal do pedido */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          backgroundColor: "#174c4f",
        }}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "#174c4f",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: "100%",
          }}
        >
          {cliente?.generico == 1 ? (
            <TouchableOpacity
              style={{
                height: 70,
                color: "black",
                backgroundColor: "white",
                borderRadius: 5,
                paddingLeft: 10,
                paddingRight: 10,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Text style={{ color: "gray" }}>Cliente</Text>
              <TextInput
                style={{ backgroundColor: "#fff" }}
                value={nomeclientes}
                onChangeText={(e) => setNomeClientes(e)}
              />
              <Ionicons
                style={{ position: "absolute", right: 10 }}
                size={22}
                color="#174c4f"
                name="search"
                onPress={() => openModal("")}
              />
            </TouchableOpacity>
          ) : (
            <Button
              color="#fff"
              left
              textColor="#174c4f"
              texto={cliente ? cliente.nome : "selecionar cliente"}
              funcao={() => openModal("")}
              validar={cliente === ""}
            />
          )}
          <Input
            label="Nº Pedido do Cliente"
            setValor={setNumPedidoCli}
            valor={numPedidoCli}
            icone="edit"
          />
          <Data
            setValor={setDataPedido}
            valor={dataPedido}
            color="#fff"
            textColor="#174c4f"
            min={new Date()}
            max={new Date()}
          />

          <Picker
            selectedValue={situacao}
            style={{
              height: 70,
              width: "100%",
              borderRadius: 15,
              marginTop: 10,
              backgroundColor: "white",
            }}
            onValueChange={(itemValue, itemIndex) => setSituacao(itemValue)}
          >
            <Picker.Item label="Pendente" value={0} />
            <Picker.Item label="Finalizado" value={1} />
            <Picker.Item label="Cancelado" value={2} />
          </Picker>

          {parametrosLocal[0]?.permite_financeiro.valor == "0" &&
            pagamentosLocal !== null && (
              <>
                <Picker
                  selectedValue={formaPagamento}
                  style={{
                    height: 70,
                    marginTop: 10,
                    width: "100%",
                    borderStyle: "solid",
                    borderWidth: formaPagamento === "" ? 2 : 0,
                    borderColor: "red",
                    borderRadius: 5,
                    backgroundColor: "white",
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    setFormaPagamento(itemValue)
                  }
                >
                  <Picker.Item
                    label="- selecione a forma de pagamento -"
                    value={0}
                  />
                  {pagamentosLocal.map((dado, index) => (
                    <Picker.Item
                      key={dado.id}
                      label={dado.descricao}
                      value={dado.id_pagamento_servidor}
                    />
                  ))}
                </Picker>

                {permiteParcelas[0]?.parcelamento > 0 && totalPedido > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: -10,
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        height: 70,
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: 5,
                        marginBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                        justifyContent: "center",
                        width: "100%",
                        width: "48%",
                      }}
                    >
                      <Text style={{ color: "gray" }}>Parcelas</Text>
                      <TextInput
                        style={{ backgroundColor: "#fff", height: 30 }}
                        disabled={totalPedido > 0 ? false : true}
                        defaultValue={qtdParcelas}
                        onChangeText={setQtdParcelas}
                        autoFocus={true}
                        keyboardType="numeric"
                      />
                      <MaterialCommunityIcons
                        style={{ position: "absolute", right: 10 }}
                        size={22}
                        color="#174c4f"
                        name="calculator"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        height: 70,
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: 5,
                        marginBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                        justifyContent: "center",
                        width: "100%",
                        width: "48%",
                      }}
                    >
                      <Text style={{ color: "gray" }}>Total</Text>
                      <TextInput
                        style={{ backgroundColor: "#fff" }}
                        disabled={true}
                        value={
                          totalPedido !== "0" && qtdParcelas > 0
                            ? `R$ ${(
                              parseFloat(totalPedido) / qtdParcelas
                            ).toFixed(2)}`
                            : "R$ 00.00"
                        }
                      />
                      <MaterialCommunityIcons
                        style={{ position: "absolute", right: 10 }}
                        size={22}
                        color="#174c4f"
                        name="lock"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}

          <Input
            label="Observações"
            setValor={setObservacoesPedido}
            valor={observacoesPedido}
            icone="edit"
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              height: 70,
              marginTop: 10,
              justifyContent: "space-between",
              padding: 10,
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>DESCONTO</Text>
              <Text style={{ textAlign: "left" }}>R$ {totalDesconto}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", textAlign: "right" }}>
                TOTAL
              </Text>
              <Text style={{ textAlign: "right" }}>R$ {totalPedido}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "49%" }}>
              <Button
                texto={`mostrar Itens (${produtosPedido.length})`}
                color="red"
                funcao={produtosPedido.length > 0 ? modalItens : null}
              />
            </View>
            <View style={{ width: "49%" }}>
              <Button
                texto="adicionar item"
                color="green"
                funcao={openModalProdutos}
              />
            </View>
          </View>
          <Button funcao={handleGravarDadosLocal} texto="gravar" />
        </View>
      </ScrollView>
      {/* fim tela principal do pedido */}

      {/* modal clientes */}
      <ModalTelaCheia
        onPress={() => setShowModal(false)}
        visivel={showModal}
        setValor={setPesquisarCliente}
        valor={pesquisarCliente}
        rota={`seleção de cliente (${clientes?.length})`}
      >
        <SafeAreaView style={styles.container}>
          {loading ? (
            <Loading />
          ) : clientes?.length > 0 ? (
            <FlatList
              data={clientes}
              renderItem={renderItemCliente}
              keyExtractor={(item) => (item.id > 0 ? item.id : item.id_unico)}
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
        <FabReload recarregar={() => setReload(!reload)} />
      </ModalTelaCheia>

      {/* fim modal clientes */}

      {/* modal produtos */}
      <ModalTelaCheia
        onPress={() => setShowModalProdutos(false)}
        visivel={showModalProdutos}
        rota={`seleção de produto (${produtos?.length})`}
        setValor={setPesquisarProdutos}
        valor={pesquisarProdutos}
      >
        <SafeAreaView style={styles.container}>
          {loading ? (
            <Loading />
          ) : produtos?.length > 0 ? (
            <FlatList
              data={produtos}
              renderItem={renderItem}
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
                Nenhum produto foi encontrado!
              </Text>
            </View>
          )}
        </SafeAreaView>
        <FabReload recarregar={() => setReload(!reload)} />
      </ModalTelaCheia>
      {/* fim modal produtos */}

      {/* modal dados produto pedido */}
      <ModalTelaCheia
        onPress={() => setShowModalDadosProdutosPedido(false)}
        bottonRight
        visivel={showModalDadosProdutosPedido}
        rota="DADOS DO ITEM"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            backgroundColor: "#174c4f",
          }}
        >
          <Input
            icone="cube"
            label="Produto"
            valor={produtoTemporarioPedido.descricao}
          />
          <Input
            icone="cube"
            label="Complemento"
            valor={descricaoComplementar}
            setValor={setDescricaoComplementar}
          />
          <Input
            icone="calculator"
            label="Quantidade"
            valor={quantidadeProdPedido}
            setValor={setQuantidadeProdPedido}
            tipo="phone-pad"
            validar={quantidadeProdPedido === "" || quantidadeProdPedido < 0.1}
          />
          <Input
            icone="calculator"
            label={`Valor unitário: R$ ${parseFloat(
              produtoTemporarioPedido.preco
            ).toFixed(2)}`}
            valor={parseFloat(
              produtoTemporarioPedido.preco
            ).toFixed(2)}
            setValor={setPrecoProdPedido}
            tipo="phone-pad"
            validar={precoProdPedido === "" || precoProdPedido < 0.1}
          />

          {parametrosLocal[0]?.permite_desconto.valor === "0" && (
            <Input
              icone="calculator"
              label="Desconto"
              valor={descontoProdPedido}
              setValor={setDescontoProdPedido}
              tipo="phone-pad"
            />
          )}
          <Button texto="adicionar" funcao={addProdPedido} />
        </ScrollView>
      </ModalTelaCheia>
      {/* fim modal dados produto pedido */}

      {/* modal mostrar itens do pedido */}
      {produtosPedido?.length > 0 && (
        <ModalTelaCheia
          onPress={() => setShowModalItens(false)}
          bottonRight
          visivel={showModalItens}
          rota={`ITENS DO PEDIDO (${produtosPedido.length})`}
        >
          <SafeAreaView style={styles.container}>
            <ScrollView>
              {produtosPedido.map((dado, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    borderStyle: "solid",
                    borderWidth: 0.5,
                    borderColor: "#2f4f4f",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: dado?.url_imagem }}
                      style={{ width: 80, height: 80, borderRadius: 5, borderStyle: 'solid', borderWidth: 1, borderColor: "#2f4f4f", }}
                    />
                    <View style={{ flexDirection: "column", maxWidth: 200, marginLeft: 10 }}>
                      <Text style={{ textTransform: "uppercase" }}>
                        {dado.descricao}
                      </Text>
                      {dado.descricao_complementar?.length > 1 &&
                        <Text style={{ textTransform: "uppercase" }}>
                          {dado.descricao_complementar}
                        </Text>
                      }
                      <Text style={{ color: "gray", fontSize: 11 }}>
                        {dado.qt} X R$ {dado.preco}
                        {dado.desconto !== "0" && ` - R$ ${dado.desconto}`} = R${" "}
                        {(
                          parseFloat(dado.preco) * parseFloat(dado.qt) -
                          parseFloat(dado.desconto)
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    onPress={() =>
                      confirmarDelProdPedido(dado.id_unico, dado.descricao)
                    }
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={30}
                      color="red"
                    />
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </ModalTelaCheia>
      )}

      <ModalSimples
        btnFechar
        texto={textoModal}
        imagem={null}
        onPress={() => setOpenModalErro(false)}
        visivel={openModalErro}
      >
        {textoModal !==
          "Os campos QUANTIDADE e PREÇO devem ser preenchidos e devem ser maior que zero!" &&
          textoModal !== "Preencha todos os campos para finalizar o pedido!" &&
          textoModal !==
          "O pedido não pode ser criado na data informada, altere a data e tente novamente" &&
          textoModal != "Este item já foi adicionado ao pedido!" && (
            <>
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
                onPress={() => delProdPedido(idExcluirProdPedido)}
              >
                <Text style={{ color: "#fff" }}>confirmar</Text>
              </TouchableOpacity>
            </>
          )}
      </ModalSimples>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
  },
  buttonItem: {
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
    maxWidth: 270
  },
  containerItem: {
    marginLeft: 10,
  },
  textItem: {
    color: "gray",
  },
});
export default CadastrarPedido;
