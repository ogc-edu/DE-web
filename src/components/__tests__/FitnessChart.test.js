import React from "react";
import { render, screen } from "@testing-library/react";
import FitnessChart from "../FitnessChart";

// Chart.js needs a real canvas; render a stub that reports the props the
// component computed, which is what the assertions actually care about.
jest.mock("react-chartjs-2", () => ({
  Bar: ({ data, options }) => (
    <div
      data-testid="chart"
      data-kind="bar"
      data-labels={data.labels.join("|")}
      data-datasets={data.datasets.map((d) => d.label).join("|")}
      data-yscale={options.scales.y.type}
    />
  ),
  Line: ({ data, options }) => (
    <div
      data-testid="chart"
      data-kind="line"
      data-labels={data.labels.join("|")}
      data-datasets={data.datasets.map((d) => d.label).join("|")}
      data-yscale={options.scales.y.type}
    />
  ),
}));

const model = (name, selection, avgLowestFitness) => ({
  model: name,
  selection,
  crossover: "exponential",
  avgLowestFitness,
});

const functionData = {
  name: "Sphere Function",
  description: "f(x) = \\sum_{i=1}^{n} x_i^2",
  models: [
    model("DE/rand/1", "sts", 1e-3),
    model("DE/best/1", "sts", 2e-3),
    model("DE/rand/1", "greedy", 5e-4),
    model("DE/best/1", "greedy", 9e-4),
  ],
};

describe("FitnessChart", () => {
  test("renders the function name and its formula", () => {
    render(<FitnessChart functionData={functionData} />);

    expect(screen.getByText("Sphere Function")).toBeInTheDocument();
    // react-katex renders the LaTeX into the DOM.
    expect(document.querySelector(".katex")).toBeInTheDocument();
  });

  test("plots one dataset per selection method", () => {
    render(<FitnessChart functionData={functionData} />);

    const chart = screen.getByTestId("chart");
    expect(chart).toHaveAttribute(
      "data-datasets",
      "STS Selection|Greedy Selection"
    );
    expect(chart).toHaveAttribute("data-labels", "DE/rand/1|DE/best/1");
  });

  test("omits a selection when its toggle is off", () => {
    render(<FitnessChart functionData={functionData} showGreedy={false} />);

    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-datasets",
      "STS Selection"
    );
  });

  test("honours the chart type", () => {
    render(<FitnessChart functionData={functionData} chartType="line" />);

    expect(screen.getByTestId("chart")).toHaveAttribute("data-kind", "line");
  });

  test("switches to a log Y scale when the values span more than 3 decades", () => {
    const wideSpread = {
      ...functionData,
      models: [model("DE/rand/1", "sts", 1e-40), model("DE/best/1", "sts", 1)],
    };

    render(<FitnessChart functionData={wideSpread} />);

    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-yscale",
      "logarithmic"
    );
  });

  test("stays linear when the values are close together", () => {
    render(<FitnessChart functionData={functionData} />);

    expect(screen.getByTestId("chart")).toHaveAttribute("data-yscale", "linear");
  });

  test("shows an honest empty state when there is no data", () => {
    render(<FitnessChart functionData={null} />);

    expect(
      screen.getByText("No experimental data available for this configuration")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
  });
});
