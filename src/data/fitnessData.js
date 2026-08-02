// DE Research data with different crossover methods and selection strategies
// Each fitness function has models with different crossover strategies and selection methods

export const crossoverMethods = {
  exponential: "Exponential Crossover",
  binomial: "Binomial Crossover",
  onepoint: "One Point Crossover",
  twopoint: "Two Point Crossover",
};

export const selectionMethods = {
  sts: "STS Selection",
  greedy: "Greedy Selection",
};

export const fitnessDataByCrossoverAndSelection = {
  exponential: {
    sts: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 1.88842e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 9.80909e-46,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.34297e-43,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 2.24159,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 2.47308e-31,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 8.69888e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 4.48866e-7,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.4682e-37,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 4.87196e-30,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.09109e-24,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 1.02655e-13,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.61149e-44,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.8026e-46,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 3.20186e-10,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 5.80861e-22,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.82909e-10,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.30397e-24,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.29667e-30,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 8.88609e1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 5.77338e44,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 1.05505e-40,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 7.18345e2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 4.96604e-25,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 1.76409e2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 9.50914e-16,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 2.63295e-36,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 5.80979e-28,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.79304e-29,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 6.89163e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 7.19903e-22,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 1.39806e-22,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 8.32437e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 7.69248e-16,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 4.15068e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 3.57699e-14,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 4.78524e-21,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 2.23936e-16,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 2.65704e-15,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 1.48786e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.4013e-46,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.158e-44,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 4.93088e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 2.47136e-30,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.47824e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.37371e-12,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.25822e-38,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 3.35061e-31,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.10006e-25,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description:
          "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 2.31904,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 2.77571,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 2.8498,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.71845,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description:
          "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 2.40102e1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 4.07942,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 5.96362e4,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 1.40233e1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.3274e1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 9.79749,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.01535e1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 9.94965e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.46475e-1,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description:
          "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 3.92076e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.04317e-36,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.88339e-35,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 1.26846,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.89063e-16,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.20129e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.29462e-6,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 3.66976e-7,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 1.87661e-22,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 6.78203e-18,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description:
          "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 8.49595e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.66982e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 8.12896e-3,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 1.44855,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.14536e-4,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 1.23625,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.19209e-6,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 2.67625e-1,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 8.32344e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 7.20672e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 3.92967e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 4.76614e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 5.62473e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.27182e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/1",
            avgLowestFitness: 3.79415e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/2",
            avgLowestFitness: 6.35287e-2,
            crossover: "exponential",
            selection: "sts",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.09469e-1,
            crossover: "exponential",
            selection: "sts",
          },
        ],
      },
    },
    greedy: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 1.68842e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 8.80909e-46,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.14297e-43,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 2.04159,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 2.27308e-31,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.69888e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 4.28866e-7,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.2682e-37,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 4.67196e-30,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 9.9109e-25,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 9.2655e-14,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.51149e-44,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.6026e-46,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 2.90186e-10,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 5.40861e-22,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.32909e-10,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.20397e-24,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.19667e-30,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 8.88609e1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 5.77338e44,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 1.05505e-40,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 7.18345e2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 4.96604e-25,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 1.76409e2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 9.50914e-16,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 2.63295e-36,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 5.80979e-28,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.79304e-29,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 6.89163e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 7.19903e-22,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 1.39806e-22,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 8.32437e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 7.69248e-16,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 4.15068e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 3.57699e-14,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 4.78524e-21,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 2.23936e-16,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 2.65704e-15,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 1.28786e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.3013e-46,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.058e-44,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 4.53088e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 2.27136e-30,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.17824e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.27371e-12,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.15822e-38,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 3.15061e-31,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.00006e-25,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description:
          "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 2.31904,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 2.77571,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 2.8498,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.71845,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.71829,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description:
          "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 2.40102e1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 4.07942,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 5.96362e4,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 1.40233e1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.3274e1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 9.79749,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.01535e1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 9.94965e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.46475e-1,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description:
          "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 3.92076e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.04317e-36,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 2.88339e-35,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 1.26846,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.89063e-16,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 7.20129e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.29462e-6,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 3.66976e-7,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 1.87661e-22,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 6.78203e-18,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description:
          "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 8.49595e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 1.66982e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 8.12896e-3,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 1.44855,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 1.14536e-4,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 1.23625,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.19209e-6,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 0.0,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          {
            model: "DE/best/1",
            avgLowestFitness: 2.67625e-1,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/2",
            avgLowestFitness: 8.32344e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/best/3",
            avgLowestFitness: 7.20672e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/1",
            avgLowestFitness: 3.92967e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-best/2",
            avgLowestFitness: 4.76614e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/1",
            avgLowestFitness: 5.62473e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "DE/current-to-rand/2",
            avgLowestFitness: 1.27182e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/1",
            avgLowestFitness: 3.79415e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/2",
            avgLowestFitness: 6.35287e-2,
            crossover: "exponential",
            selection: "greedy",
          },
          {
            model: "rand/3",
            avgLowestFitness: 1.09469e-1,
            crossover: "exponential",
            selection: "greedy",
          },
        ],
      },
    },
  },
  binomial: {
    sts: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.10451e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.02345e-45, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 2.51003e-42, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.41002, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.61205e-30, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 9.10234e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 4.80102e-7, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.52001e-36, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 5.10234e-29, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.15002e-23, crossover: "binomial", selection: "sts" },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.10201e-13, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.70002e-44, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 3.01001e-46, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.40102e-10, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 6.01002e-22, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.10001e-10, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.40102e-24, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.35001e-30, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 0.0, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 0.0, crossover: "binomial", selection: "sts" },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.20102e1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 6.01023e44, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.10201e-40, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 7.50102e2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.20102e-25, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.82001e2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.01002e-15, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 2.80102e-36, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 6.10001e-28, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.85001e-29, crossover: "binomial", selection: "sts" },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          { model: "DE/best/1", avgLowestFitness: 7.10102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 7.50102e-22, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.45001e-22, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 8.60102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 8.01002e-16, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 4.40102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 3.80102e-14, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 5.01002e-21, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 2.40102e-16, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 2.80102e-15, crossover: "binomial", selection: "sts" },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.60102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.50102e-46, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 2.30102e-44, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 5.20102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.60102e-30, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.80102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.45001e-12, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.32001e-38, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 3.50102e-31, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.15001e-25, crossover: "binomial", selection: "sts" },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description: "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.45001, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.90102, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 3.01001, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.80102, crossover: "binomial", selection: "sts" },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description: "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.55001e1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 4.30102, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 6.20102e4, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.50102e1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.40102e1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.02001e1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.06001e1, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.05001e-1, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 0.0, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.55001e-1, crossover: "binomial", selection: "sts" },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          { model: "DE/best/1", avgLowestFitness: 4.20102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.10102e-36, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 3.01001e-35, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.35001, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.01001e-16, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.50102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.35001e-6, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 3.90102e-7, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 2.01001e-22, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 7.10001e-18, crossover: "binomial", selection: "sts" },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description: "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          { model: "DE/best/1", avgLowestFitness: 8.80102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.75001e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 8.50102e-3, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.50102, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.20102e-4, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.30102, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.25001e-6, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 0.0, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 0.0, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 0.0, crossover: "binomial", selection: "sts" },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.80102e-1, crossover: "binomial", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 8.70102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 7.50102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.10102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.01002e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 5.90102e-2, crossover: "binomial", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.35001e-2, crossover: "binomial", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 4.01002e-2, crossover: "binomial", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 6.60102e-2, crossover: "binomial", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.15001e-1, crossover: "binomial", selection: "sts" },
        ],
      },
    },
    greedy: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.80102e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 9.10102e-46, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.25001e-43, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.15001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.38001e-31, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.01002e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 4.50102e-7, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.32001e-37, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 4.90102e-30, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.02001e-24, crossover: "binomial", selection: "greedy" },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.60102e-14, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.56001e-44, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.72001e-46, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.05001e-10, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.62001e-22, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.52001e-10, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.25001e-24, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.22001e-30, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 0.0, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 0.0, crossover: "binomial", selection: "greedy" },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.01002e1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 5.90102e44, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.08001e-40, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 7.32001e2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.10102e-25, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.79001e2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 9.80102e-16, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 2.72001e-36, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 5.95001e-28, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.82001e-29, crossover: "binomial", selection: "greedy" },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          { model: "DE/best/1", avgLowestFitness: 7.01002e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 7.32001e-22, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.42001e-22, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 8.46001e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 7.85001e-16, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 4.28001e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 3.65001e-14, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 4.90102e-21, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 2.30102e-16, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 2.72001e-15, crossover: "binomial", selection: "greedy" },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.35001e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.35001e-46, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.12001e-44, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.70102e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.35001e-30, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.32001e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.30102e-12, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.19001e-38, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 3.25001e-31, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.03001e-25, crossover: "binomial", selection: "greedy" },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description: "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.38001, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.83001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 2.90102, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.75001, crossover: "binomial", selection: "greedy" },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description: "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.48001e1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 4.15001, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 6.05001e4, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.45001e1, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.36001e1, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 9.95001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.03001e1, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.01001e-1, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 0.0, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.50001e-1, crossover: "binomial", selection: "greedy" },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          { model: "DE/best/1", avgLowestFitness: 4.05001e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.07001e-36, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.95001e-35, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.30102, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.92001e-16, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.35001e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.32001e-6, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 3.75001e-7, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.90102e-22, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 6.92001e-18, crossover: "binomial", selection: "greedy" },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description: "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          { model: "DE/best/1", avgLowestFitness: 8.62001e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.70102e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 8.30102e-3, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.47001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.17001e-4, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.26001, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.21001e-6, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 0.0, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 0.0, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 0.0, crossover: "binomial", selection: "greedy" },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.75001e-1, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 8.50102e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 7.35001e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.01002e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 4.85001e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 5.75001e-2, crossover: "binomial", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.30102e-2, crossover: "binomial", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 3.88001e-2, crossover: "binomial", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 6.48001e-2, crossover: "binomial", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.12001e-1, crossover: "binomial", selection: "greedy" },
        ],
      },
    },
  },
  onepoint: {
    sts: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.35001e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.15001e-44, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 2.70102e-42, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.65001, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.85001e-30, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 9.50102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 5.10102e-7, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.65001e-36, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 5.40102e-29, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.20102e-23, crossover: "onepoint", selection: "sts" },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.20102e-13, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.82001e-44, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 3.20102e-46, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.60102e-10, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 6.30102e-22, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.50102e-10, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.50102e-24, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.40102e-30, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.01002e-31, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 2.01002e-31, crossover: "onepoint", selection: "sts" },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.50102e1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 6.30102e44, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.15001e-40, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 7.80102e2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.40102e-25, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.90102e2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.05001e-15, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 2.90102e-36, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 6.30102e-28, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.90102e-29, crossover: "onepoint", selection: "sts" },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          { model: "DE/best/1", avgLowestFitness: 7.30102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 7.80102e-22, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.50102e-22, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 8.90102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 8.30102e-16, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 4.60102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 3.95001e-14, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 5.20102e-21, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 2.50102e-16, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 2.90102e-15, crossover: "onepoint", selection: "sts" },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.70102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.60102e-46, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 2.40102e-44, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 5.40102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.70102e-30, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.10102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.50102e-12, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.38001e-38, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 3.65001e-31, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.20102e-25, crossover: "onepoint", selection: "sts" },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description: "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.55001, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.01001, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 3.10102, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.85001, crossover: "onepoint", selection: "sts" },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description: "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.65001e1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 4.50102, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 6.40102e4, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.55001e1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.45001e1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.05001e1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.10102e1, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.10102e-1, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.60102e-1, crossover: "onepoint", selection: "sts" },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          { model: "DE/best/1", avgLowestFitness: 4.40102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.15001e-36, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 3.15001e-35, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.40102, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.10102e-16, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.80102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.40102e-6, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 4.10102e-7, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 2.10102e-22, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 7.30102e-18, crossover: "onepoint", selection: "sts" },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description: "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.10102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.85001e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 8.80102e-3, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.55001, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.25001e-4, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.35001, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.30102e-6, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "sts" },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.90102e-1, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 9.0102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 7.80102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.25001e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.20102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 6.10102e-2, crossover: "onepoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.40102e-2, crossover: "onepoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 4.15001e-2, crossover: "onepoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 6.85001e-2, crossover: "onepoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.18001e-1, crossover: "onepoint", selection: "sts" },
        ],
      },
    },
    greedy: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.95001e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 9.40102e-46, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.35001e-43, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.25001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.48001e-31, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.30102e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 4.70102e-7, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.38001e-37, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 5.05001e-30, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.05001e-24, crossover: "onepoint", selection: "greedy" },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.00102e-13, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.60102e-44, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.85001e-46, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.15001e-10, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.75001e-22, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.65001e-10, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.28001e-24, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.25001e-30, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.01002e-31, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.01002e-31, crossover: "onepoint", selection: "greedy" },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.15001e1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 6.05001e44, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.10102e-40, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 7.45001e2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.15001e-25, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.80102e2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 9.90102e-16, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 2.75001e-36, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 6.01002e-28, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.84001e-29, crossover: "onepoint", selection: "greedy" },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          { model: "DE/best/1", avgLowestFitness: 7.05001e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 7.45001e-22, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.43001e-22, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 8.55001e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 7.78001e-16, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 4.32001e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 3.62001e-14, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 4.95001e-21, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 2.35001e-16, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 2.75001e-15, crossover: "onepoint", selection: "greedy" },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.38001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.38001e-46, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.15001e-44, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.80102e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.38001e-30, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.45001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.33001e-12, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.20102e-38, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 3.30102e-31, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.05001e-25, crossover: "onepoint", selection: "greedy" },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description: "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.40102, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.86001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 2.93001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.78001, crossover: "onepoint", selection: "greedy" },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description: "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.50102e1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 4.20102, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 6.10102e4, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.47001e1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.38001e1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 9.90102, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.04001e1, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.03001e-1, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.53001e-1, crossover: "onepoint", selection: "greedy" },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          { model: "DE/best/1", avgLowestFitness: 4.10102e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.08001e-36, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.98001e-35, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.32001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.95001e-16, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.40102e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.34001e-6, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 3.80102e-7, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.93001e-22, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 6.98001e-18, crossover: "onepoint", selection: "greedy" },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description: "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          { model: "DE/best/1", avgLowestFitness: 8.70102e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.72001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 8.40102e-3, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.48001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.18001e-4, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.27001, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.22001e-6, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.01002e-1, crossover: "onepoint", selection: "greedy" },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.78001e-1, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 8.60102e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 7.40102e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.05001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 4.90102e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 5.80102e-2, crossover: "onepoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.32001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 3.92001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 6.52001e-2, crossover: "onepoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.13001e-1, crossover: "onepoint", selection: "greedy" },
        ],
      },
    },
  },
  twopoint: {
    sts: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.50102e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.22001e-44, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 2.85001e-42, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.80102, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 3.01002e-30, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 9.80102e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 5.30102e-7, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.72001e-36, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 5.60102e-29, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.25001e-23, crossover: "twopoint", selection: "sts" },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.25001e-13, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.90102e-44, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 3.35001e-46, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.75001e-10, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 6.50102e-22, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.80102e-10, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.55001e-24, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.45001e-30, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.50102e-31, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 2.50102e-31, crossover: "twopoint", selection: "sts" },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.70102e1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 6.50102e44, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.20102e-40, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 8.01002e2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.60102e-25, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.95001e2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.10102e-15, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 3.01002e-36, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 6.50102e-28, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.95001e-29, crossover: "twopoint", selection: "sts" },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          { model: "DE/best/1", avgLowestFitness: 7.50102e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 8.01002e-22, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.55001e-22, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 9.10102e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 8.50102e-16, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 4.75001e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 4.10102e-14, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 5.35001e-21, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 2.60102e-16, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 3.01002e-15, crossover: "twopoint", selection: "sts" },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.78001e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.68001e-46, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 2.50102e-44, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 5.60102e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.80102e-30, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.35001e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.55001e-12, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.42001e-38, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 3.80102e-31, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.25001e-25, crossover: "twopoint", selection: "sts" },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description: "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.62001, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.08001, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 3.18001, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.90102, crossover: "twopoint", selection: "sts" },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description: "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.72001e1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 4.70102, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 6.60102e4, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.60102e1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.50102e1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.08001e1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.13001e1, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.15001e-1, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.68001e-1, crossover: "twopoint", selection: "sts" },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          { model: "DE/best/1", avgLowestFitness: 4.55001e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.20102e-36, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 3.28001e-35, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.45001, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.18001e-16, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.01002e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.45001e-6, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 4.25001e-7, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 2.18001e-22, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 7.50102e-18, crossover: "twopoint", selection: "sts" },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description: "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.35001e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 1.92001e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 9.10102e-3, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.60102, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.30102e-4, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.40102, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.35001e-6, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "sts" },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 3.01002e-1, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/2", avgLowestFitness: 9.30102e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/best/3", avgLowestFitness: 8.01002e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.38001e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.35001e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 6.30102e-2, crossover: "twopoint", selection: "sts" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.45001e-2, crossover: "twopoint", selection: "sts" },
          { model: "rand/1", avgLowestFitness: 4.28001e-2, crossover: "twopoint", selection: "sts" },
          { model: "rand/2", avgLowestFitness: 7.05001e-2, crossover: "twopoint", selection: "sts" },
          { model: "rand/3", avgLowestFitness: 1.22001e-1, crossover: "twopoint", selection: "sts" },
        ],
      },
    },
    greedy: {
      axisParallelHyperEllipsoid: {
        name: "Axis Parallel Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.05001e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 9.70102e-46, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.45001e-43, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.35001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.55001e-31, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 8.50102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 4.85001e-7, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.42001e-37, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 5.20102e-30, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.08001e-24, crossover: "twopoint", selection: "greedy" },
        ],
      },
      sumOfDifferentPowers: {
        name: "Sum of Different Powers Function",
        description: "f(x) = \\sum_{i=1}^{n} \\left| x_i \\right|^{i+1}",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.05001e-13, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.65001e-44, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.92001e-46, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 3.25001e-10, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.90102e-22, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.80102e-10, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.32001e-24, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.28001e-30, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.50102e-31, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.50102e-31, crossover: "twopoint", selection: "greedy" },
        ],
      },
      rotatedHyperEllipsoid: {
        name: "Rotated Hyper Ellipsoid Function",
        description: "f(x) = \\sum_{i=1}^{n} \\sum_{j=1}^{i} x_j^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 9.30102e1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 6.20102e44, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.13001e-40, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 7.60102e2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 5.25001e-25, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.85001e2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.01002e-15, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 2.82001e-36, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 6.15001e-28, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.87001e-29, crossover: "twopoint", selection: "greedy" },
        ],
      },
      schewefel: {
        name: "Schwefel 2.22 Function",
        description: "f(x) = \\sum_{i=1}^{n} |x_i| + \\prod_{i=1}^{n} |x_i|",
        models: [
          { model: "DE/best/1", avgLowestFitness: 7.20102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 7.60102e-22, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.47001e-22, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 8.70102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 7.95001e-16, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 4.40102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 3.72001e-14, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 5.05001e-21, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 2.40102e-16, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 2.80102e-15, crossover: "twopoint", selection: "greedy" },
        ],
      },
      sphere: {
        name: "Sphere Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2",
        models: [
          { model: "DE/best/1", avgLowestFitness: 1.42001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.42001e-46, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 2.20102e-44, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.95001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 2.42001e-30, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.60102e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.36001e-12, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.23001e-38, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 3.40102e-31, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.08001e-25, crossover: "twopoint", selection: "greedy" },
        ],
      },
      ackley: {
        name: "Ackley Function",
        description: "f(x) = 20 + e - 20 \\exp\\left( -0.2 \\sqrt{ \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 } \\right) - \\exp\\left( \\frac{1}{n} \\sum_{i=1}^{n} \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.45001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 2.92001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 2.98001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.82001, crossover: "twopoint", selection: "greedy" },
        ],
      },
      rastrigin: {
        name: "Rastrigin Function",
        description: "f(x) = 10n + \\sum_{i=1}^{n} \\left( x_i^2 - 10 \\cos(2\\pi x_i) \\right)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.55001e1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 4.35001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 6.25001e4, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.50102e1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.41001e1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.01001e1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.06001e1, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.06001e-1, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.58001e-1, crossover: "twopoint", selection: "greedy" },
        ],
      },
      zakharov: {
        name: "Zakharov Function",
        description: "f(x) = \\sum_{i=1}^{n} x_i^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^2 + \\left( \\sum_{i=1}^{n} 0.5 x_i \\right)^4",
        models: [
          { model: "DE/best/1", avgLowestFitness: 4.20102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.10102e-36, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 3.05001e-35, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.35001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.98001e-16, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 7.55001e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.37001e-6, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 3.90102e-7, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.96001e-22, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 7.10001e-18, crossover: "twopoint", selection: "greedy" },
        ],
      },
      griewangk: {
        name: "Griewangk Function",
        description: "f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{4000} - \\prod_{i=1}^{n} \\cos\\left( \\frac{x_i}{\\sqrt{i}} \\right) + 1",
        models: [
          { model: "DE/best/1", avgLowestFitness: 8.85001e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 1.76001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 8.55001e-3, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 1.50102, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 1.20102e-4, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 1.29001, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.24001e-6, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.50102e-1, crossover: "twopoint", selection: "greedy" },
        ],
      },
      quartic: {
        name: "Quartic with Noise Function",
        description: "f(x) = \\sum_{i=1}^{n} i x_i^4 + \\text{random}[0, 1)",
        models: [
          { model: "DE/best/1", avgLowestFitness: 2.82001e-1, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/2", avgLowestFitness: 8.80102e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/best/3", avgLowestFitness: 7.55001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/1", avgLowestFitness: 4.12001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-best/2", avgLowestFitness: 4.98001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/1", avgLowestFitness: 5.92001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "DE/current-to-rand/2", avgLowestFitness: 1.35001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "rand/1", avgLowestFitness: 3.98001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "rand/2", avgLowestFitness: 6.62001e-2, crossover: "twopoint", selection: "greedy" },
          { model: "rand/3", avgLowestFitness: 1.15001e-1, crossover: "twopoint", selection: "greedy" },
        ],
      },
    },
  },
};

// return all function names
export const getFunctionNames = () => {
  return Object.keys(fitnessDataByCrossoverAndSelection.exponential.sts);
};

export const getCrossoverMethods = () => {
  return Object.keys(crossoverMethods);
};

export const getSelectionMethods = () => {
  return Object.keys(selectionMethods);
};

export const getFunctionDataByCrossoverAndSelection = (
  crossoverMethod,
  selectionMethod,
  functionName
) => {
  return (
    fitnessDataByCrossoverAndSelection[crossoverMethod]?.[selectionMethod]?.[
      functionName
    ] || null
  );
};

export const getAllFunctionData = (
  crossoverMethod = null,
  selectionMethod = null
) => {
  const allData = {};

  if (crossoverMethod === "all") {
    // Show all crossover methods and selection methods
    Object.keys(fitnessDataByCrossoverAndSelection).forEach((crossover) => {
      Object.keys(fitnessDataByCrossoverAndSelection[crossover]).forEach(
        (selection) => {
          Object.keys(
            fitnessDataByCrossoverAndSelection[crossover][selection]
          ).forEach((functionName) => {
            const functionData =
              fitnessDataByCrossoverAndSelection[crossover][selection][
                functionName
              ];
            if (functionData && functionData.models) {
              if (!allData[functionName]) {
                allData[functionName] = {
                  name: functionData.name,
                  description: functionData.description,
                  models: [],
                };
              }
              allData[functionName].models.push(...functionData.models);
            }
          });
        }
      );
    });
  } else if (crossoverMethod && selectionMethod === "all") {
    // Show all selection methods for specific crossover
    Object.keys(
      fitnessDataByCrossoverAndSelection[crossoverMethod] || {}
    ).forEach((selection) => {
      Object.keys(
        fitnessDataByCrossoverAndSelection[crossoverMethod][selection]
      ).forEach((functionName) => {
        const functionData =
          fitnessDataByCrossoverAndSelection[crossoverMethod][selection][
            functionName
          ];
        if (functionData && functionData.models) {
          if (!allData[functionName]) {
            allData[functionName] = {
              name: functionData.name,
              description: functionData.description,
              models: [],
            };
          }
          allData[functionName].models.push(...functionData.models);
        }
      });
    });
  } else if (crossoverMethod && selectionMethod) {
    // Show specific crossover and selection combination
    Object.keys(
      fitnessDataByCrossoverAndSelection[crossoverMethod]?.[selectionMethod] ||
        {}
    ).forEach((functionName) => {
      const functionData =
        fitnessDataByCrossoverAndSelection[crossoverMethod][selectionMethod][
          functionName
        ];
      if (functionData && functionData.models) {
        allData[functionName] = {
          name: functionData.name,
          description: functionData.description,
          models: [...functionData.models],
        };
      }
    });
  }

  return allData;
};

// Legacy compatibility - keep old exports working
export const fitnessDataByCrossover = {
  exponential: fitnessDataByCrossoverAndSelection.exponential.sts,
  binomial: {},
  onepoint: {},
  twopoint: {},
};

export const getFunctionDataByCrossover = (crossoverMethod, functionName) => {
  return getFunctionDataByCrossoverAndSelection(
    crossoverMethod,
    "sts",
    functionName
  );
};

export const fitnessData = getAllFunctionData("exponential", "sts");
export const getFunctionData = (functionName) =>
  getAllFunctionData("exponential", "sts")[functionName];
