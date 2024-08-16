import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import * as React from "react";
const Squeleton = ({ qtd }) => {
  var qtdSqueleton = [];
  for (var i = 0; i < qtd; i++) {
    qtdSqueleton = [...qtdSqueleton, { id: i }];
  }
  return (
    <>
      {qtdSqueleton.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.5}
          style={[
            styles.btPedido,
            { elevation: 4, backgroundColor: "#fff", borderColor: "#fff" },
          ]}
        >
          <View style={styles.containerBtPedido}>
            <View style={[styles.iconPedido, { backgroundColor: "#f2f2f2" }]}>
              <FontAwesome name="shopping-cart" size={25} color="#f2f2f2" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text
                style={[
                  styles.subtitlePedido,
                  {
                    backgroundColor: "#f2f2f2",
                    color: "#f2f2f2",
                    borderRadius: 5,
                  },
                ]}
              >
                1234567891011121314151617181920
              </Text>
              <Text
                style={[
                  styles.subtitlePedido,
                  {
                    backgroundColor: "#f2f2f2",
                    color: "#f2f2f2",
                    borderRadius: 5,
                    marginTop: 2,
                  },
                ]}
              >
                1234567891011121314151617181920
              </Text>
              <Text
                style={[
                  styles.subtitlePedido,
                  {
                    backgroundColor: "#f2f2f2",
                    color: "#f2f2f2",
                    borderRadius: 5,
                    marginTop: 2,
                  },
                ]}
              >
                1234567891011121314151617181920
              </Text>
              <Text
                style={[
                  styles.subtitlePedido,
                  {
                    backgroundColor: "#f2f2f2",
                    color: "#f2f2f2",
                    borderRadius: 5,
                    marginTop: 2,
                  },
                ]}
              >
                1234567891011121314151617181920
              </Text>
            </View>
          </View>
          <Text>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={20}
              color="#f2f2f2"
            />
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );
};
export default Squeleton;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  btPedido: {
    backgroundColor: "#fff3c8",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6464f8",
  },
  iconPedido: {
    backgroundColor: "#6464f8",
    padding: 10,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBtPedido: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitlePedido: {
    color: "gray",
  },
});
