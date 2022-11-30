<template>
  <base-layout pageTitle="Add memory" page-default-back-link="/memories">
    <form class="ion-padding" @submit.prevent="addData">
      <ion-list>
        <ion-item>
          <ion-label position="floating"> Name </ion-label>
          <ion-input
            autocapitalize="words"
            clear-input
            type="text"
            v-model="newData.name"
            @keyup="doThis($event)"
            required
          >
          </ion-input>
        </ion-item>
        <ion-list v-if="newData.name?.length > 0 && inputSelection?.length > 0">
          <ion-item
            v-for="(color, i) in inputSelection"
            :key="i"
            class="data_selection"
            @click="pickAchoice(color)"
          >
            {{ color }}
          </ion-item>
        </ion-list>
        <ion-item>
          <ion-thumbnail v-if="preImageUrl">
            <img :src="preImageUrl" alt="sfsref" />
          </ion-thumbnail>
          <ion-button type="button" @click="takePhoto">
            <ion-icon slot="icon-only" :icon="camera"> </ion-icon>
          </ion-button>
          <ion-button type="button" @click="openPhoto">
            <ion-icon slot="icon-only" :icon="folderOpen"> </ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label position="floating"> species </ion-label>
          <ion-input v-model="newData.species" type="text" required>
          </ion-input>
        </ion-item>
        <ion-button expand="full" type="submit"> Add data </ion-button>
      </ion-list>
    </form>
    <ion-label position="floating"> Clipboard </ion-label>
    <ion-input v-model="textToCopy" type="text"> </ion-input>
    <ion-button expand="full" @click="useClipboard"> Copy data </ion-button>
    <ion-button expand="full" @click="useToast"> Toast </ion-button>
    <ion-button expand="full" @click="fetchCapacitor">
      Fetch data capacitor
    </ion-button>
    <ion-button expand="full" @click="fetch"> Fetch </ion-button>
  </base-layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonThumbnail,
  loadingController,
} from "@ionic/vue";
import datas from "../mixins/datas";
import { camera, folderOpen } from "ionicons/icons";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Clipboard } from "@capacitor/clipboard";
import { Toast } from "@capacitor/toast";
import { CapacitorHttp } from "@capacitor/core";
export default {
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonThumbnail,
  },
  mixins: [datas],
  data() {
    return {
      newData: {
        id: null,
        title: undefined,
        image: undefined,
        gender: undefined,
        species: undefined,
      },
      preImageUrl: null,
      camera,
      folderOpen,
      inputSuggestion: ["red", "blue", "green", "black"],
      inputSelection: undefined,
      textToCopy: "",
    };
  },
  methods: {
    addData() {
      this.newData.id = this.$store.state.datas.length + 1;
      this.newData.gender = "male";
      this.$store.dispatch("newCharacter", this.newData).then(() => {
        this.$router.replace(`/memories`);
      });
    },
    doThis($event) {
      this.inputSelection = this.inputSuggestion.filter((e) =>
        e.startsWith($event.target.value)
      );
    },
    pickAchoice(color) {
      this.newData.name = color;
      this.inputSelection = [];
    },
    async takePhoto() {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 60,
      });
      this.preImageUrl = photo.webPath;
      this.newData.image = photo.webPath;
    },
    async openPhoto() {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 60,
      });
      this.preImageUrl = photo.webPath;
      this.newData.image = photo.webPath;
    },
    async useClipboard() {
      await Clipboard.write({
        string: this.textToCopy,
        label: "Copied",
      });
    },
    async useToast() {
      await Toast.show({
        text: "Hello!",
      });
    },
    async fetchCapacitor() {
      const loading = await loadingController.create({
        message: "Loading...",
        duration: 10000,
        cssClass: "custom-loading",
      });

      loading.present();

      const options = {
        url: "http://localhost:8000/api/villages/fetch",
      };
      const response = await CapacitorHttp.request({
        ...options,
        method: "GET",
      });
      if (response) {
        loading.dismiss();
        console.log(response);
      }
    },
    async fetch() {
      const response = await fetch("http://localhost:8000/api/villages/fetch", {
        method: "GET",
      });
      response.json().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style scoped></style>
