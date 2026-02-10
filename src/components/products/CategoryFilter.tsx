import { CATEGORIES } from '../../utils/constants';

interface Props {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
      <button
        onClick={() => onSelect('All')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === 'All' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === cat
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}