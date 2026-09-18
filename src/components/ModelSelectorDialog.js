import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { crossoverMethods, selectionMethods } from "../data/fitnessData";
import {
  mutationIdToName,
  crossoverIdToName,
  selectionIdToName,
} from "../data/variantMappings";
import {
  seriesCount,
  barCount,
  COMFORTABLE_SERIES,
} from "../data/chartSelection";

const GROUPS = [
  {
    field: "mutations",
    title: "Mutation",
    options: mutationIdToName.map((name) => ({ key: name, label: name })),
  },
  {
    field: "crossovers",
    title: "Crossover",
    options: crossoverIdToName.map((key) => ({
      key,
      label: crossoverMethods[key] || key,
    })),
  },
  {
    field: "selections",
    title: "Selection",
    options: selectionIdToName.map((key) => ({
      key,
      label: selectionMethods[key] || key,
    })),
  },
];

// There is no checkbox primitive in ui/ and adding a dependency is out of scope,
// so this is a native input styled with Tailwind.
const CheckboxRow = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 py-1 text-sm cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600 accent-accent-600"
    />
    <span className={checked ? "text-primary-900" : "text-muted-foreground"}>
      {label}
    </span>
  </label>
);

/**
 * Staged editor for the chart selection state. Edits live in local state until
 * Apply; Cancel throws them away.
 */
const ModelSelectorDialog = ({ open, onOpenChange, value, onApply }) => {
  const [draft, setDraft] = useState(value);

  // Re-seed from the committed value whenever the dialog is (re)opened, so a
  // cancelled edit never leaks into the next session.
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const toggle = (field, key) =>
    setDraft((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: current.includes(key)
          ? current.filter((k) => k !== key)
          : [...current, key],
      };
    });

  const setGroup = (field, keys) =>
    setDraft((prev) => ({ ...prev, [field]: keys }));

  const series = seriesCount(draft);
  const bars = barCount(draft);
  const emptyGroups = GROUPS.filter(
    (group) => (draft[group.field] || []).length === 0
  );
  const valid = emptyGroups.length === 0;
  const crowded = series > COMFORTABLE_SERIES;

  const summary = `${draft.crossovers?.length || 0} crossover × ${
    draft.selections?.length || 0
  } selection = ${series} series × ${draft.mutations?.length || 0} mutations = ${bars} bars`;

  const handleApply = () => {
    if (!valid) return;
    onApply({ ...draft, mode: "custom" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Custom model selection</DialogTitle>
          <DialogDescription>
            Pick which variants to plot. Mutations stay on the x-axis; every
            crossover × selection pair becomes its own series.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {GROUPS.map((group) => {
            const picked = draft[group.field] || [];
            const allKeys = group.options.map((o) => o.key);
            return (
              <div key={group.field}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-primary-900">
                    {group.title}
                  </h3>
                  <button
                    type="button"
                    className="text-xs text-accent-600 hover:underline"
                    aria-label={`${
                      picked.length === allKeys.length ? "Clear" : "Select all"
                    } ${group.title.toLowerCase()}`}
                    onClick={() =>
                      setGroup(
                        group.field,
                        picked.length === allKeys.length ? [] : allKeys
                      )
                    }
                  >
                    {picked.length === allKeys.length ? "Clear" : "Select all"}
                  </button>
                </div>
                <div className="rounded-lg border border-gray-100 p-3">
                  {group.options.map((option) => (
                    <CheckboxRow
                      key={option.key}
                      label={option.label}
                      checked={picked.includes(option.key)}
                      onChange={() => toggle(group.field, option.key)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 text-sm">
          <p className="text-muted-foreground">
            {summary}
            {crowded && (
              <span className="text-amber-600">
                {" "}
                — above the comfortable limit ({COMFORTABLE_SERIES} series) —
                consider Top-N
              </span>
            )}
          </p>
          {!valid && (
            <p className="text-red-600 mt-1">
              Select at least one{" "}
              {emptyGroups.map((g) => g.title.toLowerCase()).join(" and one ")}{" "}
              to apply.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!valid}
            className="bg-accent-600 hover:bg-accent-700 text-white"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelSelectorDialog;
