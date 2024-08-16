import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppbarSimples from "../../../components/AppbarSimples";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import NetInfo from "@react-native-community/netinfo";
import Loading from "../../../components/Loading";
import ModalSimples from "../../../components/ModalSimples";
import { useNavigation } from "@react-navigation/native";
import { addCliente, readClientes } from "../../../database/servicesClientes";
import uuid from "react-uuid";
import { ContextGlobal } from "../../../context/GlobalContext";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
const CadastrarCliente = () => {
  const navigation = useNavigation();
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [ieRg, setIeRg] = useState("");
  const [razao, setRazao] = useState("");
  const [fantasia, setFantasia] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [email, setEmail] = useState("");
  const [fone1, setFone1] = useState("");
  const [fone2, setFone2] = useState("");
  const [contato, setContato] = useState("");
  const [generico, setGenerico] = useState(0);
  const [load, setLoad] = useState(false);
  const [openModalErro, setOpenModalErro] = useState(false);
  const [openModalSucesso, setOpenModalSucesso] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const { parametrosLocal } = useContext(ContextGlobal);
  // busca os dados do cliente pelo cnpj se houve conexão de rede
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (cnpjCpf.length === 14 && state.isConnected) {
        setLoad(true);
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const timeout = setTimeout(() => {
          setTextoModal(`ATENÇÃO ERRO, buscar dados pelo CNPJ falhou, tente novamente ou preencha os dados manualmente.`);
          setOpenModalErro(!openModalErro);
          setLoad(false);
          source.cancel();
        }, 10000);
        axios.get(`https://publica.cnpj.ws/cnpj/${cnpjCpf}`)
          .then((response) => {
            clearTimeout(timeout);
            if (response.data && response.data?.status !== 400 && response.data?.status !== 429) {
              setRazao(response.data?.razao_social);
              setFantasia(response.data?.estabelecimento.nome_fantasia);
              setFone1(response.data?.estabelecimento.telefone1);
              setFone2(response.data?.estabelecimento.telefone2);
              setContato(response.data?.estabelecimento.contato);
              setIeRg(
                response.data?.estabelecimento.inscricoes_estaduais[0]
                  .inscricao_estadual
              );
              setUf(response.data?.estabelecimento.estado.sigla);
              setCep(response.data?.estabelecimento.cep);
              setBairro(response.data?.estabelecimento.bairro);
              setCidade(response.data?.estabelecimento.cidade.nome);
              setLogradouro(response.data?.estabelecimento.logradouro);
              setNumero(response.data?.estabelecimento.numero);
              setEmail(response.data?.estabelecimento.email);
              setComplemento(response.data?.estabelecimento.complemento);
            }
            setLoad(false);
          })
          .catch((error) => {
            setTextoModal(`ATENÇÃO ERRO, buscar dados pelo CNPJ falhou, tente novamente ou preencha os dados manualmente.`);
            setOpenModalErro(!openModalErro);
            setLoad(false);
          });
      }
      // mostra mensagem de falha caso a busca de dados por cnpj falhar
      if (cnpjCpf.length === 14 && !state.isConnected) {
        setTextoModal(
          "Buscar dados pelo CNPJ falhou, tente novamente ou preencha os dados manualmente."
        );
        setOpenModalErro(!openModalErro);
      }
    });
  }, [cnpjCpf]);

  // busca dados de endereço pelo cep se houver conexão de rede
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (cep.length === 8 && cep.length > 7 && state.isConnected) {
        setLoad(true);
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then((response) => response.json())
          .then((result) => {
            if (!result.erro) {
              setLogradouro(result.logradouro);
              setUf(result.uf);
              setBairro(result.bairro);
              setCidade(result.localidade);
              setLoad(false);
            } else {
              setTextoModal(
                "Buscar dados de endereço pelo CEP falhou, tente novamente ou preencha os dados manualmente."
              );
              setOpenModalSucesso(!openModalErro);
              setLoad(false);
            }
          });
      }
      // mostra a mensagem de erro caso a busca de dados do endereço pelo cep falhar
      if (cep.length === 8 && cep.length > 7 && !state.isConnected) {
        setOpenModalErro(!openModalErro);
        setTextoModal(
          "Buscar dados de endereço pelo CEP falhou, tente novamente ou preencha os dados manualmente."
        );
      }
    });
  }, [cep]);

  // grava os dados do cliente no banco local
  const handleGravarCliente = async () => {
    var clienteObjCriar = [
      {
        apelido: fantasia,
        bairro: bairro,
        cep: cep,
        cidade: cidade,
        clientes_id: "0",
        cnpj_cpf: cnpjCpf,
        codigo: "0",
        complemento: complemento,
        conta: " ",
        created_at: "2022-11-25 14:10:16",
        data_nascimento: null,
        dias_semana_venda: "1111111",
        email: email,
        estabelecimento_id: "47",
        fone1: fone1,
        fone2: fone2,
        contato: contato,
        forma_pagto_descricao: null,
        forma_pagto_id: "0",
        id: "0",
        ie_rg: ieRg,
        latitude: null,
        logradouro: logradouro,
        longitude: null,
        nome: razao,
        numero: numero,
        representante_id: parametrosLocal[0].representante?.idRepresentante,
        rota_id: "0",
        sexo: "0",
        status: "0",
        uf: uf,
        updated_at: "2022-11-25 14:10:16",
        id_cliente_servidor: 0,
        idUnico: uuid(),
        generico: generico,
      },
    ];
    if (
      razao !== "" &&
      cnpjCpf !== "" &&
      logradouro !== "" &&
      numero !== "" &&
      bairro !== "" &&
      fone1 !== "" &&
      cidade !== ""
    ) {
      setLoad(true);
      readClientes(cnpjCpf, -1, 10)
        .then((response) => {
          setLoad(false);
          if (response.length > 0) {
            setOpenModalErro(!openModalErro);
            return setTextoModal(
              `O cnpj informado já está vinculado ao usuario ${response[0].nome}`
            );
          } else {
            addCliente(clienteObjCriar)
              .then((response) => {
                setOpenModalSucesso(!openModalErro);
                setTextoModal(response);
                setLoad(false);
              })
              .catch((erro) => {
                console.log(erro);
                setLoad(false);
              });
          }
        })
        .catch((erro) => {
          console.log(erro);
          setLoad(false);
        });
    } else {
      setOpenModalErro(!openModalErro);
      setTextoModal("Todos os campos devem ser preenchidos");
    }
  };

  if (load) {
    return <Loading />;
  }
  return (
    <>
      <AppbarSimples rota="cadastrar cliente" />
      <View style={styles.container}>
        <ScrollView>
          <Input
            label="CNPJ/CPF"
            tipo="numeric"
            valor={cnpjCpf}
            setValor={setCnpjCpf}
            validar={cnpjCpf == ""}
          />
          <Input label="IR/RG" tipo="numeric" valor={ieRg} setValor={setIeRg} />
          <Input
            label="Razão Social"
            valor={razao}
            setValor={setRazao}
            validar={razao == ""}
          />
          <Input label="Fantasia" valor={fantasia} setValor={setFantasia} />
          <Input
            label="CEP"
            tipo="numeric"
            valor={cep}
            setValor={setCep}
            validar={cep == ""}
          />
          <Input
            label="Logradouro"
            valor={logradouro}
            setValor={setLogradouro}
            validar={logradouro == ""}
          />
          <Input
            label="Número"
            tipo="numeric"
            valor={numero}
            setValor={setNumero}
            validar={numero == ""}
          />
          <Input
            label="Bairro"
            valor={bairro}
            setValor={setBairro}
            validar={bairro == ""}
          />
          <Input
            label="Complemento"
            valor={complemento}
            setValor={setComplemento}
          />
          <Input
            label="Cidade"
            valor={cidade}
            setValor={setCidade}
            validar={cidade == ""}
          />
          <Input label="UF" valor={uf} setValor={setUf} validar={uf == ""} />
          <Input
            label="Email"
            tipo="email-address"
            valor={email}
            setValor={setEmail}
          />
          <Input
            label="Telefone 1"
            tipo="phone-pad"
            valor={fone1}
            setValor={setFone1}
            validar={fone1 == ""}
          />
          <Input
            label="Telefone 2"
            tipo="phone-pad"
            valor={fone2}
            setValor={setFone2}
          />
          <Input
            label="Contato"
            valor={contato}
            setValor={setContato}
          />
          <Picker
            selectedValue={generico}
            style={{
              height: 70,
              width: "100%",
              borderRadius: 15,
              marginTop: 10,
              backgroundColor: "white",
            }}
            onValueChange={(itemValue, itemIndex) => setGenerico(itemValue)}
          >
            <Picker.Item label="Cliente padrão" value={0} />
            <Picker.Item label="Cliente Generico" value={1} />
          </Picker>
          <Button texto="gravar" funcao={handleGravarCliente} />
        </ScrollView>
        <ModalSimples
          imagem={null}
          texto={textoModal}
          visivel={openModalErro}
          onPress={() => setOpenModalErro(false)}
          btnFechar
        />
        <ModalSimples
          imagem={null}
          texto={textoModal}
          visivel={openModalSucesso}
          onPress={() => navigation.navigate("ListaClientes")}
          btnFechar
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    padding: 10,
    paddingBottom: 80,
  },
});

export default CadastrarCliente;
