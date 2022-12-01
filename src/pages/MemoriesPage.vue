<template>
  <base-layout pageTitle="All memories">
    <template v-slot:actions-end>
      <ion-button router-link="/memories/add" @ionFocus="doThis">
        <slot name="icon-only"><ion-icon :icon="add"> </ion-icon></slot>
      </ion-button>
    </template>
    <!-- <ion-list v-if="items">
      <ion-item
        v-for="elt in items"
        :key="elt.id"
        :router-link="'/memories/' + elt.id"
      >
        <ion-thumbnail slot="start">
          <ion-img :src="elt.image"></ion-img>
        </ion-thumbnail>
        <ion-label>{{ elt.title }}</ion-label>
      </ion-item>
    </ion-list> -->
    <ion-list v-if="$store.state.datas">
      <ion-item
        v-for="elt in $store.state.datas"
        :key="elt.id"
        :router-link="'/memories/' + elt.id"
      >
        <ion-thumbnail slot="start">
          <ion-img :src="elt.image"></ion-img>
        </ion-thumbnail>
        <ion-label>{{ elt.name }}</ion-label>
      </ion-item>
    </ion-list>
  </base-layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonImg,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonIcon,
  loadingController,
} from "@ionic/vue";
/* import datas from "../mixins/datas"; */
import { add } from "ionicons/icons";

export default {
  components: {
    IonList,
    IonItem,
    IonImg,
    IonLabel,
    IonThumbnail,
    IonButton,
    IonIcon,
  },
  /* mixins: [datas], */
  data() {
    return {
      add,
      datasFetch: null,
    };
  },
  methods: {
    doThis() {
      console.log("click");
    },
  },
  async created() {
    const loading = await loadingController.create({
      message: "Loading...",
      duration: 10000,
      cssClass: "custom-loading",
    });

    loading.present();
    this.$store.dispatch("fetchDatas").then(() => {
      loading.dismiss();
    });
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
