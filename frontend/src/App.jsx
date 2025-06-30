import { useState } from "react";
import Exporter from "./components/Exporter";
import GameBox from "./components/GameBox";
import ParameterAI from "./components/ParameterAI";
import ReskinAI from "./components/ReskinAI";
import TemplateSelector from "./components/TemplateSelector";

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [assets, setAssets] = useState({});
  const [parameters, setParameters] = useState({});

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎮 GameGen: No-Code AI Game Maker</h1>

      {!selectedGame ? (
        <TemplateSelector onSelect={setSelectedGame} />
      ) : (
        <>
          <h2 className="text-xl font-semibold text-center">
            {selectedGame}
          </h2>

          {assets.character && (
            <p className="text-center text-sm text-gray-600">
              Theme: {assets.themeStyle} | Hero: {assets.character}
            </p>
          )}

          <div className="flex justify-center">
            <GameBox assets={assets} parameters={parameters} />
          </div>

          <ReskinAI game={selectedGame} onUpdateAssets={setAssets} />
          <ParameterAI game={selectedGame} onUpdateParams={setParameters} />
          <Exporter game={selectedGame} assets={assets} parameters={parameters} />
        </>
      )}
    </div>
  );
}

export default App;