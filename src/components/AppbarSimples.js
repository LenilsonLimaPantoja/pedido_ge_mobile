import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AppbarSimples = ({ rota }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.containerBtGoBack}>
        <TouchableOpacity>
          <Ionicons
            onPress={() => navigation.goBack()}
            style={styles.icones}
            name="arrow-back"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            marginLeft: 10,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {rota}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#174c4f",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    padding: 20,
  },
  containerBtGoBack: {
    flexDirection: "row",
    alignItems: "center",
  },
  icones: {
    fontSize: 25,
    color: "#fff",
  },
});

export default AppbarSimples;
