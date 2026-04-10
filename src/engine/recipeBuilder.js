/**
 * Fridge Alchemy - Spoonacular Enterprise Engine v6
 * Handles global search, pantry matching, and multi-recipe varieties.
 */

const EDAMAM_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const EDAMAM_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

/**
 * MASTER FETCH: Handles both Pantry varieties and Dish searches
 */
export async function fetchVarieties(input, searchMode = 'inventory', servings = 2) {
  if (!EDAMAM_ID || !EDAMAM_KEY) {
    console.error("ALCHEMY ERROR: Edamam Keys missing in environment!");
    return [synthesizeProceduralRecipe(input, searchMode, servings)];
  }

  try {
    const query = input.toLowerCase().replace(/\bchoco\b/g, 'chocolate');
    
    // Edamam v2 Endpoint
    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${EDAMAM_ID}&app_key=${EDAMAM_KEY}&random=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.hits || data.hits.length === 0) {
      console.log("Edamam found 0 results. Switching to Alchemical Synthesis.");
      return [synthesizeProceduralRecipe(query, searchMode, servings)];
    }

    // Map Edamam Hits to Fridge Alchemy schema (taking top 3)
    return data.hits.slice(0, 3).map(hit => mapEdamamToAlchemy(hit.recipe, servings));

  } catch (error) {
    console.error("Connectivity issue with Edamam. Falling back to local synthesis.", error);
    return [synthesizeProceduralRecipe(input, searchMode, servings)];
  }
}

/**
 * Procedural Synthesis Engine: The 'Alchemical Guess' that never fails.
 */
function synthesizeProceduralRecipe(dishName, mode, servings) {
  const isSweet = dishName.includes('cake') || dishName.includes('choco') || dishName.includes('lava') || dishName.includes('sweet');
  
  return {
    id: `syn-${Date.now()}`,
    title: `${dishName.toUpperCase()} (Alchemical Synthesis)`,
    image: isSweet 
      ? "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop" 
      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    summary: `Procedural decomposition for ${dishName}. Full cloud data unavailable.`,
    ingredients: isSweet ? {
      "Basic Flour": { quantity: 150 * servings, unit: "g" },
      "Purified Sugar": { quantity: 100 * servings, unit: "g" },
      "Dairy Fat": { quantity: 50 * servings, unit: "g" }
    } : {
      "Protein Element": { quantity: 200 * servings, unit: "g" },
      "Aromatic Herbs": { quantity: 1 * servings, unit: "tbsp" },
      "Lipid Base": { quantity: 2 * servings, unit: "tbsp" }
    },
    steps: [
      `Step 1: Gather and verify the reagents for ${dishName}.`,
      `Step 2: Combine base elements in a logical sequence.`,
      `Step 3: Apply thermal energy at controlled intensity.`,
      `Step 4: Visit the original source for advanced techniques.`
    ],
    nutrition: isSweet ? 450 : 350,
    mode: mode || 'Dinner',
    servings: servings,
    sourceUrl: "https://www.edamam.com"
  };
}

/**
 * Maps Edamam data to our clean Alchemical schema
 */
function mapEdamamToAlchemy(recipe, targetServings) {
  const ratio = targetServings / recipe.yield;
  
  const ingredients = {};
  recipe.ingredients.forEach(ing => {
    const name = ing.food.charAt(0).toUpperCase() + ing.food.slice(1);
    ingredients[name] = {
      quantity: Math.round(ing.quantity * ratio * 10) / 10 || 1,
      unit: ing.measure === '<unit>' ? 'unit' : (ing.measure || 'unit')
    };
  });

  return {
    id: recipe.uri.split('#recipe_')[1] || Date.now(),
    title: recipe.label.toUpperCase(),
    image: recipe.image,
    summary: `A premium recipe sourced via ${recipe.source}. High-fidelity search results from the Edamam Global Library.`,
    ingredients,
    steps: [
      "DIRECTIONS:",
      `This enterprise-grade recipe is a direct dispatch from ${recipe.source}.`,
      "Due to culinary content protection, the full step-by-step instructions are waiting for you at the original manuscript.",
      "CLUE: Most recipes of this type involve prepping ingredients, combined sautéing/mixing, and thermal finishing.",
      "CLICK 'VIEW ORIGINAL MANUSCRIPT' BELOW TO OPEN THE FULL DIRECTIONS!"
    ],
    nutrition: Math.round(recipe.calories * ratio),
    mode: recipe.mealType?.[0] || 'General',
    servings: targetServings,
    sourceUrl: recipe.url
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
