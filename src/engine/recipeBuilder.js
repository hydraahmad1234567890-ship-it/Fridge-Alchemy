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

    if (recipeIds.length === 0) {
      console.log("Spoonacular found 0 results. Switching to Alchemical Synthesis.");
      return [synthesizeProceduralRecipe(normalizedInput, searchMode, servings)];
    }

    // 3. Fetch bulk information (Instructions, Nutrition, etc.)
    const bulkResponse = await fetch(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds.join(',')}&includeNutrition=true&apiKey=${SPOONACULAR_KEY}`
    );
    const bulkData = await bulkResponse.json();

    if (!bulkData || bulkData.length === 0) {
      return [synthesizeProceduralRecipe(normalizedInput, searchMode, servings)];
    }

    // 4. Map Spoonacular data to Fridge Alchemy schema
    return bulkData.map(recipe => mapSpoonacularToAlchemy(recipe, servings));

  } catch (error) {
    console.error("Connectivity issue. Falling back to local synthesis.", error);
    return [synthesizeProceduralRecipe(input, searchMode, servings)];
  }
}

/**
 * Procedural Synthesis Engine: The 'Alchemical Guess' that never fails.
 */
function synthesizeProceduralRecipe(dishName, mode, servings) {
  // Logic to guess ingredients based on name
  const isSweet = dishName.includes('cake') || dishName.includes('choco') || dishName.includes('lava') || dishName.includes('sweet');
  
  return {
    id: `syn-${Date.now()}`,
    title: `${dishName.toUpperCase()} (Alchemical Synthesis)`,
    image: isSweet 
      ? "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop" 
      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    summary: `This recipe was procedurally deconstructed using Fridge Alchemy's internal culinary matrix. It provides a logical framework for ${dishName}.`,
    ingredients: isSweet ? {
      "Flour": { quantity: 150 * servings, unit: "g" },
      "Sugar": { quantity: 100 * servings, unit: "g" },
      "Butter": { quantity: 50 * servings, unit: "g" },
      "Essence": { quantity: 1 * servings, unit: "tsp" }
    } : {
      "Protein Base": { quantity: 200 * servings, unit: "g" },
      "Allspice/Seasoning": { quantity: 1 * servings, unit: "tbsp" },
      "Base Oil": { quantity: 2 * servings, unit: "tbsp" },
      "Water/Stock": { quantity: 100 * servings, unit: "ml" }
    },
    steps: [
      `1. Prepare all reagents required for ${dishName}.`,
      `2. Gently combine core elements in a medium vessel.`,
      `3. Apply thermal energy (medium heat) until transmutation begins.`,
      `4. Adjust seasoning and consistency to preference.`,
      `5. Garnish and serve while the alchemy is fresh.`
    ],
    nutrition: isSweet ? 450 : 350,
    mode: mode || 'Dinner',
    servings: servings,
    sourceUrl: "#"
  };
}

/**
 * Maps rich Spoonacular data to our clean Alchemical schema
 */
function mapSpoonacularToAlchemy(recipe, targetServings) {
  const ratio = recipe.servings ? (targetServings / recipe.servings) : 1;
  
  const ingredients = {};
  (recipe.extendedIngredients || []).forEach(ing => {
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
