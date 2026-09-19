import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ChartFocusDialog from "../ChartFocusDialog";
import { getFunctionNames } from "../../data/fitnessData";
import { buildTopN, functionMeta } from "../../data/chartSelection";
import { mutationIdToName } from "../../data/variantMappings";

// Chart.js needs a real canvas. The stub has no Chart instance either, which is
// exactly why `Reset zoom` must be optional-chained.
jest.mock("react-chartjs-2", () => {
  const React = require("react");
  const stub = (kind) => ({ data, options }) =>
    React.createElement("div", {
      "data-testid": "chart",
      "data-kind": kind,
      "data-labels": data.labels.join("|"),
      "data-indexaxis": options.indexAxis,
      "data-yscale": options.scales.y?.type ?? "",
      "data-xscale": options.scales.x?.type ?? "",
      "data-zoom": JSON.stringify(options.plugins.zoom),
    });
  return { Bar: stub("bar"), Line: stub("line") };
});

const FUNCTION_KEYS = getFunctionNames();

const selection = {
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
    functionKeys: FUNCTION_KEYS,
    activeKey: FUNCTION_KEYS[0],
    onNavigate: jest.fn(),
    selection,
    ...over,
  };
  const utils = render(<ChartFocusDialog {...props} />);
  return { ...utils, props };
};

// ui/dialog.jsx sets no role="dialog", so everything is queried by text.
const showRanked = () => fireEvent.click(screen.getByText("Ranked"));

const bodyRows = () => {
  const [, ...rows] = screen.getAllByRole("row");
  return rows.map((row) =>
    within(row)
      .getAllByRole("cell")
      .map((cell) => cell.textContent)
  );
};

describe("ChartFocusDialog", () => {
  test("renders nothing when closed", () => {
    renderDialog({ open: false });
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
  });

  test("shows the focused function's name and formula", () => {
    renderDialog();

    expect(
      screen.getByText(functionMeta(FUNCTION_KEYS[0]).name)
    ).toBeInTheDocument();
    expect(document.querySelector(".katex")).toBeInTheDocument();
  });

  test("the chart is zoomable on the value axis", () => {
    renderDialog();

    const zoom = JSON.parse(
      screen.getByTestId("chart").getAttribute("data-zoom")
    );
    expect(zoom.zoom.wheel.enabled).toBe(true);
    expect(zoom.zoom.drag.enabled).toBe(true);
    expect(zoom.pan.enabled).toBe(true);
  });

  test("the ranked table lists every selected model, ascending", () => {
    renderDialog();

    const expected = buildTopN(FUNCTION_KEYS[0], selection, null);
    const rows = bodyRows();

    expect(rows).toHaveLength(expected.labels.length);
    expect(expected.labels.length).toBe(20); // 10 mutations × 1 crossover × 2 selections
    expect(rows.map((cells) => cells[1])).toEqual(expected.labels);
    expect(rows.map((cells) => Number(cells[0]))).toEqual(
      expected.labels.map((_, i) => i + 1)
    );

    // Ascending: DE minimises, so the best model is rank 1.
    const values = expected.datasets[0].data;
    expect([...values].sort((a, b) => a - b)).toEqual(values);
  });

  test("the ×best column starts at 1.00× and grows", () => {
    renderDialog();

    const rows = bodyRows();
    expect(rows[0][3]).toBe("1.00×");

    const laterRatios = rows
      .slice(1)
      .map((cells) => parseFloat(cells[3]))
      .filter((n) => Number.isFinite(n));
    expect(laterRatios.length).toBeGreaterThan(0);
    expect(Math.max(...laterRatios)).toBeGreaterThan(1);
  });

  test("the ×best column never prints Infinity, NaN or undefined", () => {
    FUNCTION_KEYS.forEach((key) => {
      const { unmount } = renderDialog({ activeKey: key });
      bodyRows().forEach((cells) => {
        expect(cells[3]).not.toMatch(/Infinity|NaN|undefined/);
      });
      unmount();
    });
  });

  test("a converged best value stands the ratio column down", () => {
    // Ackley clamps to the floor for several variants in the reference data;
    // force the case directly so the assertion does not depend on that.
    const converged = {
      labels: ["DE/rand/1 · exponential · STS", "DE/best/1 · exponential · STS"],
      datasets: [{ label: "Avg. lowest fitness", data: [1e-100, 1e-3] }],
      belowFloor: [[true, false]],
      horizontal: true,
    };
    jest
      .spyOn(require("../../data/chartSelection"), "buildTopN")
      .mockReturnValue(converged);

    renderDialog();
    const rows = bodyRows();

    expect(rows[0][2]).toBe("< 1e-100");
    expect(rows.map((cells) => cells[3])).toEqual(["—", "—"]);

    jest.restoreAllMocks();
  });

  test("prev/next walk the function list and wrap at both ends", () => {
    const { props, rerender } = renderDialog({ activeKey: FUNCTION_KEYS[1] });

    fireEvent.click(screen.getByLabelText("Next function"));
    expect(props.onNavigate).toHaveBeenLastCalledWith(FUNCTION_KEYS[2]);

    fireEvent.click(screen.getByLabelText("Previous function"));
    expect(props.onNavigate).toHaveBeenLastCalledWith(FUNCTION_KEYS[0]);

    // Wrap backwards off the first entry.
    rerender(<ChartFocusDialog {...props} activeKey={FUNCTION_KEYS[0]} />);
    fireEvent.click(screen.getByLabelText("Previous function"));
    expect(props.onNavigate).toHaveBeenLastCalledWith(
      FUNCTION_KEYS[FUNCTION_KEYS.length - 1]
    );

    // And forwards off the last.
    rerender(
      <ChartFocusDialog
        {...props}
        activeKey={FUNCTION_KEYS[FUNCTION_KEYS.length - 1]}
      />
    );
    fireEvent.click(screen.getByLabelText("Next function"));
    expect(props.onNavigate).toHaveBeenLastCalledWith(FUNCTION_KEYS[0]);
  });

  test("Reset zoom does not throw when the chart instance has no resetZoom", () => {
    renderDialog();

    expect(() =>
      fireEvent.click(screen.getByText("Reset zoom"))
    ).not.toThrow();
  });

  test("the Ranked view sorts compared bars adjacent", () => {
    renderDialog();

    const grid = screen.getByTestId("chart").getAttribute("data-labels");
    showRanked();
    const ranked = screen.getByTestId("chart").getAttribute("data-labels");

    expect(grid).not.toBe(ranked);
    expect(ranked.split("|")).toEqual(
      buildTopN(FUNCTION_KEYS[0], selection, null).labels
    );
  });

  test("the scale toggle overrides the automatic rule", () => {
    renderDialog();

    fireEvent.click(screen.getByText("Linear"));
    expect(screen.getByTestId("chart")).toHaveAttribute("data-yscale", "linear");

    fireEvent.click(screen.getByText("Log"));
    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-yscale",
      "logarithmic"
    );
  });

  test("the chart type toggle is independent of the grid", () => {
    renderDialog();

    expect(screen.getByTestId("chart")).toHaveAttribute("data-kind", "bar");
    fireEvent.click(screen.getByText("Line"));
    expect(screen.getByTestId("chart")).toHaveAttribute("data-kind", "line");
  });

  test("controls reset when the dialog is reopened", () => {
    const { props, rerender } = renderDialog();

    fireEvent.click(screen.getByText("Line"));
    expect(screen.getByTestId("chart")).toHaveAttribute("data-kind", "line");

    rerender(<ChartFocusDialog {...props} open={false} />);
    rerender(<ChartFocusDialog {...props} open />);

    expect(screen.getByTestId("chart")).toHaveAttribute("data-kind", "bar");
  });

  test("Escape closes it", () => {
    const { props } = renderDialog();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });
});
