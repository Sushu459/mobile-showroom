import { CATEGORIES } from '../../utils/constants';
import './CategoryFilter.css'; // Import the CSS file

interface Props {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelect }: Props) {
  return (
    <div className="filter-container">
      <button
        onClick={() => onSelect('All')}
        className={`filter-btn ${selectedCategory === 'All' ? 'active' : 'inactive'}`}
      >
        All
      </button>
      
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`filter-btn ${selectedCategory === cat ? 'active' : 'inactive'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}