import axios from 'axios';
import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Loading from '../../../components/Loading';
import { ContextGlobal } from '../../../context/GlobalContext';
import ModalSimples from '../../../components/ModalSimples';
import AppbarSimples from '../../../components/AppbarSimples';
const AlterarSenha = () => {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [load, setLoad] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const { parametrosLocal } = useContext(ContextGlobal);

    const handleOpenModal = (texto) => {
        setTextoModal(texto);
        setOpenModal(!openModal);
    }
    const handleAlteSenha = () => {
        if (senha !== '' && senha.length > 3 && confirmarSenha !== '' && confirmarSenha.length > 3 && senha === confirmarSenha) {
            setLoad(true)
            const options = {
                headers: { 'Content-Type': 'application/json', 'Authorization': parametrosLocal[0]?.token }
            }
            const body = { "senha": senha, "id": parametrosLocal[0]?.representante.idRepresentante };
            axios.put('https://gesuportelogico.com.br/api/representantes/update', body, options)
                .then((response) => {
                    setLoad(false);
                    setSenha('');
                    setConfirmarSenha('');
                    handleOpenModal(response.data.retorno.mensagem)
                })
                .catch((erro) => {
                    setLoad(false);
                    handleOpenModal(erro.response.data.retorno.mensagem)
                    console.log(erro);
                })
        } else {
            if (senha != confirmarSenha) {
                return handleOpenModal('Os campos senha e confirmar senha devem ser iguais')
            }
            handleOpenModal('Preencha todos os campos')
        }
    }
    if (load) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <AppbarSimples rota='Alterar Senha' />
            <View style={styles.container}>
                <Input label='Representante' valor={parametrosLocal[0]?.representante.nome} icone='user' validar={!parametrosLocal[0]?.representante.nome} />
                <Input label='Nova senha' valor={senha} setValor={setSenha} securo={true} icone='user-secret' validar={senha == '' || senha != confirmarSenha} />
                <Input label='Confirmar senha' valor={confirmarSenha} setValor={setConfirmarSenha} securo={true} icone='user-secret' validar={confirmarSenha == '' || senha != confirmarSenha} />
                <Button funcao={handleAlteSenha} texto='gravar' />
                <ModalSimples visivel={openModal} imagem={null} onPress={handleOpenModal} texto={textoModal} btnFechar />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#174c4f',
        flex: 1,
        justifyContent: 'center',
        padding: 10
    }
})

export default AlterarSenha;
