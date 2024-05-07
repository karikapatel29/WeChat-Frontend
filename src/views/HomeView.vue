<template>
  <div class="background-image1">
    <v-card
      class="pa-12 pb-8 mx-auto"
      color="#FDD7E4"
      height="80%"
      width="80%"
      elevation="16"
      style="margin-left: 50px; margin-bottom: 60px"
    >
      <v-row>
        <v-col>
          <br /><br />
          <v-card-title
            style="
              font-size: 72px;
              color: #550a35;
              font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial,
                sans-serif;
            "
            ><b>WeChat</b></v-card-title
          >
          <br /><br />
          <div style="width: 75%; color: grey">
            <h5>
              Empower your team with seamless communication. Our organizational
              chat app streamlines collaboration, boosts productivity, and
              fosters teamwork. Say goodbye to communication barriers and hello
              to efficiency with our intuitive platform at your fingertips.
            </h5>
          </div>
          <br /><br />
          <div style="width: 50%">
            <router-link to="/login" class="nav-link">
              <v-btn rounded="xl" size="default" color="#045D5D" block
                >LOGIN</v-btn
              ></router-link
            >
            <br />

            <router-link to="/register" class="nav-link">
              <v-btn rounded="xl" size="default" block
                >REGISTER</v-btn
              ></router-link
            >
          </div>
        </v-col>
        <v-col>
          <div class="bg-img"></div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "HomePage",
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    // Check if token is present in cookies
    // const token = Cookies.get("token");
    // this.isAuthenticated = !!token;
    // if (token) {
    //   this.$router.push("/dashboard");
    // }
  },
};
</script>

<style>
.background-image1 {
  background-image: url("../assets/s4.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.bg-img {
  background-image: url("../assets/s3.jpg");
  background-size: cover;
  height: 70vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
}
</style>


 <!--<div v-if="!isAuthenticated">-->
  
  <!--</div> -->