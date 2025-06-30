const TemplateSelector = ({ onSelect }) => {
  const templates = ["Flappy Bird"];

  return (
    <div className="grid grid-cols-2 gap-4 justify-center">
      {templates.map((templateName) => (
        <button
          key={templateName}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => onSelect(templateName)}
        >
          {templateName}
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;