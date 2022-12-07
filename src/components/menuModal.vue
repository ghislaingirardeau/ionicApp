<template>
  <ion-modal
    id="example-modal"
    ref="modal"
    :is-open="isOpen"
    @didDismiss="closeModal"
  >
    <div>
      <ion-list>
        <ion-list-header>
          <ion-label class="menu_title">Settings</ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-end">
          <ion-label>Record language</ion-label>
          <ion-select
            interface="popover"
            placeholder="English"
            @ionChange="selectLanguage($event)"
          >
            <IonSelectOption value="en-GB">English</IonSelectOption>
            <IonSelectOption value="fr-FR">French</IonSelectOption>
            <IonSelectOption value="km-KH">Khmer</IonSelectOption>
          </ion-select>
        </ion-item>
        <ion-item @click="installApp">
          <ion-icon slot="end" :icon="downloadOutline"> </ion-icon>
          Download App
        </ion-item>
        <ion-item @click="closeModal" class="item_close">
          <ion-icon slot="end" :icon="closeCircleOutline"> </ion-icon>
          Close
        </ion-item>
      </ion-list>
    </div>
  </ion-modal>
</template>

<script>
import { downloadOutline, closeCircleOutline } from "ionicons/icons";
import {
  IonModal,
  IonIcon,
  IonList,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonListHeader,
} from "@ionic/vue";
export default {
  components: {
    IonIcon,
    IonModal,
    IonList,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonListHeader,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      downloadOutline,
      closeCircleOutline,
      deferredPrompt: undefined,
    };
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (e) => {
      this.deferredPrompt = e;
    });
  },
  methods: {
    selectLanguage($event) {
      this.$store.dispatch("setLang", { lang: $event.target.value });
      this.closeModal();
      // use the store to for lang
      // select lang inside the modal
    },

    async installApp() {
      if (this.deferredPrompt !== null) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === "accepted") {
          this.deferredPrompt = null;
        }
      }
    },
    closeModal() {
      this.$emit("modal", { message: false });
    },
  },
};
</script>

<style scoped>
.item_close {
  color: rgb(216, 114, 11);
  border-top: 2px solid rgb(216, 114, 11);
}
ion-list-header {
  padding: 0px;
}
.menu_title {
  color: rgb(216, 114, 11);
  padding-bottom: 10px;
  padding-left: 20px;
  border-bottom: 2px solid rgb(216, 114, 11);
}
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 330px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
</style>
