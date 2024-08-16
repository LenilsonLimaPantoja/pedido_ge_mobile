import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CadastrarCliente from "../pages/cadastro/cliente/CadastrarCliente";
import ListaClientes from "../pages/listagem/cliente/ListaClientes";
import PreLoad from "../pages/preLoad/PreLoad";
import DrawerRouter from "./DrawerRouter";
import AlterarSenha from "../pages/alterar/senha/AlterarSenha";
import ListaPedidos from "../pages/listagem/pedido/ListaPedidos";
import ListaProdutos from "../pages/listagem/produto/ListaProdutos";
import ListaPagamentos from "../pages/listagem/formaPgto/ListaPagamentos";
import ListaVisitas from "../pages/listagem/visitas/ListaVisitas";
import BaixarDados from "../pages/baixarDados/BaixarDados";
import AlterarCliente from "../pages/alterar/cliente/AlterarCliente";
import CadastrarVisita from "../pages/cadastro/visita/CadastrarVisita";
import BaixarClientes from "../pages/baixarDados/clientes/BaixarClientes";
import BaixarProdutos from "../pages/baixarDados/produtos/BaixarProdutos";
import BaixarFormasPgto from "../pages/baixarDados/formasPgto/BaixarFormasPgto";
import BaixarMotivoVisitas from "../pages/baixarDados/motivoVisitas/BaixarMotivoVisitas";
import CadastrarPedido from "../pages/cadastro/pedido/CadastrarPedido";
import AlterarVisita from "../pages/alterar/visita/AlterarVisita";
import SincronizarDados from "../pages/sincronizarDados/SincronizarDados";
import SincronizarClientes from "../pages/sincronizarDados/clientes/SincronizarClientes";
import SincronizarPedidos from "../pages/sincronizarDados/pedidos/SincronizarPedidos";
import SincronizarVisitas from "../pages/sincronizarDados/visitas/SincronizarVisitas";
import ALterarPedido from "../pages/alterar/pedido/ALterarPedido";
import DesvincularAparelho from "../pages/alterar/desvincularAparelho/DesvincularAparelho";
import { IndexLogin } from "../pages/login/IndexLogin";
import ImportarDados from "../pages/importar/ImportarDados";
import BaixarTabelaPrecos from "../pages/baixarDados/tabelaPrecos/BaixarTabelaPrecos";
import ListaTabelaPrecos from "../pages/listagem/tabelaPrecos/ListaTabelaPrecos";
import BaixarItensTabelaPrecos from "../pages/baixarDados/itensTabelaPrecos/BaixarItensTabelaPrecos";
const Stack = createNativeStackNavigator();
const Rotas = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        orientation: "default",
        animation: "none",
      }}
    >
      <Stack.Screen name="Preload" component={PreLoad} />
      <Stack.Screen name="Drawer" component={DrawerRouter} />
      <Stack.Screen name="Login" component={IndexLogin} />
      <Stack.Screen name="BaixarDados" component={BaixarDados} />

      {/* cadastrar */}
      <Stack.Screen name="CadastrarVisita" component={CadastrarVisita} />
      <Stack.Screen name="CadastrarPedido" component={CadastrarPedido} />
      <Stack.Screen name="CadastrarCliente" component={CadastrarCliente} />

      {/* alterar */}
      <Stack.Screen name="AlterarVisita" component={AlterarVisita} />
      <Stack.Screen name="AlterarCliente" component={AlterarCliente} />
      <Stack.Screen name="AlterarPedido" component={ALterarPedido} />
      <Stack.Screen name="AltSenha" component={AlterarSenha} />
      <Stack.Screen
        name="DesvincularAparelho"
        component={DesvincularAparelho}
      />

      {/* listar */}
      <Stack.Screen name="ListaClientes" component={ListaClientes} />
      <Stack.Screen name="ListaProdutos" component={ListaProdutos} />
      <Stack.Screen name="FormaPagamento" component={ListaPagamentos} />
      <Stack.Screen name="ListaVisitas" component={ListaVisitas} />
      <Stack.Screen name="ListaPedidos" component={ListaPedidos} />
      <Stack.Screen name="ListaTabelaPrecos" component={ListaTabelaPrecos} />

      {/* baixar dados */}
      <Stack.Screen name="BaixarClientes" component={BaixarClientes} />
      <Stack.Screen
        name="BaixarMotivoVisitas"
        component={BaixarMotivoVisitas}
      />
      <Stack.Screen name="BaixarProdutos" component={BaixarProdutos} />
      <Stack.Screen name="BaixarFormasPgto" component={BaixarFormasPgto} />
      <Stack.Screen name="BaixarTabelaPrecos" component={BaixarTabelaPrecos} />
      <Stack.Screen name="BaixarItensTabelaPrecos" component={BaixarItensTabelaPrecos} />

      {/* soncronizar */}
      <Stack.Screen name="SincronizarDados" component={SincronizarDados} />
      <Stack.Screen name="SincronizarPedidos" component={SincronizarPedidos} />
      <Stack.Screen name="SincronizarVisitas" component={SincronizarVisitas} />
      <Stack.Screen
        name="SincronizarClientes"
        component={SincronizarClientes}
      />

      {/* importar dados */}
      <Stack.Screen name="ImportarDados" component={ImportarDados} />
    </Stack.Navigator>
  );
};
export default Rotas;
