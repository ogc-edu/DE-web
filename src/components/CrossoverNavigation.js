import React from "react";
import { crossoverMethods } from "../data/fitnessData";
import { crossoverIdToName } from "../data/variantMappings";
import { seriesCount } from "../data/chartSelection";
import { Button } from "./ui/button";

const LABELS = {
  exponential: "Exponential",
  binomial: "Binomial",
  onepoint: "One-Point",
  twopoint: "Two-Point",
};

const crossoverOptions = crossoverIdToName.map((key) => ({
  key,
  label: LABELS[key] || key,
  description: crossoverMethods[key],
}));

const buttonClass = (active) =>
  `rounded-lg transition-all duration-200 border-2 ${
    active
      ? "bg-accent-600 border-accent-600 text-white shadow-md shadow-accent-600/20"
      : "bg-white border-gray-100 text-muted-foreground hover:border-accent-600 hover:text-accent-600"
  }`;

/**
 * Quick single-crossover picker plus the escape hatch into the custom model
 * selector. The old "All Methods" option is gone: it concatenated all four
 * crossovers into one flat list where a name lookup silently kept only the
 * first match.
 */
const CrossoverNavigation = ({ selection, onSelectCrossover, onOpenCustom }) => {
  const isCustom = selection?.mode === "custom";
  const activeCrossover = isCustom ? null : selection?.crossovers?.[0];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {crossoverOptions.map((option) => (
        <Button
          key={option.key}
          variant={activeCrossover === option.key ? "default" : "outline"}
          size="sm"
          className={buttonClass(activeCrossover === option.key)}
          onClick={() => onSelectCrossover(option.key)}
          title={option.description}
        >
          {option.label}
        </Button>
      ))}
      <Button
        variant={isCustom ? "default" : "outline"}
        size="sm"
        className={buttonClass(isCustom)}
        onClick={onOpenCustom}
        title="Choose any combination of mutation, crossover and selection"
      >
        {isCustom
          ? `Custom (${seriesCount(selection)} series)`
          : "Custom…"}
      </Button>
    </div>
  );
};

export default CrossoverNavigation;
