"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/common";
import {
  ProgressBar,
  ServiceSelection,
  DateTimeSelection,
  CustomerForm,
  Confirmation,
  Completion,
} from "@/components/booking";
import {
  Service,
  CustomerFormData,
  ReservationData,
  businessConfig,
} from "@/lib/config";
import { createReservation, generateReservationNumber } from "@/lib/supabase";

const STEPS = ["メニュー", "日時", "情報", "確認", "完了"];

export default function BookingPage() {
  // Current step in booking flow
  const [currentStep, setCurrentStep] = useState(1);

  // Booking data
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    customerName: "",
    customerNameKana: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Completed reservation
  const [completedReservation, setCompletedReservation] =
    useState<ReservationData | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Service selection handlers
  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  // Navigation handlers
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit reservation
  const handleSubmit = async () => {
    setLoading(true);

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const reservationNumber = generateReservationNumber(new Date(selectedDate));

    const reservationData: Omit<ReservationData, "id" | "createdAt"> = {
      reservationNumber,
      customerName: customerData.customerName,
      customerNameKana: customerData.customerNameKana,
      phone: customerData.phone,
      email: customerData.email,
      date: selectedDate,
      time: selectedTime,
      services: selectedServices,
      totalDuration,
      totalPrice,
      notes: customerData.notes || undefined,
      status: "確定",
    };

    console.log("Creating reservation:", reservationData);

    const result = await createReservation(reservationData);

    if (result) {
      setCompletedReservation(result);
      setCurrentStep(5);
    } else {
      // For demo purposes, create a mock reservation if Supabase is not configured
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

  // Reset booking flow
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedServices([]);
    setSelectedDate("");
    setSelectedTime("");
    setCustomerData({
      customerName: "",
      customerNameKana: "",
      phone: "",
      email: "",
      notes: "",
    });
    setCompletedReservation(null);
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
            onNext={goNext}
          />
        );
      case 2:
        return (
          <DateTimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <CustomerForm
            formData={customerData}
            onFormChange={setCustomerData}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <Confirmation
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
          <Completion
            reservation={completedReservation}
            onReset={handleReset}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        showBackButton={currentStep > 1 && currentStep < 5}
        onBack={goBack}
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Progress Bar - Hide on completion */}
        {currentStep < 5 && (
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length - 1}
            steps={STEPS.slice(0, -1)}
          />
        )}

        {/* Step Content */}
        <div className="mt-4">{renderStep()}</div>
      </main>

      <Footer />
    </div>
  );
}
