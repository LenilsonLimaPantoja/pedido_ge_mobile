import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useCallback, useContext, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons
} from "react-native-vector-icons";
import { ContextGlobal } from "../context/GlobalContext";
import logo from "../img/logo.png";
import { useFocusEffect } from "@react-navigation/native";
import db from "../database/open";
import axios from "axios";

const Menu = (props) => {
  const { logout, handleRedirect } = useContext(ContextGlobal);
  const [arrayDadosBdClientes, setArrayDadosBdClientes] = useState([]);
  const [arrayDadosBdProdutos, setArrayDadosBdProdutos] = useState([]);
  const [arrayDadosBdFormaPagamento, setArrayDadosBdFormaPagamento] = useState([]);
  const [arrayDadosBdMotivoVisitas, setArrayDadosBdMotivoVisitas] = useState([]);
  const [arrayDadosBdPedidos, setArrayDadosBdPedidos] = useState([]);
  const [arrayDadosBdItemsPedidos, setArrayDadosBdItemsPedidos] = useState([]);
  const [arrayDadosBdVisitas, setArrayDadosBdVisitas] = useState([]);
  useFocusEffect(useCallback(() => {
    const handleData = async () => {
      db.transaction((tx) => {
        tx.executeSql(
          'select * from clientes',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdClientes(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });

      db.transaction((tx) => {
        tx.executeSql(
          'select * from produtos',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdProdutos(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });

      db.transaction((tx) => {
        tx.executeSql(
          'select * from formaPagamento',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdFormaPagamento(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });

      db.transaction((tx) => {
        tx.executeSql(
          'select * from motivoVisitas',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdMotivoVisitas(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });

      db.transaction((tx) => {
        tx.executeSql(
          'select * from pedidos',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdPedidos(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });

      db.transaction((tx) => {
        tx.executeSql(
          'select * from itemsPedidos',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdItemsPedidos(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });

      db.transaction((tx) => {
        tx.executeSql(
          'select * from visitas',
          [],
          (txObj, resultSet) => {
            // console.log(resultSet.rows._array);
            setArrayDadosBdVisitas(resultSet.rows._array)
          },
          (txObj, resultError) => {
            console.log(JSON.stringify(resultError));
          }
        )
      });
    }
    handleData();
  }, []));
  const handleEnviarDadosBd = async () => {
    let ddBD = [
      {
        "clientes": arrayDadosBdClientes,
        "produtos": arrayDadosBdProdutos,
        "formaPagamento": arrayDadosBdFormaPagamento,
        "motivoVisitas": arrayDadosBdMotivoVisitas,
        "pedidos": arrayDadosBdPedidos,
        "itemsPedidos": arrayDadosBdItemsPedidos,
        "visitas": arrayDadosBdVisitas
      }
    ];

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    await axios.post('https://gesuportelogico.com.br/api/manutencao/enviar_obj_cli', { ddBD }, requestOptions)
      .then((response) => {
        Alert.alert('SUCESSO', response.data?.mensagem);
      })
      .catch((erro) => {
        Alert.alert('ATENÇÃO', erro.response.data?.mensagem);
      })
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <View style={styles.containerImg}>
          <Image style={styles.img} source={logo} resizeMode="contain" />
          <Text style={styles.pedidoTitulo}>GE PEDIDO ONLINE</Text>
          <Text style={styles.pedidoSubtitulo}>www.gesistemas.com.br</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("Home")}
        >
          <MaterialCommunityIcons
            style={styles.icone}
            name="monitor-dashboard"
          />
          <Text style={styles.textButton}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("ListaPedidos")}
        >
          <MaterialCommunityIcons style={styles.icone} name="cart" />
          <Text style={styles.textButton}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("ListaVisitas")}
        >
          <MaterialCommunityIcons style={styles.icone} name="handshake" />
          <Text style={styles.textButton}>Visitas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("ListaClientes")}
        >
          <MaterialCommunityIcons style={styles.icone} name="account" />
          <Text style={styles.textButton}>Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("ListaProdutos")}
        >
          <FontAwesome style={styles.icone} name="cubes" />
          <Text style={styles.textButton}>Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("FormaPagamento")}
        >
          <MaterialCommunityIcons style={styles.icone} name="credit-card" />
          <Text style={styles.textButton}>Formas de Pgto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("ListaTabelaPrecos")}
        >
          <MaterialCommunityIcons style={styles.icone} name="table" />
          <Text style={styles.textButton}>Tabela de Preços</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("BaixarDados")}
        >
          <MaterialCommunityIcons style={styles.icone} name="cloud-download" />
          <Text style={styles.textButton}>Baixar Dados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("SincronizarDados")}
        >
          <MaterialCommunityIcons style={styles.icone} name="cloud-sync" />
          <Text style={styles.textButton}>Sincronizar Dados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("AltSenha")}
        >
          <MaterialCommunityIcons style={styles.icone} name="cellphone-key" />
          <Text style={styles.textButton}>Alterar Senha</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("DesvincularAparelho")}
        >
          <MaterialIcons style={styles.icone} name="mobile-off" />
          <Text style={styles.textButton}>Desvincular aparelho</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={handleEnviarDadosBd}
        >
          <MaterialIcons style={styles.icone} name="backup" />
          <Text style={styles.textButton}>Enviar Backup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleRedirect("ImportarDados")}
        >
          <MaterialCommunityIcons style={styles.icone} name="cloud-download" />
          <Text style={styles.textButton}>Importar Backup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={logout}
        >
          <MaterialCommunityIcons style={styles.icone} name="logout" />
          <Text style={styles.textButton}>Sair</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flex: 1,
    padding: 20,
  },
  containerImg: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  img: {
    width: 90,
    height: 90,
  },
  pedidoTitulo: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
  },
  pedidoSubtitulo: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  textButton: {
    color: "#fff",
    marginLeft: 15,
  },
  icone: {
    color: "#fff",
    fontSize: 25,
  },
});
export default Menu;
