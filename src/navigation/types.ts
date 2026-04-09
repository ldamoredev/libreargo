export type RootStackParamList = {
  HubList: undefined;
  HubHome: { hubHash: string; filter?: "sensores" | "actuadores" };
  Alarms: { hubHash: string };
  SensorDetail: { hubHash: string; sensorType: string };
  ActuatorDetail: { hubHash: string; relayAddress: number };
  Crops: undefined;
  Recommendations: undefined;
};
