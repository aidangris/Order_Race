<script setup>
import { ref } from 'vue';
import Game from '/src/components/Game.vue';

defineProps({
  msg: {
    type: String,
    required: true
  }
})










</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    
  </div>
  
  

</template>

<style scoped>
/* Dropdown Button */


h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
