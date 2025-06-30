import React, { useState } from "react";

const ParameterAI = ({ game, onUpdateParams }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdjust = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/adjust-parameters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, prompt }),
      });
      const data = await response.json();
      onUpdateParams(data.parameters);
    } catch (err) {
      console.error("Adjustment failed", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">⚙️ Tune Game Difficulty</h2>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Describe difficulty (e.g., Make it harder)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-800"
        onClick={handleAdjust}
        disabled={loading || !prompt}
      >
        {loading ? "Adjusting..." : "Adjust Parameters"}
      </button>
    </div>
  );
};

export default ParameterAI;