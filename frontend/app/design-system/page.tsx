"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Typography } from "@/components/typography/typography";
import { ReusableButton } from "@/components/buttons/button-variants";
import {
  BaseCard,
  FeatureCard,
  StatsCard,
  ProfileCard,
  DeliveryCard,
  GlassCard,
  AICard,
  InteractiveCard,
} from "@/components/cards/card-variants";
import {
  Label,
  Input,
  PasswordInput,
  SearchInput,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  Switch,
  DatePickerPlaceholder,
  FileUploadPlaceholder,
  HelperText,
} from "@/components/forms/form-inputs";
import { DataTable, Column } from "@/components/tables/data-table";
import { Alert, ProgressBar, Spinner, CardSkeleton } from "@/components/feedback/feedback-panels";
import { ConfirmModal, DeleteModal, SuccessModal } from "@/components/modals/modal-dialogs";
import { BackButton, StepIndicator, TabNavigator, Breadcrumbs } from "@/components/navigation/nav-items";
import { Avatar, Badge, TimelineItem, RatingStars } from "@/components/data-display/displays";
import { NoDeliveriesState } from "@/components/empty-state/empty-states";
import { Container, Section, Grid, Stack } from "@/components/layout/layouts";
import { BarChart, LineChart } from "@/components/charts/charts-placeholder";
import { Sparkles, Star, Shield, HelpCircle, Activity, Globe, Coffee } from "lucide-react";

interface MockTableData {
  id: string;
  name: string;
  vehicle: string;
  status: "active" | "inactive";
  rating: number;
}

export default function DesignSystemShowcase() {
  // States for interactive components
  const [multiSelectVal, setMultiSelectVal] = React.useState<string[]>([]);
  const [switchVal, setSwitchVal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("components");
  const [ratingVal, setRatingVal] = React.useState(4);

  // Modal toggles
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Form input value states
  const [inputVal, setInputVal] = React.useState("");
  const [selectedOpt, setSelectedOpt] = React.useState("");

  // Table columns & mock data
  const columns: Column<MockTableData>[] = [
    { key: "id", header: "Driver ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "vehicle", header: "Vehicle", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "danger"}>
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "rating",
      header: "Score",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{row.rating}</span>
        </div>
      ),
    },
  ];

  const tableData: MockTableData[] = [
    { id: "DRV001", name: "David Miller", vehicle: "Ford Transit (Cargo)", status: "active", rating: 4.9 },
    { id: "DRV002", name: "Sarah Jenkins", vehicle: "Chevrolet Bolt (EV)", status: "active", rating: 4.8 },
    { id: "DRV003", name: "Marcus Thompson", vehicle: "Mercedes Sprinter", status: "inactive", rating: 4.7 },
    { id: "DRV004", name: "Elena Rostova", vehicle: "Ram ProMaster", status: "active", rating: 4.95 },
    { id: "DRV005", name: "James Anderson", vehicle: "Toyota Prius", status: "active", rating: 4.6 },
    { id: "DRV006", name: "Kofi Mensah", vehicle: "Nissan NV200", status: "inactive", rating: 4.5 },
  ];

  const selectOptions = [
    { value: "express", label: "Priority Express (Same Day)" },
    { value: "standard", label: "Standard Delivery (2-3 Days)" },
    { value: "saver", label: "Saver Freight (5-7 Days)" },
  ];

  const multiSelectOptions = [
    { value: "refrigerated", label: "Refrigerated Cargo" },
    { value: "fragile", label: "Fragile Handing" },
    { value: "hazmat", label: "Hazmat Certified" },
    { value: "liftgate", label: "Liftgate Required" },
  ];

  const chartData = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 62 },
    { label: "Mar", value: 85 },
    { label: "Apr", value: 55 },
    { label: "May", value: 95 },
    { label: "Jun", value: 110 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Upper Navigation Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30 select-none">
        <Container className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg">
              D
            </div>
            <div>
              <Typography variant="title" as="span" className="font-extrabold tracking-tight">
                DriveLink AI
              </Typography>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold ml-2">
                DESIGN SYSTEM v1.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </Container>
      </header>

      {/* Main Section */}
      <Container className="py-10">
        <Stack gap="xl">
          {/* Intro Section */}
          <div className="flex flex-col gap-2.5">
            <Typography variant="label">Centralized System Component Shell</Typography>
            <Typography variant="hero" as="h1">
              DriveLink <Typography variant="gradient" as="span">UI Design Language</Typography>
            </Typography>
            <Typography variant="body" className="max-w-2xl text-slate-500 dark:text-slate-400">
              A premium, accessible components system custom-made for logistics management, driver scheduling, and live tracking dashboard workflows. Built with Next.js 15, Tailwind, and Framer Motion.
            </Typography>
          </div>

          <TabNavigator
            tabs={[
              { id: "components", label: "Core Components" },
              { id: "forms", label: "Form Fields" },
              { id: "data", label: "Data Display & Tables" },
              { id: "feedback", label: "Feedback & Modals" },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id)}
          />

          {/* Core Components Tab */}
          {activeTab === "components" && (
            <Stack gap="lg">
              {/* Typography Section */}
              <div className="flex flex-col gap-4 border-b border-border pb-8">
                <Typography variant="heading">1. Typography System</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-card border border-border">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Hero Title</span>
                      <Typography variant="hero">DriveLink Cargo</Typography>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Display Title</span>
                      <Typography variant="display">Logistics Platform</Typography>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Gradient Text</span>
                      <Typography variant="gradient" className="text-2xl font-bold">Optimize Freight Operations</Typography>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Heading</span>
                      <Typography variant="heading">Manage drivers and routes</Typography>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Title & Body</span>
                      <Typography variant="title">Routing parameters</Typography>
                      <Typography variant="body" className="mt-1">
                        Use intelligent matching routes to save fuel and increase on-time delivery ratios.
                      </Typography>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Muted / Captions</span>
                      <Typography variant="muted">System updated 5 minutes ago.</Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex flex-col gap-4 border-b border-border pb-8">
                <Typography variant="heading">2. Interactive Button Primitives</Typography>
                <div className="p-6 rounded-2xl bg-card border border-border flex flex-wrap gap-4 items-center">
                  <ReusableButton variant="primary">Primary Button</ReusableButton>
                  <ReusableButton variant="secondary">Secondary Button</ReusableButton>
                  <ReusableButton variant="outline">Outline Button</ReusableButton>
                  <ReusableButton variant="ghost">Ghost Button</ReusableButton>
                  <ReusableButton variant="danger">Danger Button</ReusableButton>
                  <ReusableButton variant="success">Success Button</ReusableButton>
                  <ReusableButton variant="primary" isLoading>Loading</ReusableButton>
                  <ReusableButton variant="primary" disabled>Disabled</ReusableButton>
                  <ReusableButton variant="outline" size="sm">Small size</ReusableButton>
                  <ReusableButton variant="outline" size="lg">Large size</ReusableButton>
                </div>
              </div>

              {/* Cards Section */}
              <div className="flex flex-col gap-4">
                <Typography variant="heading">3. Custom Structured Cards</Typography>
                <Grid cols={3} colsTablet={2} gap="md">
                  <StatsCard
                    title="ON-TIME MATCHES"
                    value="98.4%"
                    icon={<Activity className="h-5 w-5" />}
                    trend={{ value: 4.2, isPositive: true }}
                  />
                  <StatsCard
                    title="TOTAL FUEL SPENT"
                    value="$14,520"
                    icon={<Globe className="h-5 w-5" />}
                    trend={{ value: 1.5, isPositive: false, label: "vs budget" }}
                  />
                  <FeatureCard
                    icon={<Sparkles className="h-6 w-6" />}
                    title="Smart Driver Match"
                    description="Assign matches autonomously using machine learning constraints and priority schedules."
                    badge="NEW"
                  />
                  <AICard
                    title="AI Delivery Allocator"
                    description="Our route planner has detected an traffic anomaly near your delivery route. Optimize routes now."
                    onGenerate={() => alert("Optimizing cargo dispatch...")}
                  />
                  <DeliveryCard
                    id="JOB-4820"
                    pickup="Dallas Logistics Terminal, TX"
                    dropoff="Houston Distribution Hub, TX"
                    status="transit"
                    payout="$420.00"
                    eta="4 hours remaining"
                  />
                  <GlassCard className="p-6 flex flex-col gap-4 justify-between">
                    <div>
                      <Typography variant="title" className="mb-2">Frosted Glass UI</Typography>
                      <Typography variant="muted">Perfect for overlays, premium analytics dashboards, or side panels.</Typography>
                    </div>
                    <ReusableButton variant="outline" className="self-start">Learn More</ReusableButton>
                  </GlassCard>
                </Grid>
              </div>
            </Stack>
          )}

          {/* Forms Tab */}
          {activeTab === "forms" && (
            <Stack gap="lg">
              <div className="flex flex-col gap-4">
                <Typography variant="heading">Form Components & Inputs</Typography>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <Grid cols={2} colsTablet={1} gap="lg">
                    {/* Column 1 */}
                    <Stack gap="md">
                      <div>
                        <Label required>Driver Name</Label>
                        <Input
                          placeholder="Enter driver's full name..."
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                        />
                        <HelperText>Enter the legal name as written on their driver&apos;s license.</HelperText>
                      </div>

                      <div>
                        <Label>Search Destination</Label>
                        <SearchInput placeholder="Search zip code, city..." />
                      </div>

                      <div>
                        <Label required>Account Password</Label>
                        <PasswordInput placeholder="Enter security passphrase" />
                      </div>

                      <div>
                        <Label>Delivery Notes</Label>
                        <Textarea placeholder="Instructions for carrier..." />
                      </div>
                    </Stack>

                    {/* Column 2 */}
                    <Stack gap="md">
                      <div>
                        <Label>Priority Speed Category</Label>
                        <Select
                          options={selectOptions}
                          placeholder="Choose shipping method..."
                          value={selectedOpt}
                          onChange={(e) => setSelectedOpt(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Cargo Certificates Required</Label>
                        <MultiSelect
                          options={multiSelectOptions}
                          selectedValues={multiSelectVal}
                          onChange={(values) => setMultiSelectVal(values)}
                          placeholder="Pick certification tags..."
                        />
                      </div>

                      <div className="pt-2 flex flex-col gap-4">
                        <Checkbox label="Agree to cargo carrier Terms & Disclosures" />
                        <Switch
                          label="Enable real-time tracking SMS alerts"
                          checked={switchVal}
                          onCheckedChange={(checked) => setSwitchVal(checked)}
                        />
                      </div>

                      <div className="pt-2">
                        <DatePickerPlaceholder label="Scheduled Delivery Date" value="Tuesday, June 23, 2026" />
                      </div>

                      <div className="pt-2">
                        <FileUploadPlaceholder label="Carrier Safety PDF upload" />
                      </div>
                    </Stack>
                  </Grid>
                </div>
              </div>
            </Stack>
          )}

          {/* Data Display & Tables Tab */}
          {activeTab === "data" && (
            <Stack gap="lg">
              {/* Tables Section */}
              <div className="flex flex-col gap-4 border-b border-border pb-8">
                <Typography variant="heading">Generic Custom Table System</Typography>
                <DataTable
                  columns={columns}
                  data={tableData}
                  searchKey="name"
                  searchPlaceholder="Search active drivers..."
                />
              </div>

              {/* Data Display Helpers */}
              <Grid cols={2} colsTablet={1} gap="lg">
                <BaseCard className="p-6">
                  <Typography variant="title" className="mb-4">Avatars, Badges, Ratings</Typography>
                  <Stack gap="md">
                    <div className="flex items-center gap-4">
                      <Avatar name="David Miller" status="online" size="lg" />
                      <div className="flex flex-col">
                        <Typography variant="title">David Miller</Typography>
                        <Typography variant="muted">Heavy Freight driver</Typography>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="default">DEFAULT</Badge>
                      <Badge variant="success">SUCCESS</Badge>
                      <Badge variant="warning">WARNING</Badge>
                      <Badge variant="danger">DANGER</Badge>
                      <Badge variant="info">INFO</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-500">Interactive Rating:</span>
                      <RatingStars rating={ratingVal} interactive onChange={(v) => setRatingVal(v)} />
                    </div>
                  </Stack>
                </BaseCard>

                {/* Timeline display */}
                <BaseCard className="p-6">
                  <Typography variant="title" className="mb-4">Live Dispatch Timeline</Typography>
                  <div className="flex flex-col">
                    <TimelineItem
                      title="Cargo Manifest Assigned"
                      time="09:40 AM"
                      description="AI matching system assigned job request to David Miller (DRV001) with Chevrolet Bolt EV."
                      isActive
                    />
                    <TimelineItem
                      title="Driver Arrived at Depot"
                      time="10:15 AM"
                      description="Driver checked in at Dallas Terminal gate 4. Cargo loading initiated."
                      isActive
                    />
                    <TimelineItem
                      title="Shipment In Transit"
                      time="10:35 AM"
                      description="Cargo loaded. ETA to Houston Distribution Hub is 2:35 PM."
                      isActive={false}
                      isLast
                    />
                  </div>
                </BaseCard>
              </Grid>

              {/* Empty state & Analytics */}
              <Grid cols={2} colsTablet={1} gap="lg">
                <NoDeliveriesState onAction={() => alert("Opening post job modal...")} />
                <Stack gap="md">
                  <BarChart data={chartData} title="Monthly Deliveries Volume" description="Operational volume comparison across last semester." />
                  <LineChart data={chartData} title="Spend Growth Trend" description="Analytics tracking freight expenditures over months." />
                </Stack>
              </Grid>
            </Stack>
          )}

          {/* Feedback & Modals Tab */}
          {activeTab === "feedback" && (
            <Stack gap="lg">
              {/* Alert Banners */}
              <div className="flex flex-col gap-4 border-b border-border pb-8">
                <Typography variant="heading">1. Alert Notification Panels</Typography>
                <Stack gap="sm">
                  <Alert variant="info" title="System Notice" description="Scheduled database maintenance will occur tonight at 02:00 AM UTC. Expect minor latency spikes." />
                  <Alert variant="success" title="Dispatch Completed" description="Driver has signed digital proof-of-delivery documents. Funds transferred to escrow balance." />
                  <Alert variant="warning" title="Weather Threat" description="Heavy storm warnings detected along route I-35 North. Adjust routes to bypass closures." />
                  <Alert variant="error" title="Payment Overdue" description="Invoice balance for cargo matching fees remains unpaid. Pay within 48 hours to prevent account pause." />
                </Stack>
              </div>

              {/* Progress & Loaders */}
              <div className="flex flex-col gap-4 border-b border-border pb-8">
                <Typography variant="heading">2. Progress, Skeletons & Spinners</Typography>
                <Grid cols={2} colsTablet={1} gap="md">
                  <BaseCard className="p-6 flex flex-col gap-4">
                    <Typography variant="title">Dispatch Progress (75%)</Typography>
                    <ProgressBar value={75} />
                    <div className="flex items-center gap-3 mt-2">
                      <Spinner size="sm" />
                      <span className="text-xs text-slate-500 font-semibold">Updating telemetry links...</span>
                    </div>
                  </BaseCard>
                  <CardSkeleton />
                </Grid>
              </div>

              {/* Modals Triggers */}
              <div className="flex flex-col gap-4">
                <Typography variant="heading">3. Modal & Confirmation Triggers</Typography>
                <div className="p-6 rounded-2xl bg-card border border-border flex flex-wrap gap-4">
                  <ReusableButton variant="primary" onClick={() => setShowConfirm(true)}>
                    Trigger Confirm Modal
                  </ReusableButton>
                  <ReusableButton variant="danger" onClick={() => setShowDelete(true)}>
                    Trigger Delete Modal
                  </ReusableButton>
                  <ReusableButton variant="success" onClick={() => setShowSuccess(true)}>
                    Trigger Success Modal
                  </ReusableButton>
                </div>
              </div>
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Modals Containers rendering */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          alert("Confirmed!");
        }}
        title="Approve Dispatch Match?"
        message="Are you sure you want to approve this match? The matching algorithm has chosen the most efficient route and closest driver."
      />

      <DeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          alert("Record deleted!");
        }}
        title="Delete Driver Profile?"
        message="You are about to remove Marcus Thompson from the company vetting roster. All safety scores will be archived."
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Delivery Request Created"
        message="Your cargo manifest has been broadcast to our live matching network. We will notify you once a driver accepts your bid."
      />
    </div>
  );
}
