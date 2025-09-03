import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

export default function PersonalizationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    translation: "",
    timing: "",
    preferences: [],
  });

  const totalSteps = 5;

  const experienceOptions = [
    {
      id: "new",
      label: "New to the Bible",
      icon: "leaf",
      desc: "Just starting my journey",
    },
    {
      id: "some",
      label: "Some Experience",
      icon: "book",
      desc: "I read occasionally",
    },
    {
      id: "regular",
      label: "Regular Reader",
      icon: "star",
      desc: "I read regularly",
    },
    {
      id: "scholar",
      label: "Bible Scholar",
      icon: "school",
      desc: "I study it deeply",
    },
  ];

  const translationOptions = [
    { id: "niv", label: "NIV", desc: "New International Version" },
    { id: "esv", label: "ESV", desc: "English Standard Version" },
    { id: "nlt", label: "NLT", desc: "New Living Translation" },
    { id: "kjv", label: "KJV", desc: "King James Version" },
    { id: "msg", label: "MSG", desc: "The Message" },
  ];

  const timingOptions = [
    {
      id: "morning",
      label: "Early Morning",
      icon: "sunny",
      desc: "Start my day with God",
    },
    {
      id: "midday",
      label: "Mid-Morning",
      icon: "partly-sunny",
      desc: "During my break",
    },
    {
      id: "evening",
      label: "Evening",
      icon: "moon",
      desc: "After work/school",
    },
    { id: "night", label: "Night", icon: "moon-outline", desc: "Before bed" },
    {
      id: "anytime",
      label: "Anytime",
      icon: "time",
      desc: "Whenever I'm free",
    },
  ];

  const preferenceOptions = [
    { id: "strength", label: "Strength & Courage", icon: "fitness" },
    { id: "love", label: "Love & Relationships", icon: "heart" },
    { id: "peace", label: "Peace & Comfort", icon: "leaf" },
    { id: "purpose", label: "Purpose & Direction", icon: "compass" },
    { id: "prayer", label: "Prayer & Worship", icon: "hand-left" },
    { id: "growth", label: "Personal Growth", icon: "trending-up" },
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePreference = (prefId: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter((id) => id !== prefId)
        : [...prev.preferences, prefId],
    }));
  };

  const getStepValidation = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length > 1;
      case 2:
        return formData.experience !== "";
      case 3:
        return formData.translation !== "";
      case 4:
        return formData.timing !== "";
      case 5:
        return formData.preferences.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="flex-1 items-start justify-start">
            <View className="w-16 h-16 bg-yellow-400/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="hand-right" size={32} color="#D4AF37" />
            </View>
            <View className="mb-4">
              <Text className="text-[28px] font-PlayFairItalic text-white leading-tight">
                Welcome to your
              </Text>
              <Text className="text-[28px] font-PlayFairItalic text-yellow-400 leading-tight">
                spiritual journey! 👋
              </Text>
            </View>
            <Text className="text-[16px] font-GilroyMedium text-white/80 leading-relaxed mb-8">
              Let's personalize your Bible experience
            </Text>
            <View className="w-full">
              <Text className="text-white text-[16px] font-GilroyMedium mb-4">
                What should we call you?
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholder="Enter your first name"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                className="bg-white/10 text-white text-[16px] font-GilroyMedium px-4 py-4 rounded-[14px] border border-white/20"
                autoCapitalize="words"
                autoFocus={true}
              />
              {formData.name.length > 1 && (
                <View className="mt-3 flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text className="text-green-400 text-[13px] font-GilroyMedium ml-2">
                    Perfect! Nice to meet you, {formData.name} ✨
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 2:
        return (
          <View className="flex-1 items-start justify-start">
            <View className="w-16 h-16 bg-yellow-400/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="book" size={32} color="#D4AF37" />
            </View>
            <View className="mb-4">
              <Text className="text-[28px] font-PlayFairItalic text-white leading-tight">
                Your Bible reading
              </Text>
              <Text className="text-[28px] font-PlayFairItalic text-yellow-400 leading-tight">
                experience? 📖
              </Text>
            </View>
            <Text className="text-[16px] font-GilroyMedium text-white/80 leading-relaxed mb-8">
              This helps us choose the right content depth for you
            </Text>
            <View className="w-full space-y-3">
              {experienceOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => updateFormData("experience", option.id)}
                  className={`p-4 rounded-[14px] border flex-row items-center ${
                    formData.experience === option.id
                      ? "bg-yellow-400/20 border-yellow-400/50"
                      : "bg-white/5 border-white/20"
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                      formData.experience === option.id
                        ? "bg-yellow-400/30"
                        : "bg-white/10"
                    }`}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={18}
                      color={
                        formData.experience === option.id
                          ? "#D4AF37"
                          : "rgba(255,255,255,0.6)"
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-[15px] font-GilroyMedium ${
                        formData.experience === option.id
                          ? "text-white"
                          : "text-white/80"
                      }`}
                    >
                      {option.label}
                    </Text>
                    <Text className="text-white/50 text-[12px] font-GilroyRegular">
                      {option.desc}
                    </Text>
                  </View>
                  {formData.experience === option.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10B981"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View className="flex-1 items-start justify-start">
            <View className="w-16 h-16 bg-yellow-400/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="library" size={32} color="#D4AF37" />
            </View>
            <View className="mb-4">
              <Text className="text-[28px] font-PlayFairItalic text-white leading-tight">
                Preferred Bible
              </Text>
              <Text className="text-[28px] font-PlayFairItalic text-yellow-400 leading-tight">
                translation? 📚
              </Text>
            </View>
            <Text className="text-[16px] font-GilroyMedium text-white/80 leading-relaxed mb-8">
              Choose the version that speaks to you most
            </Text>
            <View className="w-full flex-row flex-wrap gap-3">
              {translationOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => updateFormData("translation", option.id)}
                  className={`px-5 py-4 rounded-[14px] border min-w-[45%] ${
                    formData.translation === option.id
                      ? "bg-yellow-400/20 border-yellow-400/50"
                      : "bg-white/5 border-white/20"
                  }`}
                >
                  <Text
                    className={`text-[16px] font-GilroyBold ${
                      formData.translation === option.id
                        ? "text-white"
                        : "text-white/80"
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-white/50 text-[11px] font-GilroyRegular mt-1">
                    {option.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View className="flex-1 items-start justify-start">
            <View className="w-16 h-16 bg-yellow-400/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="time" size={32} color="#D4AF37" />
            </View>
            <View className="mb-4">
              <Text className="text-[28px] font-PlayFairItalic text-white leading-tight">
                When do you prefer
              </Text>
              <Text className="text-[28px] font-PlayFairItalic text-yellow-400 leading-tight">
                spiritual content? ⏰
              </Text>
            </View>
            <Text className="text-[16px] font-GilroyMedium text-white/80 leading-relaxed mb-8">
              We'll send you verses at the perfect time
            </Text>
            <View className="w-full space-y-3">
              {timingOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => updateFormData("timing", option.id)}
                  className={`p-4 rounded-[14px] border flex-row items-center ${
                    formData.timing === option.id
                      ? "bg-yellow-400/20 border-yellow-400/50"
                      : "bg-white/5 border-white/20"
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                      formData.timing === option.id
                        ? "bg-yellow-400/30"
                        : "bg-white/10"
                    }`}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={18}
                      color={
                        formData.timing === option.id
                          ? "#D4AF37"
                          : "rgba(255,255,255,0.6)"
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-[15px] font-GilroyMedium ${
                        formData.timing === option.id
                          ? "text-white"
                          : "text-white/80"
                      }`}
                    >
                      {option.label}
                    </Text>
                    <Text className="text-white/50 text-[12px] font-GilroyRegular">
                      {option.desc}
                    </Text>
                  </View>
                  {formData.timing === option.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10B981"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View className="flex-1 items-start justify-start">
            <View className="w-16 h-16 bg-yellow-400/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="heart" size={32} color="#D4AF37" />
            </View>
            <View className="mb-4">
              <Text className="text-[28px] font-PlayFairItalic text-white leading-tight">
                What speaks to
              </Text>
              <Text className="text-[28px] font-PlayFairItalic text-yellow-400 leading-tight">
                your heart? 💝
              </Text>
            </View>
            <Text className="text-[16px] font-GilroyMedium text-white/80 leading-relaxed mb-8">
              Select topics you'd like to see more of (choose any)
            </Text>
            <View className="w-full flex-row flex-wrap gap-3">
              {preferenceOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => togglePreference(option.id)}
                  className={`px-4 py-3 rounded-[12px] border flex-row items-center ${
                    formData.preferences.includes(option.id)
                      ? "bg-yellow-400/20 border-yellow-400/50"
                      : "bg-white/5 border-white/20"
                  }`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={16}
                    color={
                      formData.preferences.includes(option.id)
                        ? "#D4AF37"
                        : "rgba(255,255,255,0.6)"
                    }
                  />
                  <Text
                    className={`text-[13px] font-GilroyMedium ml-2 ${
                      formData.preferences.includes(option.id)
                        ? "text-white"
                        : "text-white/80"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-white/50 text-[12px] font-GilroyRegular mt-4">
              Selected: {formData.preferences.length} topics
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#3730A3", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      />

      <View className="absolute inset-0 flex-1 px-5 py-16 pb-8">
        {/* Progress Bar */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white/60 text-[12px] font-GilroyMedium">
              Step {currentStep} of {totalSteps}
            </Text>
            <Text className="text-white/60 text-[12px] font-GilroyMedium">
              {Math.round((currentStep / totalSteps) * 100)}%
            </Text>
          </View>
          <View className="w-full h-2 bg-white/20 rounded-full">
            <View
              className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </View>
        </View>

        {/* Step Content */}
        {renderStep()}

        {/* Bottom Actions */}
        <View className="space-y-4 mb-2">
          <View className="flex-row space-x-3">
            {currentStep > 1 && (
              <TouchableOpacity
                onPress={prevStep}
                className="flex-1 py-6 border-2 border-white/30 rounded-[18px] items-center"
              >
                <Text className="text-white text-[16px] font-GilroyMedium">
                  Back
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`${currentStep > 1 ? "flex-1" : "w-full"} ${getStepValidation() ? "opacity-100" : "opacity-50"}`}
              disabled={!getStepValidation()}
              onPress={
                currentStep === totalSteps
                  ? () => console.log("Complete!", formData)
                  : nextStep
              }
            >
              <LinearGradient
                colors={
                  getStepValidation()
                    ? ["#D4AF37", "#B8941F"]
                    : ["#6B7280", "#4B5563"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-6 rounded-[18px] items-center"
              >
                <Text className="text-white text-[16px] font-GilroyBold">
                  {currentStep === totalSteps
                    ? `Let's Go, ${formData.name}! 🚀`
                    : "Continue"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="w-full py-4 items-center">
            <Text className="text-white/50 text-[14px] font-GilroyMedium">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Page Indicators */}
        <View className="flex-row justify-center space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full ${
                index + 1 === currentStep
                  ? "w-6 bg-yellow-400"
                  : index + 1 < currentStep
                    ? "w-4 bg-green-400"
                    : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
