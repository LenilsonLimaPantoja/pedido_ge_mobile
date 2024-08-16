import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createContext, useCallback, useState } from "react";
import { Linking } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";
import {
  limparPedidos,
  readPedidos,
  valorPedidosPendentes,
  valorPedidosSicronizados,
} from "../database/servicesPedidos";
import {
  limparDados,
  totalClientesPendentes,
} from "../database/servicesClientes";
import {
  limparDadosVisitas,
  qtdVisitasPendentes,
  readVisitasAll,
} from "../database/servicesVisitas";
import { limparDadosFormaPgto } from "../database/servicesFormasPgto";
import { limparDadosProdutos } from "../database/servicesProdutos";
import { limparDadosMotivoVisitas } from "../database/servicesMotivoVisitas";
export const ContextGlobal = createContext({});

const GlobalContext = ({ children }) => {
  const navigation = useNavigation();
  const [pedidosLocal10, setPedidosLocal10] = useState([]);
  const [PedidosOnOff, setPedidosOnOff] = useState(false);
  const [representanteId, setRepresentanteId] = useState("");
  const [pedidosLocal, setPedidosLocal] = useState([]);
  const [visitasLocal, setVisitasLocal] = useState([]);
  const [totalPedidosPendentes, setTotalPedidosPendentes] = useState(0);
  const [totalPedidosSincronizados, setTotalPedidosSincronizados] = useState(0);
  const [qtdClientesPendentes, setQtdClientesPendentes] = useState(0);
  const [totalVisitasPendentes, setTotalQtdVisitasPendentes] = useState(0);
  const [load, setLoad] = useState(false);
  const [tokenLocal, setTokenLocal] = useState("");
  const [parametrosLocal, setParametrosLocal] = useState([]);
  const [semRede, setSemRede] = useState(false);
  const data = new Date();
  useFocusEffect(
    useCallback(() => {
      handleData();
    }, [])
  );

  const handlePedidosOnOff = () => {
    setPedidosOnOff(!PedidosOnOff);
  };

  const handleParametrosLocal = async () => {
    const token = await AsyncStorage.getItem("@ge_pedido_online_token");
    const nome = await AsyncStorage.getItem(
      "@ge_pedido_online_representante_nome"
    );
    const empresa = JSON.parse(
      await AsyncStorage.getItem("@ge_pedido_online_empresa")
    );
    const idRepresentante = await AsyncStorage.getItem(
      "@ge_pedido_online_representante_id"
    );
    setRepresentanteId(idRepresentante);
    const financeiroVenda = await AsyncStorage.getItem(
      "@ge_pedido_online_financeiro_venda"
    );
    const permiteDesconto = await AsyncStorage.getItem(
      "@ge_pedido_online_permite_desconto"
    );
    setTokenLocal(token);
    setParametrosLocal([
      {
        permite_financeiro: { valor: financeiroVenda },
        permite_desconto: { valor: permiteDesconto },
        empresa,
        representante: { nome, idRepresentante },
        token,
      },
    ]);
  };

  // pegar total e quantidade de pedidos pendentes
  const handleValorPendentes = async () => {
    valorPedidosPendentes()
      .then((response) => {
        setTotalPedidosPendentes(response);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // pegar total e quantidade de pedidos sincronizados
  const handleValorSincronizados = async () => {
    await valorPedidosSicronizados()
      .then((response) => {
        setTotalPedidosSincronizados(response);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // pegar quantidade de clientes pendentes
  const handleQtdClientesPendentes = async () => {
    await totalClientesPendentes()
      .then((response) => {
        setQtdClientesPendentes(response.qtdPendentes);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // pegar quantidade de visitas pendentes
  const handleVisitasPendentes = async () => {
    await qtdVisitasPendentes()
      .then((response) => {
        setTotalQtdVisitasPendentes(response.qtdPendentes);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // pegar pedidos
  const handlePedidosLocal = async () => {
    let mes = String(data.getMonth() + 1).padStart(2, "0");
    await readPedidos("", "2023", mes, "01", "-1")
      .then((response) => {
        // todos os pedidos a partir de "2022", "01", "01"
        setPedidosLocal(response);
        // ultimos 10 pedidos
        setPedidosLocal10(response?.slice(-10));
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // pegar visitas
  const handleReadVisitas = async () => {
    await readVisitasAll()
      .then((response) => {
        setVisitasLocal(response);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  const handleData = async () => {
    setLoad(true);
    await handleParametrosLocal();
    await handlePedidosLocal();
    await handleValorPendentes();
    await handleValorSincronizados();
    await handleQtdClientesPendentes();
    await handleVisitasPendentes();
    await handleReadVisitas();
    setLoad(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@ge_pedido_online_token");
    navigation.reset({
      index: 1,
      routes: [{ name: "Login" }],
    });
  };

  const handleRedirect = (rota) => {
    NetInfo.fetch().then(async (state) => {
      if (rota === "ajuda") {
        Linking.openURL(
          "https://api.whatsapp.com/send?phone=5567991986596&text=Ajuda%20com%20o%20GE%20Pedido%20Mobile"
        );
        return;
      }

      if (
        rota === "BaixarDados" ||
        rota == "SincronizarDados" ||
        rota == "AltSenha" ||
        rota == "BaixarClientes" ||
        rota == "BaixarMotivoVisitas" ||
        rota == "BaixarProdutos" ||
        rota == "BaixarFormasPgto" ||
        rota == "DesvincularAparelho"
      ) {
        if (state.isInternetReachable) {
          return navigation.navigate(rota);
        }
        return setSemRede(true);
      }
      navigation.navigate(rota);
    });
  };

  const handleLimparDados = async () => {
    await AsyncStorage.removeItem("@ge_pedido_online_empresa");
    await AsyncStorage.removeItem("@ge_pedido_online_financeiro_venda");
    await AsyncStorage.removeItem("@ge_pedido_online_motivo");
    await AsyncStorage.removeItem("@ge_pedido_online_permite_desconto");
    await AsyncStorage.removeItem("@ge_pedido_online_representante_id");
    await AsyncStorage.removeItem("@ge_pedido_online_representante_nome");
    await AsyncStorage.removeItem("@ge_pedido_online_token");
    await limparDados();
    await limparDadosFormaPgto();
    await limparDadosProdutos();
    await limparDadosVisitas();
    await limparPedidos();
    await limparDadosMotivoVisitas();
    logout();
  };

  return (
    <ContextGlobal.Provider
      value={{
        pedidosLocal10,
        pedidosLocal,
        parametrosLocal,
        representanteId,
        totalPedidosPendentes,
        totalPedidosSincronizados,
        tokenLocal,
        semRede,
        load,
        qtdClientesPendentes,
        totalVisitasPendentes,
        visitasLocal,
        setPedidosOnOff,
        PedidosOnOff,
        handleData,
        setSemRede,
        handleRedirect,
        logout,
        handleLimparDados,
        handleParametrosLocal,
        handlePedidosLocal,
        handlePedidosOnOff,
      }}
    >
      {children}
    </ContextGlobal.Provider>
  );
};
export default GlobalContext;
