import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import axios from "axios";

const RecipeCategoriesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [mealDetails, setMealDetails] = useState<any | null>(null);
  const [video, setVideo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Vegetarian", "Seafood", "Miscellaneous", "Chicken"];

  const fetchRecipesByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    setRecipes([]);
    setSelectedCategory(category);

    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      setRecipes(response.data.meals || []);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealDetails = async (mealId: string) => {
    setLoading(true);
    setError(null);
    setMealDetails(null);
    setVideo(null);

    try {
      const mealResponse = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );

      const meal = mealResponse.data.meals[0];
      setMealDetails(meal);

      // Fetch a single Dailymotion video
      const videosResponse = await axios.get(
        `https://api.dailymotion.com/videos?search=${meal.strMeal}&limit=1`
      );
      setVideo(videosResponse.data.list[0] || null);
    } catch (err) {
      setError("Failed to fetch meal details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderMealDetails = () => {
    if (!mealDetails) return null;

    const ingredients = Object.keys(mealDetails)
      .filter((key) => key.startsWith("strIngredient") && mealDetails[key])
      .map((key) => mealDetails[key]);

    return (
      <ScrollView contentContainerStyle={styles.mealDetailsContainer}>
        <Image
          source={{ uri: mealDetails.strMealThumb }}
          style={styles.mealImage}
        />
        <Text style={styles.mealTitle}>{mealDetails.strMeal}</Text>

        {/* Ingredients Section */}
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            {index + 1}. {ingredient}
          </Text>
        ))}

        {/* Instructions Section */}
        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.instructions}>{mealDetails.strInstructions}</Text>

        {/* Nutrition Section */}
        <Text style={styles.sectionTitle}>Nutrition:</Text>
        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionItem}>1. Protein: 25g</Text>
          <Text style={styles.nutritionItem}>2. Carbs: 45g</Text>
          <Text style={styles.nutritionItem}>3. Calories: 320 kcal</Text>
          <Text style={styles.nutritionItem}>4. Fat: 15g</Text>
        </View>

        {/* Video Section */}
        {video && (
          <View>
            <Text style={styles.sectionTitle}>Recipe Video:</Text>
            <TouchableOpacity
              style={styles.videoCard}
              onPress={() =>
                Linking.openURL(`https://www.dailymotion.com/video/${video.id}`)
              }
            >
              <Image
                source={{ uri: video.thumbnail_120_url }}
                style={styles.videoThumbnail}
              />
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoViews}>{video.views_total} views</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Button title="Back to Recipes" onPress={() => setSelectedMeal(null)} />
      </ScrollView>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!selectedCategory && !selectedMeal && (
        <>
          <Text style={styles.title}>Select a Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryButton}
                onPress={() => fetchRecipesByCategory(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {selectedCategory && !selectedMeal && (
        <>
          <Text style={styles.title}>{selectedCategory} Recipes</Text>
          <Button
            title="Back to Categories"
            onPress={() => setSelectedCategory(null)}
          />
          {loading && (
            <ActivityIndicator size="large" color="#00f" style={styles.loader} />
          )}
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.recipeList}>
            {recipes.map((recipe, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recipeCard}
                onPress={() => {
                  setSelectedMeal(recipe);
                  fetchMealDetails(recipe.idMeal);
                }}
              >
                <Image
                  source={{ uri: recipe.strMealThumb }}
                  style={styles.recipeImage}
                />
                <Text style={styles.recipeName}>{recipe.strMeal}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {selectedMeal && renderMealDetails()}
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
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  categoryButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "45%",
    alignItems: "center",
  },
  categoryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: "red",
    marginVertical: 10,
    textAlign: "center",
  },
  recipeList: {
    marginTop: 20,
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
    alignItems: "center",
  },
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  mealDetailsContainer: {
    padding: 16,
    alignItems: "center",
  },
  mealImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 6,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "justify",
  },
  nutritionContainer: {
    marginBottom: 20,
  },
  nutritionItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  videoViews: {
    fontSize: 14,
    color: "#888",
  },
});

export default RecipeCategoriesScreen;