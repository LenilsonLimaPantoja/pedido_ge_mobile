import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { FAB } from "react-native-paper";

const FabButtons = ({ limpar, recarregar, cadastrar, baixar, dataPedidos }) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => {
    setOpen(!open);
  };
  var style = { display: !baixar ? "none" : "flex" };
  var styleRelatorioPedidos = { display: !dataPedidos ? "none" : "flex" };

  return (
    <FAB.Group
      open={open}
      icon={open ? "close" : "menu"}
      actions={[
        {
          icon: "download",
          onPress: () => baixar(),
          color: "#174c4f",
          size: 0,
          style: style,
        },
        {
          icon: "file-pdf-box",
          onPress: () => dataPedidos(),
          color: "#174c4f",
          size: 0,
          style: styleRelatorioPedidos,
        },
        {
          icon: "delete",
          onPress: () => limpar(),
          color: "red",
          size: 25,
        },
        {
          icon: "reload",
          onPress: () => recarregar(),
          color: "#02dac3",
          size: 25,
        },
        {
          icon: "plus",
          color: "#02dac3",
          onPress: () => cadastrar(),
          size: 25,
        },
      ]}
      backdropColor="transparent"
      fabStyle={{ backgroundColor: "#6464f8", borderRadius: 30 }}
      color="#fff"
      onStateChange={onOpenChange}
    />
  );
};
export default FabButtons;
