import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrossoverNavigation from "../CrossoverNavigation";

describe("CrossoverNavigation", () => {
  test("offers every crossover operator plus an all-methods option", () => {
    render(
      <CrossoverNavigation
        activeCrossover="exponential"
        onCrossoverChange={jest.fn()}
      />
    );

    for (const label of [
      "All Methods",
      "Exponential",
      "Binomial",
      "One-Point",
      "Two-Point",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  test("highlights the active operator", () => {
    render(
      <CrossoverNavigation
        activeCrossover="binomial"
        onCrossoverChange={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Binomial" }).className
    ).toContain("bg-accent-600");
    expect(
      screen.getByRole("button", { name: "Exponential" }).className
    ).not.toContain("bg-accent-600");
  });

  test("reports the selected operator by its data key", () => {
    const onCrossoverChange = jest.fn();
    render(
      <CrossoverNavigation
        activeCrossover="exponential"
        onCrossoverChange={onCrossoverChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "One-Point" }));

    // The key must match fitnessData's, not the display label.
    expect(onCrossoverChange).toHaveBeenCalledWith("onepoint");
  });
});
