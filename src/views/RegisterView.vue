<template>
  <!-- <v-row class="rowstyle background-image">
    <v-col class="pa-5 pb-8 mx-10"> -->
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
        height="100%"
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
          <span class="font-weight-bold">Register</span>
        </v-card-title>
        <br />
        <v-divider></v-divider>
        <v-form @submit.prevent="register">
          <!-- TEXT FIELDS -->
          <v-text-field
            clearable
            v-model="registerpage.fullName"
            label="Full Name"
          ></v-text-field>
          <v-text-field
            clearable
            prepend-inner-icon="mdi-identifier"
            v-model="registerpage.empId"
            label="Employee ID"
          ></v-text-field>
          <v-text-field
            clearable
            prepend-inner-icon="mdi-email-outline"
            type="email"
            v-model="registerpage.email"
            label="Email"
          ></v-text-field>
          <v-text-field
            clearable
            prepend-inner-icon="mdi-lock-outline"
            v-model="registerpage.password"
            :rules="rules.passwordRules"
            type="password"
            label="Enter password"
          ></v-text-field>
          <v-text-field
            clearable
            prepend-inner-icon="mdi-lock-outline"
            v-model="registerpage.conpassword"
            :rules="rules.conpasswordRules.concat(passwordConfirmationRule)"
            type="password"
            label="Confirm password"
          ></v-text-field>

          <v-btn
            class="mt-0"
            type="submit"
            color="blue"
            size="x-large"
            variant="tonal"
            elevation="5"
            block
            >Register</v-btn
          >
        </v-form>

        <v-card-text class="text-center">
          <p class="text-body-2">
            Already have an account?
            <router-link to="/login" class="text-blue text-decoration-none"
              >Login</router-link
            >
          </p>
        </v-card-text>
      </v-card>
    </div>
  </div>
  <!-- </v-col>

    <v-col class="pa-5 pb-8"> </v-col>
  </v-row> -->
</template>


<script>
import router from "../router";
import AppDataServices from "../services/AppDataServices";

export default {
  name: "RegisterPage",
  data() {
    return {
      registerpage: {
        fullName: "",
        email: "",
        // profileImage: "",
        password: "",
        conpassword: "",
        empId: "",
      },
      rules: {
        passwordRules: [(v) => !!v || "Password is required"],
        conpasswordRules: [(v) => !!v || "Password is required"],
      },
    };
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark
        ? "light"
        : "dark";
    },
    register(e) {
      e.preventDefault();

      if (this.registerpage.conpassword !== this.registerpage.password) {
        alert("Passwords do not match");
      } else {
        var data = {
          fullName: this.registerpage.fullName,
          email: this.registerpage.email,
          // profileImage: this.registerpage.profileImage,
          password: this.registerpage.password,
          empId: this.registerpage.empId,
        };

        AppDataServices.register(data)
          .then((response) => {
            alert(response.data.message);
            router.push("/login");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.registerpage.password === this.registerpage.conpassword ||
        "Password must match";
    },
  },
};
</script>

<style>
.background-image {
  background-image: url("../assets/15.jpg");
  background-size: cover;
  background-position: center;
  height: 93vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rowstyle {
  background-color: #3f3f3f;
}
.v-sheet {
  width: 100%; /* Make the sheet take the full width */
  max-width: 450px;
}
</style>