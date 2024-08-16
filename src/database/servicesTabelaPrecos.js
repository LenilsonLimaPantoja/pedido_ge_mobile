import axios from "axios";
import db from "./open";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
// read com filtros
export const readTabelaPrecos = (pesquisar, limite) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tabela_precos where descricao like ? ${limite ? `limit ${limite}` : ""
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

export const readTabelaPrecosId = (id_tabela_servidor) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from tabela_precos where id_tabela_servidor=?',
        [id_tabela_servidor],
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

export const addTabelaPreco = async () => {
  const token = await AsyncStorage.getItem("@ge_pedido_online_token");
  var tabelaPrecosBd = [];
  await readTabelaPrecos("")
    .then((response) => {
      tabelaPrecosBd = response;
    })
    .catch((erro) => {
      console.log(erro);
    });

  var tabelaPrecos = [];
  const options = {
    headers: { "Content-type": "application/json", Authorization: token },
  };
  await axios
    .get(Apis.urlTabelaPrecos, options)
    .then((response) => {
      tabelaPrecos = response.data?.registros;
      console.log(JSON.stringify(response.data?.registros));
    })
    .catch((erro) => {
      console.log(erro.response.data);
    });

  for (let i = 0; i < tabelaPrecosBd?.length; i++) {
    for (let j = 0; j < tabelaPrecos?.length; j++) {
      if (tabelaPrecosBd[i]?.id_tabela_servidor == tabelaPrecos[j]?.id) {
        break;
      }
      if (
        tabelaPrecosBd[i]?.id_tabela_servidor != tabelaPrecos[j]?.id &&
        j == tabelaPrecos?.length - 1
      ) {
        excluirTabelaPrecosId(tabelaPrecosBd[i]?.id);
      }
    }
  }

  var verificaExisteBd = false;
  return new Promise((resolve, reject) => {
    tabelaPrecos?.map((item) => {
      verificaExisteBd = false;

      tabelaPrecosBd?.map((itemBd) => {
        if (itemBd?.id_tabela_servidor == item?.id) {
          verificaExisteBd = true;
        }
      });

      if (verificaExisteBd) {
        alterarTabelaPreco(item, reject, resolve);
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
      `insert into tabela_precos  
            (id_tabela_servidor, desc_max, descricao, estabelecimento_id, obs, tabela_custo) values (?, ?, ?, ?, ?, ?)`,
      [
        item?.id,
        item?.desc_max,
        item?.descricao,
        item?.estabelecimento_id,
        item?.obs,
        item?.tabela_custo
      ],
      (txObj, resultSet) => {
        resolve(`Tabela de preços foram criadas`);
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};

const excluirTabelaPrecosId = async (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from tabela_precos where id=?",
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

// finallllllllllllllll
const alterarTabelaPreco = async (item, reject, resolve) => {
  console.log(item);
  db.transaction((tx) => {
    tx.executeSql(
      "update tabela_precos set desc_max=?, descricao=?, obs=?, tabela_custo=? where id = ?",
      [
        item.desc_max,
        item.descricao,
        item.obs,
        item.tabela_custo,
        item.id
      ],
      (txObj, resultSet) => {
        // finallllllllllllllll
        alterarItensTabelaPreco(item);
        resolve("Tabela de preços foram criadas");
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};


// finallllllllllllllll
const alterarItensTabelaPreco = async (item) => {
  if (item?.id_tabela_servidor) {
    db.transaction((tx) => {
      tx.executeSql(`delete from tabela_precos where id_tabela_servidor = ${item?.id_tabela_servidor}`);
    });
    adicionarItemPedido(item.produtos, item?.id_tabela_servidor);
  }
};

export const limparDadosTabelaPrecos = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from tabela_precos",
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
