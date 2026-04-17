import React from "react";
import { render } from "@testing-library/react-native";

type HubStoreState = {
  hubs: Array<{
    hash: string;
    name: string;
    status: string;
  }>;
  selectedHubHash: string | null;
};

type MockScreenOptions = {
  headerLeft?: unknown;
};

type MockScreenProps = {
  name: string;
  options?: MockScreenOptions;
};

type MockNavigatorProps = {
  screenOptions: MockScreenOptions;
  children: React.ReactNode;
};

type MockStack = {
  Navigator: (props: MockNavigatorProps) => React.ReactElement;
  Screen: (props: MockScreenProps) => React.ReactElement | null;
};

const mockScreenOptions = jest.fn<MockScreenOptions, [MockScreenOptions]>();
const mockScreens = jest.fn<MockScreenProps, [MockScreenProps]>();

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => {
    const stack: MockStack = {
      Navigator: ({ screenOptions, children }: MockNavigatorProps) => {
        mockScreenOptions(screenOptions);
        return <>{children}</>;
      },
      Screen: (props: MockScreenProps) => {
        mockScreens({ name: props.name, options: props.options });
        return null;
      },
    };

    return stack;
  },
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
  useHubStore: (selector: (state: HubStoreState) => unknown) =>
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
  });

  it("no muestra hamburguesa en HubList y la mantiene en el resto", () => {
    render(<MainStack />);

    const globalScreenOptions = mockScreenOptions.mock.calls[0]?.[0];
    const hubList = mockScreens.mock.calls.find(([props]) => props.name === "HubList")?.[0];
    const hubHome = mockScreens.mock.calls.find(([props]) => props.name === "HubHome")?.[0];

    expect(globalScreenOptions?.headerLeft).toBeDefined();
    expect(hubList?.options?.headerLeft).toBeUndefined();
    expect(hubHome?.options?.headerLeft).toBeUndefined();
  });
});
