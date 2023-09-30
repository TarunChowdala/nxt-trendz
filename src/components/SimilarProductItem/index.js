// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachItem} = props
  return (
    <li className="similar_product-item">
      <img
        src={eachItem.imageUrl}
        alt="similar product"
        className="similar-product-img"
      />
      <h1 className="similar-product-name">{eachItem.title}</h1>
      <p className="by">{`by ${eachItem.brand}`}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">{`Rs ${eachItem.price}`}</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{eachItem.rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
            className="small-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
