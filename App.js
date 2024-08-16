import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import Rotas from "./src/routes/Rotas";
import GlobalContext from "./src/context/GlobalContext";
import { StatusBar } from "react-native";
export default function App() {
  return (
    <NavigationContainer>
      <GlobalContext>
        <StatusBar backgroundColor="#174c4f" barStyle="light-content" />
        <Rotas />
      </GlobalContext>
    </NavigationContainer>
  );
}
