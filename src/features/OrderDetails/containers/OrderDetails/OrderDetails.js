import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from "react-router-dom"
import Captcha from 'react-google-recaptcha'
import { Helmet } from 'react-helmet'

import { createOrder, validOrder } from '../../models'
import { filterCart } from 'utils'
import { deliveryAndTotalCost } from './utils'
import * as actions from '../../actions'
import { RestaurantAndCafe, Cart } from 'features'
import { MonetaForm, ErrorBox, Spinner } from 'components'
import { DeliveryAddress, DeliveryTimes, CustomerInfo } from '../../components'
import { ORDER_DETAILS } from '../../links'
import { TITLE_PREFIX } from 'appConstants'

class OrderDetails extends React.Component {

  constructor(props) {
    super(props)
    const { cart, user: { name, phone } } = props
    const dishes_orders_attributes = filterCart(cart)
    this.state = {
      order: createOrder({ name, phone, dishes_orders_attributes }),
      invalidFields: [],
      ...deliveryAndTotalCost(cart)
    }
  }

  handleChange = prop => {
    const { target, delivery } = prop
    const { cart } = this.props
    this.setState(prev => ({
      ...prev,
      ...(() => delivery !== undefined ? deliveryAndTotalCost(cart, delivery) : {})(),
      order: {
        ...prev.order,
        ...(() => target ? { [target.name]: target.value } : prop)()
      }
    }))
  }

  handleSubmit = () => {
    const { order, g_recaptcha_response } = this.state
    const { createOrder, user: { id } } = this.props
    const invalidFields = validOrder(order)
    if (invalidFields) this.setState({ invalidFields })
    if (!invalidFields.length && (id || g_recaptcha_response)) {
      createOrder({
        ...order,
        street: order.street.value || ''
      }, g_recaptcha_response)
      /*console.log({
        ...order,
        street: order.street.value || ''
      })*/
    } else {
      ErrorBox.create('Заполните все необходимые поля!')
    }
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
    const { cart, loadCartFromLocalstorage, loadOrderFromLocalstorage } = this.props
    !cart && loadCartFromLocalstorage()// && loadOrderFromLocalstorage()
  }

  componentWillReceiveProps = (nextProps) => {
    const { cart, order: { id, delivery, amount, mnt_signature }, history, user: { name, phone } } = nextProps
    !cart.length && history.push(RestaurantAndCafe.links.MENU.URL)
    if (mnt_signature) { //заказ создан, рендерим форму монеты
      localStorage.clear()
      ReactDOM.render(
        <MonetaForm
          mntTransactionId={id}
          mntAmount={amount}
          mntSignature={mnt_signature}
          paymentType="43674"
        />,
        document.querySelector('#portal')
      )
    } else {
      const dishes_orders_attributes = filterCart(cart)
      this.setState(prev => ({
        ...prev,
        order: {
          ...prev.order,
          phone: phone ? phone : prev.order.phone,
          name, dishes_orders_attributes
        },
        ...deliveryAndTotalCost(cart, delivery)
      }))
    }
  }

  render = () => {
    const { freeDelivery, totalCost, invalidFields, order } = this.state
    const { clearCart, fetching, user: { id } } = this.props
    const { REACT_APP_DELIVERY_COST, REACT_APP_CAPTCHA_KEY } = process.env
    return (
      <div style={{ position: "relative" }}>
        {fetching ? Spinner() : null}
        <Helmet title={TITLE_PREFIX + ORDER_DETAILS.TITLE} />
        <div id="order" className="form-layout">
          <div id="order-header">
            <div id="logo" className="order-logo" />
            <h2>Оформление заказа</h2>
          </div>
          <div id="order-content">
            <DeliveryTimes onChange={delivery_times => this.handleChange({ delivery_times })} />
            <DeliveryAddress onChange={this.handleChange} invalidFields={invalidFields} />
            <CustomerInfo
              onChange={this.handleChange}
              invalidFields={invalidFields}
              order={order}
            />
            <div id="total">
              {
                !id ?
                  <Captcha
                    sitekey={REACT_APP_CAPTCHA_KEY}
                    onChange={g_recaptcha_response => this.setState({ g_recaptcha_response })}
                  />
                  : <div />
              }
              <div className="bl_cena">
                {
                  freeDelivery ? <div>Бесплатная доставка</div> : <div>Стоимость доставки: {REACT_APP_DELIVERY_COST}₽</div>
                }
                <span style={{ fontSize: "1.5em" }}>К оплате: </span>
                <span className="bsm">
                  <span className="bsm_n">{totalCost}</span><span style={{ fontSize: "30px" }}>₽</span>
                </span>
              </div>
            </div>
          </div>
          <div id="submit">
            <div onClick={clearCart} className="z_btn order-btn">
              Отмена
              <i style={{ color: "red" }} className="material-icons">close</i>
            </div>
            <div onClick={this.handleSubmit} className="z_btn order-btn">
              Отправить
              <i style={{ color: "green" }} className="material-icons">done</i>
            </div>
          </div>
        </div>
        <div id="leaf-right" className="leaf leafs" />
        <div id="leaf-left" className="leaf leafs" />
        <Cart.containers.Cart />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.cart.payload,
  user: state.user.payload,
  order: state.order.payload,
  fetching: state.order.fetching
})

const mapDispatchToProps = dispatch => bindActionCreators({
  ...actions,
  ...Cart.actions
}, dispatch)

const ReduxWrapper = connect(mapStateToProps, mapDispatchToProps)
const WrappedComponent = ReduxWrapper(withRouter(OrderDetails))
export default WrappedComponent