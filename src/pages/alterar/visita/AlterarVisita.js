import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Button from "../../../components/Button";
import ModalTelaCheia from "../../../components/ModalTelaCheia";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FabReload from "../../../components/FabReload";
import ModalSimples from "../../../components/ModalSimples";
import ButtonModal from "../../../components/ButtonModal";
import AppbarSimples from "../../../components/AppbarSimples";
import Loading from "../../../components/Loading";
import Data from "../../../components/Data";
import { readClientes } from "../../../database/servicesClientes";
import { readMotivoVisitas } from "../../../database/servicesMotivoVisitas";
import {
  alterarVisita,
  readVisitasId,
} from "../../../database/servicesVisitas";
const Cliente = ({ item, index, funcao }) =>
  index < 100 && (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.clienteItem,
        {
          backgroundColor: item.id_cliente_servidor < 1 ? "#fff3c8" : "white",
          borderColor: item.id_cliente_servidor < 1 ? "red" : "green",
          borderRightWidth: 10,
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
            {item?.nome?.length < 40
              ? item?.nome
              : item?.nome?.substring(0, 40)}
          </Text>
          <Text style={styles.textUser}>Email: {item.email}</Text>
          <Text style={styles.textUser}>CNPJ: {item.cnpj_cpf}</Text>
          <Text style={styles.textUser}>Telefone: {item.fone1}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

const AlterarVisita = ({ route }) => {
  const renderCliente = ({ item, index }) => (
    <Cliente item={item} index={index} funcao={selecionarCliente} />
  );

  const [clientes, setClientes] = useState([]);
  const [motivoVisitaLocal, setMotivoVisitaLocal] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [data, setData] = useState("");
  const [situacao, setSituacao] = useState("");
  const [openModaCliente, setOpenModaCliente] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [pesquisar, setPesquisar] = useState("");
  const [openModaMotivo, setOpenModaMotivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const navigation = useNavigation();
  const representanteId = 1542;

  useFocusEffect(
    useCallback(() => {
      const dataVisitaId = async () => {
        await readVisitasId(route.params.id_visita)
          .then((response) => {
            setData(response[0].data_hora);
            setCliente(response[0]);
            setSituacao(response[0].obs);
          })
          .catch((erro) => {
            console.log(erro);
          });
      };
      dataVisitaId();
    }, [])
  );

  // filtro
  useFocusEffect(
    useCallback(() => {
      const dataClienteAndMotivo = async () => {
        setLoading(true);
        await readClientes(pesquisar, -1, 30)
          .then((response) => {
            setClientes(response);
          })
          .catch((erro) => {
            handleModal(erro);
          });
        await readMotivoVisitas()
          .then((response) => {
            setMotivoVisitaLocal(response);
          })
          .catch((erro) => {
            handleModal(erro);
          });
        setLoading(false);
      };
      dataClienteAndMotivo();
    }, [pesquisar, reload])
  );

  const selecionarCliente = (dado) => {
    setOpenModaCliente(false);
    if (dado) {
      setCliente(dado);
    }
  };

  const handleModal = (texto, open) => {
    setOpenModaMotivo(open);
    setTextoModal(texto);
  };
  const selecionarMotivo = (motivo) => {
    setOpenModaMotivo(false);
    setSituacao(motivo);
  };

  // excluir e depois gravar alteração de cliente
  const gravarVisita = async () => {
    if (data !== "" && situacao !== "" && cliente.nome) {
      var dadosVisitaGravar = {
        id: route.params.id_visita,
        representante_id: representanteId,
        data_hora: data,
        obs: situacao,
        cliente_id: cliente.id,
      };
      alterarVisita(dadosVisitaGravar)
        .then((response) => {
          handleModal(response);
        })
        .catch((erro) => {
          handleModal(erro);
        });
      console.log(dadosVisitaGravar);
    } else {
      handleModal("Todos os campos dever ser preenchidos.");
    }
  };
  return (
    <>
      <AppbarSimples rota="Alterar Visita" />

      <SafeAreaView style={styles.container}>
        <Data
          setValor={setData}
          valor={data}
          color="#fff"
          textColor="#174c4f"
        />
        <Button
          left
          textColor="#174c4f"
          color="#fff"
          texto={cliente ? cliente.nome : "adicionar cliente"}
          funcao={() => setOpenModaCliente(true)}
          validar={cliente == ""}
        />
        <Button
          left
          textColor="#174c4f"
          color="#fff"
          texto={situacao}
          funcao={() => handleModal("Selecione o motivo da visita")}
          validar={situacao == ""}
        />
        <Button texto="gravar" funcao={gravarVisita} />
      </SafeAreaView>

      <ModalTelaCheia
        rota={`Seleção de cliente (${clientes?.length})`}
        visivel={openModaCliente}
        onPress={() => setOpenModaCliente(false)}
        valor={pesquisar}
        setValor={setPesquisar}
      >
        <SafeAreaView style={[styles.container, { padding: 0 }]}>
          {loading ? (
            <Loading />
          ) : clientes?.length > 0 ? (
            <FlatList
              style={styles.lista}
              data={clientes}
              renderItem={renderCliente}
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
                Nenhum cliente foi encontrado!
              </Text>
            </View>
          )}
        </SafeAreaView>
        <FabReload recarregar={() => setReload(!reload)} />
      </ModalTelaCheia>

      <ModalSimples
        visivel={openModaMotivo}
        imagem={null}
        texto={textoModal}
        onPress={() => setOpenModaMotivo(false)}
      >
        {textoModal == "Todos os campos devem ser preenchidos" ? (
          <ButtonModal
            texto="entendi"
            funcao={() => setOpenModaMotivo(false)}
          />
        ) : textoModal == "Selecione o motivo da visita" ? (
          motivoVisitaLocal.map((item, index) => (
            <ButtonModal
              texto={item.descricao}
              key={index}
              funcao={() => selecionarMotivo(item.descricao)}
            />
          ))
        ) : (
          <ButtonModal
            funcao={() => navigation.navigate("ListaVisitas")}
            texto="entendi"
          />
        )}
      </ModalSimples>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    padding: 10,
    backgroundColor: "#174c4f",
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
  },
  containerUser: {
    marginLeft: 10,
  },
  textUser: {
    color: "gray",
  },
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AlterarVisita;
