<template>
  <nav>
    <v-app-bar app flat color="cyan-lighten-5">
      <v-app-bar-nav-icon
        v-if="isAuthenticated"
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="text-uppercase grey--text">
        <span class="font-weight-light">chit</span>
        <span>chat</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn flat color="grey" v-if="!isAuthenticated">
        <router-link to="/register" class="nav-link">Register</router-link>
      </v-btn>
      <v-btn flat color="grey" v-if="!isAuthenticated">
        <router-link to="/" class="nav-link">Login</router-link>
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "NavBar",
  data() {
    return {
      isAuthenticated: false,
      drawer: false,
    };
  },
  created() {
    // Check if token is present in cookies
    const token = Cookies.get("jwt-token");
    this.isAuthenticated = !!token;
  },
  watch: {
    $route: function () {
      // Check if token is present in cookies
      const token = Cookies.get("jwt-token");
      this.isAuthenticated = !!token;
    },
  },
  methods: {},
};
</script>
<style scoped>
</style>