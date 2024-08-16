import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
export default function DataFiltro({
  setAnoFiltro,
  setMesFiltro,
  setDiaFiltro,
  anoFiltro,
  mesFiltro,
  diaFiltro,
}) {
  const [show, setShow] = useState(false);
  const handleData = (event, selectedDate) => {
    if (event.type == "dismissed") {
      return setShow(false);
    }
    setShow(false);
    const currentDate = selectedDate;
    setAnoFiltro(currentDate.getFullYear());
    setMesFiltro(String(currentDate.getMonth() + 1).padStart(2, "0"));
    setDiaFiltro(String(currentDate.getDate()).padStart(2, "0"));
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Ionicons
          style={{ color: "#fff", fontSize: 25, marginLeft: 15 }}
          name="calendar"
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={
            new Date(`${anoFiltro}-${mesFiltro}-${diaFiltro}T17:51:56.711Z`)
          }
          mode="date"
          onChange={handleData}
          positiveButtonLabel="confirmar"
          minimumDate={new Date(2022, 0, 1)}
        />
      )}
    </>
  );
}
