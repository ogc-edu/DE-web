import {
  getFunctionNames,
  getFunctionDataByCrossoverAndSelection,
  crossoverMethods,
  selectionMethods,
} from "../fitnessData";

describe("fitnessData", () => {
  test("getFunctionNames returns array of function names", () => {
    const names = getFunctionNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBe(10);
    expect(names).toContain("sphere");
    expect(names).toContain("ackley");
  });

  test("getFunctionDataByCrossoverAndSelection returns data for valid combo", () => {
    const data = getFunctionDataByCrossoverAndSelection("exponential", "sts", "sphere");
    expect(data).not.toBeNull();
    expect(data.name).toBe("Sphere Function");
    expect(data.models).toHaveLength(10);
    expect(data.models[0]).toHaveProperty("model");
    expect(data.models[0]).toHaveProperty("avgLowestFitness");
  });

  test("getFunctionDataByCrossoverAndSelection returns null for invalid combo", () => {
    const data = getFunctionDataByCrossoverAndSelection("invalid", "sts", "sphere");
    expect(data).toBeNull();
  });

  test("crossoverMethods has 4 entries", () => {
    expect(Object.keys(crossoverMethods)).toHaveLength(4);
  });

  test("selectionMethods has 2 entries", () => {
    expect(Object.keys(selectionMethods)).toHaveLength(2);
  });

  test("binomial crossover data is populated", () => {
    const data = getFunctionDataByCrossoverAndSelection("binomial", "sts", "sphere");
    expect(data).not.toBeNull();
    expect(data.models.length).toBeGreaterThan(0);
  });

  test("onepoint crossover data is populated", () => {
    const data = getFunctionDataByCrossoverAndSelection("onepoint", "greedy", "sphere");
    expect(data).not.toBeNull();
    expect(data.models.length).toBeGreaterThan(0);
  });

  test("twopoint crossover data is populated", () => {
    const data = getFunctionDataByCrossoverAndSelection("twopoint", "sts", "ackley");
    expect(data).not.toBeNull();
    expect(data.models.length).toBeGreaterThan(0);
  });
});
