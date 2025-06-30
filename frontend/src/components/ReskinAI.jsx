import React, { useState } from "react";

const ReskinAI = ({ game, onUpdateAssets }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate assets.");
      const data = await response.json();
      onUpdateAssets(data.assets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">🖌️ Reskin with AI</h2>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Describe your theme (e.g., Neon Cyberpunk)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
        onClick={handleGenerate}
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate Assets"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default ReskinAI;