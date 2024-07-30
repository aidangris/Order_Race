
<script setup>

import { useStore } from 'vuex';
import {computed} from "vue";
import { auth } from './firebaseConfig';
//import { playDC } from './components/Game.vue';


const store = useStore();
const user = computed(() => {
    return store.getters.user;
  });


auth.onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
  });

</script>

<template>
  
  <div id="navbar">
    
      <a id="title" href="/" class="navbar-brand">OrderRace</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <font-awesome-icon icon="home" /> Home
          </router-link>
        </li>
        
      </div>

      <div v-if="!user.loggedIn" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Log In
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Register
          </router-link>
        </li>
      </div>

      
      <div v-if="user.loggedIn" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            Profile
          </router-link>
        </li>
        <!--<li class="nav-item">
          <button class="nav-link" @click="playDC()">
            <font-awesome-icon icon="rocket" />
            Daily Challenge
          </button> 
        </li>-->
      </div>
    

    
  </div>
  
    <body>
    
    <div class="container-fluid">
        <router-view />
      </div>
 
  </body>

</template>

<script>
export default {
  
};
</script>

<style scoped>
header {
  line-height: 1.5;
  
}
body{
  background-color: rgb(73, 70, 70);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}


.container-fluid{
  float: left;
  display: inline;
  margin-left: -0px;
  width: 80vw;
  background-color: rgb(73, 70, 70);
  padding: 0px;
  background-size: cover;
}

.navbar-nav{
  float: center;
  display: inline;
  text-align: center;
  width: 50%;
}

#navbar{
  margin-top: 0px;
  margin-left: -160px;
  height: 100vh;
  width: 20vw;
  padding: 0px;
  background-color: rgb(59, 59, 59);
  
}
#title{
  text-align: center;
  margin-left: 20px;
  color: red;
  font-size: 3rem;
}



@media (min-width: 100vw) {
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
