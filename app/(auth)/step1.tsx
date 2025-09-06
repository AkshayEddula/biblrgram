import { useAuth } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

export default function PersonalizationFlow() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferred_bible_version: "",
    denomination: "",
    age_group: "",
    spiritual_interests: [] as string[],
    life_stage: "",
  });

  const totalSteps = 5;

  // 🔐 SecureStore helpers
  const setItem = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.error(`Error setting ${key}:`, e);
    }
  };

  // --- options ---
  const bibleVersions = [
    { id: "niv", label: "NIV" },
    { id: "kjv", label: "KJV" },
    { id: "esv", label: "ESV" },
    { id: "nlt", label: "NLT" },
  ];

  const denominations = [
    { id: "catholic", label: "Catholic" },
    { id: "protestant", label: "Protestant" },
    { id: "orthodox", label: "Orthodox" },
    { id: "other", label: "Other" },
  ];

  const ageGroups = [
    { id: "teen", label: "Teen (13-19)" },
    { id: "young_adult", label: "Young Adult (20-35)" },
    { id: "adult", label: "Adult (36-59)" },
    { id: "senior", label: "Senior (60+)" },
  ];

  const spiritualInterests = [
    { id: "prayer", label: "Prayer" },
    { id: "worship", label: "Worship" },
    { id: "bible_study", label: "Bible Study" },
    { id: "community", label: "Community" },
    { id: "missions", label: "Missions" },
    { id: "service", label: "Service" },
  ];

  const lifeStages = [
    { id: "student", label: "Student" },
    { id: "single", label: "Single" },
    { id: "married", label: "Married" },
    { id: "parent", label: "Parent" },
  ];

  // --- helpers ---
  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSpiritualInterest = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      spiritual_interests: prev.spiritual_interests.includes(interestId)
        ? prev.spiritual_interests.filter((id) => id !== interestId)
        : [...prev.spiritual_interests, interestId],
    }));
  };

  const getStepValidation = () => {
    switch (currentStep) {
      case 1:
        return formData.preferred_bible_version !== "";
      case 2:
        return formData.denomination !== "";
      case 3:
        return formData.age_group !== "";
      case 4:
        return (
          formData.spiritual_interests.length >= 3 &&
          formData.spiritual_interests.length <= 5
        );
      case 5:
        return formData.life_stage !== "";
      default:
        return false;
    }
  };

  const completeOnboarding = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.rpc("complete_user_onboarding", {
        p_user_id: user.id,
        p_preferred_bible_version: formData.preferred_bible_version,
        p_denomination: formData.denomination,
        p_age_group: formData.age_group,
        p_spiritual_interests: formData.spiritual_interests,
        p_life_stage: formData.life_stage,
      });

      if (error) {
        console.error("Onboarding error:", error);
        Alert.alert(
          "Error",
          "Failed to complete onboarding. Please try again."
        );
        return;
      }

      // ✅ Save onboarding status securely
      await setItem("user_onboarded", "true");
      await setItem("user_preferences", JSON.stringify(formData));

      console.log("Onboarding completed successfully!");
      router.replace("/(app)/(tabs)/home");
    } catch (error) {
      console.error("Onboarding error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- render step ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView>
            <Text className="text-white text-xl font-semibold mb-4">
              Which Bible version do you prefer?
            </Text>
            {bibleVersions.map((v) => (
              <TouchableOpacity
                key={v.id}
                className={`p-4 mb-3 rounded-xl ${
                  formData.preferred_bible_version === v.id
                    ? "bg-purple-600"
                    : "bg-slate-700"
                }`}
                onPress={() => updateFormData("preferred_bible_version", v.id)}
              >
                <Text className="text-white text-lg">{v.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView>
            <Text className="text-white text-xl font-semibold mb-4">
              What’s your denomination?
            </Text>
            {denominations.map((d) => (
              <TouchableOpacity
                key={d.id}
                className={`p-4 mb-3 rounded-xl ${
                  formData.denomination === d.id
                    ? "bg-purple-600"
                    : "bg-slate-700"
                }`}
                onPress={() => updateFormData("denomination", d.id)}
              >
                <Text className="text-white text-lg">{d.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 3:
        return (
          <ScrollView>
            <Text className="text-white text-xl font-semibold mb-4">
              What’s your age group?
            </Text>
            {ageGroups.map((a) => (
              <TouchableOpacity
                key={a.id}
                className={`p-4 mb-3 rounded-xl ${
                  formData.age_group === a.id ? "bg-purple-600" : "bg-slate-700"
                }`}
                onPress={() => updateFormData("age_group", a.id)}
              >
                <Text className="text-white text-lg">{a.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 4:
        return (
          <ScrollView>
            <Text className="text-white text-xl font-semibold mb-4">
              Pick 3–5 spiritual interests
            </Text>
            {spiritualInterests.map((s) => (
              <TouchableOpacity
                key={s.id}
                className={`p-4 mb-3 rounded-xl ${
                  formData.spiritual_interests.includes(s.id)
                    ? "bg-purple-600"
                    : "bg-slate-700"
                }`}
                onPress={() => toggleSpiritualInterest(s.id)}
              >
                <Text className="text-white text-lg">{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 5:
        return (
          <ScrollView>
            <Text className="text-white text-xl font-semibold mb-4">
              What life stage are you in?
            </Text>
            {lifeStages.map((l) => (
              <TouchableOpacity
                key={l.id}
                className={`p-4 mb-3 rounded-xl ${
                  formData.life_stage === l.id
                    ? "bg-purple-600"
                    : "bg-slate-700"
                }`}
                onPress={() => updateFormData("life_stage", l.id)}
              >
                <Text className="text-white text-lg">{l.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
        {/* Progress bar */}
        <View className="w-full h-2 bg-slate-700 rounded-full mb-6">
          <View
            className="h-2 bg-purple-600 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </View>

        {/* Step content */}
        <View className="flex-1">{renderStep()}</View>

        {/* Bottom actions */}
        <View className="flex-row justify-between items-center mt-6">
          {currentStep > 1 ? (
            <TouchableOpacity
              onPress={prevStep}
              className="bg-slate-600 px-6 py-3 rounded-2xl flex-row items-center"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text className="text-white ml-1">Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity
            disabled={!getStepValidation() || loading}
            onPress={currentStep === totalSteps ? completeOnboarding : nextStep}
            className={`px-6 py-3 rounded-2xl flex-row items-center ${
              getStepValidation() && !loading ? "bg-purple-600" : "bg-slate-600"
            }`}
          >
            <Text className="text-white mr-1">
              {currentStep === totalSteps ? "Finish" : "Next"}
            </Text>
            <Ionicons
              name={
                currentStep === totalSteps ? "checkmark" : "chevron-forward"
              }
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Step indicator */}
        <View className="flex-row justify-center mt-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentStep === i + 1 ? "bg-purple-600" : "bg-slate-600"
              }`}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
