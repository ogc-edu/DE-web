import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModelSelectorDialog from "../ModelSelectorDialog";
import { mutationIdToName } from "../../data/variantMappings";

// ui/dialog.jsx is hand-rolled and sets no role="dialog", so everything here is
// queried by text or by label.
const baseValue = {
  mode: "quick",
  crossovers: ["exponential"],
  selections: ["sts", "greedy"],
  mutations: [...mutationIdToName],
  topN: null,
};

const renderDialog = (over = {}) => {
  const props = {
    open: true,
    onOpenChange: jest.fn(),
    value: baseValue,
    onApply: jest.fn(),
    ...over,
  };
  render(<ModelSelectorDialog {...props} />);
  return props;
};

const counter = () => screen.getByText(/= \d+ bars/).textContent;

describe("ModelSelectorDialog", () => {
  test("renders nothing when closed", () => {
    renderDialog({ open: false });
    expect(screen.queryByText("Custom model selection")).not.toBeInTheDocument();
  });

  test("offers a checkbox per mutation, crossover and selection", () => {
    renderDialog();

    expect(screen.getByLabelText("DE/rand/1")).toBeInTheDocument();
    expect(screen.getByLabelText("Binomial Crossover")).toBeInTheDocument();
    expect(screen.getByLabelText("Greedy Selection")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(16);
  });

  test("the counter reflects the incoming value", () => {
    renderDialog();

    expect(counter()).toContain(
      "1 crossover × 2 selection = 2 series × 10 mutations = 20 bars"
    );
  });

  test("the counter recomputes on every change", () => {
    renderDialog();

    fireEvent.click(screen.getByLabelText("Binomial Crossover"));
    expect(counter()).toContain(
      "2 crossover × 2 selection = 4 series × 10 mutations = 40 bars"
    );

    fireEvent.click(screen.getByLabelText("DE/rand/1"));
    expect(counter()).toContain(
      "2 crossover × 2 selection = 4 series × 9 mutations = 36 bars"
    );
  });

  test("warns above four series without blocking Apply", () => {
    renderDialog();

    expect(screen.queryByText(/comfortable limit/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Binomial Crossover"));
    fireEvent.click(screen.getByLabelText("One Point Crossover"));

    expect(
      screen.getByText(/above the comfortable limit \(4 series\)/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
  });

  test("disables Apply and explains why when a group is emptied", () => {
    renderDialog();

    fireEvent.click(screen.getByLabelText("Exponential Crossover"));

    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(screen.getByText(/Select at least one crossover/)).toBeInTheDocument();
  });

  test("Select all / Clear toggles a whole group", () => {
    renderDialog();

    // Crossover starts with one of four picked, so the toggle offers "Select all".
    fireEvent.click(
      screen.getByRole("button", { name: "Select all crossover" })
    );
    expect(counter()).toContain("4 crossover × 2 selection = 8 series");

    fireEvent.click(screen.getByRole("button", { name: "Clear crossover" }));
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(counter()).toContain("0 crossover × 2 selection = 0 series");
  });

  test("Apply commits the staged edit in custom mode", () => {
    const { onApply, onOpenChange } = renderDialog();

    fireEvent.click(screen.getByLabelText("Binomial Crossover"));
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "custom",
        crossovers: ["exponential", "binomial"],
        selections: ["sts", "greedy"],
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("Cancel discards the staged edits", () => {
    const { onApply, onOpenChange } = renderDialog();

    fireEvent.click(screen.getByLabelText("Binomial Crossover"));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onApply).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("reopening re-seeds from the committed value, not the discarded draft", () => {
    const props = {
      open: true,
      onOpenChange: jest.fn(),
      value: baseValue,
      onApply: jest.fn(),
    };
    const { rerender } = render(<ModelSelectorDialog {...props} />);

    fireEvent.click(screen.getByLabelText("Binomial Crossover"));
    rerender(<ModelSelectorDialog {...props} open={false} />);
    rerender(<ModelSelectorDialog {...props} open={true} />);

    expect(screen.getByLabelText("Binomial Crossover")).not.toBeChecked();
    expect(counter()).toContain("1 crossover × 2 selection = 2 series");
  });
});
