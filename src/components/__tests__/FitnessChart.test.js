import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FitnessChart from "../FitnessChart";
import { buildGrouped, FITNESS_FLOOR } from "../../data/chartSelection";

// Chart.js needs a real canvas; render a stub that reports the props the
// component computed, which is what the assertions actually care about.
jest.mock("react-chartjs-2", () => {
  const React = require("react");
  const stub = (kind) => ({ data, options }) =>
    React.createElement("div", {
      "data-testid": "chart",
      "data-kind": kind,
      "data-labels": data.labels.join("|"),
      "data-datasets": data.datasets.map((d) => d.label).join("|"),
      "data-yscale": options.scales.y?.type ?? "",
      "data-xscale": options.scales.x?.type ?? "",
      "data-indexaxis": options.indexAxis,
      "data-legend": String(options.plugins.legend.display),
      "data-zoom": JSON.stringify(options.plugins.zoom),
      "data-styles": JSON.stringify(
        data.datasets.map((d) => ({
          border: d.borderColor,
          bg: d.backgroundColor,
          point: d.pointBackgroundColor ?? null,
        }))
      ),
      // Exercise the tooltip callback for every point so the assertions can
      // read back what a hover would say.
      "data-tooltip": JSON.stringify(
        data.datasets.flatMap((d, di) =>
          d.data.map((raw, i) =>
            options.plugins.tooltip.callbacks.label({
              raw,
              dataset: d,
              datasetIndex: di,
              dataIndex: i,
            })
          )
        )
      ),
    });
  return { Bar: stub("bar"), Line: stub("line") };
});

const functionData = {
  name: "Sphere Function",
  description: "f(x) = \\sum_{i=1}^{n} x_i^2",
};

const series = (label, data) => ({
  label,
  data,
  backgroundColor: "#2a78d6",
  borderColor: "#2a78d6",
});

describe("FitnessChart", () => {
  test("renders the function name and its formula", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1", "DE/best/1"]}
        datasets={[series("exponential · STS", [1e-3, 2e-3])]}
      />
    );

    expect(screen.getByText("Sphere Function")).toBeInTheDocument();
    // react-katex renders the LaTeX into the DOM.
    expect(document.querySelector(".katex")).toBeInTheDocument();
  });

  test("plots exactly the datasets it is handed", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1", "DE/best/1"]}
        datasets={[
          series("exponential · STS", [1e-3, 2e-3]),
          series("exponential · Greedy", [5e-4, 9e-4]),
        ]}
      />
    );

    const chart = screen.getByTestId("chart");
    expect(chart).toHaveAttribute(
      "data-datasets",
      "exponential · STS|exponential · Greedy"
    );
    expect(chart).toHaveAttribute("data-labels", "DE/rand/1|DE/best/1");
    expect(chart).toHaveAttribute("data-legend", "true");
  });

  test("drops the legend box for a single series", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1"]}
        datasets={[series("exponential · STS", [1e-3])]}
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute("data-legend", "false");
  });

  test("honours the chart type", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1"]}
        datasets={[series("exponential · STS", [1e-3])]}
        chartType="line"
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute("data-kind", "line");
  });

  test("switches to a log value scale when the values span more than 3 decades", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1", "DE/best/1"]}
        datasets={[series("exponential · STS", [1e-40, 1])]}
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-yscale",
      "logarithmic"
    );
  });

  test("stays linear when the values are close together", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1", "DE/best/1"]}
        datasets={[series("exponential · STS", [1e-3, 2e-3])]}
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute("data-yscale", "linear");
  });

  test("rotates to horizontal bars past ten categories", () => {
    const labels = Array.from({ length: 12 }, (_, i) => `model-${i}`);

    render(
      <FitnessChart
        functionData={functionData}
        labels={labels}
        datasets={[series("Avg. lowest fitness", labels.map(() => 1e-3))]}
      />
    );

    const chart = screen.getByTestId("chart");
    expect(chart).toHaveAttribute("data-indexaxis", "y");
    // The value scale moves to x when the chart is rotated.
    expect(chart).toHaveAttribute("data-xscale", "linear");
    expect(chart).toHaveAttribute("data-yscale", "");
  });

  test("an explicit horizontal flag wins over the category count", () => {
    const labels = ["DE/best/1 · binomial · STS", "DE/rand/1 · binomial · STS"];

    render(
      <FitnessChart
        functionData={functionData}
        labels={labels}
        datasets={[series("Avg. lowest fitness", [1e-3, 2e-3])]}
        horizontal
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute("data-indexaxis", "y");
  });

  test("keeps vertical bars at ten categories or fewer", () => {
    const labels = Array.from({ length: 10 }, (_, i) => `model-${i}`);

    render(
      <FitnessChart
        functionData={functionData}
        labels={labels}
        datasets={[series("exponential · STS", labels.map(() => 1e-3))]}
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute("data-indexaxis", "x");
  });

  test("marks clamped points as converged instead of printing the clamp", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["DE/rand/1", "DE/best/1", "DE/best/2"]}
        datasets={[series("exponential · STS", [FITNESS_FLOOR, 1e-3, null])]}
        belowFloor={[[true, false, false]]}
      />
    );

    const tooltips = JSON.parse(
      screen.getByTestId("chart").getAttribute("data-tooltip")
    );
    expect(tooltips[0]).toBe("exponential · STS: < 1e-100 (converged)");
    expect(tooltips[1]).toBe("exponential · STS: 1.0000e-3");
    expect(tooltips[2]).toBe("exponential · STS: no data");
  });

  test("consumes buildGrouped output directly", () => {
    const { labels, datasets, belowFloor } = buildGrouped("sphere", {
      mode: "quick",
      crossovers: ["exponential"],
      selections: ["sts", "greedy"],
      mutations: ["DE/rand/1", "DE/best/1"],
      topN: null,
    });

    render(
      <FitnessChart
        functionData={functionData}
        labels={labels}
        datasets={datasets}
        belowFloor={belowFloor}
      />
    );

    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-datasets",
      "exponential · STS|exponential · Greedy"
    );
  });

  test("line mode collapses a per-point colour array to a single path colour", () => {
    // Chart.js has no index resolution for the line element: an array reaches
    // strokeStyle unusable and the line renders black. Top-N hands exactly that.
    render(
      <FitnessChart
        functionData={functionData}
        labels={["a", "b", "c"]}
        datasets={[
          {
            label: "Avg. lowest fitness",
            data: [1e-3, 2e-3, 3e-3],
            backgroundColor: ["#2a78d6", "#eb6834", "#2a78d6"],
            borderColor: ["#2a78d6", "#eb6834", "#2a78d6"],
          },
        ]}
        chartType="line"
      />
    );

    const [style] = JSON.parse(
      screen.getByTestId("chart").getAttribute("data-styles")
    );
    expect(style.border).toBe("#2a78d6");
    expect(Array.isArray(style.bg)).toBe(false);
    // The per-point colours survive on the points.
    expect(style.point).toEqual(["#2a78d6", "#eb6834", "#2a78d6"]);
  });

  test("line fills are translucent so stacked series stay readable", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["a", "b"]}
        datasets={[series("exponential · STS", [1e-3, 2e-3])]}
        chartType="line"
      />
    );

    const [style] = JSON.parse(
      screen.getByTestId("chart").getAttribute("data-styles")
    );
    expect(style.border).toBe("#2a78d6");
    expect(style.bg).toBe("rgba(42, 120, 214, 0.25)");
  });

  test("bar mode leaves the per-point colour array untouched", () => {
    render(
      <FitnessChart
        functionData={functionData}
        labels={["a", "b"]}
        datasets={[
          {
            label: "Avg. lowest fitness",
            data: [1e-3, 2e-3],
            backgroundColor: ["#2a78d6", "#eb6834"],
            borderColor: ["#2a78d6", "#eb6834"],
          },
        ]}
        chartType="bar"
      />
    );

    const [style] = JSON.parse(
      screen.getByTestId("chart").getAttribute("data-styles")
    );
    expect(style.bg).toEqual(["#2a78d6", "#eb6834"]);
    expect(style.point).toBeNull();
  });

  describe("zoom", () => {
    const zoomOf = () =>
      JSON.parse(screen.getByTestId("chart").getAttribute("data-zoom"));

    test("grid charts are inert — the plugin is registered globally", () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1", "DE/best/1"]}
          datasets={[series("exponential · STS", [1e-3, 2e-3])]}
        />
      );

      const zoom = zoomOf();
      expect(zoom.zoom.wheel.enabled).toBe(false);
      expect(zoom.zoom.drag.enabled).toBe(false);
      expect(zoom.zoom.pinch.enabled).toBe(false);
      expect(zoom.pan.enabled).toBe(false);
    });

    test("an explicit zoomable={false} is inert too", () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1"]}
          datasets={[series("exponential · STS", [1e-3])]}
          zoomable={false}
        />
      );

      expect(zoomOf().zoom.wheel.enabled).toBe(false);
    });

    test("zoomable enables wheel, drag and shift-pan on the vertical value axis", () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1", "DE/best/1"]}
          datasets={[series("exponential · STS", [1e-3, 2e-3])]}
          zoomable
        />
      );

      const zoom = zoomOf();
      expect(zoom.zoom.wheel.enabled).toBe(true);
      expect(zoom.zoom.drag.enabled).toBe(true);
      // Pinch stays off: hammerjs is deliberately not a dependency.
      expect(zoom.zoom.pinch.enabled).toBe(false);
      expect(zoom.zoom.mode).toBe("y");
      expect(zoom.pan).toEqual({ enabled: true, mode: "y", modifierKey: "shift" });
    });

    test("the zoom axis follows the rotation", () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["a", "b"]}
          datasets={[series("Avg. lowest fitness", [1e-3, 2e-3])]}
          horizontal
          zoomable
        />
      );

      const zoom = zoomOf();
      expect(zoom.zoom.mode).toBe("x");
      expect(zoom.pan.mode).toBe("x");
    });
  });

  describe("scale override", () => {
    test('scale="log" forces a log axis for close-together values', () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1", "DE/best/1"]}
          datasets={[series("exponential · STS", [1.9e-1, 2.3e-1])]}
          scale="log"
        />
      );

      expect(screen.getByTestId("chart")).toHaveAttribute(
        "data-yscale",
        "logarithmic"
      );
    });

    test('scale="linear" forces a linear axis across forty decades', () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1", "DE/best/1"]}
          datasets={[series("exponential · STS", [1e-40, 1])]}
          scale="linear"
        />
      );

      expect(screen.getByTestId("chart")).toHaveAttribute("data-yscale", "linear");
    });

    test('scale="auto" keeps the max/min rule', () => {
      const { unmount } = render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1", "DE/best/1"]}
          datasets={[series("exponential · STS", [1e-40, 1])]}
          scale="auto"
        />
      );
      expect(screen.getByTestId("chart")).toHaveAttribute(
        "data-yscale",
        "logarithmic"
      );
      unmount();

      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1", "DE/best/1"]}
          datasets={[series("exponential · STS", [1.9e-1, 2.3e-1])]}
          scale="auto"
        />
      );
      expect(screen.getByTestId("chart")).toHaveAttribute("data-yscale", "linear");
    });
  });

  describe("expand affordance", () => {
    test("renders a focus button and fires it", () => {
      const onExpand = jest.fn();
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1"]}
          datasets={[series("exponential · STS", [1e-3])]}
          onExpand={onExpand}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: "Focus Sphere Function" })
      );
      expect(onExpand).toHaveBeenCalledTimes(1);
    });

    test("renders no button without onExpand", () => {
      render(
        <FitnessChart
          functionData={functionData}
          labels={["DE/rand/1"]}
          datasets={[series("exponential · STS", [1e-3])]}
        />
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  test("shows an honest empty state when there is no data", () => {
    render(<FitnessChart functionData={null} />);

    expect(
      screen.getByText("No experimental data available for this configuration")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
  });

  test("shows the empty state when every group was deselected", () => {
    render(
      <FitnessChart functionData={functionData} labels={[]} datasets={[]} />
    );

    expect(
      screen.getByText("No experimental data available for this configuration")
    ).toBeInTheDocument();
  });
});
