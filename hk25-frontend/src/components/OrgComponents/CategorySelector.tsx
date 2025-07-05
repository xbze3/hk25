

type Props = {
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
};

const categories = [
  "Accident",
  "Injury",
  "Workplace Hazard",
  "Fire",
  "Explosion",
  "Fatality",
  "Emergency",
  "Medical",
  "Safety Violation",
];

function CategorySelector({ selectedCategories, onChange }: Props) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div>
      <h3>Select Categories</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              border: selectedCategories.includes(category) ? '2px solid #007BFF' : '1px solid #ccc',
              background: selectedCategories.includes(category) ? '#E0F0FF' : '#fff',
              cursor: 'pointer',
            }}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;
