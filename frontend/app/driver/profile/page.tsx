"use client";

import * as React from "react";
import { Mail, Phone, Truck, Shield, Star, Edit2, Globe, Calendar, Award } from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/cards/card-variants";
import { Avatar } from "@/components/data-display/displays";
import { Badge } from "@/components/badges/badge";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTrustStore } from "@/store/trust-store";
import { TrustScoreOverviewCard } from "@/components/trust/TrustScoreOverviewCard";
import { DocumentUploadCenter } from "@/components/trust/DocumentUploadCenter";
import { ExpiryAlertsDashboard } from "@/components/trust/ExpiryAlertsDashboard";

const EMPTY_REVIEWS: any[] = [];

export default function DriverProfilePage() {
  const { activeDriver } = useDrivers();
  const { deliveries } = useDeliveries();
  const getProfile = useTrustStore((state) => state.getProfile);

  const [activeTab, setActiveTab] = React.useState<"info" | "trust">("info");

  // Load from local storage on mount
  React.useEffect(() => {
    useTrustStore.getState().loadFromStorage();
  }, []);

  const handleEditProfile = () => {
    alert("Profile editing is disabled in this mockup sprint.");
  };

  const driverId = activeDriver?.id || "DRV-001";
  const profile = getProfile(driverId);

  const driverName = activeDriver?.name || "Driver";
  const driverEmail = activeDriver?.email || "driver@drivelink.ai";
  const driverPhone = activeDriver?.phone || "+1 (555) 000-0000";
  const driverLicense = profile.documents.license.fileName || activeDriver?.licenseNumber || "DL-N/A";
  const driverVehicle = activeDriver?.vehicleType || "van";
  const driverPlate = activeDriver?.vehiclePlate || "N/A";
  const driverStatus = activeDriver?.status || "available";
  const driverExperience = activeDriver?.experience || 3;
  const driverJoined = activeDriver?.joinedAt || new Date().toISOString();

  // Get completed jobs
  const completedJobs = React.useMemo(() => {
    return deliveries.filter((d) => d.driverId === driverId && d.status === "delivered");
  }, [deliveries, driverId]);

  // Sync rating from reviews
  const allReviews = useTrustStore((state) => state.reviews);
  const reviews = allReviews[driverId] || EMPTY_REVIEWS;
  const driverRating = React.useMemo(() => {
    if (reviews.length === 0) return activeDriver?.rating || 4.9;
    return parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2));
  }, [reviews, activeDriver?.rating]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Driver Profile"
        subtitle="Manage your public credentials, registered logistics vehicle, and security parameters."
      />

      {/* Tab Switcher */}
      <div className="flex border-b border-border bg-slate-50/20 dark:bg-slate-900/10 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("info")}
          className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "info"
              ? "bg-white dark:bg-slate-900 text-primary shadow-soft"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab("trust")}
          className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeTab === "trust"
              ? "bg-white dark:bg-slate-900 text-primary shadow-soft"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          Document Center & Trust Score
        </button>
      </div>

      {activeTab === "info" ? (
        <>
          <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
            {/* Profile Card */}
            <Card className="lg:col-span-1 rounded-2xl border-border bg-card">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="relative">
                  <Avatar name={driverName} size="lg" className="mb-4" />
                  <span className="absolute bottom-4 right-2 h-4 w-4 rounded-full border-2 border-card bg-secondary animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{driverName}</h2>
                <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide font-semibold">
                  {profile.verificationLevel} Freight Carrier
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <Badge variant="warning">
                    ★ {driverRating.toFixed(2)} Rating
                  </Badge>
                  <Badge variant="default" outline>
                    {driverStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-6 w-full space-y-2 border-t border-border pt-4 text-left text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Completed Trips:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{completedJobs.length}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{driverExperience} Years</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Language:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">English, Spanish</span>
                  </div>
                </div>

                <ReusableButton onClick={handleEditProfile} variant="outline" size="sm" className="mt-6 w-full" leftIcon={<Edit2 className="h-3.5 w-3.5" />}>
                  Edit Profile Info
                </ReusableButton>
              </CardContent>
            </Card>

            {/* Credentials Columns */}
            <div className="space-y-6 lg:col-span-2">
              {/* Details */}
              <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Driver Credentials</CardTitle>
                  <CardDescription className="text-xs">Secure driver account information</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Full Name", value: driverName, icon: Shield },
                    { label: "Email Address", value: driverEmail, icon: Mail },
                    { label: "Phone Number", value: driverPhone, icon: Phone },
                    { label: "Vetted License", value: driverLicense, icon: Award },
                    { label: "Registration Date", value: new Date(driverJoined).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" }), icon: Calendar },
                    { label: "Achievements", value: profile.achievements.length > 0 ? `${profile.achievements.length} Badges Unlocked` : "Vetted Logistics Carrier", icon: Award },
                  ].map((field, idx) => {
                    const Icon = field.icon;
                    return (
                      <div key={idx} className="rounded-2xl bg-muted/40 p-4 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.value}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Vehicle specifications */}
              <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Registered Vehicle Spec</CardTitle>
                  <CardDescription className="text-xs">Vetted logistics cargo carrier classification</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Vehicle Category", value: driverVehicle.toUpperCase(), detail: `Medium size cargo ${driverVehicle}` },
                    { label: "Plate Registration", value: driverPlate, detail: "Escrow matching network active" },
                  ].map((field, idx) => (
                    <div key={idx} className="rounded-2xl bg-muted/40 p-4 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{field.detail}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid gap-4 sm:grid-cols-3 mt-6">
            <StatsCard title="Completed Deliveries" value={completedJobs.length} icon={<Truck className="h-5 w-5" />} />
            <StatsCard title="Acceptance Ratio" value="96%" icon={<Shield className="h-5 w-5" />} className="border-l-4 border-l-emerald-500" />
            <StatsCard title="Vetted Quality Rating" value={`${driverRating.toFixed(2)} / 5.0`} icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />} />
          </div>
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Trust Score circular gauge and achievements */}
          <TrustScoreOverviewCard
            profile={profile}
            driverRating={driverRating}
            completedDeliveries={completedJobs.length}
          />

          {/* Expiry Dashboards */}
          <ExpiryAlertsDashboard documents={profile.documents} />

          {/* Document upload list and history audit trail */}
          <DocumentUploadCenter driverId={driverId} />
        </div>
      )}
    </div>
  );
}
