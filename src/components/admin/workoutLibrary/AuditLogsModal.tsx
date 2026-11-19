import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  History, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { workoutLibraryService } from '../../../services/workoutLibraryService';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'imports' | 'audit'>('imports');
  const importLogs = workoutLibraryService.getImportLogs();
  const auditLogs = workoutLibraryService.getAuditLogs();

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#111927] to-[#0A0E17] border border-cyan-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              AUDIT TRAILS & INGESTION TELEMETRY
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            Import History & Operational Audit Logs
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete compliance logging of all batch imports, validations, deletions, and category reassignments.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('imports')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
              activeTab === 'imports'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Bulk Import Logs ({importLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
              activeTab === 'audit'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
            }`}
          >
            System Action Audit Log ({auditLogs.length})
          </button>
        </div>

        {/* Tab: Import Logs */}
        {activeTab === 'imports' && (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {importLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 bg-black/20 rounded-2xl">
                No bulk import events recorded yet. Upload an Excel or CSV file to populate history.
              </div>
            ) : (
              importLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                        <Upload className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm">{log.filename}</span>
                        <span className="text-[10px] text-gray-400 font-mono ml-2 uppercase">
                          ({log.fileFormat})
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {new Date(log.createdAt).toLocaleString()} by <strong className="text-gray-300">{log.importedBy}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-gray-400 block text-[10px]">TOTAL PARSED</span>
                      <span className="font-bold text-white text-sm">{log.totalRows}</span>
                    </div>
                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-300">
                      <span className="block text-[10px]">IMPORTED</span>
                      <span className="font-bold text-sm">+{log.importedCount}</span>
                    </div>
                    <div className="bg-amber-500/10 p-2 rounded-lg text-amber-300">
                      <span className="block text-[10px]">SKIPPED DUPLICATES</span>
                      <span className="font-bold text-sm">{log.duplicateCount}</span>
                    </div>
                    <div className="bg-red-500/10 p-2 rounded-lg text-red-300">
                      <span className="block text-[10px]">FAILED VALIDATION</span>
                      <span className="font-bold text-sm">{log.failedCount}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: System Action Audit Log */}
        {activeTab === 'audit' && (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 bg-black/20 rounded-2xl">
                No administrative actions recorded yet.
              </div>
            ) : (
              auditLogs.map((al) => (
                <div key={al.id} className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        al.action.includes('delete') ? 'bg-red-500/20 text-red-300' :
                        al.action.includes('import') ? 'bg-cyan-500/20 text-cyan-300' :
                        al.action.includes('publish') ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {al.action.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-white">{al.entityName}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{al.details}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono shrink-0 text-right">
                    <div>{new Date(al.timestamp).toLocaleTimeString()}</div>
                    <div>{new Date(al.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
