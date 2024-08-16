import React, { useCallback, useContext, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import AppbarSimples from "../../../components/AppbarSimples";
import Button from "../../../components/Button";
import ButtonModal from "../../../components/ButtonModal";
import ModalSimples from "../../../components/ModalSimples";
import ModalTelaCheia from "../../../components/ModalTelaCheia";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FabReload from "../../../components/FabReload";
import Loading from "../../../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import Data from "../../../components/Data";
import { readClientes } from "../../../database/servicesClientes";
import { readMotivoVisitas } from "../../../database/servicesMotivoVisitas";
import { addVisita } from "../../../database/servicesVisitas";
import uuid from "react-uuid";
import { ContextGlobal } from "../../../context/GlobalContext";

import * as Location from "expo-location";
const Cliente = ({ item, index, funcao }) => (
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
          {item?.nome?.length < 40 || item?.apelido?.length < 40
            ? item?.apelido
              ? item?.apelido
              : item?.nome
            : item?.apelido
            ? item?.apelido?.substring(0, 40)
            : item?.nome?.substring(0, 40)}
        </Text>
        <Text style={styles.textUser}>Email: {item.email}</Text>
        <Text style={styles.textUser}>CNPJ: {item.cnpj_cpf}</Text>
        <Text style={styles.textUser}>Telefone: {item.fone1}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const CadastrarVisita = () => {
  const renderCliente = ({ item, index }) => (
    <Cliente item={item} index={index} funcao={selecionarCliente} />
  );
  const [data, setData] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisar, setPesquisar] = useState("");
  const [clientes, setClientes] = useState([]);
  const [motivoVisita, setMotivoVisita] = useState([]);
  const [cliente, setCliente] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [openModaMotivo, setOpenModaMotivo] = useState(false);
  const [openModaCliente, setOpenModaCliente] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const { parametrosLocal, handleRedirect } = useContext(ContextGlobal);

  const handleModalMotivo = (texto) => {
    setOpenModaMotivo(!openModaMotivo);
    setTextoModal(texto);
  };
  useFocusEffect(
    useCallback(() => {
      const dataClienteAndMotivo = async () => {
        setLoading(true);
        await readClientes(pesquisar, -1, 30)
          .then((response) => {
            setClientes(response);
          })
          .catch((erro) => {
            handleModalMotivo(erro);
            setOpenModaMotivo(true);
          });

        await readMotivoVisitas()
          .then((response) => {
            setMotivoVisita(response);
          })
          .catch((erro) => {
            handleModalMotivo(erro);
          });
        setLoading(false);
      };
      dataClienteAndMotivo();
    }, [pesquisar, reload])
  );

  const selecionarCliente = (dado) => {
    setOpenModaCliente(false);
    console.log(dado);
    if (dado) {
      setCliente(dado);
    }
  };
  const selecionarMotivo = (motivo) => {
    setOpenModaMotivo(false);
    setSituacao(motivo);
  };
  // grava os dados da visita no banco
  const gravarVisita = async () => {
    //permitir acesso a localização do dispositivo
    let { status } = await Location.requestForegroundPermissionsAsync();
    let location = {};
    if (status !== "granted") {
      console.log("Permissão negada");
      handleModalMotivo(
        "Permisaão negada para acessar a localização do dispositivo, por favor habilite-a para continuar"
      );
      setOpenModaMotivo(true);
      setLoading(false);
      return;
    }

    await Location.getCurrentPositionAsync()
      .then((position) => {
        setLoading(false);
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

    setLoading(true);
    //verificar se o gps está ligado
    let gps = await Location.hasServicesEnabledAsync();
    if (!gps) {
      handleModalMotivo(
        "O GPS está desligado, por favor ligue-o para continuar"
      );
      setOpenModaMotivo(true);
      setLoading(false);
      return;
    }
    if (
      parametrosLocal[0].representante.idRepresentante !== "" &&
      cliente.id !== "" &&
      situacao !== "" &&
      cliente &&
      cliente.id !== undefined
    ) {
      var dadosVisitaGravar = {
        representante_id: parametrosLocal[0].representante.idRepresentante,
        data_hora: data,
        obs: situacao,
        cliente_id: cliente.id,
        idUnico: uuid(),
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
      await addVisita(dadosVisitaGravar)
        .then((response) => {
          setLoading(false);
          handleModalMotivo(response);
        })
        .catch((erro) => {
          setLoading(false);
          handleModalMotivo(erro);
        });
      setCliente("");
      setSituacao("");
    } else {
      setLoading(false);
      handleModalMotivo("Todos os campos devem ser preenchidos");
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { padding: 0 }]}>
        <Loading />
      </SafeAreaView>
    );
  }
  return (
    <>
      <AppbarSimples rota="Cadastrar Visita" />

      <SafeAreaView style={styles.container}>
        <Data
          setValor={setData}
          valor={data}
          textColor="#174c4f"
          color="#fff"
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
          texto={situacao ? `${situacao}` : "selecione o motivo"}
          funcao={() =>
            handleModalMotivo("Selecione o motivo da visita")
          }
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
              keyExtractor={(item) => item.cnpj_cpf}
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
        {textoModal == "Selecione o motivo da visita" ? (
          motivoVisita?.map((item, index) => (
            <ButtonModal
              texto={item.descricao}
              key={index}
              funcao={() => selecionarMotivo(item.descricao)}
            />
          ))
        ) : (
          <>
            <ButtonModal
              texto="entendi"
              funcao={() => setOpenModaMotivo(false)}
            />
            <ButtonModal
              texto="voltar a listagem"
              color="red"
              funcao={() => handleRedirect("ListaVisitas")}
            />
          </>
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

export default CadastrarVisita;
