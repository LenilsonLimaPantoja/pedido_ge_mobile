import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import Loading from "../../../components/Loading";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Button from "../../../components/Button";
import Data from "../../../components/Data";
import Input from "../../../components/Input";
import ModalSimples from "../../../components/ModalSimples";
import AppbarSimples from "../../../components/AppbarSimples";
import ModalTelaCheia from "../../../components/ModalTelaCheia";
import FabReload from "../../../components/FabReload";
import { ContextGlobal } from "../../../context/GlobalContext";
import ButtonModal from "../../../components/ButtonModal";
import { readFormaPgto } from "../../../database/servicesFormasPgto";
import {
  alterarPedidoId,
  readItensPedidos,
  readPedidosId,
} from "../../../database/servicesPedidos";
import { readClientes } from "../../../database/servicesClientes";
import { readProdutos } from "../../../database/servicesProdutos";
// função para montar e redenrizar a lista de produtos
const ItemProduto = ({ item, openModalProduto }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={styles.buttonItem}
    onPress={() => openModalProduto(item)}
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
        {item?.sigla && <Text style={styles.textItem}>Unidade: {item?.sigla}</Text>}
        <Text style={styles.textItem}>
          Estoque: {parseFloat(item?.estoque).toFixed(2)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// função para montar e redenrizar a lista de clientes
const ItemCliente = ({ item, openModalCliente }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={[
      styles.buttonItem,
      {
        backgroundColor: item.id < 1 ? "#fff3c8" : "white",
        borderColor: item.id_cliente_servidor < 1 ? "red" : "green",
      },
    ]}
    onPress={() => openModalCliente(item)}
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
          {item?.nome?.length < 40 ? item?.nome : item?.nome?.substring(0, 40)}
        </Text>
        <Text style={styles.textItem}>Email: {item.email}</Text>
        <Text style={styles.textItem}>CNPJ: {item.cnpj_cpf}</Text>
        <Text style={styles.textItem}>Telefone: {item.fone1}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
const AlterarPedido = ({ route }) => {
  // função para renderizar a lista de produtos
  const renderItemProduto = ({ item }) => (
    <ItemProduto item={item} openModalProduto={openModalProduto} />
  );

  // função para renderizar a lista de clientes
  const renderItemCliente = ({ item }) => (
    <ItemCliente item={item} openModalCliente={openModalCliente} />
  );
  const { pedidosLocal, handleData, load, representanteId, parametrosLocal } =
    useContext(ContextGlobal);
  const [tabelaPrecos, setTabelaPrecos] = useState(0);
  const navigation = useNavigation();
  const [nomeclientes, setNomeClientes] = useState("");
  const [formaPagamento, setFormaPagamento] = useState(0);
  const [permiteParcelas, setPermiteParcelas] = useState(0);
  const [qtdParcelas, setQtdParcelas] = useState("1");
  const [produtosPedido, setProdutosPedido] = useState([]);
  const [pedidoEditar, setPedidoEditar] = useState([]);
  const [cliente, setCliente] = useState("");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [showModalItens, setShowModalItens] = useState(false);
  const [showModalDadosProdutosPedido, setShowModalDadosProdutosPedido] =
    useState(false);
  const [totalPedido, setTotalPedido] = useState("0");
  const [totalDesconto, setTotalDesconto] = useState("0");
  const [quantidadeProdPedido, setQuantidadeProdPedido] = useState("");
  const [descricaoComplementar, setDescricaoComplementar] = useState("");
  const [descontoProdPedido, setDescontoProdPedido] = useState("0");
  const [precoProdPedido, setPrecoProdPedido] = useState("");
  const [produtoTemporarioPedido, setProdutoTemporarioPedido] = useState([]);
  const [idDellItemPedido, setIdDellItemPedido] = useState([]);
  const [pesquisarCliente, setPesquisarCliente] = useState("");
  const [pesquisarProduto, setPesquisarProduto] = useState("");
  const [openModalErro, setOpenModalErro] = useState(false);
  const [openModalDellItemPedido, setOpenModalDellItemPedido] = useState(false);
  const [openModalPreencherCampos, setOpenModalPreencherCampos] =
    useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [dataPedido, setDataPedido] = useState("");
  const [situacao, setSituacao] = useState(0);
  const [observacoesPedido, setObservacoesPedido] = useState("");
  const [numPedidoCli, setNumPedidoCli] = useState("");
  const [pagamentosLocal, setPagamentosLocal] = useState([]);
  const [clientesLocal, setClientesLocal] = useState([]);
  const [produtosLocal, setProdutosLocal] = useState([]);
  const dataId = new Date();
  var dia = String(dataId.getDate()).padStart(2, "0");
  var mes = String(dataId.getMonth() + 1).padStart(2, "0");
  var ano = dataId.getFullYear();

  // var parametrosLocal = { 'permite_financeiro': { 'valor': 0 }, 'permite_desconto': { 'valor': 0 } };

  const showModalErro = (texto) => {
    setTextoModal(texto);
    setOpenModalErro(!openModalErro);
  };

  const showModalDellItemPedido = (texto) => {
    setTextoModal(texto);
    setOpenModalDellItemPedido(!openModalDellItemPedido);
  };

  const showModalPreencherCampos = (texto) => {
    setTextoModal(texto);
    setOpenModalPreencherCampos(!openModalPreencherCampos);
  };

  useFocusEffect(
    useCallback(() => {
      const dataBd = async () => {
        setLoading(true);
        await readFormaPgto("")
          .then((response) => {
            setPagamentosLocal(response);
          })
          .catch((erro) => {
            showModalErro(erro);
          });
        setLoading(false);
      };
      dataBd();
    }, [reload])
  );

  useFocusEffect(
    useCallback(() => {
      const dataClientes = async () => {
        setLoading(true);
        await readClientes(pesquisarCliente, -1, 30)
          .then((response) => {
            setClientesLocal(response);
          })
          .catch((erro) => {
            console.log(erro);
          });
        setLoading(false);
      };
      dataClientes();
    }, [pesquisarCliente, reload])
  );

  useFocusEffect(
    useCallback(() => {
      const dataProdutos = async () => {
        setLoading(true);
        await readProdutos(pesquisarProduto, 30)
          .then((response) => {
            setProdutosLocal(response);
          })
          .catch((erro) => {
            console.log(erro);
          });
        setLoading(false);
      };
      dataProdutos();
    }, [pesquisarProduto, reload])
  );

  useFocusEffect(
    useCallback(() => {
      const dataPegarLocal = async () => {
        if (formaPagamento > 0) {
          setPermiteParcelas(
            pagamentosLocal?.filter((item) => item.id === formaPagamento)
          );
        } else {
          setPermiteParcelas([{ parcelamento: "0" }]);
        }
      };
      dataPegarLocal();
    }, [formaPagamento])
  );

  // função para pegar os pedidos, clientes e produtos gravados no localStorage e gravar nas suas respectivas variaveis
  useFocusEffect(
    useCallback(() => {
      const dataPedido = async () => {
        setLoading(true);
        await readPedidosId(route.params?.pedido.id_pedido)
          .then((response) => {
            setPedidoEditar(response[0]);
            setObservacoesPedido(String(response[0]?.obs));
            setNumPedidoCli(String(response[0]?.num_pedido_cli));
            setSituacao(response[0]?.situacao);
            setDataPedido(response[0]?.data);
            setCliente({
              apelido: response[0]?.apelido,
              id: response[0]?.cliente_id,
              nome: response[0]?.nome,
              generico: response[0]?.generico,
            });
            setNomeClientes(response[0]?.nome_cliente);
            // setProdutosPedido(response[0]?.produtos);
            setTotalDesconto(response[0]?.total_desconto);
            setTotalPedido(response[0]?.liquido);
            setFormaPagamento(response[0]?.forma_pagamento_id);
            setQtdParcelas(String(response[0]?.qt_parcelas));
          })
          .catch((erro) => {
            console.log(erro);
          });

        await readItensPedidos(route.params?.pedido.id_pedido)
          .then((response) => {
            setProdutosPedido(response);
          })
          .catch((erro) => {
            console.log(erro);
          });

        setLoading(false);
      };
      dataPedido();
    }, [reload])
  );

  // função para verificar se o usuario deseja removero item do pedido, essa função executa outra função que vai remover o item caso o usuário clique em confirmar (delProdPedido())
  const confirmarDelProdPedido = (id_unico, produto) => {
    setIdDellItemPedido(id_unico);
    showModalDellItemPedido(
      `Deseja excluir o item ${produto} do pedido?`,
    );
  };

  // função para adicionar produto ao pedido, obs se ja houver produtos ele entra no if e mantem oq tem e grava outro objeto
  const addProdPedido = () => {
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
      if (produtosPedido?.length > 0) {
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
            url_imagem: produtoTemporarioPedido?.url_imagem,
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
            url_imagem: produtoTemporarioPedido?.url_imagem,
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
      showModalPreencherCampos(
        "Os campos QUANTIDADE e PREÇO devem ser preenchidos e devem ser maior que zero!",
      );
    }
  };

  // função que grava as alterações do pedido no localStorage
  const gravarAlteracao = async () => {
    if (dataPedido != `${ano}-${mes}-${dia}`) {
      return showModalPreencherCampos(
        "O pedido não pode ser criado na data informada, altere a data e tente novamente",
      );
    }
    if (
      totalPedido > 0 &&
      produtosPedido?.length > 0 &&
      cliente &&
      dataPedido
    ) {
      setLoading(true);
      const data = {
        id: route.params?.pedido.id_pedido,
        status: 0,
        forma_pagamento_id: formaPagamento || 0,
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
        nome_cliente: cliente?.generico == 1 ? nomeclientes : "",
      };

      await alterarPedidoId(data)
        .then((response) => {
          showModalErro(response);
        })
        .catch((erro) => {
          console.log(erro);
        });
      setLoading(false);
      return;
    } else {
      showModalPreencherCampos(
        "Preencha todos os campos para finalizar o pedido!",
      );
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    const handleTabela = async () => {
      if (tabelaPrecos > 0) {
        var tabela = []
        const options = {
          headers: {
            "Content-type": "application/json",
            Authorization: await AsyncStorage.getItem("@ge_pedido_online_token"),
          },
        };
        const body = JSON.stringify({
          id: tabelaPrecos,
        });
        await axios
          .post(Apis.urlTabelaPrecosOne, body, options)
          .then((response) => {
            tabela = response.data.tabela;
          })
          .catch((erro) => {
            console.log(erro.response.data);
            tabela = [];
          });

        var produtosCopy = [];
        var encontrou = false;
        if (tabela) {
          produtosLocal?.map((item) => {
            tabela.produtos.map((item2, index) => {
              if (item.id_produto_servidor == item2.id) {
                encontrou = true;
              }
              if ((tabela.produtos.length - 1) === index && !encontrou) {
                produtosCopy.push(item);
              }
            });
            encontrou = false;
          });
          tabela.produtos.map((item) => {
            produtosCopy.push(item);
          });
          setProdutosLocal(produtosCopy);
          console.log('teste', produtosCopy.length);
        }
      }
      else {
        setReload(!reload);
      }
    }
    handleTabela();
  }, [tabelaPrecos]));

  // função para open/close o modal de seleção de cliente, recebe como parametro o cliente selecionado
  const openModalCliente = (dado) => {
    setTabelaPrecos(-1);
    if (dado) {
      setTabelaPrecos(dado?.tabela_preco_id);
      setNomeClientes(dado.nome);
      setCliente(dado);
      setFormaPagamento(dado.forma_pagto_id);
    }
    setShowModalCliente(!showModalCliente);
  };
  // função para open/close do modal de produtos
  const openModalProdutos = () => {
    setShowModalProduto(!showModalProduto);
  };

  // função para gravar o produto que foi selecionado em uma variavel temporaria
  const openModalProduto = (dado) => {
    setProdutoTemporarioPedido(dado);
    setPrecoProdPedido(dado.preco);
    openModalDadosProdutosPedido();
  };
  // função para open/close do modal para a inserir os valores do produto
  const openModalDadosProdutosPedido = () => {
    setShowModalProduto(false);
    setShowModalDadosProdutosPedido(!showModalDadosProdutosPedido);
  };

  // função para open/close do modal itens, mostra os itens que estão inseridos no pedido
  const modalItens = () => {
    setShowModalItens(!showModalItens);
  };

  const delProdPedido = (id_unico) => {
    setOpenModalErro(false);
    setOpenModalDellItemPedido(false);
    for (var i = 0; i < produtosPedido?.length; i++) {
      if (produtosPedido[i]?.id_unico === id_unico) {
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

  return (
    <>
      <AppbarSimples rota="ALTERAR PEDIDO" />
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
                onPress={() => openModalCliente("")}
              />
            </TouchableOpacity>
          ) : (
            <Button
              left
              color="#fff"
              textColor="#174c4f"
              texto={cliente ? cliente.nome : "selecionar cliente"}
              funcao={() => openModalCliente("")}
            />
          )}
          <Input
            icone="edit"
            label="Nº Pedido do Cliente"
            setValor={setNumPedidoCli}
            valor={numPedidoCli}
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
              width: "100%",
              marginTop: 10,
              height: 70,
              backgroundColor: "#fff",
            }}
            onValueChange={(itemValue, itemIndex) => setSituacao(itemValue)}
          >
            <Picker.Item label="Pendente" value={0} />
            <Picker.Item label="Finalizado" value={1} />
            <Picker.Item label="Cancelado" value={2} />
          </Picker>

          {/* verifica se tem permissão de acessar o financeiro */}
          {parametrosLocal[0]?.permite_financeiro?.valor == "0" &&
            pagamentosLocal != null && (
              <>
                <Picker
                  selectedValue={String(formaPagamento)}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    height: 70,
                    backgroundColor: "#fff",
                  }}
                  onValueChange={(itemValue) => setFormaPagamento(itemValue)}
                >
                  <Picker.Item
                    label="- selecione a forma de pagamento -"
                    value={0}
                  />
                  {pagamentosLocal.map((item) => (
                    <Picker.Item
                      key={item.id_pagamento_servidor}
                      label={item.descricao}
                      value={item.id_pagamento_servidor}
                    />
                  ))}
                </Picker>

                {permiteParcelas[0]?.parcelamento > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "49%" }}>
                      <Input
                        label="Parcelas"
                        icone="calculator"
                        valor={qtdParcelas}
                        setValor={setQtdParcelas}
                        tipo="numeric"
                      />
                    </View>
                    <View style={{ width: "49%" }}>
                      <Input
                        label="Parcelas"
                        icone="lock"
                        valor={
                          totalPedido !== "0" && qtdParcelas > 0
                            ? `R$ ${(
                              parseFloat(totalPedido) / qtdParcelas
                            ).toFixed(2)}`
                            : "R$ 00.00"
                        }
                      />
                    </View>
                  </View>
                )}
              </>
            )}

          <Input
            icone="edit"
            label="Observações"
            setValor={setObservacoesPedido}
            valor={observacoesPedido}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              backgroundColor: "white",
              height: 70,
              marginTop: 10,
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
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "49%" }}>
              <Button
                texto={`mostrar Itens (${produtosPedido?.length})`}
                color="red"
                funcao={modalItens}
              />
            </View>
            <View style={{ width: "49%" }}>
              <Button
                texto="adicionar item"
                color="green"
                funcao={() => openModalProdutos("")}
              />
            </View>
          </View>
          <Button funcao={gravarAlteracao} texto="gravar" />
        </View>
      </ScrollView>
      {/* fim tela principal de alteração do pedido - modal pedido */}

      {/* modal para seleção de cliente  */}
      <ModalTelaCheia
        rota="SELEÇÃO DE CLIENTE"
        visivel={showModalCliente}
        onPress={() => setShowModalCliente(false)}
        setValor={setPesquisarCliente}
        valor={pesquisarCliente}
      >
        <SafeAreaView style={styles.container}>
          {loading ? (
            <Loading />
          ) : clientesLocal?.length > 0 ? (
            <FlatList
              data={clientesLocal}
              renderItem={renderItemCliente}
              keyExtractor={(item) => (item.id > 0 ? item.id : item.id_unico)}
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
                  Nenhum cliente foi encontrato
                </Text>
              </View>
            </SafeAreaView>
          )}
        </SafeAreaView>
        <FabReload recarregar={() => setReload(!reload)} />
      </ModalTelaCheia>
      {/* fim modal para seleção de cliente */}

      {/* modal para seleção de produtos  */}
      <ModalTelaCheia
        onPress={() => setShowModalProduto(false)}
        visivel={showModalProduto}
        rota="SELEÇÃO DE PRODUTOS"
        setValor={setPesquisarProduto}
        valor={pesquisarProduto}
      >
        <SafeAreaView style={styles.container}>
          {loading ? (
            <Loading />
          ) : produtosLocal?.length > 0 ? (
            <FlatList
              data={produtosLocal}
              renderItem={renderItemProduto}
              keyExtractor={(item) => item.id}
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
                  Nenhum produto foi encontrato
                </Text>
              </View>
            </SafeAreaView>
          )}
        </SafeAreaView>
        <FabReload recarregar={() => setReload(!reload)} />
      </ModalTelaCheia>
      {/* fim modal para seleção de produtos */}

      {/* modal para inserir dados do produto no pedido */}
      <ModalTelaCheia
        bottonRight={true}
        rota="ITEM DO PEDIDO"
        onPress={() => openModalDadosProdutosPedido("")}
        visivel={showModalDadosProdutosPedido}
      >
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
            <Input
              label="Produto"
              icone="cube"
              valor={produtoTemporarioPedido.descricao}
            />
            <Input
              label="Complemento"
              icone="calculator"
              setValor={setDescricaoComplementar}
              valor={descricaoComplementar}
            />
            <Input
              label="Quantidade"
              icone="calculator"
              tipo="phone-pad"
              setValor={setQuantidadeProdPedido}
              valor={quantidadeProdPedido}
              validar={quantidadeProdPedido === "" || quantidadeProdPedido < 1}
            />
            <Input
              label={`Valor unitário: R$ ${parseFloat(
                produtoTemporarioPedido.preco
              ).toFixed(2)}`}
              icone="calculator"
              setValor={setPrecoProdPedido}
              valor={parseFloat(
                produtoTemporarioPedido.preco
              ).toFixed(2)}
              validar={precoProdPedido === "" || precoProdPedido < 0.1}
              tipo="phone-pad"
            />
            {parametrosLocal[0]?.permite_desconto.valor === "0" && (
              <Input
                icone="calculator"
                label="Desconto"
                setValor={setDescontoProdPedido}
                valor={descontoProdPedido}
                tipo="phone-pad"
              />
            )}
            <Button texto="adicionar" funcao={addProdPedido} />
          </View>
        </ScrollView>
      </ModalTelaCheia>
      {/* fim modal para inserir dados do produto no pedido */}

      {/* modal mostrar itens do pedido */}
      {produtosPedido?.length > 0 && (
        <ModalTelaCheia
          bottonRight={true}
          onPress={() => setShowModalItens(false)}
          rota={`TOTAL DE ITENS (${produtosPedido?.length})`}
          visivel={showModalItens}
        >
          {produtosPedido?.length > 0 && (
            <ScrollView style={styles.container}>
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
                      style={{ width: 70, height: 70, borderRadius: 5, borderStyle: 'solid', borderWidth: 1, borderColor: "#2f4f4f", boxShadow: '1px 2px 5px 1px gray' }}
                    />
                    <View style={{
                      flexDirection: "column", maxWidth: 200, marginLeft: 10
                    }}>
                      <Text style={{ textTransform: "uppercase" }}>
                        {dado?.descricao}
                      </Text>
                      {dado.descricao_complementar?.length > 1 &&
                        <Text style={{ textTransform: "uppercase" }}>
                          {dado.descricao_complementar}
                        </Text>
                      }
                      <Text style={{ color: "gray", fontSize: 11 }}>
                        {dado.qt} X R$ {parseFloat(dado.preco)?.toFixed(2)}
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
          )}
        </ModalTelaCheia>
      )}
      {/* fim modal mostrar itens do pedido */}

      <ModalSimples
        btnFechar
        texto={textoModal}
        imagem={null}
        onPress={() => navigation.goBack()}
        visivel={openModalErro}
      />

      <ModalSimples
        btnFechar
        imagem={null}
        texto={textoModal}
        onPress={() => setOpenModalPreencherCampos(false)}
        visivel={openModalPreencherCampos}
      />

      <ModalSimples
        btnFechar
        imagem={null}
        onPress={() => setOpenModalDellItemPedido(false)}
        texto={textoModal}
        visivel={openModalDellItemPedido}
      >
        <ButtonModal
          color="red"
          texto="confirmar"
          funcao={() => delProdPedido(idDellItemPedido)}
        />
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
export default AlterarPedido;
