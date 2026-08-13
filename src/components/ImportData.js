import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useSimulation } from "../context/SimulationContext";
import { simulationService } from "../services/api";
import { IMPORT_TEMPLATE } from "../data/importTemplate";
import {
  mutationIdToName,
  crossoverIdToName,
  selectionIdToName,
} from "../data/variantMappings";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ImportData = () => {
  const navigate = useNavigate();
  const { fetchSimulations } = useSimulation();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null); // { name, size, content }
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(null); // { simulationId, totalModels }
  const [error, setError] = useState(null); // { message, details: [] }
  const [dragOver, setDragOver] = useState(false);

  const resetFeedback = () => {
    setSuccess(null);
    setError(null);
  };

  const ingestFile = (file) => {
    resetFeedback();
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError({
        message: "Please choose a .txt file.",
        details: [],
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError({
        message: "File must be 5 MB or smaller.",
        details: [],
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        size: file.size,
        content: String(reader.result ?? ""),
      });
    };
    reader.onerror = () => {
      setError({
        message: "Could not read the file. Please try again.",
        details: [],
      });
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file.
    e.target.value = "";
    ingestFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    ingestFile(file);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([IMPORT_TEMPLATE], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "import-template.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    resetFeedback();
    setIsImporting(true);
    try {
      const { data } = await simulationService.importFile({
        content: selectedFile.content,
        filename: selectedFile.name,
      });
      setSuccess({
        simulationId: data.simulationId,
        totalModels: data.totalModels,
      });
      // Refresh the dashboard/history lists so the imported record shows up.
      await fetchSimulations();
    } catch (err) {
      const responseData = err.response?.data || {};
      const details = Array.isArray(responseData.errors)
        ? responseData.errors.map((item) =>
            item.line != null
              ? `Line ${item.line}: ${item.message}`
              : item.message
          )
        : [];
      setError({
        message:
          responseData.message ||
          responseData.error ||
          err.message ||
          "Failed to import data.",
        details,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const clearFile = () => {
    resetFeedback();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 font-sans max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
            Import Data
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload your own results as a tab-separated .txt file and add them to
            your simulations.
          </p>
        </div>

        {/* Format guide — teaches the user how to format the file */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>How to format your file</CardTitle>
            <CardDescription>
              One line per (model &times; benchmark function). Columns are
              separated by a <strong>tab</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>
                First line must be exactly:{" "}
                <code className="bg-muted px-1 rounded">
                  model&nbsp;&nbsp;benchmark&nbsp;&nbsp;lowestFitness
                </code>{" "}
                (tab-separated).
              </li>
              <li>
                <code className="bg-muted px-1 rounded">model</code> ={" "}
                <code className="bg-muted px-1 rounded">
                  mutation/crossover/selection
                </code>{" "}
                (e.g. <code>DE/best/1/binomial/greedy</code>).
              </li>
              <li>
                <code className="bg-muted px-1 rounded">benchmark</code> = a
                number from 1 to 10.
              </li>
              <li>
                <code className="bg-muted px-1 rounded">lowestFitness</code> =
                one final number (scientific notation allowed, e.g.{" "}
                <code>2.99E-30</code>).
              </li>
              <li>
                Optional lines starting with <code>#</code> at the top set the
                DE settings (np, f, cr, gen, dim).
              </li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-primary-900 mb-1">Mutations</p>
                <p className="text-muted-foreground break-words">
                  {mutationIdToName.join(", ")}
                </p>
              </div>
              <div>
                <p className="font-semibold text-primary-900 mb-1">Crossovers</p>
                <p className="text-muted-foreground">
                  {crossoverIdToName.join(", ")}
                </p>
              </div>
              <div>
                <p className="font-semibold text-primary-900 mb-1">Selections</p>
                <p className="text-muted-foreground">
                  {selectionIdToName.join(", ")}
                </p>
              </div>
            </div>

            <pre className="bg-neutral-50 border rounded-xl p-4 text-xs overflow-x-auto text-muted-foreground whitespace-pre">
              {IMPORT_TEMPLATE}
            </pre>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
              className="rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Download template
            </Button>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Upload your data</CardTitle>
            <CardDescription>
              Choose a .txt file that follows the format above.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              id="import-file-input"
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="import-file-input"
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                dragOver
                  ? "border-accent-600 bg-accent-50/50"
                  : "border-gray-300 hover:border-accent-600 hover:bg-accent-50/30"
              }`}
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm font-medium text-primary-900">
                Drag & drop a .txt file, or click to browse
              </span>
              <span className="text-xs text-muted-foreground">
                Maximum size: 5 MB
              </span>
            </label>

            {selectedFile && (
              <div className="flex items-center justify-between gap-3 p-4 rounded-xl border bg-neutral-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-accent-600 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-primary-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm font-semibold text-red-700">
                    {error.message}
                  </p>
                </div>
                {error.details.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1 pl-6">
                    {error.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Imported {success.totalModels} result
                      {success.totalModels === 1 ? "" : "s"} successfully!
                    </p>
                    <p className="text-xs text-green-600 break-all">
                      Simulation ID: {success.simulationId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isImporting}
                className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/api")}
                className="rounded-xl"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ImportData;
