import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { readItensPedidos } from "../database/servicesPedidos";
var dadosEmpresa = [];
var representante = "";
var selectedPrinter = "";

//   visualizar
export const print = async (dado, parametrosLocal) => {
  dadosEmpresa = parametrosLocal[0]?.empresa;
  representante = parametrosLocal[0]?.representante.nome;
  var itemPedido = [];
  if (dado.produtos) {
    itemPedido = dado.produtos;
  } else {
    await readItensPedidos(dado?.id_pedido).then((response) => {
      itemPedido = response;
      console.log(response);
    });
  }
  handleComprovante(dado, itemPedido);
  await Print.printAsync({
    html,
    printerUrl: selectedPrinter?.url,
  });
};

//   enviar
export const printToFile = async (dado, parametrosLocal) => {
  dadosEmpresa = parametrosLocal[0]?.empresa;
  representante = parametrosLocal[0]?.representante.nome;
  var itemPedido = [];
  if (dado.produtos) {
    itemPedido = dado.produtos;
  } else {
    await readItensPedidos(dado?.id_pedido).then((response) => {
      itemPedido = response;
    });
  }
  handleComprovante(dado, itemPedido);
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  const { uri } = await Print.printToFileAsync({
    html,
  });
  // console.log('File has been saved to:', uri);
  await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
};

var html = "";
const handleComprovante = async (dado, items) => {
  var data = new Date();
  var hora = data.getHours();
  var minuto = data.getMinutes();
  var segundo = data.getSeconds();

  var dia = String(data.getDate()).padStart(2, "0");
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  var dataAtual = `${dia}/${mes}/${ano}`;
  if (minuto < 10) {
    minuto = "0" + minuto;
  }
  if (segundo < 10) {
    segundo = "0" + segundo;
  }

  var horaFormatada = hora + ":" + minuto + ":" + segundo;
  var produtos = items?.map(
    (dados, index) =>
      `
    <tr key={${index}}>
      <td style="font-size: 15px; font-family: Helvetica Neue; text-transform: lowercase;">
        ${dados?.descricao}${dados?.descricao_complementar && ' - '}${dados?.descricao_complementar || ''}
      </td>
      <td style="text-align: center; font-size: 15px; font-family: Helvetica Neue;">${
        dados?.unidade
      }</td>
      <td style="text-align: center; font-size: 15px; font-family: Helvetica Neue;">${parseFloat(
        dados?.qt
      ).toFixed(2)}</td>
      <td style="text-align: left; font-size: 15px; font-family: Helvetica Neue;">R$ ${parseFloat(
        dados?.preco
      ).toFixed(2)}</td>
      <td style="text-align: left; font-size: 15px; font-family: Helvetica Neue;">R$ ${parseFloat(
        dados?.desconto
      ).toFixed(2)}</td>
      <td style="text-align: right; font-size: 15px; font-family: Helvetica Neue;">R$ ${(
        parseFloat(dados?.qt) * parseFloat(dados?.preco) -
        parseFloat(dados?.desconto)
      ).toFixed(2)}</td>
    </tr>
    `
  );

  html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          </head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
          <body style="text-align: center;">
            <div style="text-align: left;">
              <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px; text-transform: uppercase;">
                ${dadosEmpresa?.nome}
              </p>
              <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                CNPJ: ${dadosEmpresa?.cnpj}
              </p>
              <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                ${dadosEmpresa?.endereco.logradouro}, ${
    dadosEmpresa?.endereco.numero
  } - ${dadosEmpresa?.endereco.bairro}
              </p>
              <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                ${dadosEmpresa?.endereco.cidade} - ${
    dadosEmpresa?.endereco.uf
  } - CEP: ${dadosEmpresa?.endereco.cep}
              </p>
              <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                Telefone: ${dadosEmpresa?.endereco.telefone} - email: ${
    dadosEmpresa?.endereco.email
  }
              </p>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 15px;"/>
            <h1>
              COMPROVANTE DE VENDA
            </h1>
            
            <div style="text-align: left;">
                ${
                  dado?.generico != 1
                    ? `
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                    ${dado?.numPedido ? `Pedido: ${dado?.numPedido}` : ""}
                  </p>
                  <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                    Data: ${dado?.data.split("-").reverse().join("/")}
                  </p>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                    Cliente: ${dado?.nome || dado.cliente?.nome}
                  </p>
                  <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                    CNPJ: ${dado?.cnpj_cpf || dado.cliente?.cnpj_cpf}
                  </p>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                    Fantasia: ${
                      dado?.apelido !== null
                        ? dado?.apelido || dado.cliente?.apelido
                        : "não informado"
                    }
                  </p>
                  <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px; text-align: right;">
                    ${dado?.logradouro || dado.cliente?.logradouro}, ${
                        dado?.numero || dado.cliente?.numero
                      } - ${dado?.bairro || dado.cliente?.bairro} - CEP: ${
                        dado?.cep || dado.cliente?.cep
                      }
                  </p>
                </div>
                <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                  ${dado?.cidade || dado.cliente?.cidade} - ${
                        dado?.uf || dado.cliente?.uf
                      }
                </p>
              </div>
              `
                    : `
              <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                    ${dado?.numPedido ? `Pedido: ${dado?.numPedido}` : ""}
                  </p>
                  <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                    Data: ${dado?.data.split("-").reverse().join("/")}
                  </p>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                    Cliente: ${dado?.nome_cliente}
                  </p>
                </div>
              </div>
              `
                }
            <hr style="margin-top: 15px; margin-bottom: 15px;"/>
            
            <div style="text-align: left;">
              <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px; text-transform: capitalize">
                  Vendedor: ${representante}
              </p>
              <p style="font-size: 15px; font-family: Helvetica Neue; font-weight: normal; margin-top: 3px; margin-bottom: 3px;">
                  Condições de Pagamento: ${dado?.forma_pagto_descricao} ${
    parseFloat(dado?.qt_parcelas) > 1 ? ` ${dado?.qt_parcelas} parcelas` : ""
  } R$ ${(
    (parseFloat(dado?.total) - parseFloat(dado?.total_desconto)) /
    (parseFloat(dado?.qt_parcelas) > 0 ? parseFloat(dado?.qt_parcelas) : 1)
  ).toFixed(2)}
              </p>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 15px;"/>
            <table class="table table-striped table-hover">
              <thead>
                <th scope="col" style="font-size: 15px; font-family: Helvetica Neue; text-align: left;">DESCRIÇÃO</th>
                <th scope="col" style="font-size: 15px; font-family: Helvetica Neue; text-align: center;">UNID.</th>
                <th scope="col" style="font-size: 15px; font-family: Helvetica Neue; text-align: center;">QTDADE.</th>
                <th scope="col" style="font-size: 15px; font-family: Helvetica Neue; text-align: center;">PREÇO</th>
                <th scope="col" style="font-size: 15px; font-family: Helvetica Neue; text-align: center;">DESCT.</th>
                <th scope="col" style="font-size: 15px; font-family: Helvetica Neue; text-align: right;">TOTAL</th>
              </thead>
                <tbody>
                  ${String(produtos)}
                </tbody>
            </table>
            <hr style="margin-top: 15px; margin-bottom: 15px;"/>

            <div style="text-align: left;">
              <div style="display: flex; justify-content: space-between;">
                <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                  Total
                </p>
                <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                  R$ ${(
                    parseFloat(dado?.total).toFixed(2) -
                    parseFloat(dado?.total_desconto).toFixed(2)
                  ).toFixed(2)}
                </p>
              </div>
              <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 3px;">
                Não vale como recibo
              </p>
              ${
                dado.situacao == 1 && dado.numPedido <= 0
                  ? `<p style="position: fixed; bottom: 0px; font-weight: bold; display: flex; justify-content: space-between; width: 100%;">
                      <span>Não sincronizado</span>
                      <span>${dataAtual} ${horaFormatada}</span>
                    </p>`
                  : `<p style="position: fixed; bottom: 0px; font-weight: bold;">${dataAtual} ${horaFormatada}</p>`
              }
            </div>
          </body>
        </html>
      `;
};
