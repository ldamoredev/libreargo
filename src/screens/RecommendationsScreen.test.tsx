import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { RecommendationsScreen } from "./RecommendationsScreen";
import { getRecommendations } from "../services/hubDataService";

jest.mock("../services/hubDataService", () => ({
  getRecommendations: jest.fn(),
}));

describe("RecommendationsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getRecommendations as jest.Mock).mockResolvedValue([]);
  });

  it("mantiene el titulo principal en una sola linea", async () => {
    render(<RecommendationsScreen />);

    await waitFor(() => {
      const title = screen.getByText("Recomendaciones");
      expect(title.props.numberOfLines).toBe(1);
      expect(title.props.adjustsFontSizeToFit).toBe(true);
    });
  });
});
