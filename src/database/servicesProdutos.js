import axios from "axios";
import db from "./open";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
// read com filtros
export const readProdutos = (pesquisar, limite) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from produtos where descricao like ? ${limite ? `limit ${limite}` : ""
        }`,
        [`%${pesquisar}%`],
        (txObj, resultSet) => {
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

export const addProdutos = async () => {
  const token = await AsyncStorage.getItem("@ge_pedido_online_token");
  var produtosBd = [];
  await readProdutos("").then((response) => {
    produtosBd = response;
  });

  var produtos = [];
  const options = {
    headers: { "Content-type": "application/json", Authorization: token },
  };
  await axios
    .post(Apis.urlReadProdutos, {"tipo_produto": "0,4", "status": 0}, options)
    .then((response) => {
      produtos = response.data.registros;
    })
    .catch((erro) => {
      console.log(erro.response.data);
    });

  for (let i = 0; i < produtosBd.length; i++) {
    for (let j = 0; j < produtos.length; j++) {
      if (produtosBd[i].id_produto_servidor == produtos[j].id) {
        break;
      }
      if (
        produtosBd[i].id_produto_servidor != produtos[j].id &&
        j == produtos?.length - 1
      ) {
        db.transaction((tx) => {
          tx.executeSql(`delete from produtos where id = ${produtosBd[i].id}`);
        });
      }
    }
  }

  var verificaExisteBd = false;
  return new Promise((resolve, reject) => {
    produtos?.map((item) => {
      verificaExisteBd = false;
      produtosBd?.map((itemBd) => {
        if (itemBd?.codigo == item?.codigo) {
          verificaExisteBd = true;
        }
      });

      if (verificaExisteBd) {
        alterarProduto(item, resolve, reject);
      }
      if (!verificaExisteBd) {
        gravarDadosProduto(item, resolve, reject);
      }
    });
  });
};

const gravarDadosProduto = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      `insert into produtos  
        (codigo, descricao, estabelecimento_id, estoque, id_produto_servidor, preco, status, tipo, unidade, url_imagem) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.codigo,
        item.descricao,
        item.estabelecimento_id,
        item.estoque,
        item.id,
        item.preco,
        item.status,
        item.tipo,
        item.unidade,
        item.link_imagem
          ? item.link_imagem
          : "https://img-produto-geonline.s3.amazonaws.com/img_produto_padrao.jpeg",
      ],
      (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          resolve(`Os produtos foram criados`);
        }
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};
const alterarProduto = async (item, resolve, reject) => {
  db.transaction((tx) => {
    console.log(item);
    tx.executeSql(
      "update produtos set codigo=?, descricao=?, estabelecimento_id=?, estoque=?, id_produto_servidor=?, preco=?, status=?, tipo=?, unidade=?, url_imagem=? where codigo=?",
      [
        item.codigo,
        item.descricao,
        item.estabelecimento_id,
        item.estoque,
        item.id,
        item.preco,
        item.status,
        item.tipo,
        item.unidade,
        item.link_imagem
          ? item.link_imagem
          : "https://img-produto-geonline.s3.amazonaws.com/img_produto_padrao.jpeg",
        item.codigo,
      ],
      (txObj, resultSet) => {
        resolve("Os produtos foram criados");
      },
      (txObj, error) => {
        console.log(error);
        reject("Erro, tente novamente");
      }
    );
  });
};

const excluirProdutoId = async (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from produtos where id = ?",
      [id],
      (txObj, resultSet) => {
        console.log("Removido");
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export const limparDadosProdutos = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from produtos",
        null,
        (txObj, resultSet) => {
          resolve("A base de dados de produtos foi removida");
        },
        (txObj, error) => {
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};
