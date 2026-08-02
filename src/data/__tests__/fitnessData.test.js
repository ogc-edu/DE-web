import {
  getFunctionNames,
  getCrossoverMethods,
  getSelectionMethods,
  getFunctionDataByCrossoverAndSelection,
  getAllFunctionData,
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

  test("getCrossoverMethods returns all crossover method keys", () => {
    const methods = getCrossoverMethods();
    expect(methods).toEqual(["exponential", "binomial", "onepoint", "twopoint"]);
  });

  test("getSelectionMethods returns all selection method keys", () => {
    const methods = getSelectionMethods();
    expect(methods).toEqual(["sts", "greedy"]);
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

  test("getAllFunctionData returns data for specific crossover and selection", () => {
    const data = getAllFunctionData("exponential", "sts");
    expect(Object.keys(data).length).toBe(10);
    expect(data.sphere.name).toBe("Sphere Function");
  });

  test("getAllFunctionData with crossover=all returns combined data", () => {
    const data = getAllFunctionData("all");
    expect(Object.keys(data).length).toBeGreaterThan(0);
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
