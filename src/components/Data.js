import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Button from "./Button";
export default function Data({ setValor, valor, color, textColor }) {
  const [datePicker, setDatePicker] = useState(new Date());
  const [show, setShow] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setValor(
        `${datePicker.getFullYear()}-${String(
          datePicker.getMonth() + 1
        ).padStart(2, "0")}-${String(datePicker.getDate()).padStart(2, "0")}`
      );
    }, [])
  );
  const handleData = (event, selectedDate) => {
    if (event.type == "dismissed") {
      return setShow(false);
    }
    const currentDate = selectedDate;
    setShow(false);
    setDatePicker(currentDate);
    setValor(
      `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
    );
  };

  return (
    <>
      <Button
        left
        texto={`${valor?.split("-").reverse().join("/")}`}
        funcao={() => setShow(true)}
        color={color}
        textColor={textColor}
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={datePicker}
          mode="date"
          onChange={handleData}
          positiveButtonLabel="confirmar"
        />
      )}
    </>
  );
}
