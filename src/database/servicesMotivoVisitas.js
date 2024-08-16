import axios from "axios";
import db from "./open";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
// read com filtros
export const readMotivoVisitas = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from motivoVisitas`,
        null,
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

export const addMotivoVisita = async () => {
  const token = await AsyncStorage.getItem("@ge_pedido_online_token");
  var motivoBd = [];
  await readMotivoVisitas().then((response) => {
    motivoBd = response;
  });

  var motivo = [];
  const options = {
    headers: { "Content-type": "application/json", Authorization: token },
  };
  await axios
    .post(Apis.urlReadMotivoVisitas, {}, options)
    .then((response) => {
      motivo = response.data;
    })
    .catch((erro) => {
      console.log(erro.response.data);
    });

  for (let i = 0; i < motivoBd.length; i++) {
    for (let j = 0; j < motivo.length; j++) {
      if (motivoBd[i]?.codigo == motivo[j]?.codigo) {
        break;
      }
      if (motivoBd[i]?.codigo != motivo[j]?.codigo && j == motivo?.length - 1) {
        excluirMotivoId(motivoBd[i]?.id);
      }
    }
  }

  var verificaExisteBd = false;
  return new Promise((resolve, reject) => {
    motivo?.map((item) => {
      verificaExisteBd = false;
      motivoBd?.map((itemBd) => {
        if (itemBd?.codigo == item?.codigo) {
          verificaExisteBd = true;
        }
      });

      if (verificaExisteBd) {
        alterarMotivo(item, resolve, reject);
      }
      if (!verificaExisteBd) {
        gravarDadosMotivo(item, resolve, reject);
      }
    });
  });
};

const gravarDadosMotivo = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      `insert into motivoVisitas (codigo, descricao) values (?, ?)`,
      [item.codigo, item.descricao],
      (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          resolve(`Os motivos das visitas foram baixados`);
        }
      },
      (txObj, error) => {
        reject("Erro, tente novamente.");
      }
    );
  });
};

const excluirMotivoId = async (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from motivoVisitas where id=?",
      [id],
      (txObj, resultSet) => {
        console.log("Escluido");
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

const alterarMotivo = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update motivoVisitas set codigo=?, descricao=? where codigo=?",
      [item.codigo, item.descricao, item.codigo],
      (txObj, resultSet) => {
        resolve("Os motivos das visitas foram baixados");
      },
      (txObj, error) => {
        reject("Erro, tente novamente");
      }
    );
  });
};
export const limparDadosMotivoVisitas = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from motivoVisitas",
        null,
        (txObj, resultSet) => {
          resolve("A base de dados de motivo de visitas foi removida");
        },
        (txObj, error) => {
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};
