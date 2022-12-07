<template>
  <ion-page>
    <!-- always use for a page  -->
    <menu-modal :isOpen="openModal" @modal="doThis" />
    <ion-header>
      <ion-toolbar>
        <ion-button
          slot="start"
          fill="clear"
          id="open-custom-dialog"
          @click="openModal = true"
        >
          <slot name="icon-only"
            ><ion-icon :icon="gridOutline"> </ion-icon
          ></slot>
        </ion-button>

        <ion-title> {{ pageTitle }} </ion-title>
        <slot name="actions-end"></slot>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <slot name="contents"></slot>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title> Footer </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import menuModal from "@/components/menuModal";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
} from "@ionic/vue";
import { gridOutline, chevronBackCircleOutline } from "ionicons/icons";
export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonFooter,
    menuModal,
  },
  props: {
    pageTitle: {
      type: String,
    },
    pageDefaultBackLink: {
      // to keep showing the back button on reload
      type: String,
    },
  },
  data() {
    return {
      gridOutline,
      chevronBackCircleOutline,
      openModal: false,
    };
  },
  methods: {
    doThis() {
      this.openModal = false;
    },
  },
};
</script>

<style scoped></style>
