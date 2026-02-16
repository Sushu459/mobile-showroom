import "./FilterSidebar.css"; // Import the CSS file

interface FilterSidebarProps {
  categories: readonly string[];
  brands: string[];
  selectedCategory: string;
  selectedBrand: string;
  selectedPriceRange: string;
  onCategoryChange: (c: string) => void;
  onBrandChange: (b: string) => void;
  onPriceChange: (p: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

// Define the ranges inside the file or import from constants
const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹10,000', value: '0-10000' },
  { label: '₹10,000 - ₹30,000', value: '10000-30000' },
  { label: '₹30,000 - ₹50,000', value: '30000-50000' },
  { label: 'Above ₹50,000', value: '50000-999999' },
];

export default function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedPriceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClear,
  isOpen,
  onClose
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar-aside ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content hide-scrollbar">

          {/* Header */}
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              Filters
            </h3>
            <button
              onClick={onClear}
              className="clear-btn"
            >
              Clear
            </button>
          </div>

          {/* Category */}
          <FilterSection title="Category">
            <RadioOption
              label="All"
              selected={selectedCategory === 'All'}
              onClick={() => onCategoryChange('All')}
            />
            {categories.map((cat) => (
              <RadioOption
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onClick={() => onCategoryChange(cat)}
              />
            ))}
          </FilterSection>

          {/* Price */}
          <FilterSection title="Price">
            {PRICE_RANGES.map((range) => (
              <RadioOption
                key={range.value}
                label={range.label}
                selected={selectedPriceRange === range.value}
                onClick={() => onPriceChange(range.value)}
              />
            ))}
          </FilterSection>

          {/* Brand */}
          <FilterSection title="Brand">
            <div className="section-options brand-scroll hide-scrollbar">
              <RadioOption
                label="All"
                selected={selectedBrand === 'All'}
                onClick={() => onBrandChange('All')}
              />
              {brands.map((brand) => (
                <RadioOption
                  key={brand}
                  label={brand}
                  selected={selectedBrand === brand}
                  onClick={() => onBrandChange(brand)}
                />
              ))}
            </div>
          </FilterSection>

        </div>
      </aside>
    </>
  );
}

// Helper Components
function RadioOption({
  label,
  selected,
  onClick
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`radio-btn ${selected ? 'selected' : 'unselected'}`}
    >
      <div className="radio-circle">
        {selected && (
          <div className="radio-dot" />
        )}
      </div>
      <span className="radio-label">
        {label}
      </span>
    </button>
  );
}

function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="filter-section">
      <h4 className="section-title">
        {title}
      </h4>
      <div className="section-options">
        {children}
      </div>
    </div>
  );
}