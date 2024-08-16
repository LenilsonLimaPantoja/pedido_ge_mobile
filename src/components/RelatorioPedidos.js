import * as Print from "expo-print";
import { readItensPedidos } from "../database/servicesPedidos";

var selectedPrinter = "";

//   visualizar
var dataInicialLoc = '';
var dataFinalloc = '';
var nome = '';
export const printRelatorioPedidos = async (dados, dataInicial, dataFinal, parametrosLocal) => {
  dataInicialLoc = dataInicial;
  dataFinalloc = dataFinal;
  nome = parametrosLocal[0].representante.nome;
  const pedidosComItens = await handleComprovante(dados);

  // Atualizar o HTML com os pedidos e itens completos
  await Print.printAsync({
    html: gerarHtml(pedidosComItens),
    printerUrl: selectedPrinter?.url,
  });
};

const handleComprovante = async (dados) => {
  try {
    // Usando Promise.all para garantir que todas as chamadas sejam resolvidas
    const pedidosComItens = await Promise.all(dados.map(async (item) => {
      try {
        // Buscar os itens do pedido
        const itens = await readItensPedidos(item.id_pedido);
        
        // Adicionar os itens ao pedido
        return { ...item, itemsPedidos: itens };
      } catch (error) {
        console.error(`Erro ao buscar itens para o pedido ${item.id_pedido}:`, error);
        return item; // Retorna o pedido sem os itens em caso de erro
      }
    }));

    return pedidosComItens;
  } catch (error) {
    console.error('Erro ao processar os pedidos:', error);
    return [];
  }
};

// Função para gerar o HTML com base nos pedidos completos
const gerarHtml = (pedidosComItens) => {
  const data = new Date();
  
  const produtos = pedidosComItens.map((pedido, index) => `
    <key={${index}}>
      <tr style="border-top: dashed ; border-top-width: 2px;">
          <td style="font-size: 15px; font-family: Helvetica Neue;">
            PEDIDO: ${pedido.numPedido ? pedido.numPedido : pedido.id_pedido}  DATA: ${String(pedido.data).split('-').reverse().join('/')}  TOTAL: ${pedido.total}
          </td>
      </tr>
      <tr>
          <td style="font-size: 15px; font-family: Helvetica Neue;">CLIENTE: ${pedido.nome}</td>
      </tr>
      <tr style="border-bottom: dashed ; border-bottom-width: 2px;">
          <td style="font-size: 15px; font-family: Helvetica Neue; padding-left: 40px;">
            ${pedido.itemsPedidos?.map((item, index2) => (
        `<p key={${index2}}>${item.descricao} ${item.qt} ${item.unidade} * ${parseFloat(item.preco).toFixed(2)} ${item.desconto > 0 ? `- ${parseFloat(item.desconto).toFixed(2)}` : ''} = R$ ${(parseFloat(item.qt) * parseFloat(item.preco) - parseFloat(item.desconto)).toFixed(2)}</p>`
      )).join('')}
          </td>
      </tr>
  `).join('');

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <style>
          table {
              border-collapse: collapse;
              border: none;
          }
          td, th {
              border: none;
          }
      </style>
      <body style="text-align: center; padding: 10px; position: relative;">
      <span style="position: fixed; top: 30px; right: 30px;">${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}</span>
        <div style="padding: 20px;">
          <span style="font-size: 20px; font-weight: bold;">RELATÓRIO DE VENDAS</span>
          </br>
          <span>PERÍODO DE ${String(dataInicialLoc).split('-').reverse().join('/')} À ${String(dataFinalloc).split('-').reverse().join('/')}</span>
          </br>
          <span>VENDEDOR: ${nome}</span>
        </div>
        <table class="table">
            <tbody>
              ${produtos}
            </tbody>
        </table>
      </body>
    </html>
  `;
};
