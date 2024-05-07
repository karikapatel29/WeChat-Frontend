<template>
  <v-container style="height: 98%" class="chatbox border border-light">
    <!-- ////////////////////////  Toolbar  /////////////////////////////////// -->

    <v-toolbar
      class="user-list-item-wrapper p-0"
      color="blue-grey-lighten-4"
      style="height: 3.5rem"
    >
      <v-list-item class="pa-2 pt-1">
        <v-img :src="getProfileImage(receiverData)" alt="" class="user-image" />
      </v-list-item>

      <v-list-item-content class="user-list-item-content">
        <v-list-item-title
          >{{ receiverData.name }}
          <v-list-item-subtitle
            v-if="receiverData.isOnline === false"
            style="color: red"
            >offline</v-list-item-subtitle
          >
          <v-list-item-subtitle
            v-else-if="receiverData.isOnline === true"
            style="color: green"
            >online</v-list-item-subtitle
          >
        </v-list-item-title>
      </v-list-item-content>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-phone</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-video</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="closeChat">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- ////////////////////////  Message container  /////////////////////////////////// -->

    <v-container style="height: 35rem" class="message-box" id="message-box">
      <!-- use below tag to iterate over messages -->
      <template v-for="(message, index) in messages" :key="index">
        <!-- Display date if it's different from the previous message -->
        <template v-if="isDifferentDate(message.createdAt, index)">
          <div class="text-center">
            {{ formatDate(message.createdAt) }}
          </div>
        </template>

        <!-- if current user is not the sender of message, then message should be on the left-hand side -->

        <v-list-item
          v-if="
            message.sender_id == receiver_id || message.receiver_id == sender_id
          "
        >
          <!-- for all other person's messages -->
          <v-list-item-content class="received-message">
            <div class="d-flex">
              <img
                :src="getProfileImage(receiverData)"
                alt=""
                width="4%"
                height="4%"
                class="rounded-circle"
              />
              <div
                class="receiver-message mb-4 ma-1"
                style="background-color: #7393b3"
              >
                <v-list-item-subtitle class="d-flex justify-space-between"
                  >~ {{ receiverData.name }}
                  <v-icon type="button" @click="openDialog(message.id)">
                    mdi-chevron-down
                  </v-icon>
                </v-list-item-subtitle>
                {{ message.message }}
                <v-list-item-subtitle class="text-end">{{
                  new Date(message.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}</v-list-item-subtitle>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>

        <!-- for the logged in user's messages on right-hand side -->

        <v-list-item v-else>
          <v-list-item-content class="sent-message">
            <!-- <div class="d-flex "> -->
            <div class="sender-message mb-4">
              <v-list-item-subtitle class="d-flex justify-space-between"
                >~ You
                <v-icon type="button" @click="openDialog(message.id)">
                  mdi-chevron-down
                </v-icon>
              </v-list-item-subtitle>
              {{ message.message }}
              <v-list-item-subtitle class="text-end">{{
                new Date(message.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}</v-list-item-subtitle>
            </div>
            <img
              :src="getProfileImage(userData)"
              alt=""
              width="4%"
              height="4%"
              class="rounded-circle"
            />
            <!-- </div> -->
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-container>

    <!-- ////////////////////////  Type message field  /////////////////////////////////// -->

    <v-row class="message-sender d-flex justify-content-evenly">
      <v-text-field
        class="message-field pa-4 pt-0 pb-0 mb-0"
        v-model="currmessage"
        style="max-width: 90%"
        prepend-inner-icon="mdi-message-reply"
        filled
        clearable
        label="Type a Message"
        type="text"
      >
      </v-text-field>
      <!-- <v-spacer></v-spacer> -->
      <v-btn icon @click="sendMessage">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-row>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="350">
      <v-card>
        <v-card-text>
          <p>Do you want to delete this message?</p>
          <div class="d-flex justify-space-evenly pt-2">
            <v-btn
              :disabled="loading"
              class="ma-1"
              color="grey"
              plain
              @click="closeDialog"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn
              :loading="loading"
              class="ma-1"
              color="error"
              plain
              @click="deleteMssg"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- / -->
  </v-container>
</template>

<script>
import chatData from "@/services/chatData";
import io from "socket.io-client";

export default {
  name: "ChatBox",
  data() {
    return {
      currmessage: "",
      deleteDialog: false,
      messageId: 0,
    };
  },
  props: {
    userData: Object,
    receiverData: Object,
    sender_id: Number,
    receiver_id: Number,
    messages: Array,
  },
  methods: {
    initializeSocket() {
      this.socket = io("http://localhost:3000");

      this.socket.on("message", (message) => {
        this.messages.push(message); // Push message into the messages array
        this.scrollbottom();
      });
    },

    getProfileImage(user) {
      return `http://localhost:3000${user.profileImage}`;
    },

    async sendMessage() {
      //////// append message into database
      try {
        //Initialize socket if not already initialized
        if (!this.socket) {
          this.initializeSocket();
        }
        // Append message into database
        const messageData = {
          senderId: this.$props.sender_id,
          receiverId: this.$props.receiver_id,
          message: this.currmessage,
        };

        const response = await chatData.saveChat(messageData);

        // Emit the message via socket
        this.socket.emit("message", response.data.data);

        // Clear the message input field after sending
        this.currmessage = "";
        this.scrollbottom();
      } catch (error) {
        console.log("Error sending message", error);
      }
    },
    async deleteMssg() {
      const mssgIndex = this.messages.findIndex((a) => a.id === this.messageId);

      const response = await chatData.deleteChat(this.messageId);

      if (response) {
        this.messages.splice(mssgIndex, 1);
        this.deleteDialog = false;
      }
    },
    scrollbottom() {
      var chatContainer = document.getElementById("message-box");

      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } else {
        console.error("Element with id 'chat-container' not found.");
      }
    },
    isDifferentDate(createdAt, index) {
      const messageDate = new Date(createdAt).toDateString();
      if (index === 0 || messageDate !== this.lastDisplayedDate) {
        this.lastDisplayedDate = messageDate;
        return true;
      }
      return false;
    },

    formatDate(createdAt) {
      return new Date(createdAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    openDialog(id) {
      this.messageId = id;
      this.deleteDialog = true;
    },
    closeDialog() {
      this.deleteDialog = false;
    },
    closeChat() {
      this.$emit("closeChat");
    },
  },
  created() {
    this.initializeSocket();
  },
  mounted() {
    this.scrollbottom();
  },
  updated() {
    this.scrollbottom();
  },
};
</script>

<style>
.user-list-item {
  padding: 1rem;
  border-bottom: 0.05rem solid #ccc;
  display: flex;
  align-items: center;
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
.message-box {
  overflow-y: scroll;
  overflow-x: hidden;
}
.chatbox {
}
.sent-message {
  display: flex;
  justify-items: end;
  justify-content: end;
  text-align: right;
  align-content: end;
  align-items: end;
}
.received-message {
  text-align: left;
}
.sender-message {
  text-align: left;
  max-width: 50%;
  background-color: #80cbc4; /* Example background color for sender messages */
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}

.receiver-message {
  text-align: left;
  /* background-color: #e0e0e0; Example background color for receiver messages */
  max-width: 50%;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>