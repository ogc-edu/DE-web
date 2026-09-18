import {
  seriesCount,
  barCount,
  buildGrouped,
  buildTopN,
  buildChartData,
  seriesColor,
  selectionColor,
  normalizeMutationName,
  functionMeta,
  FITNESS_FLOOR,
} from "../chartSelection";
import { mutationIdToName } from "../variantMappings";

jest.mock("../fitnessData", () => {
  const actual = jest.requireActual("../fitnessData");
  return { ...actual };
});

const ALL_MUTATIONS = [...mutationIdToName];

const sel = (over = {}) => ({
  mode: "custom",
  crossovers: ["exponential"],
  selections: ["sts"],
  mutations: ALL_MUTATIONS,
  topN: null,
  ...over,
});

describe("normalizeMutationName", () => {
  test("prefixes the bare rand/N names used by fitnessData", () => {
    expect(normalizeMutationName("rand/2")).toBe("DE/rand/2");
    expect(normalizeMutationName("rand/1")).toBe("DE/rand/1");
  });

  test("passes already-canonical names through untouched", () => {
    expect(normalizeMutationName("DE/best/1")).toBe("DE/best/1");
    expect(normalizeMutationName("DE/current-to-rand/2")).toBe(
      "DE/current-to-rand/2"
    );
  });
});

describe("seriesCount / barCount", () => {
  test("is crossovers × selections", () => {
    expect(seriesCount(sel())).toBe(1);
    expect(
      seriesCount(
        sel({ crossovers: ["exponential", "binomial", "onepoint"], selections: ["sts", "greedy"] })
      )
    ).toBe(6);
    // Today's quick default: one crossover, both selections.
    expect(seriesCount(sel({ mode: "quick", selections: ["sts", "greedy"] }))).toBe(2);
    // Everything selected.
    expect(
      seriesCount(
        sel({
          crossovers: ["exponential", "binomial", "onepoint", "twopoint"],
          selections: ["sts", "greedy"],
        })
      )
    ).toBe(8);
  });

  test("is zero when a group is empty", () => {
    expect(seriesCount(sel({ crossovers: [] }))).toBe(0);
    expect(seriesCount(sel({ selections: [] }))).toBe(0);
    expect(seriesCount(undefined)).toBe(0);
  });

  test("barCount multiplies the series by the mutation count", () => {
    expect(
      barCount(
        sel({
          crossovers: ["exponential", "binomial", "onepoint"],
          selections: ["sts", "greedy"],
          mutations: ALL_MUTATIONS,
        })
      )
    ).toBe(60);
  });
});

describe("buildGrouped", () => {
  test("emits one dataset per (crossover, selection) pair", () => {
    const { datasets } = buildGrouped("sphere", {
      ...sel(),
      crossovers: ["exponential", "binomial"],
      selections: ["sts", "greedy"],
    });

    expect(datasets.map((d) => d.label)).toEqual([
      "exponential · STS",
      "exponential · Greedy",
      "binomial · STS",
      "binomial · Greedy",
    ]);
  });

  test("labels are the selected mutations in canonical order", () => {
    const { labels } = buildGrouped("sphere", sel());
    expect(labels).toEqual(ALL_MUTATIONS);

    // Canonical order wins over the order the user clicked them in.
    const subset = buildGrouped(
      "sphere",
      sel({ mutations: ["DE/best/1", "DE/rand/1"] })
    );
    expect(subset.labels).toEqual(["DE/rand/1", "DE/best/1"]);
  });

  test("normalises the bare rand/N rows so they line up with the labels", () => {
    const { labels, datasets } = buildGrouped(
      "sphere",
      sel({ mutations: ["DE/rand/1", "DE/rand/2", "DE/rand/3"] })
    );

    expect(labels).toEqual(["DE/rand/1", "DE/rand/2", "DE/rand/3"]);
    expect(datasets[0].data.every((v) => typeof v === "number")).toBe(true);
  });

  test("yields null for a model the data does not carry", () => {
    const { labels, datasets } = buildGrouped(
      "sphere",
      sel({ mutations: [...ALL_MUTATIONS, "DE/does-not-exist"] })
    );

    // The unknown name is not canonical, so it never becomes a label.
    expect(labels).not.toContain("DE/does-not-exist");
    expect(datasets[0].data).toHaveLength(labels.length);
  });

  test("returns no datasets when a group is empty", () => {
    expect(buildGrouped("sphere", sel({ selections: [] })).datasets).toEqual([]);
    expect(buildGrouped("sphere", sel({ crossovers: [] })).datasets).toEqual([]);
  });

  test("belowFloor is parallel to the datasets", () => {
    const { datasets, belowFloor } = buildGrouped(
      "sphere",
      sel({ crossovers: ["exponential", "binomial"], selections: ["sts", "greedy"] })
    );

    expect(belowFloor).toHaveLength(datasets.length);
    belowFloor.forEach((flags, i) =>
      expect(flags).toHaveLength(datasets[i].data.length)
    );
  });
});

describe("fitness floor", () => {
  const withValues = (values) => {
    const fitnessData = require("../fitnessData");
    jest
      .spyOn(fitnessData, "getFunctionDataByCrossoverAndSelection")
      .mockReturnValue({
        name: "Stub Function",
        description: "f(x)",
        models: values.map((avgLowestFitness, i) => ({
          model: mutationIdToName[i],
          avgLowestFitness,
          crossover: "exponential",
          selection: "sts",
        })),
      });
  };

  afterEach(() => jest.restoreAllMocks());

  test("clamps 0 and sub-floor values, flagging each one", () => {
    withValues([0, 1e-120, 1e-3]);
    const mutations = mutationIdToName.slice(0, 3);

    const { datasets, belowFloor } = buildGrouped("sphere", sel({ mutations }));

    expect(datasets[0].data).toEqual([FITNESS_FLOOR, FITNESS_FLOOR, 1e-3]);
    expect(belowFloor[0]).toEqual([true, true, false]);
  });

  test("carries the flag through Top-N as well", () => {
    withValues([0, 1e-3, 1e-120]);
    const mutations = mutationIdToName.slice(0, 3);

    const { datasets, belowFloor } = buildTopN("sphere", sel({ mutations }), 3);

    expect(datasets[0].data).toEqual([FITNESS_FLOOR, FITNESS_FLOOR, 1e-3]);
    expect(belowFloor[0]).toEqual([true, true, false]);
  });
});

describe("buildTopN", () => {
  test("sorts ascending and produces exactly one dataset", () => {
    const { labels, datasets } = buildTopN(
      "sphere",
      sel({ crossovers: ["exponential", "binomial"], selections: ["sts", "greedy"] }),
      10
    );

    expect(datasets).toHaveLength(1);
    expect(labels).toHaveLength(10);
    const values = datasets[0].data;
    expect(values).toHaveLength(10);
    expect([...values].sort((a, b) => a - b)).toEqual(values);
  });

  test("respects n and never exceeds the available rows", () => {
    const selection = sel({ mutations: ["DE/rand/1", "DE/best/1"] });

    expect(buildTopN("sphere", selection, 1).labels).toHaveLength(1);
    // Only two rows exist for one crossover × one selection.
    expect(buildTopN("sphere", selection, 50).labels).toHaveLength(2);
  });

  test("returns every row when n is null", () => {
    const selection = sel({
      crossovers: ["exponential", "binomial", "onepoint", "twopoint"],
      selections: ["sts", "greedy"],
    });

    expect(buildTopN("sphere", selection, null).labels).toHaveLength(80);
  });

  test("labels name the full model", () => {
    const { labels } = buildTopN(
      "sphere",
      sel({ mutations: ["DE/best/1"], selections: ["sts"] }),
      1
    );

    expect(labels[0]).toBe("DE/best/1 · exponential · STS");
  });

  test("colours each bar by its selection method", () => {
    const { datasets } = buildTopN(
      "sphere",
      sel({ mutations: ["DE/best/1"], selections: ["sts", "greedy"] }),
      2
    );

    datasets[0].backgroundColor.forEach((color) => {
      expect([selectionColor("sts"), selectionColor("greedy")]).toContain(color);
    });
  });
});

describe("bar orientation", () => {
  test("grouped charts stay vertical — mutation names fit under a bar", () => {
    expect(
      buildGrouped("sphere", sel({ selections: ["sts", "greedy"] })).horizontal
    ).toBe(false);
  });

  test("Top-N always rotates, even at ten bars, because its labels are long", () => {
    const top = buildTopN(
      "sphere",
      sel({
        crossovers: ["exponential", "binomial", "onepoint", "twopoint"],
        selections: ["sts", "greedy"],
      }),
      10
    );

    expect(top.horizontal).toBe(true);
    expect(top.labels).toHaveLength(10);
  });
});

describe("buildChartData", () => {
  test("routes to grouped when topN is null and Top-N otherwise", () => {
    const grouped = buildChartData("sphere", sel({ selections: ["sts", "greedy"] }));
    expect(grouped.datasets).toHaveLength(2);

    const top = buildChartData(
      "sphere",
      sel({ selections: ["sts", "greedy"], topN: 5 })
    );
    expect(top.datasets).toHaveLength(1);
    expect(top.labels).toHaveLength(5);
  });
});

describe("seriesColor", () => {
  test("is stable for a pair across repeated calls and selections", () => {
    const first = seriesColor("binomial", "greedy");
    expect(seriesColor("binomial", "greedy")).toBe(first);

    // The colour must not shift when other series are added or removed.
    const a = buildGrouped("sphere", {
      ...sel(),
      crossovers: ["binomial"],
      selections: ["greedy"],
    }).datasets[0].backgroundColor;
    const b = buildGrouped("sphere", {
      ...sel(),
      crossovers: ["exponential", "binomial", "onepoint"],
      selections: ["sts", "greedy"],
    }).datasets.find((d) => d.label === "binomial · Greedy").backgroundColor;

    expect(a).toBe(first);
    expect(b).toBe(first);
  });

  test("gives all eight pairs a distinct slot", () => {
    const colors = new Set();
    ["exponential", "binomial", "onepoint", "twopoint"].forEach((c) =>
      ["sts", "greedy"].forEach((s) => colors.add(seriesColor(c, s)))
    );
    expect(colors.size).toBe(8);
  });
});

describe("functionMeta", () => {
  test("returns the display name and formula for a function key", () => {
    expect(functionMeta("sphere")).toEqual({
      name: "Sphere Function",
      description: expect.any(String),
    });
  });

  test("returns null for an unknown key", () => {
    expect(functionMeta("nope")).toBeNull();
  });
});
