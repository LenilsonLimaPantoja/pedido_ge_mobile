import db from "./open";
const date = new Date();
export const readPedidos = async (
  pesquisar,
  anoFiltro,
  mesFiltro,
  diaFiltro,
  filtroPorSitucao
) => {
  return new Promise((resolve, reject) => {
    const ultimoDia = new Date(anoFiltro, mesFiltro, 0);
    db.transaction((tx) => {
      tx.executeSql(
        `select pedidos.id as id_pedido, pedidos.*, clientes.*, formaPagamento.descricao as forma_pagto_descricao, formaPagamento.* from pedidos
                           left join clientes on pedidos.cliente_id = clientes.id left join formaPagamento on pedidos.forma_pagamento_id = formaPagamento.id_pagamento_servidor
                           where (clientes.nome like ?) and data >= ? and data <= ? and pedidos.numPedido ${filtroPorSitucao == 0 ? "=" : ">="
        } ?
            limit 30`,
        [
          `%${pesquisar}%`,
          `${anoFiltro}-${mesFiltro}-${diaFiltro}`,
          `${anoFiltro}-${mesFiltro}-${String(ultimoDia.getDate()).padStart(2, "0")}`,
          filtroPorSitucao,
        ],
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

export const readPedidosRelatorio = async (dataInicial, dataFinal,) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select pedidos.id as id_pedido, pedidos.*, clientes.*, formaPagamento.descricao as forma_pagto_descricao, formaPagamento.* from pedidos
                           left join clientes on pedidos.cliente_id = clientes.id left join formaPagamento on pedidos.forma_pagamento_id = formaPagamento.id_pagamento_servidor
                           where data >= ? and data <= ? and pedidos.situacao = 1`,
        [
          `${dataInicial}`,
          `${dataFinal}`,
        ],
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

export const readPedidosId = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select formaPagamento.id as id_forma_pgto, pedidos.*, clientes.nome, clientes.tabela_preco_id, clientes.apelido, clientes.generico, formaPagamento.descricao, formaPagamento.codigo from pedidos
                           left join clientes on pedidos.cliente_id = clientes.id left join formaPagamento on pedidos.forma_pagamento_id = formaPagamento.id where pedidos.id = ?`,
        [id],
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

export const readPedidosIdCliente = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select COUNT(*) as qtdPedidosCliente from pedidos where cliente_id = ?",
        [id],
        (txObj, resultSet) => {
          resolve(resultSet.rows._array[0].qtdPedidosCliente);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const readPedidosSincronizar = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select pedidos.idUnico as idUnico, pedidos.nome_cliente as nome_cliente, pedidos.num_pedido_cli as num_pedido_cli, pedidos.id as id, pedidos.cliente_id as cliente_id, pedidos.data as data, pedidos.forma_pagamento_id as forma_pagamento_id, pedidos.liquido as liquido, pedidos.obs as obs,
             pedidos.qt_parcelas as qt_parcelas, pedidos.total as total, pedidos.total_desconto as total_desconto, pedidos.vendedor_id as vendedor_id from pedidos
                           left join formaPagamento on pedidos.forma_pagamento_id = formaPagamento.id where pedidos.numPedido < 1 and pedidos.situacao = 1`,
        null,
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

export const alterarPedidoSinc = async (item) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update pedidos set numPedido=?, motivo=? where idUnico=?",
      [item.numPedido, item.motivo, item.idUnico],
      (txObj, resultSet) => {
        console.log(`O pedido ${item.idUnico} foi alterado com sucesso`);
      },
      (txObj, error) => {
        console.log("Erro, tente novamente");
      }
    );
  });
};

export const readItensPedidos = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select produtos.*, itemsPedidos.* from itemsPedidos 
                           left join produtos on itemsPedidos.produto_id = produtos.id
                           where itemsPedidos.pedido_id = ?`,
        [id],
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

export const createPedido = async (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into pedidos (data, forma_pagamento_id, liquido, numPedido, obs, motivo, qt_parcelas, situacao, total, total_desconto, vendedor_id, cliente_id, idUnico, nome_cliente, num_pedido_cli) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.data,
          item.forma_pagamento_id,
          item.liquido,
          item.numPedido,
          item.obs,
          "",
          item.qt_parcelas,
          item.situacao,
          item.total,
          item.total_desconto,
          item.vendedor_id,
          item.cliente_id,
          item.idUnico,
          item.nome_cliente,
          item?.num_pedido_cli
        ],
        (txObj, resultSet) => {
          item?.produtos?.map((item) => {
            createItems(item, resultSet.insertId, resolve, reject);
          });
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

const createItems = async (item, pedido_id, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into itemsPedidos (desconto, descricao, preco, qt, unidade, pedido_id, produto_id, id_unico, descricao_complementar) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        item.desconto,
        item.descricao,
        item.preco,
        item.qt,
        item.unidade,
        pedido_id,
        item.produto_id,
        item.id_unico,
        item.descricao_complementar
      ],
      (txObj, resultSet) => {
        resolve(`O pedido ${pedido_id} foi criado`);
      },
      (txObj, error) => {
        reject("Erro, tente novamente");
      }
    );
  });
};

export const cancelarPedidoId = async (id_pedido) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update pedidos set situacao=? where id =?",
        [2, id_pedido],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            resolve(`O pedido ${id_pedido} foi cancelado com sucesso`);
          }
        },
        (txObj, error) => {
          console.log(error);
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

export const alterarPedidoId = async (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update pedidos set data=?, forma_pagamento_id=?, liquido=?, numPedido=?, obs=?, qt_parcelas=?, situacao=?, total=?, total_desconto=?, vendedor_id=?, cliente_id=?, nome_cliente=?, num_pedido_cli=? where id =?",
        [
          item.data,
          item.forma_pagamento_id,
          item.liquido,
          item.numPedido,
          item.obs,
          item.qt_parcelas,
          item.situacao,
          item.total,
          item.total_desconto,
          item.vendedor_id,
          item.cliente_id,
          item.nome_cliente,
          item.num_pedido_cli,
          item.id,
        ],
        (txObj, resultSet) => {
          alterarItensPedido(item);
          if (resultSet.rowsAffected > 0) {
            resolve(`O pedido ${item.id} foi alterado com sucesso`);
          }
        },
        (txObj, error) => {
          console.log(error);
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

const alterarItensPedido = async (pedido) => {
  if (pedido?.id) {
    db.transaction((tx) => {
      tx.executeSql(`delete from itemsPedidos where pedido_id = ${pedido?.id}`);
    });
    adicionarItemPedido(pedido.produtos, pedido?.id);
  }
};

const adicionarItemPedido = async (verificaAddItemPedido, pedido_id) => {
  verificaAddItemPedido.map((item) => {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into itemsPedidos (desconto, descricao, preco, qt, unidade, pedido_id, produto_id, id_unico, descricao_complementar) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item.desconto,
          item.descricao,
          item.preco,
          item.qt,
          item.unidade,
          pedido_id,
          item.produto_id,
          item.id_unico,
          item.descricao_complementar
        ],
        (txObj, resultSet) => {
          console.log(`O pedido ${pedido_id} foi criado`);
        },
        (txObj, error) => {
          console.log("Erro, tente novamente");
        }
      );
    });
  });
};

const removerItemPedido = (verificaDeleteItemPedido) => {
  verificaDeleteItemPedido?.map((item) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from itemsPedidos where id = ?",
        [item.id],
        (txObj, resultSet) => {
          console.log(`Item ${item.id} foi removido`);
        },
        (txObj, error) => {
          console.log(error);
        }
      );
    });
  });
};

export const deletePedidoId = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from pedidos where id=?",
        [id],
        (txObj, resultSet) => {
          deleteItemsPedido(id, resolve, reject);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

const deleteItemsPedido = async (pedido_id, resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from itemsPedidos where pedido_id=?",
      [pedido_id],
      (txObj, resultSet) => {
        resolve(` O pedido ${pedido_id} excluido com sucesso`);
      },
      (txObj, error) => {
        reject("Erro, tente novamente");
      }
    );
  });
};

export const limparPedidos = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from pedidos",
        null,
        (txObj, resultSet) => {
          limparItemsPedidos(resolve, reject);
        },
        (txObj, error) => {
          reject("Erro, tente novamente");
        }
      );
    });
  });
};

const limparItemsPedidos = async (resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from itemsPedidos",
      null,
      (txObj, resultSet) => {
        resolve("A base de dados de pedidos foi removida");
      },
      (txObj, resultSet) => {
        reject("Erro, tente novamente");
      }
    );
  });
};

export const valorPedidosPendentes = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select SUM(total - total_desconto) as totalPendente, COUNT(*) as qtdPendente from pedidos where numPedido < 1",
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

export const valorPedidosSicronizados = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select SUM(total - total_desconto) as totalSincronizado, COUNT(*) as qtdSincronizado from pedidos where numPedido > 0",
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
