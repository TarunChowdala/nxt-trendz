// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {productData: [], itemCount: 1, apiStatus: 'INITIAL'}

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    const {match} = this.props
    const {id} = match.params
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    const fetchedData = await response.json()
    if (response.ok === true) {
      this.apiSuccess(fetchedData)
    } else {
      this.apiFailed()
    }
  }

  apiSuccess = fetchedData => {
    const formattedData = {
      availability: fetchedData.availability,
      brand: fetchedData.brand,
      description: fetchedData.description,
      id: fetchedData.id,
      imageUrl: fetchedData.image_url,
      price: fetchedData.price,
      rating: fetchedData.rating,
      similarProducts: fetchedData.similar_products.map(eachProduct =>
        this.formattedObject(eachProduct),
      ),
      style: fetchedData.style,
      title: fetchedData.title,
      totalReviews: fetchedData.total_reviews,
    }
    this.setState({
      productData: formattedData,
      apiStatus: 'SUCCESS',
    })
  }

  apiFailed = () => this.setState({apiStatus: 'FAILED'})

  formattedObject = eachProduct => ({
    availability: eachProduct.availability,
    brand: eachProduct.brand,
    description: eachProduct.description,
    id: eachProduct.id,
    imageUrl: eachProduct.image_url,
    price: eachProduct.price,
    rating: eachProduct.rating,
    style: eachProduct.style,
    title: eachProduct.title,
    totalReviews: eachProduct.total_reviews,
  })

  renderProductItem = () => {
    const {productData, itemCount} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
      similarProducts,
    } = productData

    return (
      <div className="inner-container">
        <div className="selected-product">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="details-container">
            <h1 className="title">{title}</h1>
            <p className="price">{`Rs ${price}/-`}</p>
            <div className="rating-review-box">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="star"
                />
              </div>

              <p className="review">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="description">{description}</p>
            <div className="availability-container">
              <p className="text">Availability: </p>
              <p className="availability">{availability}</p>
            </div>
            <div className="brand-container">
              <p className="text">Brand:</p>
              <p className="brand">{brand}</p>
            </div>
            <hr className="hr-line" />
            <div className="product-item-counter-container">
              <button
                type="button"
                className="btn"
                onClick={this.onClickDecrease}
                data-testid="minus"
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="number">{itemCount}</p>
              <button
                type="button"
                data-testid="plus"
                className="btn"
                onClick={this.onClickIncrease}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-text">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProducts.map(eachItem => (
            <SimilarProductItem key={eachItem.id} eachItem={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  onClickDecrease = () => {
    const {itemCount} = this.state
    if (itemCount > 1) {
      this.setState(prevState => ({itemCount: prevState.itemCount - 1}))
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({itemCount: prevState.itemCount + 1}))
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickContinueButton = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderErrorView = () => (
    <div className="empty-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onClickContinueButton}
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {history, apiStatus} = this.props
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      history.replace('/login')
    }

    let resultantRenderedItem
    switch (apiStatus) {
      case 'SUCCESS':
        resultantRenderedItem = this.renderProductItem()
        break
      case 'FAILED':
        resultantRenderedItem = this.renderErrorView()
        break
      default:
        resultantRenderedItem = this.renderLoader()
    }

    return (
      <div className="product-item-container">
        <Header />
        {resultantRenderedItem}
      </div>
    )
  }
}

export default ProductItemDetails
