import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { benchmarkFunctions } from "../data/mockData";
import { crossoverMethods, selectionMethods } from "../data/fitnessData";
import { useSimulation } from "../context/SimulationContext";
import { simulationService } from "../services/api";
import {
  Play,
  Loader2,
  AlertCircle,
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "../lib/utils";

// 10 Mutation schemes
const mutationSchemes = [
  { value: "DE/rand/1", label: "DE/rand/1" },
  { value: "DE/rand/2", label: "DE/rand/2" },
  { value: "DE/rand/3", label: "DE/rand/3" },
  { value: "DE/best/1", label: "DE/best/1" },
  { value: "DE/best/2", label: "DE/best/2" },
  { value: "DE/best/3", label: "DE/best/3" },
  { value: "DE/current-to-best/1", label: "DE/current-to-best/1" },
  { value: "DE/current-to-best/2", label: "DE/current-to-best/2" },
  { value: "DE/current-to-rand/1", label: "DE/current-to-rand/1" },
  { value: "DE/current-to-rand/2", label: "DE/current-to-rand/2" },
];

const Simulator = () => {
  const navigate = useNavigate();
  const { setIsSimulating } = useSimulation();

  const [formData, setFormData] = useState({
    benchmarks: [],
    population: "15",
    scalingFactor: "0.5",
    crossoverRate: "0.9",
    generations: "1000",
    dimension: "30",
    mutationSchemes: [],
    crossoverMethods: [],
    selectionMethods: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showQueueFullDialog, setShowQueueFullDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    benchmarks: false,
    mutationSchemes: false,
    crossoverMethods: false,
    selectionMethods: false,
  });
  
  const errorAlertRef = useRef(null);

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setSubmitError("");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setSubmitError("");
  };

  const validatePage1 = () => {
    const newErrors = {};

    // Validate population
    const population = parseInt(formData.population);
    if (
      !formData.population ||
      isNaN(population) ||
      population < 10 ||
      population > 20
    ) {
      newErrors.population = "Population must be between 10 and 20";
    }

    // Validate scaling factor
    const scalingFactor = parseFloat(formData.scalingFactor);
    if (
      !formData.scalingFactor ||
      isNaN(scalingFactor) ||
      scalingFactor < 0.1 ||
      scalingFactor > 2.0
    ) {
      newErrors.scalingFactor = "Scaling factor must be between 0.1 and 2.0";
    }

    // Validate crossover rate
    const crossoverRate = parseFloat(formData.crossoverRate);
    if (
      !formData.crossoverRate ||
      isNaN(crossoverRate) ||
      crossoverRate < 0.01 ||
      crossoverRate > 1.0
    ) {
      newErrors.crossoverRate = "Crossover rate must be between 0.01 and 1.0";
    }

    // Validate generations
    const generations = parseInt(formData.generations);
    if (
      !formData.generations ||
      isNaN(generations) ||
      generations < 1 ||
      generations > 100000
    ) {
      newErrors.generations = "Generations must be between 1 and 100000";
    }

    // Validate dimension
    const dimension = parseInt(formData.dimension);
    if (
      !formData.dimension ||
      isNaN(dimension) ||
      dimension < 1 ||
      dimension > 1000
    ) {
      newErrors.dimension = "Dimension must be between 1 and 1000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors = {};

    // Validate benchmarks
    if (!formData.benchmarks || formData.benchmarks.length === 0) {
      newErrors.benchmarks = "Please select at least one benchmark function";
    }

    // Validate mutation schemes
    if (!formData.mutationSchemes || formData.mutationSchemes.length === 0) {
      newErrors.mutationSchemes = "Please select at least one mutation scheme";
    }

    // Validate crossover methods
    if (!formData.crossoverMethods || formData.crossoverMethods.length === 0) {
      newErrors.crossoverMethods = "Please select at least one crossover method";
    }

    // Validate selection methods
    if (!formData.selectionMethods || formData.selectionMethods.length === 0) {
      newErrors.selectionMethods = "Please select at least one selection method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const page1Valid = validatePage1();
    const page2Valid = validatePage2();
    return page1Valid && page2Valid;
  };

  const handleNext = () => {
    if (validatePage1()) {
      setCurrentPage(2);
    }
  };

  const handleBack = () => {
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePage2()) {
      return;
    }

    // Clear any previous errors before showing confirmation dialog
    setSubmitError("");
    
    // Show confirmation dialog instead of submitting immediately
    setShowConfirmationDialog(true);
  };

  const handleConfirmSubmit = async () => {
    // Close confirmation dialog first
    setShowConfirmationDialog(false);
    
    // Clear any previous errors
    setSubmitError("");
    
    setIsSubmitting(true);

    try {
      const simulationData = {
        benchmarks: formData.benchmarks,
        np: parseInt(formData.population),
        f: parseFloat(formData.scalingFactor),
        cr: parseFloat(formData.crossoverRate),
        generations: parseInt(formData.generations),
        dimension: parseInt(formData.dimension),
        mutationSchemes: formData.mutationSchemes,
        crossoverMethods: formData.crossoverMethods,
        selectionMethods: formData.selectionMethods,
      };

      const response = await simulationService.create(simulationData);

      // Navigate to dashboard after successful submission
      setIsSimulating(true);
      navigate("/api", { state: { newSimulation: response.data } });
    } catch (error) {
      console.error("Error creating simulation:", error);
      
      // Check if error is queue full
      const errorMessage = error.response?.data?.message || error.message || "";
      const isNetworkError = !error.response && error.message;
      
      if (
        errorMessage.toLowerCase().includes("queue") ||
        errorMessage.toLowerCase().includes("full") ||
        error.response?.status === 503
      ) {
        setShowQueueFullDialog(true);
      } else if (isNetworkError || error.code === "NETWORK_ERROR" || error.code === "ECONNABORTED") {
        // Network error - only show after confirmation
        setSubmitError(
          "Network error: Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        // Other errors - only show after confirmation
        setSubmitError(
          errorMessage || "Failed to start simulation. Please try again."
        );
      }
      setIsSimulating(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Scroll to top when error is shown after confirmation dialog closes
  useEffect(() => {
    if (submitError && !showConfirmationDialog && !showQueueFullDialog) {
      // Small delay to ensure the error element is rendered and dialog is fully closed
      setTimeout(() => {
        if (errorAlertRef.current) {
          errorAlertRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        } else {
          // Fallback to scroll to top of page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 200);
    }
  }, [submitError, showConfirmationDialog, showQueueFullDialog]);

  const CheckboxGroup = ({ label, options, selectedValues, onChange, error, field }) => (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border-2 transition-colors",
          error
            ? "border-red-500 bg-red-50/50"
            : "border-gray-200 bg-neutral-50"
        )}
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const labelText = typeof option === "string" ? option : option.label;
          const isSelected = selectedValues.includes(value);
          return (
            <label
              key={value}
              onClick={() => onChange(value)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                isSelected
                  ? "bg-accent-600 text-white shadow-md"
                  : "bg-white hover:bg-gray-50 border border-gray-200"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-white border-white"
                    : "border-gray-300 bg-white"
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-accent-600" />}
              </div>
              <span className="text-sm font-medium">{labelText}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 font-sans max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
            Create New Simulation
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure parameters for your Differential Evolution simulation
          </p>
        </div>

        {/* Error Alert - Only show when dialog is closed */}
        {submitError && !showConfirmationDialog && (
          <Card 
            ref={errorAlertRef}
            className="border-red-200 bg-red-50"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              currentPage === 1
                ? "bg-accent-600 w-8"
                : "bg-gray-300"
            )}
          />
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              currentPage === 2
                ? "bg-accent-600 w-8"
                : "bg-gray-300"
            )}
          />
        </div>

        {/* Simulation Form */}
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>
                Simulation Parameters - Page {currentPage} of 2
              </CardTitle>
              <CardDescription>
                {currentPage === 1
                  ? "Enter the numerical parameters for your DE simulation."
                  : "Select the benchmark functions, mutation schemes, crossover methods, and selection methods."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Page 1: Numerical Parameters */}
              {currentPage === 1 && (
                <>
                  {/* Number of Population */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="population"
                      className="text-base font-semibold"
                    >
                      Number of Population (NP){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="population"
                      type="number"
                      min="10"
                      max="20"
                      step="1"
                      value={formData.population}
                      onChange={(e) =>
                        handleChange("population", e.target.value)
                      }
                      placeholder="e.g., 15"
                      className={cn(
                        "bg-neutral-50 border-none rounded-xl",
                        errors.population ? "border-red-500 border-2" : ""
                      )}
                    />
                    {errors.population && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.population}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Range: 10-20
                    </p>
                  </div>

                  {/* Scaling Factor */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="scalingFactor"
                      className="text-base font-semibold"
                    >
                      Scaling Factor (F) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="scalingFactor"
                      type="number"
                      min="0.1"
                      max="2.0"
                      step="0.01"
                      value={formData.scalingFactor}
                      onChange={(e) =>
                        handleChange("scalingFactor", e.target.value)
                      }
                      placeholder="e.g., 0.5"
                      className={cn(
                        "bg-neutral-50 border-none rounded-xl",
                        errors.scalingFactor ? "border-red-500 border-2" : ""
                      )}
                    />
                    {errors.scalingFactor && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.scalingFactor}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Range: 0.1-2.0
                    </p>
                  </div>

                  {/* Crossover Rate */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="crossoverRate"
                      className="text-base font-semibold"
                    >
                      Crossover Rate (Cr){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="crossoverRate"
                      type="number"
                      min="0.01"
                      max="1.0"
                      step="0.01"
                      value={formData.crossoverRate}
                      onChange={(e) =>
                        handleChange("crossoverRate", e.target.value)
                      }
                      placeholder="e.g., 0.9"
                      className={cn(
                        "bg-neutral-50 border-none rounded-xl",
                        errors.crossoverRate ? "border-red-500 border-2" : ""
                      )}
                    />
                    {errors.crossoverRate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.crossoverRate}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Range: 0.01-1.0
                    </p>
                  </div>

                  {/* Dimension */}
                  <div className="space-y-2">
                    <Label htmlFor="dimension" className="text-base font-semibold">
                      Dimension <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dimension"
                      type="number"
                      min="1"
                      max="1000"
                      step="1"
                      value={formData.dimension}
                      onChange={(e) => handleChange("dimension", e.target.value)}
                      placeholder="e.g., 30"
                      className={cn(
                        "bg-neutral-50 border-none rounded-xl",
                        errors.dimension ? "border-red-500 border-2" : ""
                      )}
                    />
                    {errors.dimension && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dimension}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Range: 1-1000
                    </p>
                  </div>

                  {/* Number of Generations */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="generations"
                      className="text-base font-semibold"
                    >
                      Number of Generations{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="generations"
                      type="number"
                      min="1"
                      max="100000"
                      step="1"
                      value={formData.generations}
                      onChange={(e) =>
                        handleChange("generations", e.target.value)
                      }
                      placeholder="e.g., 1000"
                      className={cn(
                        "bg-neutral-50 border-none rounded-xl",
                        errors.generations ? "border-red-500 border-2" : ""
                      )}
                    />
                    {errors.generations && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.generations}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Range: 1-100000
                    </p>
                  </div>
                </>
              )}

              {/* Page 2: Checkbox Selections */}
              {currentPage === 2 && (
                <>
                  {/* Benchmark Functions - Multiple Selection */}
                  <CheckboxGroup
                    label="Benchmark Functions"
                    options={benchmarkFunctions}
                    selectedValues={formData.benchmarks}
                    onChange={(value) =>
                      handleCheckboxChange("benchmarks", value)
                    }
                    error={errors.benchmarks}
                    field="benchmarks"
                  />

                  {/* Mutation Schemes - Multiple Selection */}
                  <CheckboxGroup
                    label="Mutation Schemes"
                    options={mutationSchemes}
                    selectedValues={formData.mutationSchemes}
                    onChange={(value) =>
                      handleCheckboxChange("mutationSchemes", value)
                    }
                    error={errors.mutationSchemes}
                    field="mutationSchemes"
                  />

                  {/* Crossover Methods - Multiple Selection */}
                  <CheckboxGroup
                    label="Crossover Methods"
                    options={Object.entries(crossoverMethods).map(
                      ([key, label]) => ({
                        value: key,
                        label: label,
                      })
                    )}
                    selectedValues={formData.crossoverMethods}
                    onChange={(value) =>
                      handleCheckboxChange("crossoverMethods", value)
                    }
                    error={errors.crossoverMethods}
                    field="crossoverMethods"
                  />

                  {/* Selection Methods - Multiple Selection */}
                  <CheckboxGroup
                    label="Selection Methods"
                    options={Object.entries(selectionMethods).map(
                      ([key, label]) => ({
                        value: key,
                        label: label,
                      })
                    )}
                    selectedValues={formData.selectionMethods}
                    onChange={(value) =>
                      handleCheckboxChange("selectionMethods", value)
                    }
                    error={errors.selectionMethods}
                    field="selectionMethods"
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  {currentPage === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="rounded-xl px-6 py-3 text-base font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/api")}
                    disabled={isSubmitting}
                    className="rounded-xl px-6 py-3 text-base font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  {currentPage === 1 && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl shadow-lg shadow-accent-600/20 px-8 py-3 text-base font-semibold"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {currentPage === 2 && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl shadow-lg shadow-accent-600/20 px-8 py-3 text-base font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting Simulation...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Start Simulation
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Confirm Simulation Parameters
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Please review all parameters before starting the simulation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Numerical Parameters */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary-900 border-b pb-2">
                  Numerical Parameters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Number of Population (NP)
                    </p>
                    <p className="text-base font-semibold">
                      {formData.population}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Scaling Factor (F)
                    </p>
                    <p className="text-base font-semibold">
                      {formData.scalingFactor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Crossover Rate (Cr)
                    </p>
                    <p className="text-base font-semibold">
                      {formData.crossoverRate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Dimension</p>
                    <p className="text-base font-semibold">
                      {formData.dimension}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Number of Generations
                    </p>
                    <p className="text-base font-semibold">
                      {formData.generations}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benchmark Functions - Collapsible */}
              <div className="border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection("benchmarks")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold">
                      Benchmark Functions
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formData.benchmarks.length} selected)
                    </span>
                  </div>
                  {expandedSections.benchmarks ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.benchmarks && (
                  <div className="px-4 pb-4 space-y-2">
                    {formData.benchmarks.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.benchmarks.map((benchmark) => (
                          <span
                            key={benchmark}
                            className="px-3 py-1 bg-accent-600 text-white rounded-lg text-sm font-medium"
                          >
                            {benchmark}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No benchmark functions selected
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Mutation Schemes - Collapsible */}
              <div className="border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection("mutationSchemes")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold">
                      Mutation Schemes
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formData.mutationSchemes.length} selected)
                    </span>
                  </div>
                  {expandedSections.mutationSchemes ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.mutationSchemes && (
                  <div className="px-4 pb-4 space-y-2">
                    {formData.mutationSchemes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.mutationSchemes.map((scheme) => (
                          <span
                            key={scheme}
                            className="px-3 py-1 bg-accent-600 text-white rounded-lg text-sm font-medium"
                          >
                            {scheme}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No mutation schemes selected
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Crossover Methods - Collapsible */}
              <div className="border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection("crossoverMethods")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold">
                      Crossover Methods
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formData.crossoverMethods.length} selected)
                    </span>
                  </div>
                  {expandedSections.crossoverMethods ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.crossoverMethods && (
                  <div className="px-4 pb-4 space-y-2">
                    {formData.crossoverMethods.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.crossoverMethods.map((method) => (
                          <span
                            key={method}
                            className="px-3 py-1 bg-accent-600 text-white rounded-lg text-sm font-medium"
                          >
                            {crossoverMethods[method]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No crossover methods selected
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Selection Methods - Collapsible */}
              <div className="border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection("selectionMethods")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold">
                      Selection Methods
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formData.selectionMethods.length} selected)
                    </span>
                  </div>
                  {expandedSections.selectionMethods ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.selectionMethods && (
                  <div className="px-4 pb-4 space-y-2">
                    {formData.selectionMethods.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.selectionMethods.map((method) => (
                          <span
                            key={method}
                            className="px-3 py-1 bg-accent-600 text-white rounded-lg text-sm font-medium"
                          >
                            {selectionMethods[method]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No selection methods selected
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmationDialog(false)}
                disabled={isSubmitting}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Confirm & Start
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Queue Full Dialog */}
        <Dialog open={showQueueFullDialog} onOpenChange={setShowQueueFullDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <DialogTitle>Simulation Queue Full</DialogTitle>
              </div>
              <DialogDescription className="text-base pt-2">
                The current simulation queue is full. Please try again later.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => setShowQueueFullDialog(false)}
                className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Simulator;
