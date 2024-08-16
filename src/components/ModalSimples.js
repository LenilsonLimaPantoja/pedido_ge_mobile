import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const ModalSimples = ({
  children,
  visivel,
  onPress,
  texto,
  imagem,
  btnFechar,
}) => {
  return (
    <Modal
      visible={visivel}
      onRequestClose={onPress}
      transparent={true}
      animationType="slide"
    >
      <SafeAreaView style={styles.areaModal}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "black", opacity: 0.5 }}
          activeOpacity={0}
          onPress={onPress}
        ></TouchableOpacity>
        <View style={styles.containerModal}>
          {/* <View style={styles.containerImg}>
                        <Image style={styles.image} source={imagem} resizeMode='contain' />
                    </View> */}
          <Text style={styles.textModal}>{texto}</Text>
          {btnFechar && (
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.textButton}>entendi</Text>
            </TouchableOpacity>
          )}
          {children}
        </View>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    width: "100%",
    bottom: -1,
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
export default ModalSimples;
