import db from "./open";
// read com filtros
export const readVisitas = (
  pesquisa,
  anoFiltro,
  mesFiltro,
  diaFiltro,
  filtroPorStatus
) => {
  var ultimoDiaMes = new Date(anoFiltro, mesFiltro, 0);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select visitas.id as id_visita, visitas.status as status_visita, visitas.*, clientes.* from visitas
                           left join clientes on visitas.cliente_id = clientes.id
                           where (nome like ? and data_hora >= ? and data_hora <= ?) and (visitas.status ${
                             filtroPorStatus == 0 ? "=" : ">="
                           } ?)`,
        [
          `%${pesquisa}%`,
          `${anoFiltro}-${mesFiltro}-${diaFiltro}`,
          `${anoFiltro}-${mesFiltro}-${ultimoDiaMes}`,
          filtroPorStatus,
        ],
        (txObj, resultSet) => {
          console.log(resultSet.rows._array);
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

// read pelo id
export const readVisitasId = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select visitas.id as id_visita, visitas.*, clientes.* from visitas
                        left join clientes on visitas.cliente_id = clientes.id where id_visita = ?`,
        [id],
        (txObj, resultSet) => {
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const readVisitaIdCliente = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select COUNT(*) as qtdVisitasCliente from visitas where cliente_id = ?",
        [id],
        (txObj, resultSet) => {
          resolve(resultSet.rows._array[0].qtdVisitasCliente);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const addVisita = async (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into visitas  
                (status, cliente_id, representante_id, data_hora, idUnico, obs, lat, long) values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          0,
          item.cliente_id,
          item.representante_id,
          item.data_hora,
          item.idUnico,
          item.obs,
          item.latitude,
          item.longitude
        ],
        (txObj, resultSet) => {
          if (resultSet.insertId) {
            resolve(`A visita ${resultSet.insertId} foi criada`);
          }
          reject("Erro, tente novamente.");
        },
        (txObj, error) => {
          console.log(error);
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};

export const alterarVisita = async (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update visitas set cliente_id=?, representante_id=?, data_hora=?, obs=? where id=?",
        [
          item.cliente_id,
          item.representante_id,
          item.data_hora,
          item.obs,
          item.id,
        ],
        (txObj, resultSet) => {
          resolve(`A visita foi alterada com sucesso`);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const alterarVisitaSinc = async (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update visitas set status=1 where idUnico =?",
      [id],
      (txObj, resultSet) => {
        console.log(`A visita ${id} foi alterada com sucesso`);
      },
      (txObj, error) => {
        console.log("Erro, tente novamente");
      }
    );
  });
};

export const removeVisitaId = async (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      return reject("Id não encontrado, tente novamente.");
    }
    db.transaction((tx) => {
      tx.executeSql(
        "delete from visitas where id = ?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            resolve(`A visita com id ${id} foi removido`);
          }
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const limparDadosVisitas = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from visitas",
        null,
        (txObj, resultSet) => {
          resolve("A base de dados de visitas foi removida");
        },
        (txObj, error) => {
          reject("Erro, tente novamente.");
        }
      );
    });
  });
};

export const qtdVisitasPendentes = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select COUNT(*) as qtdPendentes from visitas where status = "0"',
        null,
        (txObj, resultSet) => {
          resolve(resultSet.rows._array[0]);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const readVisitasSincronizar = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select visitas.* from visitas where status = '0'",
        null,
        (txObj, resultSet) => {
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const readVisitasAll = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select visitas.* from visitas",
        null,
        (txObj, resultSet) => {
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};
