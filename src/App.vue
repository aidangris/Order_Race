<script setup>
import Game from './components/Game.vue'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//import { createApp } from 'vue';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdnqOqLtIBhdrf2dp3AxbvIs5TMTKg-5Q",
  authDomain: "orderrace-e1845.firebaseapp.com",
  projectId: "orderrace",
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
  <body>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a id="title" href="/" class="navbar-brand">OrderRace</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <font-awesome-icon icon="home" /> Home
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>

    
  </div>
  
    <div class="container-fluid">
        <router-view />
      </div>
 
  </body>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
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

.navbar-nav{
  float: center;
  display: inline;
  text-align: center;
  width: 50%;
}
.navbar{
  display: block;
  width: 20vw;
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

#app{
  margin-top: 0px;
  margin-left: -160px;
  height: 100vh;
  width: 20vw;
  padding: 0px;
  
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
