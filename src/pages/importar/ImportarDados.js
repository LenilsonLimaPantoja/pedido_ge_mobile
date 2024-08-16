import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import backup from './backup.json';
import { restaurarClientes, restaurarFormasPagamento, restaurarItensPedidos, restaurarMotivoVisita, restaurarPedidos, restaurarProdutos } from "../../database/serviceRestaurar";
import Button from '../../components/Button.js';
import axios from "axios";
import { ContextGlobal } from "../../context/GlobalContext";
const ImportarDados = () => {
    const [clientes, setClientes] = useState([]);
    const [formaPagamento, setFormaPagamento] = useState([]);
    const [itemsPedidos, setItemsPedidos] = useState([]);
    const [motivoVisitas, setMotivoVisitas] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [visitas, setVisitas] = useState([]);
    const { tokenLocal } = useContext(ContextGlobal);
    useFocusEffect(useCallback(() => {
        const handleData = async () => {
            // const requestOptions = {
            //     headers: {
            //         'Content-Type': 'application/json', Authorization: tokenLocal
            //     }
            // };
            // await axios.get('https://gesuportelogico.com.br/api/manutencao/buscar_obj_cli', requestOptions)
            //     .then((response) => {
            //         console.log(response.data.dados);
            //     })
            //     .catch((error) => {
            //         console.log(error.response.data);
            //     });

            setClientes(backup.ddBD[0].clientes);
            setFormaPagamento(backup.ddBD[0].formaPagamento);
            setItemsPedidos(backup.ddBD[0].itemsPedidos);
            setMotivoVisitas(backup.ddBD[0].motivoVisitas);
            setPedidos(backup.ddBD[0].pedidos);
            setProdutos(backup.ddBD[0].produtos);
            setVisitas(backup.ddBD[0].visitas);
        }
        handleData();
    }, []));

    const handleClientes = () => {
        restaurarClientes(clientes)
            .then((response) => {
                console.log(response);
                Alert.alert('SUCESSO', response);
            })
            .catch((error) => {
                Alert.alert('ERRO', error);
                console.log(error);
            });
    }
    const handleProdutos = () => {
        restaurarProdutos(produtos)
            .then((response) => {
                console.log(response);
                Alert.alert('SUCESSO', response);
            })
            .catch((error) => {
                Alert.alert('ERRO', error);
                console.log(error);
            });
    }
    const handleFormasPagamento = () => {
        restaurarFormasPagamento(formaPagamento)
            .then((response) => {
                console.log(response);
                Alert.alert('SUCESSO', response);
            })
            .catch((error) => {
                Alert.alert('ERRO', error);
                console.log(error);
            });
    }
    const handleMotivoVisita = () => {
        restaurarMotivoVisita(motivoVisitas)
            .then((response) => {
                console.log(response);
                Alert.alert('SUCESSO', response);
            })
            .catch((error) => {
                Alert.alert('ERRO', error);
                console.log(error);
            });
    }
    const handlePedidos = () => {
        restaurarPedidos(pedidos)
            .then((response) => {
                console.log(response);
                Alert.alert('SUCESSO', response);
            })
            .catch((error) => {
                Alert.alert('ERRO', error);
                console.log(error);
            });
    }
    const handleItensPedidos = () => {
        restaurarItensPedidos(itemsPedidos)
            .then((response) => {
                console.log(response);
                Alert.alert('SUCESSO', response);
            })
            .catch((error) => {
                Alert.alert('ERRO', error);
                console.log(error);
            });
    }
    const handleVisitas = () => {
        console.log(visitas);
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Button texto="Restuarar Clientes" funcao={handleClientes} />
            <Button texto="Restuarar Produtos" funcao={handleProdutos} />
            <Button texto="Restuarar Formas de Pagamento" funcao={handleFormasPagamento} />
            <Button texto="Restuarar Motivo da Visita" funcao={handleMotivoVisita} />
            <Button texto="Restuarar Pedidos" funcao={handlePedidos} />
            <Button texto="Restuarar Itens Pedidos" funcao={handleItensPedidos} />
            <Button texto="Restuarar Visitas" funcao={handleVisitas} />
        </ScrollView>
    )
}
export default ImportarDados;
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#174c4f",
        flex: 1,
        justifyContent: "center",
        padding: 10,
    },
});