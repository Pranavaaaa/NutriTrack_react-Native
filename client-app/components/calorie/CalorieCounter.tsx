import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

const API_BASE_URL = "http://localhost:4000/users/calories";

const CalorieCounter = () => {
  const getSelectedDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [caldata, setCaldata] = useState("");
  const [selectedDate, setSelectedDate] = useState(getSelectedDate());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const fetchData = async () => {
    try {
      console.log("Fetching data for date:", selectedDate);
      const response = await fetch(`${API_BASE_URL}/calories/`);
      const data = await response.json();
      setCaldata(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const Data = {
    Breakfast: 100,
    Lunch: 100,
    Dinner: 100,
    Snacks: 80,
    water: 100,
    weight: 100,
    calorieBudget: 700,
  };

  const totalCalories =
    Data.Breakfast + Data.Lunch + Data.Dinner + Data.Snacks + Data.water;

  const handleDateChange = (date) => {
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false);
  };

  const prevDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate.toISOString().split("T")[0]);
  };

  const nextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate.toISOString().split("T")[0]);
  };

  return (
    <View style={styles.container}>
      {/* Calorie Overview */}
      <View style={styles.calorieOverview}>
        <Text style={styles.title}>Calorie Budget</Text>
        <Text style={styles.value}>{Data.calorieBudget} kcal</Text>
      </View>

      {/* Calories Consumed & Remaining */}
      <View style={styles.calorieDetails}>
        <Text style={styles.totalCalories}>Total: {totalCalories} kcal</Text>
        <Text style={styles.remainingCalories}>
          Remaining: {Data.calorieBudget - totalCalories} kcal
        </Text>
      </View>

      {/* Food Intake Grid */}
      <View style={styles.gridContainer}>
        {Object.entries(Data).map(([key, value]) =>
          key !== "calorieBudget" ? (
            <View style={styles.gridItem} key={key}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.data}>{value} kcal</Text>
            </View>
          ) : null
        )}
      </View>

      {/* Date Navigation */}
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.navButton} onPress={prevDay}>
          <Text style={styles.navButtonText}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <TouchableOpacity style={styles.navButton} onPress={nextDay}>
          <Text style={styles.navButtonText}>❯</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Toggle Button */}
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setIsCalendarVisible(!isCalendarVisible)}
      >
        <Text style={styles.calendarButtonText}>📅 Select Date</Text>
      </TouchableOpacity>

      {/* Calendar Component (Auto-closes on selection) */}
      {isCalendarVisible && (
        <View style={styles.calendarWrapper}>
          <Calendar
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#007bff",
                selectedTextColor: "#fff",
              },
            }}
            onDayPress={handleDateChange}
            monthFormat={"yyyy MM"}
          />
        </View>
      )}
    </View>
  );
};

// Improved Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  calorieOverview: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  calorieDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 15,
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  remainingCalories: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4d4d",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
  },
  gridItem: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  data: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  dateText: {
    fontSize: 18,
    marginHorizontal: 15,
    fontWeight: "bold",
    color: "#333",
  },
  navButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 20,
    color: "white",
  },
  calendarButton: {
    marginTop: 15,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
  },
  calendarButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  calendarWrapper: {
    marginTop: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default CalorieCounter;
