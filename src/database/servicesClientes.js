import axios from "axios";
import db from "./open";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
const date = new Date();
// read com filtros
export const readClientes = (pesquisar, status, limit) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from clientes where (nome like ? or apelido like ? or cnpj_cpf like ? or email like ?) and (substr(dias_semana_venda, ${
          date.getDay() + 1
        }, 1) = '1') and (id_cliente_servidor ${
          status == 0 ? "=" : ">="
        } ?) limit ?`,
        [
          `%${pesquisar}%`,
          `%${pesquisar}%`,
          `%${pesquisar}%`,
          `%${pesquisar}%`,
          status,
          1000000,
        ],
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

// read cliente pelo id
export const readClientesId = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from clientes where id = ?",
        [id],
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

export const readClientesSincronizar = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from clientes where id_cliente_servidor="0"',
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

export const addCliente = async (cliente) => {
  var clientesBd = [];
  await readClientes("", -1, 9999999)
    .then((response) => {
      clientesBd = response;
    })
    .catch((erro) => {
      console.log(erro);
    });
  var clientes = cliente;

  if (!cliente) {
    const options = {
      headers: {
        "Content-type": "application/json",
        Authorization: await AsyncStorage.getItem("@ge_pedido_online_token"),
      },
    };
    const body = JSON.stringify({
      representante_id: await AsyncStorage.getItem(
        "@ge_pedido_online_representante_id"
      ),
    });
    await axios
      .post(Apis.urlReadClientes, body, options)
      .then((response) => {
        clientes = response.data.registros;
      })
      .catch((erro) => {
        console.log(erro.response.data);
      });
    for (let i = 0; i < clientesBd.length; i++) {
      for (let j = 0; j < clientes.length; j++) {
        if (clientesBd[i]?.id_cliente_servidor == clientes[j]?.id) {
          break;
        }
        if (
          clientesBd[i]?.id_cliente_servidor != clientes[j]?.id &&
          j == clientes?.length - 1
        ) {
          db.transaction((tx) => {
            tx.executeSql(
              `delete from clientes where id = ${clientesBd[i].id}`
            );
          });
        }
      }
    }
  }

  var verificaExisteBd = false;
  return new Promise((resolve, reject) => {
    if (clientes?.length < 1) {
      resolve("Nenhum cliente foi encontrado");
    }
    clientes?.map((item) => {
      verificaExisteBd = false;

      clientesBd?.map((itemBd) => {
        if (itemBd?.id_cliente_servidor == item?.id) {
          verificaExisteBd = true;
        }
      });

      if (verificaExisteBd) {
        alterarClienteExisteBdCliId(item, resolve, reject, clientes?.length);
      }
      if (!verificaExisteBd) {
        createCliente(item, resolve, reject);
      }
    });
  });
};

export const alterarClienteId = async (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update clientes set nome=?, apelido=?, logradouro=?, numero=?, cep=?, bairro=?, complemento=?, cidade=?, uf=?, email=?, fone1=?, fone2=?, contato=?, cnpj_cpf=?, ie_rg=?, generico=?, tabela_preco_id=? where id = ?",
        [
          item.nome,
          item.apelido,
          item.logradouro,
          item.numero,
          item.cep,
          item.bairro,
          item.complemento,
          item.cidade,
          item.uf,
          item.email,
          item.fone1,
          item.fone2,
          item.contato,
          item.cnpj_cpf,
          item.ie_rg,
          item.generico,
          item.tabela_preco_id,
          item.id,
        ],
        (txObj, resultSet) => {
          resolve("Cliente(s) foram criado(s)");
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const alterarClienteSinc = async (id_cliente_servidor, idUnico) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update clientes set id_cliente_servidor=? where idUnico = ?",
        [id_cliente_servidor, idUnico],
        (txObj, resultSet) => {
          resolve(`O cliente ${idUnico} foi atualizado`);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

const createCliente = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      `insert into clientes  
        (
            id_cliente_servidor, nome, cnpj_cpf, ie_rg, apelido, email, cep, cidade, uf, logradouro, bairro, numero, latitude, longitude, sexo, status, codigo,
            clientes_id, complemento, conta, created_at, data_nascimento, dias_semana_venda, estabelecimento_id, fone1, fone2, contato, forma_pagto_descricao, forma_pagto_id, representante_id, rota_id, updated_at, idUnico, generico, tabela_preco_id
        ) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.nome,
        item.cnpj_cpf,
        item.ie_rg,
        item.apelido,
        item.email,
        item.cep,
        item.cidade,
        item.uf,
        item.logradouro,
        item.bairro,
        item.numero,
        item.latitude,
        item.longitude,
        item.sexo,
        item.status,
        item.codigo,
        item.clientes_id,
        item.complemento,
        item.conta,
        item.created_at,
        item.data_nascimento,
        item.dias_semana_venda,
        item.estabelecimento_id,
        item.fone1,
        item.fone2,
        item.contato,
        item.forma_pagto_descricao,
        item.forma_pagto_id,
        item.representante_id,
        item.rota_id,
        item.updated_at,
        item.idUnico,
        item.generico,
        item.tabela_preco_id,
      ],
      (txObj, resultSet) => {
        resolve(`Cliente(s) foram criado(s)`);
      },
      (txObj, error) => {
        reject(error);
      }
    );
  });
};
const alterarClienteExisteBdCliId = async (item, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update clientes set nome=?, apelido=?, logradouro=?, numero=?, cep=?, bairro=?, complemento=?, cidade=?, uf=?, email=?, fone1=?, fone2=?, contato=?, cnpj_cpf=?, ie_rg=?, dias_semana_venda=?, generico=?, tabela_preco_id=? where id_cliente_servidor = ?",
      [
        item.nome,
        item.apelido,
        item.logradouro,
        item.numero,
        item.cep,
        item.bairro,
        item.complemento,
        item.cidade,
        item.uf,
        item.email,
        item.fone1,
        item.fone2,
        item.contato,
        item.cnpj_cpf,
        item.ie_rg,
        item.dias_semana_venda,
        item.generico,
        item.tabela_preco_id,
        item.id,
      ],
      (txObj, resultSet) => {
        resolve("Cliente(s) foram criado(s)");
      },
      (txObj, error) => {
        reject("Erro, tente novamente");
      }
    );
  });
};

export const removeClienteId = (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from clientes where id = (?)",
        [item.id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            resolve(`Usuário ${item.nome} foi removido com sucesso`);
          }
          reject("Id não encontrado");
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

export const limparDados = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from clientes",
        null,
        (txObj, resultSet) => {
          resolve("A base de dados de clientes foi removida");
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

export const totalClientesPendentes = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select COUNT(*) as qtdPendentes from clientes where id_cliente_servidor < 1",
        null,
        (txObj, relsutSet) => {
          resolve(relsutSet.rows._array[0]);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};
