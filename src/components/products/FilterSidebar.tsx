//import { Filter, X,  } from 'lucide-react';

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
      {/* Mobile Overlay (Dark background when menu is open on phone) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
  fixed inset-y-0 left-0 z-50 w-72 bg-white
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}

  lg:translate-x-0 lg:transform-none lg:sticky lg:top-24
  lg:z-0 lg:w-72 lg:block
`}>
  <div className="h-full overflow-y-auto hide-scrollbar px-6 py-8 space-y-10">

    {/* Header */}
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">
        Filters
      </h3>
      <button
        onClick={onClear}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
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
      <div className="max-h-52 overflow-y-auto hide-scrollbar space-y-2">
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

// Helper Component for cleaner code
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
      className={`flex items-center gap-3 w-full text-left py-1.5 transition ${
        selected ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
          selected
            ? 'border-blue-600'
            : 'border-gray-300'
        }`}
      >
        {selected && (
          <div className="w-2 h-2 rounded-full bg-blue-600" />
        )}
      </div>

      <span className="text-sm">
        {label}
      </span>
    </button>
  );
}

function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
