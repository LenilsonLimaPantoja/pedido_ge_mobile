import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
const Loading = ({ texto }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color="#fff" />
      <Text style={{ color: "#fff" }}>{texto}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#174c4f",
  },
});

export default Loading;
