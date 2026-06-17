"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Package, MapPin, CheckCircle2, RotateCcw, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ReusableButton } from "@/components/buttons/button-variants";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDeliveries } from "@/hooks/useDeliveries";
import { formatCurrency, formatWeight } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

interface FormState {
  pickupAddress: string;
  dropoffAddress: string;
  cargoDescription: string;
  weight: string;
  vehicleType: string;
  priority: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
  paymentMethod: string;
}

const initialForm: FormState = {
  pickupAddress: "",
  dropoffAddress: "",
  cargoDescription: "",
  weight: "",
  vehicleType: "van",
  priority: "standard",
  pickupDate: "",
  pickupTime: "",
  deliveryDate: "",
  deliveryTime: "",
  notes: "",
  paymentMethod: "account",
};

export default function CreateDeliveryPage() {
  const { activeOrganization, currentOrgId } = useOrganizations();
  const { addDelivery } = useDeliveries();

  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [lastAssignedNum, setLastAssignedNum] = useState("");

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleReset = () => {
    setForm(initialForm);
    setStep(1);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully to offline operator queue!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dlvNum = `DLV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newJob = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryNumber: dlvNum,
      pickup: form.pickupAddress,
      drop: form.dropoffAddress,
      distance: parseFloat((Math.random() * 40 + 5).toFixed(1)),
      weight: parseFloat(form.weight) || 45,
      vehicleType: form.vehicleType as any,
      payment: totalCost,
      priority: form.priority as any,
      driverId: null,
      driverName: null,
      organizationId: currentOrgId,
      organizationName: activeOrganization?.name || "FreshMart Retail",
      status: "pending" as const,
      estimatedTime: form.priority === "express" ? "1 hr 45 mins" : "3 hrs 30 mins",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDelivery(newJob);
    setLastAssignedNum(dlvNum);
    setSubmitted(true);
  };

  // Pricing Tariff calculations
  const basePrice = 350;
  const surcharge = form.priority === "express" ? 150 : form.priority === "overnight" ? 300 : 0;
  const platformFee = 30;
  const totalCost = basePrice + surcharge + platformFee;

  // Form Step Validation
  const isStep1Valid = form.pickupAddress.trim() && form.dropoffAddress.trim() && form.cargoDescription.trim() && form.weight;
  const isStep2Valid = form.pickupDate && form.pickupTime && form.deliveryDate && form.deliveryTime;

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 select-none">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/15 mb-4 shadow-soft">
          <CheckCircle2 className="h-8 w-8 text-secondary" aria-hidden />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Delivery Posted Successfully!</h2>
        <p className="mt-2 text-xs text-muted-foreground max-w-sm">
          Your delivery request **{lastAssignedNum}** has been registered in the system. The AI Matching engine is prioritizing nearby vetted carriers.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <ReusableButton
            onClick={() => {
              setSubmitted(false);
              handleReset();
            }}
          >
            Post Another Request
          </ReusableButton>
          <LinkButton href={ROUTES.organization.deliveries} variant="outline">
            Monitor Shipments Board
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Delivery"
        subtitle="Post cargo specifications, dates, and handling rules to match the best nearby logistics carrier."
      />

      {/* Steps Indicator Progress Bar */}
      <div className="max-w-xl mx-auto py-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground select-none">
          <button onClick={() => setStep(1)} className={cn("flex flex-col items-center gap-1.5 focus:outline-none", step >= 1 && "text-primary")}>
            <span className={cn("h-6 w-6 rounded-full border border-border flex items-center justify-center text-[10px]", step >= 1 && "border-primary bg-primary/10 text-primary")}>1</span>
            <span>Route & Specs</span>
          </button>
          <div className={cn("h-px flex-1 bg-border mx-4", step >= 2 && "bg-primary")} />
          <button onClick={() => isStep1Valid && setStep(2)} className={cn("flex flex-col items-center gap-1.5 focus:outline-none", step >= 2 && "text-primary")} disabled={!isStep1Valid}>
            <span className={cn("h-6 w-6 rounded-full border border-border flex items-center justify-center text-[10px]", step >= 2 && "border-primary bg-primary/10 text-primary")}>2</span>
            <span>Schedule & Pay</span>
          </button>
          <div className={cn("h-px flex-1 bg-border mx-4", step >= 3 && "bg-primary")} />
          <button onClick={() => isStep1Valid && isStep2Valid && setStep(3)} className={cn("flex flex-col items-center gap-1.5 focus:outline-none", step >= 3 && "text-primary")} disabled={!isStep1Valid || !isStep2Valid}>
            <span className={cn("h-6 w-6 rounded-full border border-border flex items-center justify-center text-[10px]", step >= 3 && "border-primary bg-primary/10 text-primary")}>3</span>
            <span>Review & Publish</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Form Wizard Contents */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Route Section */}
                <Card className="rounded-2xl border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MapPin className="h-4.5 w-4.5 text-primary" />
                      Trip Routing Details
                    </CardTitle>
                    <CardDescription className="text-xs">Provide origin warehouses and drop destination parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="pickupAddress" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Pickup Address
                      </label>
                      <input
                        id="pickupAddress"
                        type="text"
                        value={form.pickupAddress}
                        onChange={update("pickupAddress")}
                        placeholder="e.g. Peenya Warehouses, Block B, Bengaluru"
                        className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dropoffAddress" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Drop-off Address
                      </label>
                      <input
                        id="dropoffAddress"
                        type="text"
                        value={form.dropoffAddress}
                        onChange={update("dropoffAddress")}
                        placeholder="e.g. Koramangala Outlets, Phase 2, Bengaluru"
                        className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Cargo Section */}
                <Card className="rounded-2xl border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Package className="h-4.5 w-4.5 text-primary" />
                      Cargo Details & Vehicle Required
                    </CardTitle>
                    <CardDescription className="text-xs">Specify weight and transport classifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="cargoDescription" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Cargo Description
                      </label>
                      <input
                        id="cargoDescription"
                        type="text"
                        value={form.cargoDescription}
                        onChange={update("cargoDescription")}
                        placeholder="e.g. Groceries and dairy items (8 crates)"
                        className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="weight" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Weight (kg)
                        </label>
                        <input
                          id="weight"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={form.weight}
                          onChange={update("weight")}
                          placeholder="45"
                          className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="vehicleType" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Required Vehicle Type
                        </label>
                        <select
                          id="vehicleType"
                          value={form.vehicleType}
                          onChange={update("vehicleType")}
                          className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="motorcycle">Motorcycle</option>
                          <option value="van">Medium Cargo Van</option>
                          <option value="truck">Large Cargo Truck</option>
                          <option value="heavy_truck">Heavy Duty Trailer</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="priority" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Routing Priority
                      </label>
                      <select
                        id="priority"
                        value={form.priority}
                        onChange={update("priority")}
                        className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="standard">Standard Routing</option>
                        <option value="express">Express Delivery (+₹150)</option>
                        <option value="overnight">Overnight Delivery (+₹300)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Schedule Section */}
                <Card className="rounded-2xl border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Trip Scheduling</CardTitle>
                    <CardDescription className="text-xs">Configure pickup and drop times</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="pickupDate" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Pickup Date
                        </label>
                        <input
                          id="pickupDate"
                          type="date"
                          value={form.pickupDate}
                          onChange={update("pickupDate")}
                          className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="pickupTime" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Pickup Time
                        </label>
                        <input
                          id="pickupTime"
                          type="time"
                          value={form.pickupTime}
                          onChange={update("pickupTime")}
                          className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="deliveryDate" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Delivery Date
                        </label>
                        <input
                          id="deliveryDate"
                          type="date"
                          value={form.deliveryDate}
                          onChange={update("deliveryDate")}
                          className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="deliveryTime" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Delivery Time
                        </label>
                        <input
                          id="deliveryTime"
                          type="time"
                          value={form.deliveryTime}
                          onChange={update("deliveryTime")}
                          className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing/Payment Details */}
                <Card className="rounded-2xl border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Payment & Directives</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="paymentMethod" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Payment Profile
                      </label>
                      <select
                        id="paymentMethod"
                        value={form.paymentMethod}
                        onChange={update("paymentMethod")}
                        className="h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="account">Corporate Account (Invoice Balance)</option>
                        <option value="credit">Linked Credit Card</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Handling Instructions
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={form.notes}
                        onChange={update("notes")}
                        placeholder="e.g. Fragile cargo, keep boxes upright. Contact logistics manager on arrival."
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Summary Table */}
                <Card className="rounded-2xl border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Review Shipment Specifications</CardTitle>
                    <CardDescription className="text-xs">Confirm all load and address specs are accurate before publishing.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid gap-4 sm:grid-cols-2 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border">
                      <div className="space-y-2 pb-3 sm:pb-0">
                        <p className="font-bold text-muted-foreground text-[10px] uppercase">Route Details</p>
                        <div className="flex gap-2">
                          <MapPin className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                          <p><span className="font-bold">Pickup: </span>{form.pickupAddress}</p>
                        </div>
                        <div className="flex gap-2">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p><span className="font-bold">Drop: </span>{form.dropoffAddress}</p>
                        </div>
                      </div>
                      <div className="space-y-2 pt-3 sm:pt-0 sm:pl-4">
                        <p className="font-bold text-muted-foreground text-[10px] uppercase">Cargo & Schedule</p>
                        <p><span className="font-bold">Description: </span>{form.cargoDescription}</p>
                        <p><span className="font-bold">Total Weight: </span>{formatWeight(parseFloat(form.weight) || 0)}</p>
                        <p><span className="font-bold">Vehicle Class: </span><span className="uppercase text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold">{form.vehicleType}</span></p>
                        <p><span className="font-bold">Schedule Pickup: </span>{form.pickupDate} at {form.pickupTime}</p>
                        <p><span className="font-bold">Priority: </span><span className="capitalize">{form.priority}</span></p>
                        {form.notes && <p className="italic text-muted-foreground">&ldquo;{form.notes}&rdquo;</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Summary & Billing Panel */}
        <div className="space-y-4">
          <Card className="sticky top-20 rounded-2xl border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Summary & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Billing Breakdown */}
              <div className="rounded-2xl bg-muted/40 p-4 space-y-2.5 border border-border/50">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Base distance tariff</span>
                  <span className="text-foreground">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Priority premium surcharge</span>
                  <span className="text-foreground">₹{surcharge}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Platform logistics fee</span>
                  <span className="text-foreground">₹{platformFee}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                  <span className="text-foreground">Total Payout Cost</span>
                  <span className="text-primary">₹{totalCost}</span>
                </div>
              </div>

              {/* Matching Assist Notification */}
              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 flex gap-2">
                <ShieldCheck className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">AI Matching Engine</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Matches instantly based on coordinates, driver safety records, and vehicle capacity models.
                  </p>
                </div>
              </div>

              {/* Form Navigation Controls */}
              <div className="flex flex-col gap-2">
                {step === 1 && (
                  <ReusableButton
                    onClick={handleNextStep}
                    disabled={!isStep1Valid}
                    className="w-full justify-center text-xs gap-1.5 h-10 group"
                  >
                    Next: Scheduling
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </ReusableButton>
                )}
                {step === 2 && (
                  <div className="flex gap-2">
                    <ReusableButton
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 text-xs gap-1 h-10"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back
                    </ReusableButton>
                    <ReusableButton
                      onClick={handleNextStep}
                      disabled={!isStep2Valid}
                      className="flex-1 text-xs gap-1.5 h-10 group"
                    >
                      Next: Review
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </ReusableButton>
                  </div>
                )}
                {step === 3 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <ReusableButton
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1 text-xs gap-1 h-10"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                      </ReusableButton>
                      <ReusableButton
                        onClick={handleSaveDraft}
                        type="button"
                        variant="outline"
                        className="flex-1 text-xs h-10"
                      >
                        Save Draft
                      </ReusableButton>
                    </div>
                    <ReusableButton
                      type="submit"
                      className="w-full justify-center text-xs gap-1.5 h-10 bg-secondary hover:bg-emerald-600 border-none text-white shadow-soft"
                    >
                      Confirm & Publish Cargo
                    </ReusableButton>
                  </div>
                )}

                <ReusableButton
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full text-xs gap-1 h-9 mt-1 text-muted-foreground border-dashed"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Form Data
                </ReusableButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

