<template>
  <v-card class="card">
    <v-card-text class="text">
      <div class="image-container">
        <label for="profile-image-input">
          <img
            class="edit-image"
            :src="getProfileImage(userData)"
            alt="Current Profile Image"
          />
        </label>
        <input
          id="profile-image-input"
          type="file"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
      <br />
      <v-text-field
        v-model="updatedName"
        label="Change Name"
        type="text"
        required
        class="updatedName"
      ></v-text-field>
      <br />
      <v-text-field
        v-model="updatedPassword"
        label="Change Password"
        type="password"
        required
        class="updatedPassword"
      ></v-text-field>
      <div class="d-flex justify-content-between" style="width: 100%">
        <v-btn class="me-5 ms-8" color="grey" @click="sendImg(updatedImg)"
          >Submit Changes</v-btn
        >
        <v-btn class="ms-5" color="red" @click="deleteDialog = true"
          >Delete Account</v-btn
        >
      </div>
    </v-card-text>
  </v-card>

  <!-- delete dialog -->

  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title>Confirm Account Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete your account?</v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="deleteAccount">Delete</v-btn>
        <v-btn @click="deleteDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Cropper dialog -->

  <v-dialog v-model="cropperDialogVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>Crop Image</v-card-title>
      <v-card-text>
        <div ref="cropperContainer">
          <img
            ref="cropperImage"
            :src="newProfileImage"
            alt="New Profile Image"
            style="max-width: 100%"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="cropImage">Crop</v-btn>
        <v-btn @click="cancelCrop">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import router from "../router";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import AppDataServices from "../services/AppDataServices";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      newProfileImage: null,
      cropperDialogVisible: false,
      cropper: null,
      updatedImg: "imgdef",
      updatedPassword: null,
      token: null,
      deleteDialog: false,
      updatedName: null,
    };
  },
  props: {
    userData: Object,
  },
  mounted() {
    this.token = Cookies.get("jwt-token");
  },
  methods: {
    openFileInput() {
      // Programmatically trigger the click event of the file input element
      document.getElementById("profile-image-input").click();
    },
    getProfileImage(user) {
      return `http://localhost:3000${user.profileImage}`;
    },
    handleFileChange(event) {
      // Update newProfileImage with the selected file
      this.openCropperDialog();
      this.newProfileImage = URL.createObjectURL(event.target.files[0]);
    },
    openCropperDialog() {
      this.cropperDialogVisible = true;
      this.$nextTick(() => {
        this.cropper = new Cropper(this.$refs.cropperImage, {
          aspectRatio: 1, // Set aspect ratio to 1:1 for square cropping
          viewMode: 1, // Set view mode to 1 for a fixed crop box
        });
      });
    },
    cropImage() {
      const canvas = this.cropper.getCroppedCanvas();
      this.updatedImg = canvas.toDataURL("image.jpeg"); // Update currentProfileImage with cropped image
      // this.sendImg(this.updatedImg);
      this.closeCropperDialog();
    },
    cancelCrop() {
      this.closeCropperDialog();
    },
    closeCropperDialog() {
      this.cropperDialogVisible = false;
      if (this.cropper) {
        this.cropper.destroy(); // Destroy Cropper instance when dialog is closed
        this.cropper = null;
      }
    },
    async sendImg(img) {
      const uniqueVal = this.userData.uniqueVal;
      const formData = new FormData();

      if (img != "imgdef") {
        const blob = this.base64ToBlob(img);
        formData.append("profileImage", blob, "image.jpg");
      }

      formData.append("uniqueVal", uniqueVal);

      formData.append(
        "name",
        this.updatedName === null ? this.userData.name : this.updatedName
      );

      formData.append(
        "password",
        this.updatedPassword === null ? "same" : this.updatedPassword
      );

      await AppDataServices.editprofile(formData).then((response) => {
        if (response.data == "done") {
          this.$router.go(0);
        }
      });
    },
    base64ToBlob(base64) {
      // Remove data URL prefix if present
      const base64Data = base64.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );

      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: "image/jpeg" }); // Adjust the type if your image format is different
    },
    async deleteAccount() {
      this.deleteDialog = false;
      await AppDataServices.deleteUser(this.userData.uniqueVal).then(
        (response) => {
          if (response.data == "done") {
            Cookies.remove("jwt-token");
            router.push("/");
          }
        }
      );
    },
  },
};
</script>

<style scoped>
.card {
  align-items: center;
}
.text {
  justify-content: center; /* Center horizontally */
  align-items: center;
}
.edit-image {
  height: 80px;
  width: 80px;
  border-radius: 60%;
}
.updatedPassword {
  width: 100%;
}
.image-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}
</style>