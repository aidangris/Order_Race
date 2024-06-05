<script setup>
import Menu from './components/Menu.vue'
import Game from './components/Game.vue'
import { initializeApp } from "./firebase/app";
import { getAnalytics } from "./firebase/analytics";
//import { createApp } from 'vue';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdnqOqLtIBhdrf2dp3AxbvIs5TMTKg-5Q",
  authDomain: "orderrace-e1845.firebaseapp.com",
  projectId: "orderrace-e1845",
  storageBucket: "orderrace-e1845.appspot.com",
  messagingSenderId: "1015772696682",
  appId: "1:1015772696682:web:d4c3ac8c787780687ffa13",
  measurementId: "G-T37DNGN9Z1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

</script>

<template>
  <!--<header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    
  </header>-->

  <main id="game">
    <Game />
  </main>
</template>



<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

#game{
  width: 1300px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
