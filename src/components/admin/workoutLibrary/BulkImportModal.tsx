import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Code, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Repeat, 
  X, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { bulkImportService } from '../../../services/bulkImportService';
import { workoutLibraryService } from '../../../services/workoutLibraryService';
import { WorkoutValidationResult, WorkoutItem, WorkoutValidationError } from '../../../types/workoutLibrary';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ processed: number; total: number }>({ processed: 0, total: 0 });
  const [validationResult, setValidationResult] = useState<WorkoutValidationResult | null>(null);
  const [duplicatePolicy, setDuplicatePolicy] = useState<'skip' | 'overwrite'>('skip');
  const [batchSize, setBatchSize] = useState<number>(100);
  const [importFinishedSummary, setImportFinishedSummary] = useState<{ imported: number; updated: number; skipped: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setValidationResult(null);
    setImportFinishedSummary(null);
    setIsParsing(true);

    try {
      const { rawRows } = await bulkImportService.parseFile(file);
      if (rawRows.length === 0) {
        throw new Error('Uploaded file contains no rows or records.');
      }

      const existing = await workoutLibraryService.getAllCached();
      const result = bulkImportService.validateRows(rawRows, existing);
      setValidationResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to read or parse file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteImport = async () => {
    if (!validationResult || validationResult.valid.length === 0 && validationResult.duplicates.length === 0) return;

    setIsImporting(true);
    setErrorMessage(null);

    try {
      // Items to process: valid records + duplicate records if policy is overwrite
      const itemsToImport: WorkoutItem[] = [
        ...validationResult.valid,
        ...(duplicatePolicy === 'overwrite' ? validationResult.duplicates.map((d: { item: WorkoutItem }) => d.item) : [])
      ];

      setImportProgress({ processed: 0, total: itemsToImport.length });

      const result = await workoutLibraryService.importBatch(itemsToImport, {
        overwriteExisting: duplicatePolicy === 'overwrite',
        batchSize,
        onProgress: (processed: number, total: number) => {
          setImportProgress({ processed, total });
        }
      });

      // Record in import logs
      workoutLibraryService.addImportLog({
        id: 'log-' + Date.now(),
        filename: selectedFile?.name || 'unknown_upload',
        fileFormat: (selectedFile?.name.split('.').pop()?.toLowerCase() as any) || 'xlsx',
        totalRows: validationResult.total,
        importedCount: result.imported,
        duplicateCount: result.skipped,
        failedCount: validationResult.invalid.length,
        errorDetails: validationResult.invalid.flatMap((inv: { errors: WorkoutValidationError[]; data: any }) => inv.errors),
        importedBy: 'Super Admin',
        createdAt: new Date().toISOString()
      });

      setImportFinishedSummary(result);
      onImportComplete();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Batch import failed during processing.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadFailed = () => {
    if (validationResult && validationResult.invalid.length > 0) {
      bulkImportService.exportFailedRows(validationResult.invalid);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setImportFinishedSummary(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#111927] to-[#0A0E17] border border-cyan-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              BULK WORKOUT INGESTION ENGINE
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Scalable Batch Architecture (50,000+ Records Capacity)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Bulk Workout Library Upload
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Upload workout entries in Excel (.xlsx), CSV, or JSON formats with automated schema validation, duplicate detection, and transactional batch imports.
          </p>
        </div>

        {/* Template Downloads Row */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
              Download Standardized Import Templates:
            </span>
            <span className="text-[11px] text-gray-500">
              Pre-populated with 21 column headers, sample exercises, and formatting instructions
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => bulkImportService.downloadExcelTemplate()}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => bulkImportService.downloadCSVTemplate()}
              className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => bulkImportService.downloadJSONTemplate()}
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Upload Zone */}
        {!validationResult && !importFinishedSummary && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-cyan-400 bg-white/[0.02] hover:bg-cyan-950/20 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all space-y-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              {isParsing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isParsing ? 'Parsing and validating file structure...' : 'Click to select or drop an Excel, CSV, or JSON file here'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Supports up to 50,000 workout rows per file. Validates required fields, enum bounds, and duplicates.
              </p>
            </div>
          </div>
        )}

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <span className="font-bold">Import Error: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Validation Inspector & Pre-Import Preview */}
        {validationResult && !importFinishedSummary && (
          <div className="space-y-5 animate-fade-in">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-gray-400 uppercase block">Total Rows</span>
                <span className="text-xl font-bold text-white mt-1 block">{validationResult.total}</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-300">
                <span className="uppercase block">Valid & Ready</span>
                <span className="text-xl font-bold mt-1 block">{validationResult.valid.length}</span>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-300">
                <span className="uppercase block">Duplicates</span>
                <span className="text-xl font-bold mt-1 block">{validationResult.duplicates.length}</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300">
                <span className="uppercase block">Failed Validation</span>
                <span className="text-xl font-bold mt-1 block">{validationResult.invalid.length}</span>
              </div>
            </div>

            {/* Batch & Duplicate Configuration */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-gray-300 block mb-1">
                  Duplicate Handling Policy:
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dupPolicy"
                      checked={duplicatePolicy === 'skip'}
                      onChange={() => setDuplicatePolicy('skip')}
                      className="accent-cyan-400"
                    />
                    <span>Skip Duplicates ({validationResult.duplicates.length})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dupPolicy"
                      checked={duplicatePolicy === 'overwrite'}
                      onChange={() => setDuplicatePolicy('overwrite')}
                      className="accent-cyan-400"
                    />
                    <span>Overwrite / Update Existing</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-gray-300 block mb-1">
                  Batch Chunk Size:
                </label>
                <select
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="bg-[#141923] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value={50}>50 rows per batch (Safer)</option>
                  <option value={100}>100 rows per batch (Recommended)</option>
                  <option value={250}>250 rows per batch (High speed)</option>
                </select>
              </div>
            </div>

            {/* Failed Records Action */}
            {validationResult.invalid.length > 0 && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-red-200">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    <strong>{validationResult.invalid.length} records</strong> failed validation. Download the correction spreadsheet, fix errors, and re-upload.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadFailed}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-mono font-bold shrink-0 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Errors (.xlsx)</span>
                </button>
              </div>
            )}

            {/* Valid Rows Preview Table (first 5 rows) */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-mono">
                <span>Preview Valid Workouts (Showing top {Math.min(5, validationResult.valid.length)} of {validationResult.valid.length})</span>
                <span>File: {selectedFile?.name}</span>
              </div>
              <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 font-mono uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Workout Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Primary Muscle</th>
                      <th className="py-2.5 px-3">Difficulty</th>
                      <th className="py-2.5 px-3">Sets/Reps</th>
                      <th className="py-2.5 px-3">Environment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {validationResult.valid.slice(0, 5).map((row: WorkoutItem, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="py-2 px-3 font-bold text-white">{row.name}</td>
                        <td className="py-2 px-3 text-cyan-300">{row.category}</td>
                        <td className="py-2 px-3 text-gray-300">{row.primaryMuscle}</td>
                        <td className="py-2 px-3 capitalize">{row.difficulty}</td>
                        <td className="py-2 px-3 text-gray-400">{row.recommendedSets} × {row.recommendedReps}</td>
                        <td className="py-2 px-3 uppercase text-gray-400">{row.environment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Import Progress Bar if Importing */}
            {isImporting && (
              <div className="space-y-2 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing Batch Ingestion...
                  </span>
                  <span className="font-bold text-white">
                    {importProgress.processed} / {importProgress.total} Records
                  </span>
                </div>
                <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200"
                    style={{ width: `${Math.round((importProgress.processed / Math.max(1, importProgress.total)) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion Success Summary */}
        {importFinishedSummary && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Bulk Import Successfully Completed</h3>
              <p className="text-xs text-emerald-200/90 mt-1">
                The workout catalog has been indexed and synced with the application.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs font-mono pt-2">
              <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3">
                <span className="text-gray-400 uppercase block text-[10px]">New Imported</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">+{importFinishedSummary.imported}</span>
              </div>
              <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3">
                <span className="text-gray-400 uppercase block text-[10px]">Updated</span>
                <span className="text-xl font-bold text-blue-400 mt-1 block">{importFinishedSummary.updated}</span>
              </div>
              <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3">
                <span className="text-gray-400 uppercase block text-[10px]">Skipped Duplicates</span>
                <span className="text-xl font-bold text-gray-400 mt-1 block">{importFinishedSummary.skipped}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            {(validationResult || importFinishedSummary) && (
              <button
                type="button"
                onClick={resetAll}
                disabled={isImporting}
                className="text-xs text-gray-400 hover:text-white underline font-mono"
              >
                Upload another file
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isImporting}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
            >
              {importFinishedSummary ? 'Close' : 'Cancel'}
            </button>

            {validationResult && !importFinishedSummary && (
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || (validationResult.valid.length === 0 && (duplicatePolicy === 'skip' || validationResult.duplicates.length === 0))}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Ingestion...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Confirm & Ingest {validationResult.valid.length + (duplicatePolicy === 'overwrite' ? validationResult.duplicates.length : 0)} Records
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
