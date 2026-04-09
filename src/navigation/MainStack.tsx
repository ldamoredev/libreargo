import { useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "../constants";
import {
  HubListScreen,
  HubHomeScreen,
  AlarmsScreen,
  SensorDetailScreen,
  ActuatorDetailScreen,
  CropsScreen,
  RecommendationsScreen,
} from "../screens";
import { HamburgerButton, MenuDrawer } from "../components";
import { navigate } from "./navigationRef";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

type MenuKey =
  | "Inicio"
  | "Sensores"
  | "Actuadores"
  | "Alarmas"
  | "Cultivos"
  | "Recomendaciones";

export function MainStack() {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const hamburgerButton = useCallback(
    () => <HamburgerButton onPress={openMenu} />,
    [openMenu]
  );

  const handleMenuSelect = useCallback((key: string) => {
    const menuKey = key as MenuKey;
    switch (menuKey) {
      case "Inicio":
        navigate("HubList");
        break;
      case "Cultivos":
        navigate("Crops");
        break;
      case "Recomendaciones":
        navigate("Recommendations");
        break;
      case "Sensores":
      case "Actuadores":
      case "Alarmas":
        // Se conectarán con hub seleccionado en fases futuras
        navigate("HubList");
        break;
    }
  }, []);

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.surface,
          headerTitleStyle: { fontWeight: "bold" },
          headerLeft: hamburgerButton,
        }}
      >
        <Stack.Screen
          name="HubList"
          component={HubListScreen}
          options={{ title: "LibreAgro" }}
        />
        <Stack.Screen
          name="HubHome"
          component={HubHomeScreen}
          options={{ title: "Home del Hub" }}
        />
        <Stack.Screen
          name="Alarms"
          component={AlarmsScreen}
          options={{ title: "Alarmas" }}
        />
        <Stack.Screen
          name="SensorDetail"
          component={SensorDetailScreen}
          options={{ title: "Detalle Sensor" }}
        />
        <Stack.Screen
          name="ActuatorDetail"
          component={ActuatorDetailScreen}
          options={{ title: "Detalle Actuador" }}
        />
        <Stack.Screen
          name="Crops"
          component={CropsScreen}
          options={{ title: "Cultivos" }}
        />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={{ title: "Recomendaciones" }}
        />
      </Stack.Navigator>
      <MenuDrawer
        visible={menuVisible}
        onClose={closeMenu}
        onSelect={handleMenuSelect}
      />
    </>
  );
}
