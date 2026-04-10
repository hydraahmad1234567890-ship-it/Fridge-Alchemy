/**
 * Fridge Alchemy - Spoonacular Enterprise Engine v6
 * Handles global search, pantry matching, and multi-recipe varieties.
 */

const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

/**
 * MASTER FETCH: Handles both Pantry varieties and Dish searches
 */
export async function fetchVarieties(input, searchMode = 'inventory', servings = 2) {
  if (!SPOONACULAR_KEY) {
    console.error("ALCHEMY ERROR: API Key missing in environment!");
    return [];
  }

  try {
    let recipeIds = [];
    const normalizedInput = input.toLowerCase().replace(/\bchoco\b/g, 'chocolate');

    if (searchMode === 'inventory') {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(normalizedInput)}&number=3&ranking=1&apiKey=${SPOONACULAR_KEY}`
      );
      const data = await response.json();
      recipeIds = (data || []).map(r => r.id);
    } else {
      // 1. Initial Strict Search
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(normalizedInput)}&number=3&apiKey=${SPOONACULAR_KEY}`
      );
      const data = await response.json();
      recipeIds = (data.results || []).map(r => r.id);

      // 2. INTELLIGENT DECOMPOSITION: If no results, try broader keywords
      if (recipeIds.length === 0) {
        // Try removing generic words or searching by the most important noun
        const keyword = normalizedInput.split(' ').sort((a,b) => b.length - a.length)[0]; 
        const fallbackResponse = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(keyword)}&number=3&apiKey=${SPOONACULAR_KEY}`
        );
        const fallbackData = await fallbackResponse.json();
        recipeIds = (fallbackData.results || []).map(r => r.id);
      }
    }

    if (recipeIds.length === 0) return [];

    // 3. Fetch bulk information (Instructions, Nutrition, etc.)
    const bulkResponse = await fetch(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds.join(',')}&includeNutrition=true&apiKey=${SPOONACULAR_KEY}`
    );
    const bulkData = await bulkResponse.json();

    // 4. Map Spoonacular data to Fridge Alchemy schema
    return bulkData.map(recipe => mapSpoonacularToAlchemy(recipe, servings));

  } catch (error) {
    console.error("Spoonacular fetch failed:", error);
    return [];
  }
}

/**
 * Maps rich Spoonacular data to our clean Alchemical schema
 */
function mapSpoonacularToAlchemy(recipe, targetServings) {
  const ratio = targetServings / recipe.servings;
  
  const ingredients = {};
  recipe.extendedIngredients.forEach(ing => {
    // Basic quantity scaling
    ingredients[ing.name] = {
      quantity: Math.round(ing.amount * ratio * 10) / 10,
      unit: ing.unit || 'unit'
    };
  });

  const steps = recipe.analyzedInstructions[0]?.steps.map((s, i) => 
    `Step ${i+1}: ${s.step}`
  ) || ["Prepare ingredients and cook according to intuition."];

  const calories = recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 0;

  return {
    id: recipe.id,
    title: recipe.title.toUpperCase(),
    image: recipe.image,
    summary: recipe.summary.replace(/<[^>]*>?/gm, '').split('.')[0] + '.', // Clean HTML
    ingredients,
    steps,
    nutrition: Math.round(calories),
    mode: recipe.dishTypes[0] || 'General',
    servings: targetServings,
    sourceUrl: recipe.sourceUrl
  };
}

// Fallback procedural functions preserved just in case
export function parsePantry(inputString) {
  const ingredients = {};
  const regex = /([\d.]+)\s*([a-zA-Z]+)?\s*([a-zA-Z\s]+)/gi;
  let match;
  while ((match = regex.exec(inputString)) !== null) {
      ingredients[match[3].trim().toLowerCase()] = { quantity: parseFloat(match[1]), unit: match[2] || 'unit' };
  }
  return ingredients;
}

export function generateRecipe(parsedPantry, mode, servings) {
  // Original logic could go here as fallback, omitted for Spoonacular priority
  return { title: "Procedural Fallback", ingredients: parsedPantry, steps: ["API Offline"], nutrition: 0, mode, servings };
}
