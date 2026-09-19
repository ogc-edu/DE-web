import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrossoverNavigation from "../CrossoverNavigation";

const quick = (crossover = "exponential") => ({
  mode: "quick",
  crossovers: [crossover],
  selections: ["sts", "greedy"],
  mutations: [],
  topN: null,
});

describe("CrossoverNavigation", () => {
  test("offers every crossover operator plus the custom escape hatch", () => {
    render(
      <CrossoverNavigation
        selection={quick()}
        onSelectCrossover={jest.fn()}
        onOpenCustom={jest.fn()}
      />
    );

    for (const label of [
      "Exponential",
      "Binomial",
      "One-Point",
      "Two-Point",
      "Custom…",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  test("no longer offers the broken all-methods option", () => {
    render(
      <CrossoverNavigation
        selection={quick()}
        onSelectCrossover={jest.fn()}
        onOpenCustom={jest.fn()}
      />
    );

    expect(screen.queryByText("All Methods")).not.toBeInTheDocument();
  });

  test("highlights the active operator", () => {
    render(
      <CrossoverNavigation
        selection={quick("binomial")}
        onSelectCrossover={jest.fn()}
        onOpenCustom={jest.fn()}
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
    const onSelectCrossover = jest.fn();
    render(
      <CrossoverNavigation
        selection={quick()}
        onSelectCrossover={onSelectCrossover}
        onOpenCustom={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "One-Point" }));

    // The key must match fitnessData's, not the display label.
    expect(onSelectCrossover).toHaveBeenCalledWith("onepoint");
  });

  test("in custom mode no operator is active and the button summarises the series", () => {
    const selection = {
      mode: "custom",
      crossovers: ["exponential", "binomial", "onepoint"],
      selections: ["sts", "greedy"],
      mutations: [],
      topN: null,
    };

    render(
      <CrossoverNavigation
        selection={selection}
        onSelectCrossover={jest.fn()}
        onOpenCustom={jest.fn()}
      />
    );

    const custom = screen.getByRole("button", { name: "Custom (6 series)" });
    expect(custom.className).toContain("bg-accent-600");
    expect(
      screen.getByRole("button", { name: "Exponential" }).className
    ).not.toContain("bg-accent-600");
  });

  test("the custom button opens the dialog", () => {
    const onOpenCustom = jest.fn();
    render(
      <CrossoverNavigation
        selection={quick()}
        onSelectCrossover={jest.fn()}
        onOpenCustom={onOpenCustom}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Custom…" }));
    expect(onOpenCustom).toHaveBeenCalledTimes(1);
  });
});
