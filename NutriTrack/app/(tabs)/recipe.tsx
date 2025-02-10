import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
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

    // Fetch recipe details
    const optionsDetails = {
      method: "GET",
      url: "https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe",
      params: { query },
      headers: {
        "x-rapidapi-key": "670a9e0dd5msh82c782372d4234ap111f31jsna8c7d4751b7e",
        "x-rapidapi-host": "recipe-by-api-ninjas.p.rapidapi.com",
      },
    };

    try {
      const responseDetails = await axios.request(optionsDetails);

      // Fetch recipe images from the second API
      const optionsImages = {
        method: "GET",
        url: "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + query,
      };

      const responseImages = await axios.request(optionsImages);

      // Combine recipe details with images
      const combinedRecipes = responseDetails.data.map((recipe: any, index: number) => ({
        ...recipe,
        image: responseImages.data.meals?.[index]?.strMealThumb || null,
      }));

      setRecipes(combinedRecipes);
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
        placeholder="Enter a recipe name (e.g., Chicken)"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search Recipes" onPress={fetchRecipes} />

      {loading && (
        <ActivityIndicator size="large" color="#00f" style={styles.loader} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {recipes.length > 0 && (
        <View style={styles.recipesContainer}>
          <Text style={styles.recipeTitle}>Results:</Text>
          {recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <Text style={styles.recipeName}>
                {index + 1}. {recipe.title}
              </Text>
              {recipe.image && (
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                />
              )}
              <Text style={styles.recipePoint}>
                - Ingredients: {recipe.ingredients}
              </Text>
              <Text style={styles.recipePoint}>
                - Instructions: {recipe.instructions}
              </Text>
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
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipePoint: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default RecipeSearchScreen;
