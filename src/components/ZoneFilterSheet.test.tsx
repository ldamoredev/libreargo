import React from "react";
import { Modal } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { ZoneFilterSheet } from "./ZoneFilterSheet";

let mockInsets = { top: 0, right: 0, bottom: 0, left: 0 };

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => mockInsets,
}));

describe("ZoneFilterSheet", () => {
  beforeEach(() => {
    mockInsets = { top: 0, right: 0, bottom: 0, left: 0 };
  });

  function renderSheet() {
    return render(
      <ZoneFilterSheet
        visible
        availableZones={["Zona A", "Zona B"]}
        selectedZones={["Zona B"]}
        onChange={jest.fn()}
        onClose={jest.fn()}
      />
    );
  }

  it("keeps the list clipped above the footer so rows cannot bleed out the bottom", () => {
    renderSheet();

    expect(screen.getByTestId("zone-filter-sheet")).toHaveStyle({
      maxHeight: "82%",
      minHeight: 360,
      overflow: "hidden",
    });
    expect(screen.getByTestId("zone-filter-list")).toHaveStyle({
      flex: 1,
    });
    expect(screen.getByTestId("zone-filter-footer")).toHaveStyle({
      backgroundColor: "#F2EEE4",
    });
  });

  it("lets the Android modal cover edge-to-edge system bars", () => {
    const { UNSAFE_getByType } = renderSheet();
    const modal = UNSAFE_getByType(Modal);

    expect(modal.props.statusBarTranslucent).toBe(true);
    expect(modal.props.navigationBarTranslucent).toBe(true);
  });

  it("keeps footer actions above the Android navigation inset", () => {
    mockInsets = { top: 0, right: 0, bottom: 28, left: 0 };

    renderSheet();

    expect(screen.getByTestId("zone-filter-footer")).toHaveStyle({
      paddingBottom: 48,
    });
  });
});
