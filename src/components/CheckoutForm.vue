checkout

<template>
  <div class="checkout">
    <h2> Checkout </h2>
    <p>
      <strong>First Name</strong>
      <input v-model.trim="order.firstName" />
    </p>
    <p>
      <strong>Last Name</strong>
      <input v-model.trim="order.lastName" />
    </p>
    <p>
      <strong>Phone:</strong>
      <input v-model.number="order.phone" type="number" />
    </p>

    <h2>Order Information</h2>
    <p>First Name: {{ order.firstName }}</p>
    <p>Last Name: {{ order.lastName }}</p>
    <p>Phone Number: {{ order.phone }}</p>
    <button v-on:click="submitOrder">Place Order</button>
    <p v-if="orderSubmitted">Order Submitted!</p>
  </div>

  <div class="cart">
    <h2>Shopping Cart</h2>
    <ul>
      <li v-for="(cartItem, index) in cart" :key="index">
        <div class="cart-item">
          <figure>
            <img v-bind:src="cartItem.Image" alt="Product Image">
          </figure>
          <h2 v-text="cartItem.title"></h2>
          <p>Location: {{ cartItem.Location }}</p>
          <p>Price: {{ cartItem.price }}</p>
          <p>Slots Available: {{ cartItem.availableInventory }}</p>
          <div>
            <span v-for="(n, index) in cartItem.rating" :key="index">★</span>
            <span v-for="(n, index) in 5 - cartItem.rating" :key="index">☆</span>
          </div>
          <button @click="removeFromCart(cartItem.id)">Remove</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CheckoutForm",
  props: {
    cart: {type: Array, required: true},
    saveOrder: {type: Function, required: true},
    orderSubmitted: {type: Boolean, required: true},
    cartCount: {type: Function, required: true},
  },
  data(){
    return {
      order: {
        firstName: '',
        lastName: '',
        phone: ''
      },
    }
  },
  methods: {
    submitOrder(){
      this.order.lessonIds = this.cart.map(item => item._id)
      this.saveOrder(this.order);
    },
    removeFromCart(lessonId) {
      this.$emit('remove-item-from-cart', lessonId);
    }
  }
}
</script>

  