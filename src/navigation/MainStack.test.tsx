import React from "react";
import { render } from "@testing-library/react-native";

let mockCurrentScreenOptions: any;
const mockScreenOptionsSpy = jest.fn();
const mockScreenSpy = jest.fn();

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ screenOptions, children }: any) => {
      mockCurrentScreenOptions = screenOptions;
      mockScreenOptionsSpy(screenOptions);
      return <>{children}</>;
    },
    Screen: (props: any) => {
      mockScreenSpy({
        ...props,
        options: {
          ...mockCurrentScreenOptions,
          ...props.options,
        },
      });
      return null;
    },
  }),
}));

jest.mock("../components", () => ({
  HamburgerButton: () => null,
  MenuDrawer: () => null,
}));

jest.mock("../screens", () => ({
  HubListScreen: () => null,
  HubHomeScreen: () => null,
  AlarmsScreen: () => null,
  SensorDetailScreen: () => null,
  ActuatorDetailScreen: () => null,
  CropsScreen: () => null,
  RecommendationsScreen: () => null,
}));

jest.mock("../stores/hubStore", () => ({
  useHubStore: (selector: (state: any) => any) =>
    selector({
      hubs: [
        {
          hash: "hub-1",
          name: "Hub Demo",
          status: "conectado",
        },
      ],
      selectedHubHash: "hub-1",
    }),
}));

jest.mock("../navigation/navigationRef", () => ({
  navigate: jest.fn(),
}));

import { MainStack } from "./MainStack";

describe("MainStack", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentScreenOptions = undefined;
  });

  it("no muestra hamburguesa en HubList y la mantiene en el resto", () => {
    render(<MainStack />);

    const hubList = mockScreenSpy.mock.calls.find(
      ([props]) => props.name === "HubList"
    )?.[0];
    const hubHome = mockScreenSpy.mock.calls.find(
      ([props]) => props.name === "HubHome"
    )?.[0];

    expect(hubList.options.headerLeft).toBeUndefined();
    expect(hubHome.options.headerLeft).toBeDefined();
    expect(mockScreenOptionsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        headerLeft: expect.any(Function),
      })
    );
  });
});
