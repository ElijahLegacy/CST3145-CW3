<template>
  <div>
    <header v-if="showProduct">
      <h1 v-text="sitename"></h1>
      <div class="search-sort">
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="Search...">
        </div>

        <div class="sort-checkout-container">
          <button @click="toggleCheckout" class="button">
            {{ cart.length }}
            <span class="fa-solid fa-cart-shopping"></span>
            Checkout
          </button>
        </div>
      </div>
    </header>
    <div v-if="showProduct">
      <div class="sort-container" >
        <label>Sort by:</label>
        <div :key="index" v-for="(attribute, index) in ['subject', 'location', 'price', 'availableInventory']">
          <input type="checkbox" :id="attribute" :value="attribute" v-model="sortAttributes"/>
          <label :for="attribute">{{ attribute }}</label>
        </div>
      </div>

      <div class="ascending-descending-options">
        <input type="checkbox" id="ascending" v-model="ascendingOrder" />
        <label for="ascending">Ascending</label>
      </div>
    </div>
    <div v-if="showProduct">
      <LessonComponent :show-product="showProduct" :cart-count="cartCount" :lessons="filteredLessons" :can-add-to-cart="canAddToCart" @add-to-cart="addToCart"/>
    </div>
    <div class="cart" v-else>
      <CheckoutForm :cart-count="cartCount" :order-submitted="orderSubmitted" :save-order="saveOrder" @remove-item-from-cart="removeFromCart" :cart="cart" />
    </div>

    <button @click="toggleCheckout">{{showProduct ? 'View Cart' : 'Back to Lessons'}}</button>
  </div>
</template>

<script>
import CheckoutForm from './components/CheckoutForm.vue';
import LessonComponent from './components/LessonComponent.vue';

export default {
  name: 'App',
  components: {
    CheckoutForm,
    LessonComponent
  },
  data() {
    return {
      sitename: 'M00986498 - Coursework 3 - CST3145',
      products: [],
      cart: [],
      searchQuery: '',
      showProduct: true, // Assuming you want to show products by default
      sortAttributes: [],
      ascendingOrder: false,
      showShoppingCart: false,
      showCheckout: false,
      orderSubmitted: false,
      baseUrl: 'https://cst3145-cw2.onrender.com'
    };
  },
  //fetch lessons & pass via prop to LessonComponent
  created() {
    this.fetchLessons();
  },
  methods: {
    fetchLessons() {
      fetch(`${this.baseUrl}/lessons`) // Assuming this is the correct endpoint on your server
          .then(response => response.json())
          .then(data => {
            // Handle the response data here (e.g., update Vue.js data)
           this.products = data;
          })
          .catch(error => {
            console.error('Error fetching lessons:', error);
          });
    },
    saveOrder(orderData) {
      fetch(`${this.baseUrl}/new-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
          .then(response => response.json())
          .then(data => {
            // Handle the response data here (if needed)
            console.log('Order saved:', data);
            this.orderSubmitted = true;
            setTimeout(function (){
              location.reload()
            },1000)
          })
          .catch(error => {
            console.error('Error saving order:', error);
          });
    },

    addToCart(product) {
      if (this.canAddToCart(product)) {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          // Update the original product's available inventory
          this.products[index].availableInventory--;
          // Add a copy of the product to the cart
          this.cart.push({ ...product });
        }
      }
    },
    canAddToCart(product) {
      return product.availableInventory > this.cartCount(product.id) && product.availableInventory > 0;
    },
    cartCount(id) {
      return this.cart.filter(item => item.id === id).length;
    },
    toggleCheckout() {
      this.showProduct = !this.showProduct;
    },
    removeFromCart(productId) {
      const index = this.cart.findIndex(item => item.id === productId);
      if (index !== -1) {
        // Increment the available inventory when removing from the cart
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          this.products[productIndex].availableInventory++;
        }

        //this removes the item from the cart array
        this.cart.splice(index, 1);
      }
    },
  },
  computed: {
    filteredLessons() {
      console.log(this.sortAttributes)
      // Check if any sorting attributes are selected
      if (this.sortAttributes.length > 0) {
        // Use a loop to apply sorting for each selected attribute
        this.sortAttributes.forEach(attribute => {
          function compare(a, b) {
            if (a[attribute] > b[attribute]) return 1;
            if (a[attribute] < b[attribute]) return -1;
            return 0;
          }
          // Sort the array based on the selected attribute and order
         this.ascendingOrder ? this.products.sort(compare) : this.products.sort(compare).reverse();
        });
      }
      if (this.searchQuery.length > 1) {
        return this.products.filter(product =>
            (product.title && product.title.toLowerCase().includes(this.searchQuery)) ||
            (product.Location && product.Location.toLowerCase().includes(this.searchQuery))
        );
      }

      return this.products;

    },
  }

};
</script>

<style>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

header {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#main-wrapper {
  margin-top: 80px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: space-around;
}

.search-sort {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.sort-container {
  position: absolute;
  left: 10px;
  top: 50px;
  background-color: white;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sort-container > div {
  margin-bottom: 10px;
}

.sort-container label {
  margin-left: 5px;
}

.sort-container div input {
  margin-right: 5px;
}

.sort-container div {
  display: flex;
  flex-direction: column;
}

.sort-container div label {
  margin-bottom: 5px;
}

.ascending-descending-options {
  position: absolute;
  left: 10px;
  top: 320px;
  background-color: white;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ascending-descending-options label {
  margin-right: 5px;
}

.ascending-descending-options input {
  margin-right: 5px;
}

.sort-checkout-container {
  display: flex;
  align-items: center;
}

.sort-container {
  margin-right: 20px;
}

.sort-container label {
  margin-right: 10px;
}

.search-container {
  margin-right: 20px;
}

.checkout,
.cart {
  width: 48%;
  margin-bottom: 20px;
  border: 1px solid #000;
  padding: 10px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .search-sort {
    flex-direction: column;
    text-align: center;
  }

  .search-container,
  .sort-checkout-container {
    margin: 10px 0;
  }

  .sort-checkout-container {
    justify-content: space-between;
    width: 100%;
  }

  .sort-container {
    margin: 0;
  }
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 80%;
}

.product {
  width: 300px;
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product:hover {
  transform: scale(1.05);
}

.product img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

button {
  display: block;
  margin-top: 10px;
  padding: 10px;
  background-color: #85B96E;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #6a9557;
}

.checkout {
  width: 80%;
  margin-top: 20px;
}

</style>
