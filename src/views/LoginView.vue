
<template>
  <div>
    <!-- NAV BAR == present in all the pages -->

    <v-toolbar color="blue-grey-darken-4" density="compact">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>WeChat</v-toolbar-title>

      <!-- Theme Change -->
      <v-icon class="mx-8" @click="toggleTheme" icon="mdi-theme-light-dark" />
    </v-toolbar>
    <div class="pa-2 pb-8 background-image">
      <v-card
        class="pa-12 pb-8"
        height="80%"
        width="40%"
        elevation="16"
        style="margin-left: 4%"
      >
        <v-card-title
          class="text-center"
          style="
            font-size: 44px;
            color: #0096ff;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
              sans-serif;
          "
        >
          <span class="font-weight-bold">Login</span>
        </v-card-title>
        <br />
        <v-divider></v-divider>

        <v-form @submit.prevent="login">
          <!-- TEXT FIELDS -->
          <v-text-field
            class="pb-4"
            clearable
            prepend-inner-icon="mdi-email-outline"
            type="email"
            :rules="rules.email"
            v-model="loginpage.email"
            label="Enter your email address"
          ></v-text-field>

          <v-text-field
            class="pb-4"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            clearable
            prepend-inner-icon="mdi-lock-outline"
            v-model="loginpage.password"
            :rules="rules.passwordRules"
            label="Enter your password"
          ></v-text-field>

          <div class="d-flex align-center justify-space-between">
            <div></div>
            <a
              class="text-caption text-decoration-none text-deep-orange-darken-4"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Forgot password?</a
            >
          </div>

          <br />
          <v-btn
            class="mt-2"
            type="submit"
            color="blue"
            size="x-large"
            variant="tonal"
            elevation="5"
            block
            >LOG IN</v-btn
          >
        </v-form>

        <v-card-text class="text-center">
          <p class="text-body-2">
            Don't have an account?
            <a class="text-blue text-decoration-none" href="/register"
              >Register</a
            >
          </p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>



<script>
import router from "../router";
import AppDataServices from "../services/AppDataServices";
import Cookies from "js-cookie";
import { useTheme } from "vuetify";

export default {
  name: "LoginPage",
  data() {
    return {
      loginpage: {
        email: "",
        password: "",
        remember: false,
      },
      visible: false,
      rules: {
        email: [
          (v) =>
            !v ||
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "Please enter a valid email",
        ],
        passwordRules: [(v) => !!v || "Password is required"],
      },
    };
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark
        ? "light"
        : "dark";
    },
    login(e) {
      e.preventDefault();
      var data = {
        email: this.loginpage.email,
        password: this.loginpage.password,
        remember: this.loginpage.remember,
      };

      AppDataServices.login(data)
        .then((response) => {
          console.log(response.data.user, response.data.token);
          if (response.data.message) {
            console.log(response.data.message);
            alert(response.data.message);
          } else {
            Cookies.set("jwt-token", response.data.token);
            router.push(`/dashboard/${response.data.user.uniqueVal}`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      router.replace("", null);
    },
  },
};
</script>

<style>
.background-image {
  background-image: url("../assets/15.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.v-sheet {
  width: 100%; /* Make the sheet take the full width */
  max-width: 450px;
}
</style>