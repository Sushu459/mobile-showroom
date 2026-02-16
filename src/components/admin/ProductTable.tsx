import "./ProductTable.css"; // The only new line

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  image?: string;
}

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onDelete }: Props) {
  return (
    <div className="table-wrapper">
      
      <div className="table-header">
        <h2 className="table-title">
          Product List
        </h2>
      </div>

      <table className="styled-table">
        <thead className="table-head">
          <tr>
            <th className="th-cell">Product</th>
            <th className="th-cell">Category</th>
            <th className="th-cell">Price</th>
            <th className="th-cell text-right">Action</th>
          </tr>
        </thead>

        <tbody className="tbody-divider">
          {products.map((product) => (
            <tr key={product.id} className="table-row">
              
              <td className="td-product">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                  />
                )}
                <div>
                  <p className="product-name">
                    {product.name}
                  </p>
                  <p className="product-brand">
                    {product.brand}
                  </p>
                </div>
              </td>

              <td className="td-regular">
                {product.category}
              </td>

              <td className="td-price">
                ₹{product.price}
              </td>

              <td className="td-action">
                <button
                  onClick={() => onDelete(product.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}