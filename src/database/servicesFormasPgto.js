import axios from "axios";
import db from "./open";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
// read com filtros
export const readFormaPgto = (pesquisar, limite) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from formaPagamento where descricao like ? ${
          limite ? `limit ${limite}` : ""
        }`,
        [`%${pesquisar}%`],
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

export const addFormaPgto = async () => {
  const token = await AsyncStorage.getItem("@ge_pedido_online_token");
  var formaPgtoBd = [];
  await readFormaPgto("")
    .then((response) => {
      formaPgtoBd = response;
    })
    .catch((erro) => {
      console.log(erro);
    });

  var formaPgto = [];
  const options = {
    headers: { "Content-type": "application/json", Authorization: token },
  };
  await axios
    .post(Apis.urlReadFormasPgto, {}, options)
    .then((response) => {
      formaPgto = response.data?.registros;
    })
    .catch((erro) => {
      console.log(erro.response.data);
    });

  for (let i = 0; i < formaPgtoBd?.length; i++) {
    for (let j = 0; j < formaPgto?.length; j++) {
      if (formaPgtoBd[i]?.id_pagamento_servidor == formaPgto[j]?.id) {
        break;
      }
      if (
        formaPgtoBd[i]?.id_pagamento_servidor != formaPgto[j]?.id &&
        j == formaPgto?.length - 1
      ) {
        excluirPgtoId(formaPgtoBd[i]?.id);
      }
    }
  }

  var verificaExisteBd = false;
  return new Promise((resolve, reject) => {
    formaPgto?.map((item) => {
      verificaExisteBd = false;

      formaPgtoBd?.map((itemBd) => {
        if (itemBd?.id_pagamento_servidor == item?.id) {
          verificaExisteBd = true;
        }
      });

      if (verificaExisteBd) {
        alterarFormaPgto(item, reject, resolve);
      }

      if (!verificaExisteBd) {
        gravarDados(item, resolve, reject);
      }
    });
  });
};

const gravarDados = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      `insert into formaPagamento  
            (codigo, descricao, estabelecimento_id, id_pagamento_servidor, parcelamento) values (?, ?, ?, ?, ?)`,
      [
        item.codigo,
        item.descricao,
        item.estabelecimento_id,
        item.id,
        item.parcelamento,
      ],
      (txObj, resultSet) => {
        resolve(`As formas de pagamento foram criadas`);
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};

const excluirPgtoId = async (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from formaPagamento where id=?",
      [id],
      (txObj, resultSet) => {
        console.log("Foram removidos " + resultSet.rowsAffected + " registros");
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

const alterarFormaPgto = async (item, reject, resolve) => {
  console.log(item);
  db.transaction((tx) => {
    tx.executeSql(
      "update formaPagamento set codigo=?, descricao=?, estabelecimento_id=?, id_pagamento_servidor=?, parcelamento=? where id = ?",
      [
        item.codigo,
        item.descricao,
        item.estabelecimento_id,
        item.id,
        item.parcelamento,
        item.id,
      ],
      (txObj, resultSet) => {
        resolve("As formas de pagamento foram criadas");
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};

export const limparDadosFormaPgto = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from formaPagamento",
        null,
        (txObj, resultSet) => {
          resolve("A base de dados de formas de pagamento foi removida");
        },
        (txObj, error) => {
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};
