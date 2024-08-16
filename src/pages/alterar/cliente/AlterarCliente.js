import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppbarSimples from "../../../components/AppbarSimples";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import ModalSimples from "../../../components/ModalSimples";
import NetInfo from "@react-native-community/netinfo";
import Loading from "../../../components/Loading";
import ButtonModal from "../../../components/ButtonModal";
import {
  readClientesId,
  alterarClienteId,
} from "../../../database/servicesClientes";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const AlterarCliente = ({ route }) => {
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
  const [clienteEditar, setClienteEditar] = useState([]);
  const [openModalErro, setOpenModalErro] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [load, setLoad] = useState(false);
  const navigation = useNavigation();
  const handleModal = (texto) => {
    setTextoModal(texto), setOpenModalErro(!openModalErro);
  };
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
              // setRazao(response.data?.razao_social);
              // setFantasia(response.data?.estabelecimento.nome_fantasia);
              // setFone1(response.data?.estabelecimento.telefone1);
              // setFone2(response.data?.estabelecimento.telefone2);
              // setIeRg(response.data?.estabelecimento.inscricoes_estaduais[0].inscricao_estadual);
              // setUf(response.data?.estabelecimento.estado.sigla);
              // setCep(response.data?.estabelecimento.cep);
              // setBairro(response.data?.estabelecimento.bairro);
              // setCidade(response.data?.estabelecimento.cidade.nome);
              // setLogradouro(response.data?.estabelecimento.logradouro);
              // setNumero(response.data?.estabelecimento.numero);
              // setEmail(response.data?.estabelecimento.email);
              // setComplemento(response.data?.estabelecimento.complemento);
            }
            setLoad(false);
          })
          .catch((error) => {
            setTextoModal(`ATENÇÃO ERRO, buscar dados pelo CNPJ falhou, tente novamente ou preencha os dados manualmente.`);
            setLoad(false);
          })
      }
      // mostra mensagem de falha caso a busca de dados por cnpj falhar
      if (cnpjCpf.length === 14 && !state.isConnected) {
        setTextoModal(`ATENÇÃO ERRO, buscar dados pelo CNPJ falhou, tente novamente ou preencha os dados manualmente.`);
        setLoad(false);
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
              handleModal(
                "Buscar dados de endereço pelo CEP falhou, tente novamente ou preencha os dados manualmente.",
              );
              setLoad(false);
            }
          });
      }
      // mostra a mensagem de erro caso a busca de dados do endereço pelo cep falhar
      if (cep.length === 8 && cep.length > 7 && !state.isConnected) {
        handleModal(
          "Buscar dados de endereço pelo CEP falhou, tente novamente ou preencha os dados manualmente.",
        );
      }
    });
  }, [cep]);

  // busca od dados do cliente no banco de dados
  useFocusEffect(
    useCallback(() => {
      const dataClienteId = async () => {
        setLoad(true);
        await readClientesId(route.params.id)
          .then((response) => {
            setClienteEditar(response[0]);
            setRazao(response[0].nome);
            setFantasia(response[0].apelido);
            setLogradouro(response[0].logradouro);
            setNumero(response[0].numero);
            setCep(response[0].cep);
            setBairro(response[0].bairro);
            setComplemento(response[0].complemento);
            setCidade(response[0].cidade);
            setUf(response[0].uf);
            setEmail(response[0].email);
            setFone1(response[0].fone1);
            setFone2(response[0].fone2);
            setContato(response[0].contato);
            setCnpjCpf(response[0].cnpj_cpf);
            setIeRg(response[0].ie_rg);
            setGenerico(response[0].generico);
          })
          .catch((erro) => {
            console.log(erro);
          });
        setLoad(false);
      };
      dataClienteId();
    }, [])
  );

  // excluir e depois gravar alteração de cliente
  const gravarAlteracao = async () => {
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
      const dadosAlterarCliente = {
        id: clienteEditar.id,
        nome: razao,
        apelido: fantasia,
        logradouro: logradouro,
        numero: numero,
        cep: cep,
        bairro: bairro,
        complemento: complemento,
        cidade: cidade,
        uf: uf,
        email: email,
        fone1: fone1,
        fone2: fone2,
        contato: contato,
        cnpj_cpf: cnpjCpf,
        ie_rg: ieRg,
        generico: generico,
      };
      await alterarClienteId(dadosAlterarCliente)
        .then((response) => {
          handleModal(response);
          setLoad(false);
        })
        .catch((erro) => {
          handleModal(erro);
          setLoad(false);
        });
    } else {
      handleModal("Todos os campos dever ser preenchidos");
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
          <Button texto="gravar" funcao={gravarAlteracao} />
        </ScrollView>
        <ModalSimples
          imagem={null}
          texto={textoModal}
          visivel={openModalErro}
          onPress={() => setOpenModalErro(false)}
          btnFechar={true}
        >
          {textoModal == "O cliente foi alterado com sucesso" && (
            <ButtonModal
              color="green"
              texto="voltar a listagem"
              funcao={() => navigation.goBack()}
            />
          )}
        </ModalSimples>
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

export default AlterarCliente;
