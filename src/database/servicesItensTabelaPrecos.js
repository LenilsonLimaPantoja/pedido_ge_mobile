import axios from "axios";
import db from "./open";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
// read com filtros
export const readItensTabelaPrecos = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from itens_tabela_precos where tabela_preco_id=?`,
        [`${id}`],
        (txObj, resultSet) => {
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};

export const addItemTabelaPreco = async (tabela) => {
  const token = await AsyncStorage.getItem("@ge_pedido_online_token");
  let tabelaPrecos = [];
  const options = {
    headers: { "Content-type": "application/json", Authorization: token },
  };
  await axios
    .post(Apis.urlTabelaPrecosOne, { id: tabela.id_tabela_servidor }, options)
    .then((response) => {
      tabelaPrecos = response.data.tabela.produtos;
      console.log(response.data.tabela.produtos);
    })
    .catch((erro) => {
      console.log(erro.response.data);
    });
  return new Promise((resolve, reject) => {
    tabelaPrecos?.map((item) => {
      gravarDadosItem(item, resolve, reject);
    });
  });
};

const gravarDadosItem = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      `insert into itens_tabela_precos  
              (id_item_tabela_servidor, descricao, tabela_preco_id, codpro, preco, custo, preco_ant, custo_ant) values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item?.id,
        item?.descricao,
        item?.tabela_preco_id,
        item?.codpro,
        item?.preco,
        item?.custo,
        item?.preco_ant,
        item?.custo_ant
      ],
      (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          resolve(`Os itens foram criados`);
        }
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};


export const limparDadosItensTabelaPrecos = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from itens_tabela_precos",
        null,
        (txObj, resultSet) => {
          resolve("A base de dados de tabela de preços foi removida");
        },
        (txObj, error) => {
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};
