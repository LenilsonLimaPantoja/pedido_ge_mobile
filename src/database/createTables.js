import db from "./open";

export const createTablesClientes = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists clientes (
            id integer primary key autoincrement,
            id_cliente_servidor integer,
            nome text,
            cnpj_cpf text,
            ie_rg,
            apelido text,
            email,
            cep,
            cidade,
            uf,
            logradouro,
            bairro,
            numero,
            latitude,
            longitude,
            sexo,
            status,
            codigo,
            clientes_id,
            complemento,
            conta,
            created_at,
            data_nascimento,
            dias_semana_venda,
            estabelecimento_id,
            fone1,
            fone2,
            forma_pagto_descricao,
            forma_pagto_id,
            representante_id,
            rota_id,
            updated_at,
            generico integer,
            idUnico
          )`);
  });
};

export const alterarTableClientes = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE clientes
      ADD COLUMN tabela_preco_id`
    )
  })
}

export const alterarTableClientes2 = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE clientes
      ADD COLUMN contato text`
    )
  })
}

export const createTablesTabelaPrecos = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists tabela_precos (
            id integer primary key autoincrement,
            id_tabela_servidor integer,
            desc_max text,
            descricao text,
            estabelecimento_id,
            obs text,
            tabela_custo
          )`);
  });
};

export const createTablesItensTabelaPrecos = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists itens_tabela_precos (
            id integer primary key autoincrement,
            id_item_tabela_servidor,
            descricao text,
            tabela_preco_id,
            codpro,
            preco,
            custo,
            preco_ant,
            custo_ant
          )`);
  });
};

export const createTableFormaPgto = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists formaPagamento (
            id integer primary key autoincrement,
            codigo,
            descricao,
            estabelecimento_id,
            id_pagamento_servidor,
            parcelamento
          )`);
  });
};

export const createTablesMotivoVisitas = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists motivoVisitas (
            id integer primary key autoincrement,
            codigo integer,
            descricao text
          )`);
  });
};

export const createTablesPedidos = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists pedidos (
            id integer primary key autoincrement, 
            data,
            liquido,
            numPedido integer,
            obs,
            motivo,
            qt_parcelas integer,
            situacao integer,
            total,
            total_desconto,
            vendedor_id integer,
            cliente_id integer,
            forma_pagamento_id integer,
            idUnico text,
            nome_cliente integer,
            FOREIGN KEY(cliente_id) REFERENCES clientes(id),
            FOREIGN KEY(forma_pagamento_id) REFERENCES formaPagamento(id)
          )`);
  });
};

export const alterTablePedidos = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE pedidos
      ADD COLUMN num_pedido_cli text`
    )
  })
}

export const createTablesItemsPedidos = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists itemsPedidos (
            id integer primary key autoincrement, 
            desconto,
            descricao,
            preco,
            qt integer,
            unidade,
            id_unico text,
            pedido_id integer,
            produto_id integer,
            FOREIGN KEY(produto_id) REFERENCES produtos(id),
            FOREIGN KEY(pedido_id) REFERENCES pedidos(id)
          )`);
  });
};

export const alterTableItemsPedidos = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE itemsPedidos
      ADD COLUMN descricao_complementar text`
    )
  })
}

export const createTablesProdutos = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists produtos (
          id integer primary key autoincrement, 
          codigo, 
          descricao, 
          estabelecimento_id, 
          estoque, 
          id_produto_servidor, 
          preco, 
          status, 
          tipo, 
          unidade,
          url_imagem
      )`);
  });
};

export const createTablesVisitas = () => {
  db.transaction((tx) => {
    tx.executeSql(`create table if not exists visitas (
             id integer primary key autoincrement,
             status integer,
             cliente_id integer,
             representante_id integer,
             data_hora,
             idUnico text,
             obs,
             lat,
             long,
             FOREIGN KEY(cliente_id) REFERENCES clientes(id)
          )`);
  });
};
