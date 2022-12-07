<template>
  <ion-modal
    id="example-modal"
    ref="modal"
    :is-open="isOpen"
    @didDismiss="cancel"
  >
    <div class="ion-padding">
      <h1>Menu</h1>
      <ion-list>
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
      </ion-list>
      <ion-button fill="clear" @click="installApp">
        <ion-icon slot="start" :icon="downloadOutline"> </ion-icon>
        Download App
      </ion-button>
      <ion-button @click="cancel">Cancel</ion-button>
      <div>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
        <button @click="animStar">animStar</button>
      </div>
    </div>
  </ion-modal>
</template>

<script>
import { downloadOutline } from "ionicons/icons";
import {
  IonModal,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
export default {
  components: {
    IonButton,
    IonIcon,
    IonModal,
    IonList,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      downloadOutline,
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
      this.langSelected = $event.target.value;
      this.$store.dispatch("setLang", { lang: $event.target.value });
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
    cancel() {
      this.$emit("modal", { message: false });
    },
    animStar() {
      const markers = document.getElementsByTagName("li");
      console.log(markers);

      for (const marker of markers) {
        marker.animate(
          { rotate: ["0deg", "360deg"] },
          {
            duration: 2000,
            pseudoElement: "::before",
            iterations: Infinity,
          }
        );
        marker.animate(
          { rotate: ["0deg", "360deg"] },
          {
            duration: 2000,
            pseudoElement: "::after",
            iterations: Infinity,
          }
        );
      }
    },
  },
};
</script>

<style scoped>
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 350px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
li::before {
  content: "✶";
  display: inline-block;
  color: red;
  animation: color-change 2s infinite alternate;
}
li::after {
  content: "✶";
  display: inline-block;
  color: red;
  animation: color-change 2s infinite alternate;
}

@keyframes color-change {
  0% {
    color: red;
  }
  100% {
    color: blue;
  }
}
</style>
