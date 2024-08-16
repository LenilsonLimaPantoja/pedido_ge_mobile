import React, { useState } from "react";
import { FAB } from "react-native-paper";

const FabButtonsSemAdd = ({ limpar, recarregar, baixar }) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => {
    setOpen(!open);
  };
  var style = { display: !baixar ? "none" : "flex" };
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
      ]}
      backdropColor="transparent"
      fabStyle={{ backgroundColor: "#6464f8", borderRadius: 30 }}
      color="#fff"
      onStateChange={onOpenChange}
      variant="secondary"
    />
  );
};
export default FabButtonsSemAdd;
