"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Header, Footer } from "@/components/common";
import {
  ProgressBar,
  ServiceSelector,
  Calendar,
  TimeSlots,
  CustomerForm,
  Confirmation,
  Completion,
} from "@/components/booking";
import Button from "@/components/common/Button";
import {
  businessConfigs,
  isValidBusinessType,
  generateReservationNumber,
} from "@/config/businesses";
import { createReservation, getBookedTimeSlots } from "@/lib/supabase";
import {
  BusinessConfig,
  BusinessType,
  Service,
  CustomerFormData,
  ReservationData,
} from "@/types";

const STEPS = ["メニュー", "日時", "情報", "確認", "完了"];

export default function BookingPage() {
  const params = useParams();
  const businessType = params.businessType as string;

  // Validate business type
  if (!isValidBusinessType(businessType)) {
    notFound();
  }

  const config: BusinessConfig = businessConfigs[businessType as BusinessType];

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: "",
    nameKana: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [completedReservation, setCompletedReservation] =
    useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setSlotsLoading(true);
      getBookedTimeSlots(businessType as BusinessType, selectedDate)
        .then(setBookedSlots)
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedDate, businessType]);

  // Service handlers
  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  // Navigation
  const goToStep = (step: number) => setCurrentStep(step);
  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Submit reservation
  const handleSubmit = async () => {
    setLoading(true);

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const reservationNumber = generateReservationNumber(
      businessType as BusinessType,
      new Date(selectedDate)
    );

    const reservationData: Omit<ReservationData, "id" | "createdAt"> = {
      businessType: businessType as BusinessType,
      reservationNumber,
      customerName: customerData.name,
      customerNameKana: customerData.nameKana,
      phone: customerData.phone,
      email: customerData.email,
      date: selectedDate,
      time: selectedTime,
      services: selectedServices,
      partySize: customerData.partySize,
      seatingPreference: customerData.seating,
      allergies: customerData.allergies,
      insuranceType: customerData.insuranceType,
      occasion: customerData.occasion,
      notes: customerData.notes || undefined,
      status: "確定",
    };

    console.log("Creating reservation:", reservationData);

    const result = await createReservation(reservationData);

    if (result) {
      setCompletedReservation(result);
      setCurrentStep(5);
    } else {
      // Mock reservation for demo
      const mockReservation: ReservationData = {
        ...reservationData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setCompletedReservation(mockReservation);
      setCurrentStep(5);
      console.log("Using mock reservation (Supabase not configured)");
    }

    setLoading(false);
  };

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelector
            config={config}
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
            onNext={goNext}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">日時選択</h2>
              <p className="text-gray-600 text-sm">ご希望の日時をお選びください</p>
            </div>
            <Calendar
              config={config}
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime("");
              }}
            />
            {selectedDate && (
              <TimeSlots
                config={config}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedService={selectedServices[0]}
                bookedSlots={bookedSlots}
                loading={slotsLoading}
                onTimeSelect={setSelectedTime}
              />
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={goBack} fullWidth themeColor={config.theme.primary}>
                戻る
              </Button>
              <Button
                onClick={goNext}
                disabled={!selectedDate || !selectedTime}
                fullWidth
                themeColor={config.theme.primary}
              >
                お客様情報入力へ
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <CustomerForm
            config={config}
            formData={customerData}
            onFormChange={setCustomerData}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <Confirmation
            config={config}
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            customerData={customerData}
            onEdit={goToStep}
            onConfirm={handleSubmit}
            onBack={goBack}
            loading={loading}
          />
        );
      case 5:
        return completedReservation ? (
          <Completion config={config} reservation={completedReservation} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        config={config}
        showBackButton={currentStep > 1 && currentStep < 5}
        onBack={goBack}
        backHref={currentStep === 1 ? "/" : undefined}
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {currentStep < 5 && (
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length - 1}
            steps={STEPS.slice(0, -1)}
            themeColor={config.theme.primary}
          />
        )}
        <div className="mt-4">{renderStep()}</div>
      </main>

      <Footer config={config} />
    </div>
  );
}
