import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/user/calories";

const CalorieCounter = () => {
  const getSelectedDate = () => new Date().toISOString().split("T")[0];

  const [caldata, setCaldata] = useState({});
  const [selectedDate, setSelectedDate] = useState(getSelectedDate());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`, { params: { date: selectedDate } });
      setCaldata(response.data.data || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const totalCalories = (caldata.breakfast || 0) + (caldata.lunch || 0) + (caldata.dinner || 0) + (caldata.snacks || 0);
  const calorieBudget = caldata.calorieBudget || 700;

  const handleDateChange = (date) => {
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Calorie Budget</Text>
        <Text style={styles.value}>{calorieBudget} kcal</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.totalCalories}>Total: {totalCalories} kcal</Text>
        <Text style={styles.remainingCalories}>Remaining: {calorieBudget - totalCalories} kcal</Text>
      </View>

      <View style={styles.gridContainer}>
        {Object.entries(caldata).map(([key, value]) =>
          key !== "calorieBudget" ? (
            <View style={styles.gridItem} key={key}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.data}>{value} kcal</Text>
            </View>
          ) : null
        )}
      </View>

      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleDateChange({ dateString: selectedDate })}>
          <Text style={styles.dateText}>{selectedDate}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.calendarButton} onPress={() => setIsCalendarVisible(!isCalendarVisible)}>
        <Text style={styles.calendarButtonText}>📅 Select Date</Text>
      </TouchableOpacity>

      {isCalendarVisible && (
        <View style={styles.calendarWrapper}>
          <Calendar
            markedDates={{ [selectedDate]: { selected: true, selectedColor: "#007bff" } }}
            onDayPress={handleDateChange}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "white" },
  value: { fontSize: 24, fontWeight: "bold", color: "white" },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  totalCalories: { fontSize: 18, fontWeight: "bold", color: "#333" },
  remainingCalories: { fontSize: 18, fontWeight: "bold", color: "#ff4d4d" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: "bold", color: "#555" },
  data: { fontSize: 18, fontWeight: "bold", color: "#007bff" },
  dateContainer: {
    marginVertical: 15,
  },
  dateText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  navButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  calendarButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
  },
  calendarButtonText: { fontSize: 18, color: "white", fontWeight: "bold" },
  calendarWrapper: {
    marginTop: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
});

export default CalorieCounter;