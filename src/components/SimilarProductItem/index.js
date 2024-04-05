import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  console.log(productDetails)
  const {
    title,
    availability,
    rating,
    price,
    totalReviews,
    description,
    brand,
    imageUrl,
  } = productDetails
  return (
    <div className="similar-product-container">
      <img
        src={imageUrl}
        alt={`similar product {title}`}
        className="similar-product-img"
      />
      <p className="similar-product-name">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-card">
        <p className="similar-product-price">{price}</p>
        <p className="similar-product-rating">{rating}</p>
      </div>
    </div>
  )
}

export default SimilarProductItem
