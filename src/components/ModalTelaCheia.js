import React from "react";
import { Modal, SafeAreaView, StyleSheet, View } from "react-native";
import AppbarModal from "./AppbarModal";
const ModalTelaCheia = ({
  children,
  visivel,
  onPress,
  valor,
  setValor,
  rota,
  bottonRight,
}) => {
  return (
    <Modal
      animationType="fade"
      visible={visivel}
      onRequestClose={onPress}
      transparent={true}
    >
      <SafeAreaView style={{backgroundColor: '#174c4f', flexGrow: 1}}>
        <AppbarModal
          bottonRight={bottonRight}
          funcFechar={onPress}
          rota={rota}
          valor={valor}
          setValor={setValor}
        />
        <SafeAreaView style={styles.areaModal}>
          <View style={styles.containerModal}>{children}</View>
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  areaModal: {
    flex: 1,
  },
  containerModal: {
    padding: 10,
    backgroundColor: "#174c4f",
    flex: 1,
    width: "100%",
  },
  containerImg: {
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  textModal: {
    margin: 10,
    textAlign: "center",
    fontSize: 15,
    color: "#174c4f",
    lineHeight: 25,
  },
  button: {
    backgroundColor: "#6464f8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 40,
    width: "100%",
    marginBottom: 10,
  },
  textButton: {
    color: "#fff",
    fontSize: 15,
  },
});
export default ModalTelaCheia;
