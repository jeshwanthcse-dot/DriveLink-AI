/**
 * components/trust/DocumentUploadCenter.tsx
 * Drag & Drop dashboard with HTML5 DragEvents simulation, loading overlays, previews, and history audit trails.
 * Sprint 9 — DriveLink AI
 */

"use client";

import * as React from "react";
import { DocumentType, DriverDocument, DocumentHistoryEntry } from "@/types/trust";
import { useTrustStore } from "@/store/trust-store";
import { OCRVerificationBadge } from "./OCRVerificationBadge";
import { Upload, FileText, Eye, History, RotateCcw, ShieldCheck, ShieldAlert, Check, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface DocumentUploadCenterProps {
  driverId: string;
}

const documentConfig: Record<DocumentType, { label: string; desc: string; sampleFile: string }> = {
  license: {
    label: "Driving License",
    desc: "National vehicle operation permit card (Front & Back)",
    sampleFile: "driver_license_miller.pdf",
  },
  insurance: {
    label: "Commercial Insurance",
    desc: "Commercial liability coverage certificate",
    sampleFile: "insurance_commercial_apex.pdf",
  },
  rc: {
    label: "Vehicle RC (Registration)",
    desc: "Smart card or registration certificate copy",
    sampleFile: "vehicle_registration_rc.png",
  },
  puc: {
    label: "PUC Certificate",
    desc: "Pollution Under Control compliance test certificate",
    sampleFile: "puc_certificate_miller.png",
  },
  photo: {
    label: "Profile Photo",
    desc: "Clear front-facing portrait photo for ID verification",
    sampleFile: "profile_miller_vetted.jpg",
  },
};

export function DocumentUploadCenter({ driverId }: DocumentUploadCenterProps) {
  const getProfile = useTrustStore((state) => state.getProfile);
  const uploadDocument = useTrustStore((state) => state.uploadDocument);
  const runSimulatedOCR = useTrustStore((state) => state.runSimulatedOCR);
  const resetProfile = useTrustStore((state) => state.resetProfile);

  const profile = getProfile(driverId);
  const [selectedType, setSelectedType] = React.useState<DocumentType>("license");
  const [dragActive, setDragActive] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState<Record<string, boolean>>({});

  const activeDoc = profile.documents[selectedType];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (fileName: string) => {
    setIsProcessing((prev) => ({ ...prev, [selectedType]: true }));
    
    // Upload document state (sets pending)
    const mockImageUrl = `/assets/documents/${selectedType}-mock.jpg`;
    uploadDocument(driverId, selectedType, fileName, mockImageUrl);

    // Wait and execute OCR simulation
    try {
      await runSimulatedOCR(driverId, selectedType);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing((prev) => ({ ...prev, [selectedType]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file.name);
    }
  };

  const triggerMockUpload = () => {
    const defaultName = documentConfig[selectedType].sampleFile;
    processFile(defaultName);
  };

  const handleReset = () => {
    resetProfile(driverId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Document Management Center</h3>
          <p className="text-xs text-slate-450">Upload, audit, and inspect your compliance certificates</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs border-dashed text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Default
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of documents & statuses */}
        <div className="lg:col-span-4 space-y-2">
          {(Object.keys(profile.documents) as DocumentType[]).map((type) => {
            const doc = profile.documents[type];
            const isSelected = selectedType === type;
            const docMeta = documentConfig[type];

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-2.5",
                  isSelected
                    ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-soft"
                    : "bg-white dark:bg-slate-900 border-border hover:bg-slate-50 dark:hover:bg-slate-850"
                )}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{docMeta.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{docMeta.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-850/60">
                  <span className="text-[10px] font-mono text-slate-400">
                    {doc.fileName ? doc.fileName : "Not uploaded"}
                  </span>
                  <OCRVerificationBadge status={doc.status} confidenceScore={doc.confidenceScore} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column: Workspace (Upload zone + Preview + Audit trail) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-border overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                    {documentConfig[selectedType].label} Workspace
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {documentConfig[selectedType].desc}
                  </CardDescription>
                </div>
                <OCRVerificationBadge status={activeDoc.status} confidenceScore={activeDoc.confidenceScore} />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Upload Zone */}
              {activeDoc.status === "missing" || activeDoc.status === "rejected" ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-slate-400 bg-slate-50/50 dark:bg-slate-950/20"
                  )}
                >
                  <div className="p-4 bg-primary/10 rounded-full text-primary mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Drag & Drop files here or browse
                    </h5>
                    <p className="text-[10px] text-slate-450 mt-1 max-w-xs mx-auto">
                      Supports PDF, PNG, JPG up to 10MB. File details will be processed automatically using mock OCR.
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90 transition-all shadow-soft active:scale-[0.98]">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleFileInput}
                        disabled={isProcessing[selectedType]}
                      />
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerMockUpload}
                      disabled={isProcessing[selectedType]}
                      className="text-xs border-border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      Use Demo File
                    </Button>
                  </div>
                </div>
              ) : (
                /* Document Details & Mock Preview */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* File Info */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="space-y-1 bg-slate-50 dark:bg-slate-950/40 border border-border/40 p-4 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">File Metadata</div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-slate-500">File Name:</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                          {activeDoc.fileName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-slate-500">Expiry Date:</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100" suppressHydrationWarning>
                          {activeDoc.expiryDate
                            ? new Date(activeDoc.expiryDate).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "No expiry needed / None"}
                        </span>
                      </div>
                      {activeDoc.confidenceScore != null && (
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-slate-500">OCR Confidence:</span>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                            {Math.round(activeDoc.confidenceScore * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground bg-background h-9 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]">
                        Re-upload File
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,application/pdf"
                          onChange={handleFileInput}
                          disabled={isProcessing[selectedType]}
                        />
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={triggerMockUpload}
                        disabled={isProcessing[selectedType]}
                        className="text-xs border-border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        Reset / Re-run OCR
                      </Button>
                    </div>
                  </div>

                  {/* Mock Image/PDF Frame */}
                  <div className="md:col-span-5 flex flex-col justify-center items-center">
                    <div className="relative border border-border/80 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden aspect-video md:aspect-square w-full flex flex-col justify-center items-center group shadow-soft max-w-[200px] mx-auto">
                      {selectedType === "photo" ? (
                        /* Standard Profile Avatar Mock */
                        <div className="text-center p-3">
                          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-2 select-none shadow-sm">
                            DM
                          </div>
                          <div className="text-[10px] font-bold text-slate-700 dark:text-slate-350">
                            David Miller
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                            photo_id_check.jpg
                          </div>
                        </div>
                      ) : (
                        /* Document PDF Mock */
                        <div className="text-center p-4">
                          <FileText className="h-10 w-10 text-primary/80 mx-auto mb-2" />
                          <div className="text-[10px] font-bold text-slate-750 dark:text-slate-300">
                            {selectedType.toUpperCase()} SECURE DOCUMENT
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono mt-1 select-none">
                            PDF PREVIEW BLOCKED
                          </div>
                        </div>
                      )}
                      {/* Hover action block */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-250">
                        <span className="text-[10px] text-white flex items-center gap-1.5 font-semibold bg-slate-800/80 px-2.5 py-1 rounded-full border border-white/10 select-none">
                          <Eye className="h-3 w-3" /> Secure Preview
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Processing state loader overlay */}
              {activeDoc.status === "pending" && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 animate-fade-in">
                  <div className="relative flex items-center justify-center mb-3">
                    <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <Upload className="absolute h-4 w-4 text-primary animate-bounce" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Processing Document Metadata</h4>
                  <p className="text-[10px] text-slate-400 mt-1 animate-pulse">Running simulated OCR parser & match diagnostics...</p>
                </div>
              )}

              {/* Audit history logs timeline */}
              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center gap-1.5 mb-4 text-slate-500">
                  <History className="h-4 w-4" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">Verification Audit Trail</h4>
                </div>

                {activeDoc.history.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 dark:bg-slate-950/10 rounded-xl border border-dashed border-border/40 text-[10px] text-slate-400">
                    No history log entries recorded. Upload a file to trigger audits.
                  </div>
                ) : (
                  <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-4 text-left ml-2">
                    {activeDoc.history.map((entry) => {
                      const isVerify = entry.action.includes("Verified") || entry.action.includes("Success");
                      const isReject = entry.action.includes("Rejected") || entry.action.includes("Failed");
                      
                      let dotColor = "bg-slate-300 dark:bg-slate-700";
                      let textColor = "text-slate-800 dark:text-slate-100";
                      
                      if (isVerify) dotColor = "bg-emerald-500";
                      else if (isReject) dotColor = "bg-red-500";
                      else if (entry.action.includes("Uploaded")) dotColor = "bg-blue-500";

                      return (
                        <div key={entry.id} className="relative">
                          {/* Timeline dot */}
                          <div className={cn(
                            "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-900",
                            dotColor
                          )} />

                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                {entry.action}
                                {isVerify && <Check className="h-3 w-3 text-emerald-500" />}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono" suppressHydrationWarning>
                                {new Date(entry.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-450 leading-relaxed">
                              {entry.details}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
