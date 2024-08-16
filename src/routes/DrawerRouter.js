import { createDrawerNavigator } from "@react-navigation/drawer";
import Menu from "../components/Menu";
import Home from "../pages/home/Home";
const Drawer = createDrawerNavigator();
const DrawerRouter = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Menu {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};

export default DrawerRouter;
