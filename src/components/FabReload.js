import React from "react";
import { FAB } from "react-native-paper";

const FabReload = ({ recarregar }) => {
  return (
    <FAB.Group
      icon="reload"
      actions={[]}
      backdropColor="transparent"
      fabStyle={{ backgroundColor: "#6464f8", borderRadius: 30 }}
      color="#fff"
      onStateChange={() => recarregar()}
    />
  );
};
export default FabReload;
