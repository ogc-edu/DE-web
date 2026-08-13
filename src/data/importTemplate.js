// src/data/importTemplate.js — sample .txt shown in the guide and used by the
// "Download template" button. Must stay in sync with import-format.md.

const header = ["model", "benchmark", "lowestFitness"].join("\t");

const rows = [
  ["DE/best/1/binomial/greedy", "1", "2.997146999302399"],
  ["DE/best/2/binomial/greedy", "1", "0.0016972511838516554"],
  ["DE/rand/3/exponential/sts", "6", "1.0924594562311541e-14"],
  ["DE/current-to-best/1/onepoint/greedy", "9", "1.44855E+00"],
].map((row) => row.join("\t"));

export const IMPORT_TEMPLATE = [
  "# np=15",
  "# f=0.5",
  "# cr=0.9",
  "# gen=1000",
  "# dim=30",
  header,
  ...rows,
].join("\n");

export default IMPORT_TEMPLATE;
