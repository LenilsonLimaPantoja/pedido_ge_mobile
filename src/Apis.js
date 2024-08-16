const URL_BASE = "https://gesuportelogico.com.br/api/";
const Apis = {
  // LOGIN
  // login
  urlLogin: `${URL_BASE}representantes/login`,
  // CREATE
  // clientes
  urlCreateClientes: `${URL_BASE}clientes/create`,
  // pedidos
  urlCreatePedidos: `${URL_BASE}pedidosvenda/create`,

  urlReadPedidos: `${URL_BASE}pedidosvenda/read`,
  // visitas
  urlCreateVisitas: `${URL_BASE}visitas/create`,

  // READ
  // produtos
  urlReadProdutos: `${URL_BASE}produtos/read`,
  // pedidos
  urlListarPedidos: `${URL_BASE}pedidosvenda/read_mobile`,
  // clientes
  urlReadClientes: `${URL_BASE}clientes/read`,
  // formas de pagamento
  urlReadFormasPgto: `${URL_BASE}formaspagamento/read`,
  // motivos das visitas
  urlReadMotivoVisitas: `${URL_BASE}visitas/situacoes_visita`,
  // tabela de precos
  urlTabelaPrecos: `${URL_BASE}tabela_preco/read`,
  // tabela de precos one
  urlTabelaPrecosOne: `${URL_BASE}tabela_preco/read_one`,
  // versao app
  urlVersaoApp: `${URL_BASE}credencial/versao_mobile`,

  // UPDATE
  // representante
  urlUpdateRepresentante: `${URL_BASE}representantes/update`,

  // desvincular dispositivo
  urlDesvincularDispositivo: `${URL_BASE}/representantes/unbind`,
};
export default Apis;
