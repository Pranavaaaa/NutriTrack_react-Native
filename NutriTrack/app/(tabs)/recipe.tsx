import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

const RecipeSearchScreen: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    const options = {
      method: "GET",
      url: "https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe",
      params: { query },
      headers: {
        "x-rapidapi-key": "670a9e0dd5msh82c782372d4234ap111f31jsna8c7d4751b7e",
        "x-rapidapi-host": "recipe-by-api-ninjas.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setRecipes(response.data);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recipe Finder</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a recipe name (e.g., Italian Wedding Soup)"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search Recipes" onPress={fetchRecipes} />

      {loading && <ActivityIndicator size="large" color="#00f" style={styles.loader} />}

      {error && <Text style={styles.error}>{error}</Text>}

      {recipes.length > 0 && (
        <View style={styles.recipesContainer}>
          <Text style={styles.recipeTitle}>Results:</Text>
          {recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <Text style={styles.recipeName}>Name: {recipe.title}</Text>
              <Text>Ingredients: {recipe.ingredients}</Text>
              <Text>Instructions: {recipe.instructions}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: "red",
    marginVertical: 10,
    textAlign: "center",
  },
  recipesContainer: {
    marginTop: 20,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recipeCard: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});

export default RecipeSearchScreen;
