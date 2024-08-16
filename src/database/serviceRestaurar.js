import db from "./open";

export const restaurarClientes = async (clientes) => {
    return new Promise((resolve, reject) => {
        let qtdError = 0;
        for (let i = 0; i < clientes.length; i++) {
            db.transaction((tx) => {
                tx.executeSql(
                    `insert into clientes (id, id_cliente_servidor, nome, cnpj_cpf, ie_rg, apelido, email, cep, cidade, uf, logradouro, bairro, numero, latitude, longitude, sexo, status, codigo, clientes_id, complemento, conta, created_at, data_nascimento, dias_semana_venda, estabelecimento_id, fone1, fone2, forma_pagto_descricao, forma_pagto_id, representante_id, rota_id, updated_at, generico, idUnico) 
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        clientes[i]?.id,
                        clientes[i]?.id_cliente_servidor,
                        clientes[i]?.nome,
                        clientes[i]?.cnpj_cpf,
                        clientes[i]?.ie_rg,
                        clientes[i]?.apelido,
                        clientes[i]?.email,
                        clientes[i]?.cep,
                        clientes[i]?.cidade,
                        clientes[i]?.uf,
                        clientes[i]?.logradouro,
                        clientes[i]?.bairro,
                        clientes[i]?.numero,
                        clientes[i]?.latitude,
                        clientes[i]?.longitude,
                        clientes[i]?.sexo,
                        clientes[i]?.status,
                        clientes[i]?.codigo,
                        clientes[i]?.clientes_id,
                        clientes[i]?.complemento,
                        clientes[i]?.conta,
                        clientes[i]?.created_at,
                        clientes[i]?.data_nascimento,
                        clientes[i]?.dias_semana_venda,
                        clientes[i]?.estabelecimento_id,
                        clientes[i]?.fone1,
                        clientes[i]?.fone2,
                        clientes[i]?.forma_pagto_descricao,
                        clientes[i]?.forma_pagto_id,
                        clientes[i]?.representante_id,
                        clientes[i]?.rota_id,
                        clientes[i]?.updated_at,
                        clientes[i]?.generico,
                        clientes[i]?.idUnico
                    ],
                    (txObj, resultSet) => {
                        console.log('Gravou cliente: ' + i);
                        if (clientes.length - 1 === i) {
                            resolve('Clientes cadastrados com sucesso')
                        }
                    },
                    (txObj, resultError) => {
                        qtdError++;
                        reject('Erro na importação dos clientes');
                        console.log('Erro cliente: ' + i);
                        console.log(resultError);
                    }

                )
            })
        }
    });
}

export const restaurarProdutos = async (produtos) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < produtos.length; i++) {
            db.transaction((tx) => {
                tx.executeSql(
                    `insert into produtos (id, codigo, descricao, estabelecimento_id, estoque, id_produto_servidor, preco, status, tipo, unidade,url_imagem) 
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        produtos[i]?.id,
                        produtos[i]?.codigo,
                        produtos[i]?.descricao,
                        produtos[i]?.estabelecimento_id,
                        produtos[i]?.estoque,
                        produtos[i]?.id_produto_servidor,
                        produtos[i]?.preco,
                        produtos[i]?.status,
                        produtos[i]?.tipo,
                        produtos[i]?.unidade,
                        produtos[i]?.url_imagem

                    ],
                    (txObj, resultSet) => {
                        console.log('Gravou produto: ' + i);
                        if (produtos.length - 1 === i) {
                            resolve('Produtos cadastrados com sucesso')
                        }
                    },
                    (txObj, resultError) => {
                        reject('Erro na importação dos produto');
                        console.log('Erro produto: ' + i);
                        console.log(resultError);
                    }

                )
            })
        }
    });
}

export const restaurarFormasPagamento = async (formaPagamento) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < formaPagamento.length; i++) {
            db.transaction((tx) => {
                tx.executeSql(
                    `insert into formaPagamento (id, codigo, descricao, estabelecimento_id, id_pagamento_servidor, parcelamento) 
                        values(?, ?, ?, ?, ?, ?)`,
                    [
                        formaPagamento[i]?.id,
                        formaPagamento[i]?.codigo,
                        formaPagamento[i]?.descricao,
                        formaPagamento[i]?.estabelecimento_id,
                        formaPagamento[i]?.id_pagamento_servidor,
                        formaPagamento[i]?.parcelamento

                    ],
                    (txObj, resultSet) => {
                        console.log('Gravou forma pagamento: ' + i);
                        if (formaPagamento.length - 1 === i) {
                            resolve('Forma de pagamento cadastrada com sucesso')
                        }
                    },
                    (txObj, resultError) => {
                        reject('Erro na importação das formas pagamento');
                        console.log('Erro forma pagamento: ' + i);
                        console.log(resultError);
                    }

                )
            })
        }
    });
}

export const restaurarMotivoVisita = async (motivoVisitas) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < motivoVisitas.length; i++) {
            db.transaction((tx) => {
                tx.executeSql(
                    `insert into motivoVisitas (id, codigo, descricao) 
                        values(?, ?, ?)`,
                    [
                        motivoVisitas[i]?.id, motivoVisitas[i]?.codigo, motivoVisitas[i]?.descricao
                    ],
                    (txObj, resultSet) => {
                        console.log('Gravou motivo visitas: ' + i);
                        if (motivoVisitas.length - 1 === i) {
                            resolve('Motivo visitas cadastrada com sucesso')
                        }
                    },
                    (txObj, resultError) => {
                        reject('Erro na importação dos motivo visitas');
                        console.log('Erro motivo visitas: ' + i);
                        console.log(resultError);
                    }

                )
            })
        }
    });
}

export const restaurarPedidos = async (pedidos) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < pedidos.length; i++) {
            db.transaction((tx) => {
                tx.executeSql(
                    `insert into pedidos (id, data, liquido, numPedido, obs, motivo, qt_parcelas, situacao, total, total_desconto, vendedor_id, cliente_id, forma_pagamento_id, idUnico, nome_cliente) 
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        pedidos[i]?.id, pedidos[i]?.data, pedidos[i]?.liquido, pedidos[i]?.numPedido, pedidos[i]?.obs, pedidos[i]?.motivo, pedidos[i]?.qt_parcelas, pedidos[i]?.situacao, pedidos[i]?.total, pedidos[i]?.total_desconto, pedidos[i]?.vendedor_id, pedidos[i]?.cliente_id, pedidos[i]?.forma_pagamento_id, pedidos[i]?.idUnico, pedidos[i]?.nome_cliente
                    ],
                    (txObj, resultSet) => {
                        console.log('Gravou pedido: ' + i);
                        if (pedidos.length - 1 === i) {
                            resolve('Pedido cadastrado com sucesso')
                        }
                    },
                    (txObj, resultError) => {
                        reject('Erro na importação dos pedido');
                        console.log('Erro pedido: ' + i);
                        console.log(resultError);
                    }

                )
            })
        }
    });
}

export const restaurarItensPedidos = async (itemsPedidos) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < itemsPedidos.length; i++) {
            db.transaction((tx) => {
                tx.executeSql(
                    `insert into itemsPedidos (id, desconto, descricao, preco, qt, unidade, id_unico, pedido_id, produto_id) 
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        itemsPedidos[i]?.id, itemsPedidos[i]?.desconto, itemsPedidos[i]?.descricao, itemsPedidos[i]?.preco, itemsPedidos[i]?.qt, itemsPedidos[i]?.unidade, itemsPedidos[i]?.id_unico, itemsPedidos[i]?.pedido_id, itemsPedidos[i]?.produto_id
                    ],
                    (txObj, resultSet) => {
                        console.log('Gravou pedido: ' + i);
                        if (itemsPedidos.length - 1 === i) {
                            resolve('Items pedidos cadastrado com sucesso')
                        }
                    },
                    (txObj, resultError) => {
                        reject('Erro na importação dos items pedidos');
                        console.log('Erro items pedidos: ' + i);
                        console.log(resultError);
                    }

                )
            })
        }
    });
}