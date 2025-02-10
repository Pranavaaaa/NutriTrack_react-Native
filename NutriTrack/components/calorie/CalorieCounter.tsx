import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

const API_BASE_URL="http://localhost:4000"
const CalorieCounter = () => {
  const [data, savedata]=useState("");
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  fetchData();

    var Data={
        Breakfast:100,
        Luch:100,
        Dinner:100,
        Snacks:80,
        water:100,
        weight:100,
        calerieBudget:700
    }
    var total=Data.Breakfast+Data.Dinner+Data.Luch+Data.Snacks+Data.water;
    
  return (
    <View style={styles.container}>
      <View style={styles.centeredItem}>
        <Text style={styles.label}>Calorie Budget{' \n'}<Text style={styles.data}>{Data.calerieBudget}</Text></Text>
      </View>
      <View style={styles.centeredItem}>
        <Text style={styles.total}>{total}</Text>
        <Text style={styles.total}>{Data.calerieBudget - total}</Text>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}><Text style={styles.label}>Breakfast {' \n'}<Text style={styles.data}>{Data.Breakfast}</Text></Text></View>
        <View style={styles.gridItem}><Text style={styles.label}>Lunch {' \n'}<Text style={styles.data}>{Data.Luch}</Text></Text></View>
        <View style={styles.gridItem}><Text style={styles.label}>Dinner {' \n'}<Text style={styles.data}>{Data.Dinner}</Text></Text></View>
        <View style={styles.gridItem}><Text style={styles.label}>Snacks{' \n'} <Text style={styles.data}>{Data.Snacks}</Text></Text></View>
        <View style={styles.gridItem}><Text style={styles.label}>Water {' \n'}<Text style={styles.data}>{Data.water}</Text></Text></View>
        <View style={styles.gridItem}><Text style={styles.label}>Weight {' \n'}<Text style={styles.data}>{Data.weight}</Text></Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredItem: {
    alignItems: "center",
    marginVertical: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  gridItem: {
    width: "45%",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: "Times New Roman",
    marginBottom: 10,
    fontWeight: "bold",
    color: "#a9a9a9",
    textAlign: "center",
  },
  data: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#00ffff",
  },
  total: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#00fa9a",
    textAlign: "center",
  }
});

export default CalorieCounter;
