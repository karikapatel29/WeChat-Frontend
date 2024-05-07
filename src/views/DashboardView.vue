<template>
  <v-app style="height: 100%">
    <v-navigation-drawer
      style="height: 90%"
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item nav>
        <v-list-item-title>{{ user.name }}</v-list-item-title>
        <template v-slot:prepend>
          <v-list-item-avatar>
            <v-img :src="getProfileImage(user)" alt="" class="user-image" />
          </v-list-item-avatar>
        </template>

        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home-city"
          title="Home"
          value="home"
          @click="this.displayusers = this.allusers"
        ></v-list-item>
        <v-list-item
          class="font-weight-bold"
          prepend-icon="mdi-account-group"
          title="My Organization"
          value="My Organization"
          @click="this.displayusers = this.orgusers"
        ></v-list-item>
        <v-list-item
          @click="openProfileDialog"
          prepend-icon="mdi-account"
          title="My Profile"
          value="account"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          value="users"
          @click="logout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="height:100vh p-0">
      <v-container fluid style="height: 100vh" class="p-0 m-0">
        <!-- Chat App Name row -->

        <v-row style="height: 100%" class="p-0">
          <v-col cols="4" style="height: 100%">
            <v-row style="height: 5%">
              <v-toolbar color="blue-grey-darken-4" density="compact">
                <v-toolbar-title class="pa-1">WeChat </v-toolbar-title>

                <!-- Theme Change -->
                <v-icon
                  class="mx-8"
                  @click="toggleTheme"
                  icon="mdi-theme-light-dark"
                />
              </v-toolbar>
            </v-row>

            <!-- Search Row -->

            <v-row style="height: 10%">
              <v-col class="mb-0 pb-0">
                <v-text-field
                  v-model="search"
                  label="Search"
                  outlined
                  clearable
                  dense
                  class="pb-0"
                  append-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row
              class="mt-0 pt-0 user-list-container"
              style="height: 90%"
              id="user-list"
            >
              <v-col>
                <!-- //////////////////////////// if some user is searched ///////////////////////////////////-->

                <div v-if="search">
                  <v-list dense>
                    <v-list-item
                      v-for="(user, index) in filteredUsers"
                      :key="index"
                      class="user-list-item pa-2"
                      @click="appendChat(user)"
                    >
                      <div class="user-list-item-wrapper">
                        <v-list-item-avatar>
                          <v-img
                            :src="getProfileImage(user)"
                            alt=""
                            class="user-image"
                          />
                        </v-list-item-avatar>

                        <v-list-item-content class="user-list-item-content">
                          <v-list-item-title
                            >{{ user.name
                            }}<sup
                              v-if="user.isOnline === false"
                              style="color: red"
                              >offline</sup
                            >
                            <sup
                              v-else-if="user.isOnline === true"
                              style="color: green"
                              >online</sup
                            ></v-list-item-title
                          >
                        </v-list-item-content>
                      </div>
                    </v-list-item>
                  </v-list>
                </div>

                <!-- //////////////////////////// by default ///////////////////////////////////-->

                <div v-else>
                  <v-list dense>
                    <v-list-item
                      v-for="(user, index) in displayusers"
                      :key="index"
                      class="user-list-item pa-2"
                      @click="handleItemClick(user)"
                    >
                      <div class="user-list-item-wrapper">
                        <v-list-item-avatar>
                          <v-img
                            :src="getProfileImage(user)"
                            alt=""
                            class="user-image"
                          />
                        </v-list-item-avatar>

                        <v-list-item-content class="user-list-item-content">
                          <v-list-item-title
                            >{{ user.name }}
                            <sup
                              v-if="user.isOnline === false"
                              style="color: red"
                              >offline</sup
                            >
                            <sup
                              v-else-if="user.isOnline === true"
                              style="color: green"
                              >online</sup
                            >
                          </v-list-item-title>
                        </v-list-item-content>
                      </div>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-if="openChat == false"
            cols="8"
            class="chat-container"
            style="height: 100%"
          ></v-col>
          <v-col v-else class="chat-box" id="chat-box">
            <ChatBox
              @closeChat="closeChat"
              :userData="user"
              :receiverData="receiver"
              :sender_id="sender_id"
              :receiver_id="receiver_id"
              :messages="chats"
          /></v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Edit Profile Dialog -->

    <v-dialog v-model="profileDialog" max-width="600">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <!-- Place your profile editing form/component here -->
          <EditForm :userData="user" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import router from "../router";
import AppDataServices from "../services/AppDataServices";
import chatData from "../services/chatData";
import Cookies from "js-cookie";
import EditForm from "../components/EditForm.vue";
import ChatBox from "../components/ChatBox.vue";
import io from "socket.io-client";

export default {
  name: "DashboardPage",
  data() {
    return {
      user: {},
      receiver: {},
      drawer: true,
      rail: true,
      profileDialog: false,
      allusers: [],
      orgusers: [],
      displayusers: [],
      socket: null,
      openChat: false,
      search: "",
      sender_id: null,
      receiver_id: null,
      chats: [],
    };
  },
  components: {
    EditForm,
    ChatBox,
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark
        ? "light"
        : "dark";
    },
    initializeSocket() {
      this.socket = io("http://localhost:3000");
    },
    setupBeforeUnloadListener() {
      window.addEventListener("beforeunload", this.handleBeforeUnload);
    },
    handleBeforeUnload() {
      this.updateUserStatus("offline");
    },
    updateUserStatus(status) {
      if (this.user) {
        this.socket.emit("userStatusChange", {
          uniqueVal: this.user.uniqueVal,
          status,
        });
      }
    },
    setupSocketListeners() {
      this.socket.on("connect", () => {
        console.log("Socket.io connection established");
      });

      this.socket.on("disconnect", () => {
        console.log("Socket.io connection disconnected");
      });

      this.socket.on("statusUpdated", ({ uniqueVal, status }) => {
        const displayusers = this.$data.displayusers; // Access allUser using $data
        if (displayusers) {
          const updatedUsers = displayusers.map((user) => {
            if (user.uniqueVal === uniqueVal) {
              //will return true for isOnline field if status is "online" else returns false
              return { ...user, isOnline: status === "online" };
            }

            return user;
          });
          this.$data.displayusers = updatedUsers;
        }
      });
    },
    logout() {
      this.updateUserStatus("offline");
      Cookies.remove("jwt-token");
      router.push("/");
    },
    getProfileImage(user) {
      return `http://localhost:3000${user.profileImage}`;
    },
    async handleItemClick(user) {
      await AppDataServices.getUser(user.uniqueVal).then(() => {
        // sender_id is the current user id (current user is this.user)
        this.sender_id = this.user.id;
      });
      this.receiver = user;
      this.openChat = true;
      this.receiver_id = user.id;

      const data = { sender_id: this.sender_id, receiver_id: this.receiver_id };
      const chats = await chatData.loadChat(data);
      this.chats = chats.data;
    },

    closeChat() {
      this.openChat = false;
    },
    openProfileDialog() {
      this.profileDialog = true;
    },
    // closeProfileDialog() {
    //   this.profileDialog = false;
    // },
    // saveProfile() {
    //   // Logic to save profile information
    //   this.profileDialog = false;
    // },

    async getUser() {
      const uniqueVal = this.$route.params.uniqueVal;
      await AppDataServices.getUser(uniqueVal).then((response) => {
        console.log(response);
        this.user = response.data;
        this.sender_id = this.user.id;
        this.updateUserStatus("online");
      });
    },

    async getAllUsers() {
      const uniqueVal = this.$route.params.uniqueVal;
      await AppDataServices.getAllUsers(uniqueVal).then((response) => {
        console.log(response);
        this.allusers = response.data;
      });

      // for filtering users that belong to same organization (i.e, have same email domain)
      const currentUserEmailDomain = this.user.email.split("@")[1];

      const sameOrganizationUsers = this.allusers.filter((user) => {
        const userEmailDomain = user.email.split("@")[1];
        return userEmailDomain === currentUserEmailDomain;
      });

      this.orgusers = sameOrganizationUsers;

      // by default all users are visible on screen
      this.displayusers = this.allusers;
    },
  },
  mounted() {
    this.initializeSocket();
    this.setupBeforeUnloadListener();
    this.setupSocketListeners();
    this.getUser();
    this.getAllUsers();
  },
  created() {
    this.displayusers = [];
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  computed: {
    filteredUsers() {
      const searchTerm = this.search.toLowerCase().trim();
      if (!searchTerm) {
        // If search term is empty, return all users
        return this.displayusers;
      } else {
        // Filter users based on search term (if username matches the characters written in search bar)
        return this.displayusers.filter(
          (user) =>
            user.name.toLowerCase().split(" ").join("").includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm)
        );
      }
    },
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.user-list-item {
  padding: 1rem;
  border-bottom: 0.05rem solid #ccc;
  display: flex;
  align-items: center;
}
.user-list-container {
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.chat-container {
  background-image: url("../assets/doodle.jpg");
  background-size: cover;
  background-position: center;
  height: 100%;
  opacity: 0.5;
}
.user-image {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 60%;
  margin-right: 1rem;
}
.user-list-item-wrapper {
  display: flex; /* Use flexbox layout */
  align-items: center; /* Align items vertically */
}
.user-list-item-content {
  margin-left: 0.5rem; /* Adjust spacing between avatar and user info */
}
.v-container {
  padding: 0;
  margin-left: 0.2rem;
  margin-top: 0.8rem;
}
</style>