import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    productDetails: '',
    similarProductsList: [],
    isLoading: false,
    isRequestSuccess: true,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onClickDecreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState({quantity: quantity - 1})
    }
  }

  onClickIncreaseQuantity = () => {
    const {quantity} = this.state
    this.setState({quantity: quantity + 1})
  }

  getProductDetails = async () => {
    this.setState({isLoading: true})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const formattedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        style: fetchedData.style,
        title: fetchedData.title,
        totalReviews: fetchedData.totalReviews,
      }
      const similarProductsList = fetchedData.similar_products
      const formattedSimilarProducts = similarProductsList.map(eachData => ({
        availability: eachData.availability,
        brand: eachData.brand,
        description: eachData.description,
        id: eachData.id,
        imageUrl: eachData.image_url,
        price: eachData.price,
        rating: eachData.rating,
        style: eachData.style,
        title: eachData.title,
        totalReviews: eachData.totalReviews,
      }))
      this.setState(
        {
          productDetails: formattedData,
          isLoading: false,
          similarProductsList: formattedSimilarProducts,
          isRequestSuccess: true,
        },
        this.renderProductDetails,
      )
    } else {
      this.setState({isRequestSuccess: false})
    }
  }

  renderFailureView = () => (
    <div className="product-details-failed-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failed-img"
      />
      <h1 className="failed-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="failed-btn">Continue Shopping</button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {isLoading} = this.state
    return <>{isLoading ? this.renderLoader() : this.renderProductDetails()}</>
  }

  renderProductDetails = () => {
    const {productDetails, similarProductsList, quantity} = this.state
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
      <div className="product-details-container">
        <div className="product-details-sub-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="product-details-card">
            <h1 className="product-name">{title}</h1>
            <p className="product-price">{price}</p>
            <div className="review-card">
              <p className="product-rating">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-logo"
                />
                {rating}
              </p>
              <p className="product-review">{totalReviews}</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-availability">
              Availabile :{' '}
              <p className="product-availability-value">{availability}</p>
            </p>
            <p className="product-brand">
              Brand : <p className="product-brand-value">{brand}</p>
            </p>
            <hr className="separator" />
            <div className="quantity-card">
              <button
                data-testid="minus"
                onClick={this.onClickDecreaseQuantity}
                className="quantity-btn"
              >
                <BsDashSquare />
              </button>
              <p className="product-quantity">{quantity}</p>
              <button
                data-testid="plus"
                onClick={this.onClickIncreaseQuantity}
                className="quantity-btn"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button>ADD TO CART</button>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Products</h1>
        <div className="similar-products-container">
          {similarProductsList.map(eachProduct => (
            <SimilarProductItem
              productDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="TailSpin" color="#00bfff" width={80} height={80} />
    </div>
  )

  render() {
    const {isRequestSuccess} = this.state
    return (
      <>
        <Header />
        {isRequestSuccess ? this.renderSuccessView() : this.renderFailureView()}
      </>
    )
  }
}

export default ProductItemDetails
