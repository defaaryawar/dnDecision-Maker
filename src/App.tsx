import React, { useState } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import Header from "./components/Header";
import CategoryButton from "./components/CategoryButton";
import DiceRoller from "./components/DiceRoller";
import ResultDisplay from "./components/ResultDisplay";
import AIChat from "./components/AIChat";
import InfoSection from "./components/InfoSection";
import { foodOptions } from "./data/food.data";
import { placeOptions } from "./data/place.data";

// Data khusus Lagoon Avenue Bekasi
const lagoonAvenueFood = [
  "Solaria (Lagoon Avenue Bekasi)",
  "Burger King (Lagoon Avenue Bekasi)",
];

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<"food" | "place">("food");
  const [result, setResult] = useState<string>("");
  const [isRolling, setIsRolling] = useState(false);
  const [diceIconIndex, setDiceIconIndex] = useState<number>(0);
  const [isSecretMode, setIsSecretMode] = useState(false);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setResult("");

    // Animasi dadu
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomDiceIndex = Math.floor(Math.random() * diceIcons.length);
      setDiceIconIndex(randomDiceIndex);
      rollCount++;

      if (rollCount > 10) {
        clearInterval(rollInterval);

        let selectedOption: string;

        // Logika secret mode
        if (isSecretMode) {
          if (currentCategory === "food") {
            // Pilih random dari makanan Lagoon Avenue
            const randomIndex = Math.floor(Math.random() * lagoonAvenueFood.length);
            selectedOption = lagoonAvenueFood[randomIndex];
          } else {
            // Untuk category place, langsung Lagoon Avenue
            selectedOption = "Lagoon Avenue Bekasi";
          }
        } else {
          // Mode normal - pilih random dari data biasa
          const options = currentCategory === "food" ? foodOptions : placeOptions;
          const randomIndex = Math.floor(Math.random() * options.length);
          selectedOption = options[randomIndex];
        }

        setTimeout(() => {
          setResult(selectedOption);
          setIsRolling(false);
        }, 200);
      }
    }, 150);
  };

  const resetResult = () => {
    setResult("");
    setDiceIconIndex(0);
  };

  const handleCategoryChange = (category: "food" | "place") => {
    setCurrentCategory(category);
    resetResult();
  };

  const toggleSecretMode = () => {
    setIsSecretMode(!isSecretMode);
    resetResult(); // Reset result ketika toggle secret mode
  };

  return (
    <div className="min-h-screen md:px-3 md:py-6">
      <div className="md:max-w-sm md:mx-auto bg-white/95 backdrop-blur-sm md:rounded-2xl shadow-2xl overflow-hidden">
        <Header isSecretMode={isSecretMode} onSecretToggle={toggleSecretMode} />

        <div className="px-4 py-4">
          {/* Category Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <CategoryButton
              label="Makan Apa?"
              isActive={currentCategory === "food"}
              onClick={() => handleCategoryChange("food")}
              icon={"food"}
            />

            <CategoryButton
              label="Kemana Ya?"
              isActive={currentCategory === "place"}
              onClick={() => handleCategoryChange("place")}
              icon={"place"}
            />
          </div>

          {/* Dice Roller - Normal tanpa indikasi secret mode */}
          <DiceRoller diceIconIndex={diceIconIndex} isRolling={isRolling} onRoll={rollDice} />

          {/* Result Display */}
          <ResultDisplay result={result} category={currentCategory} />

          {/* AI Chat */}
          <AIChat result={result} category={currentCategory} />

          {/* Info Section */}
          <InfoSection
            category={currentCategory}
            foodCount={
              isSecretMode && currentCategory === "food"
                ? lagoonAvenueFood.length
                : currentCategory === "food"
                ? foodOptions.length
                : placeOptions.length
            }
            placeCount={placeOptions.length}
          />
        </div>
      </div>
    </div>
  );
};

export default App;