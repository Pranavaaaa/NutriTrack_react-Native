import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_GEMINI_API_KEY = ""; //add your known api key 

const MealPlanning = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [duration, setDuration] = useState(""); // Weeks
  const [calories, setCalories] = useState(0);
  const [mealPlan, setMealPlan] = useState({});
  const [geminiResponse, setGeminiResponse] = useState("");

  const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const calculateCalories = async () => {
    const currWeight = parseFloat(currentWeight);
    const targWeight = parseFloat(targetWeight);
    const weeks = parseFloat(duration);

    if (isNaN(currWeight) || isNaN(targWeight) || isNaN(weeks) || weeks <= 0) {
      alert("Please enter valid numbers.");
      return;
    }

    const weightDiff = targWeight - currWeight;
    const calorieAdjustment = (weightDiff * 7700) / (weeks * 7); // 7700 kcal per kg
    const baseCalories = 2000; // Average daily maintenance calories
    const totalCalories = (baseCalories + calorieAdjustment)/2;

    setCalories(Math.round(totalCalories));

    // Meal plan distribution
    setMealPlan({
      Breakfast: Math.round(totalCalories * 0.3),
      Lunch: Math.round(totalCalories * 0.35),
      Dinner: Math.round(totalCalories * 0.25),
      Snacks: Math.round(totalCalories * 0.1),
    });

    const data={
      "daily_calories": "",
      "note": "",
      "days": [
        {
          "day": 1,
          "total_calories": "",
          "meals": {
            "breakfast": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""},
                {"name": ""},
                {"name": ""}
              ]
            },
            "snack_1": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""}
              ]
            },
            "lunch": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""},
                {"name": ""}
              ]
            },
            "snack_2": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""}
              ]
            },
            "dinner": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""},
                {"name": ""},
                {"name": ""},
                {"name": ""}
              ]
            }
          }
        },
        {
          "day": 2,
          "total_calories": "",
          "meals": {
            "breakfast": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""},
                {"name": ""}
              ]
            },
            "snack_1": {
              "calories": "",
              "items": [
                {"name": ""}
              ]
            },
            "lunch": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""}
              ]
            },
            "snack_2": {
              "calories": "",
              "items": [
                {"name": ""}
              ]
            },
            "dinner": {
              "calories": "",
              "items": [
                {"name": ""},
                {"name": ""}
              ]
            }
          }
        }
      ],
      "important_considerations": {
        "hydration": "",
        "variety": "",
        "portion_control": "",
        "individual_needs": "",
        "macronutrient_balance": "",
        "consult_a_professional": ""
      },
      "final_reminder": ""
    }
    
    function extractJsonFromText(responseText: string): any | null {
      try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          
          if (jsonMatch) {
              return JSON.parse(jsonMatch[0]);
          }
      } catch (error) {
          console.error("Error parsing JSON:", error);
      }
      return null;
  }
    try {
      const prompt = `I am planning my daily meal intake based on a target calorie goal of ${Math.round(
        totalCalories
      )} kcal/day.follow templete : ${JSON.stringify(data)} vey strictly to give response. `;
 
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      setGeminiResponse(responseText);
      console.log(extractJsonFromText(responseText));

    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setGeminiResponse("Failed to fetch AI-generated meal insights.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Meal Planning</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Weight (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={currentWeight}
          onChangeText={setCurrentWeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Target Weight (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={targetWeight}
          onChangeText={setTargetWeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Duration (weeks):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calculateCalories}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {calories > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {targetWeight > currentWeight
              ? "Calorie Intake for Gaining Weight:"
              : "Calorie Intake for Losing Weight:"}
          </Text>
          <Text style={styles.calories}>{calories} kcal/day</Text>

          <View style={styles.mealPlanContainer}>
            {Object.entries(mealPlan).map(([meal, kcal]) => (
              <View key={meal} style={styles.mealItem}>
                <Text style={styles.mealLabel}>{meal}</Text>
                <Text style={styles.mealCalories}>{kcal} kcal</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {geminiResponse && (
        <View style={styles.geminiContainer}>
          <Text style={styles.geminiTitle}>AI-Suggested Meal Plan:</Text>
          <Text style={styles.geminiText}>{geminiResponse}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007bff",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  calculateButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  calories: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  mealPlanContainer: {
    width: "100%",
  },
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mealLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  geminiContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#e3f2fd",
    width: "100%",
  },
  geminiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  geminiText: {
    fontSize: 16,
    color: "#333",
  },
});

export default MealPlanning;
