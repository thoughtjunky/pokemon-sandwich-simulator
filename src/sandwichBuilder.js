const fs = require('fs');

// Import the calculatePowerAmount function
import { calculatePowerAmount } from '../util';

// Load the data files for fillings and condiments
const fillings = JSON.parse(fs.readFileSync('fillings.json'));
const condiments = JSON.parse(fs.readFileSync('condiments.json'));

// Create a dictionary of all ingredients and their attributes
const ingredients = {};
for (const ingredient of fillings.concat(condiments)) {
  ingredients[ingredient.name] = {
    taste: ingredient.taste,
    power: ingredient.power,
    type: ingredient.type,
  };
}

function buildSandwich(desiredPowers) {
  // Initialize the lists of fillings and condiments for the sandwich
  const fillings = [];
  const condiments = [];
  const maxFillings = 6 * 4; // 6 fillings per player, 4 players
  const maxCondiments = 4 * 4; // 4 condiments per player, 4 players

  // Initialize the sums of powers for the sandwich
  const sums = {
    tastes: {},
    powers: {},
    types: {},
  };

  // Calculate the number of players required to build the sandwich
  let numPlayers = 1;
  while (maxFillings / numPlayers < 1 || maxCondiments / numPlayers < 1) {
    numPlayers++;
  }

  // Iterate over the desired powers
  for (const power of desiredPowers) {
    // Select the ingredients that have the desired power and are not already in the sandwich
    const options = Object.keys(ingredients).filter(
      (ingredient) =>
        ingredients[ingredient].power.includes(power) &&
        !fillings.includes(ingredient) &&
        !condiments.includes(ingredient)
    );

    // Sort the selected ingredients by their power attribute (in descending order)
    options.sort((a, b) =>
      ingredients[b].power.includes(power) -
      ingredients[a].power.includes(power)
    );

    // Add the first ingredient that fits within the capacity of the sandwich to the list of fillings or condiments
    for (const ingredient of options) {
      if (fillings.length < maxFillings / numPlayers) {
        fillings.push(ingredient);
      } else if (condiments.length < maxCondiments / numPlayers) {
        condiments.push(ingredient);
      }

      // Stop when both fillings and condiments have reached their maximum capacity
      if (fillings.length >= maxFillings / numPlayers && condiments.length >= maxCondiments / numPlayers) {
        break;
      }
    }
  }

      // Compute the sums of powers for the sandwich
  for (const filling of fillings) {
    const ingredient = ingredients[filling];

    for (const flavor of ingredient.taste) {
      if (!sums.tastes[flavor]) {
        sums.tastes[flavor] = 0;
      }
      sums.tastes[flavor] += calculatePowerAmount(1, ingredient, { flavor });
    }

    for (const type of ingredient.type) {
      if (!sums.types[type]) {
        sums.types[type] = 0;
      }
      sums.types[type] += calculatePowerAmount(1, ingredient, { type });
    }

    for (const power of ingredient.power) {
      if (!sums.powers[power]) {
        sums.powers[power] = 0;
      }
      sums.powers[power] += calculatePowerAmount(1, ingredient, { power });
    }
  }

  for (const condiment of condiments) {
    const ingredient = ingredients[condiment];

    for (const flavor of ingredient.taste) {
      if (!sums.tastes[flavor]) {
        sums.tastes[flavor] = 0;
      }
      sums.tastes[flavor] += calculatePowerAmount(1, ingredient, { flavor });
    }

    for (const type of ingredient.type) {
      if (!sums.types[type]) {
        sums.types[type] = 0;
      }
      sums.types[type] += calculatePowerAmount(1, ingredient, { type });
    }

    for (const power of ingredient.power) {
      if (!sums.powers[power]) {
        sums.powers[power] = 0;
      }
      sums.powers[power] += calculatePowerAmount(1, ingredient, { power });
    }
  }

  // Return the number of players and the lists of fillings and condiments for the sandwich
  return { numPlayers, fillings, condiments };
}
