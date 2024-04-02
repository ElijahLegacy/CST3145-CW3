<template>
    <div>
      <main id="main-wrapper">
        <div class="product-container" >
          <div class="product" v-for="(lesson, index) in lessons" :key="index">
            <figure>
              <img :src="lesson.Image" alt="Lesson Image">
            </figure>
            <h2>{{ lesson.title }}</h2>
            <p>Location: {{ lesson.Location }}</p>
            <p>Price: {{ lesson.price }}</p>
            <p>Slots Available: {{ lesson.availableInventory}}</p>
            <button @click="addToCart(lesson)" v-if="canAddToCart(lesson)" class="button" :disabled="lesson.availableInventory === 0">Add to cart</button>
            <span v-if="lesson.availableInventory === 0">All out!</span>
            <span v-else-if="lesson.availableInventory < 5">Only {{ lesson.availableInventory - cartCount(lesson.id) }} left!</span>
            <span v-else>Buy Now!</span>
            <div>
              <span v-for="n in lesson.rating" :key="n">★</span>
              <span v-for="n in 5 - lesson.rating" :key="n">☆</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: "LessonComponent",
    props: {
      lessons: {type: Array, required: true},
      canAddToCart: {type: Function, required: true},
      cartCount: {type: Function, required: true},
      showProduct: {type: Boolean, required: true},

    },
    data() {
      return {

      };
    },
    computed: {

    },
    methods: {
      addToCart(lesson) {
        this.$emit('add-to-cart', lesson);
      },
    }
  };
  </script>

  