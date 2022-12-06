<template>
  <base-layout pageTitle="Speech to text" :key="reload">
    <template v-slot:actions-end>
      <ion-button router-link="/file">
        <slot name="icon-only"
          ><ion-icon :icon="documentOutline"> </ion-icon
        ></slot>
      </ion-button>
    </template>

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

    <div class="block_newFile">
      <ion-button fill="clear" @click="createNewDocument"
        >Create a new file
        <ion-icon slot="end" :icon="addCircleOutline"></ion-icon>
      </ion-button>
    </div>

    <ion-button @click="installApp"> install </ion-button>

    <ion-list v-if="fromLocalStorage">
      <ion-item-sliding v-for="file in fromLocalStorage" :key="file.id">
        <ion-item
          :router-link="{
            path: `/${file.id}`,
            query: { lang: file.lang },
          }"
        >
          <ion-label>{{ file.title }}</ion-label>
        </ion-item>

        <ion-item-options side="start">
          <ion-item-option color="danger">
            <ion-icon
              slot="icon-only"
              :icon="closeCircleOutline"
              @click="cleanLocalStorage(file.id)"
            ></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </base-layout>
</template>

<script>
import {
  IonButton,
  IonLabel,
  IonIcon,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSelect,
  IonSelectOption,
  toastController,
} from "@ionic/vue";

import {
  closeCircleOutline,
  documentOutline,
  addCircleOutline,
} from "ionicons/icons";

export default {
  components: {
    IonButton,
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonSelect,
    IonSelectOption,
  },
  data() {
    return {
      closeCircleOutline,
      documentOutline,
      addCircleOutline,
      langSelected: "en-GB",
      reload: 0,
      fromLocalStorage: undefined,
      deferredPrompt: undefined,
    };
  },
  created() {
    this.$watch(
      () => this.$route.path,
      (to) => {
        if (to === "/" && localStorage.getItem("Mydocuments")) {
          this.fromLocalStorage = JSON.parse(
            localStorage.getItem("Mydocuments")
          );
        }
      }
    );
    if (localStorage.getItem("Mydocuments")) {
      this.fromLocalStorage = JSON.parse(localStorage.getItem("Mydocuments"));
    }
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (e) => {
      this.deferredPrompt = e;
      console.log(this.deferredPrompt);
    });
  },
  methods: {
    async installApp() {
      if (this.deferredPrompt !== null) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === "accepted") {
          this.deferredPrompt = null;
        }
      }
    },
    selectLanguage($event) {
      this.langSelected = $event.target.value;
    },
    createNewDocument() {
      this.$router.push({
        /* path: `/transcribe/${Date.now()}`, */
        name: "editPage",
        params: { id: `${Date.now()}` },
        query: { lang: this.langSelected },
      });
    },
    async cleanLocalStorage(id) {
      const toast = await toastController.create({
        message: "Are you sure you want to delete this file ?",
        buttons: [
          {
            text: "Yes",
            role: "info",
            handler: () => {
              const updateStorage = this.fromLocalStorage.filter(
                (elt) => elt.id != id
              );
              localStorage.setItem(
                "Mydocuments",
                JSON.stringify(updateStorage)
              );
              this.fromLocalStorage = updateStorage;
              this.reload++;
            },
          },
          {
            text: "No",
            role: "cancel",
            handler: () => {},
          },
        ],
      });

      await toast.present();
    },
  },
};
</script>

<style scoped>
ion-textarea.custom-textarea {
  --background: #ffffff;
  --color: rgb(60, 60, 60);
  --padding-end: 30px;
  --padding-start: 10px;
  border: 2px solid rgb(116, 116, 116);
  border-radius: 5px 5px;
  position: relative;
  z-index: 0;
}
.delete_icon {
  position: absolute;
  top: 30%;
  right: 10px;
  font-size: 24px;
  color: rgb(100, 100, 100);
  z-index: 1;
}
.mic_icon--size {
  font-size: 64px;
}
.wrapper-ripple {
  margin-left: auto;
}
.ripple-parent {
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;

  border: 2px solid rgb(190, 190, 190);

  background-color: #04cece;

  user-select: none;
}
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.custom-ripple {
  color: #05e63d;
}
.block_newFile {
  border-bottom: 2px solid blue;
  margin-right: 20px;
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
