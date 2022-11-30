<template>
  <ion-page>
    <!-- always use for a page  -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <!-- to position the button inside the toolbar -->
          <ion-back-button
            :default-href="pageDefaultBackLink"
            color="warning"
          ></ion-back-button>
        </ion-buttons>

        <ion-title> {{ pageTitle }} </ion-title>
        <ion-buttons slot="end">
          <slot name="actions-end"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <slot></slot>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title> Footer </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonFooter,
} from "@ionic/vue";
export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonFooter,
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
};
</script>

<style lang="scss" scoped></style>
