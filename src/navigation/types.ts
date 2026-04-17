export type RootStackParamList = {
  HubList: undefined;
  HubHome: { hubHash: string; filter?: "sensores" | "actuadores" };
  Alarms: { hubHash: string };
  SensorDetail: { hubHash: string; sensorId: string };
  ActuatorDetail: { hubHash: string; relayAddress: number };
  Crops: undefined;
  Recommendations: undefined;
};
