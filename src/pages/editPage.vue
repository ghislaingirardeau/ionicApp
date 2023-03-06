<template>
  <base-layout :pageTitle="'Edit : ' + document.title">
    <template v-slot:actions-end>
      <ion-button slot="end" fill="clear" router-link="/">
        <slot name="icon-only"
          ><ion-icon :icon="chevronBackCircleOutline"> </ion-icon
        ></slot>
      </ion-button>
    </template>

    <template v-slot:contents>
      <ion-grid>
        <ion-row>
          <ion-col size="3" class="ion-text-center ion-margin-start">
            <ion-button fill="outline" @click="saveLocaly">save</ion-button>
          </ion-col>

          <ion-col size="3" class="ion-text-center">
            <ion-button fill="outline" @click="exportDoc">To Docx</ion-button>
          </ion-col>
          <ion-col size="3" class="ion-text-center ion-margin-start">
            <ion-button fill="outline" @click="useClipboard"
              >Clipboard</ion-button
            >
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row>
          <ion-col class="ion-text-center wrapper-ripple">
            <!-- <ion-button @click="startRecord(transcribeFromFile)"
            ><ion-icon :icon="micOutline"> </ion-icon>
          </ion-button> -->
            <div
              class="ion-activatable ripple-parent circle"
              @touchstart="startTouchRecord()"
              @touchend="stopTouchRecord"
            >
              <ion-icon :icon="micOutline" class="mic_icon--size"> </ion-icon>
              <ion-ripple-effect
                type="unbounded"
                class="custom-ripple"
              ></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col size="12" v-if="liveResult" class="live_block">
            <span>{{ liveResult }}</span>
          </ion-col>
        </ion-row>
        <ion-row class="ion-margin-bottom">
          <ion-col>
            <ion-item>
              <ion-label position="floating">Title</ion-label>
              <ion-input
                :placeholder="document.title ? document.title : 'File title'"
                v-model="document.title"
              ></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          {{ document.content }}
        </ion-row>
        <ion-row
          v-for="(text, i) in document.content"
          :key="i"
          class="ion-align-items-center"
        >
          <ion-col size="12">
            <ion-textarea
              :label="'my record ' + i"
              :value="text"
              @keyup="textRevised($event, i)"
              rows="1"
              auto-grow
              class="custom-textarea"
            ></ion-textarea>
            <ion-icon
              :icon="closeCircleOutline"
              @click="clear(i)"
              class="delete_icon"
            >
            </ion-icon>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </base-layout>
</template>

<script>
import { Document, Packer, Paragraph } from "docx";
import { Clipboard } from "@capacitor/clipboard";

import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonTextarea,
  IonRippleEffect,
  IonLabel,
  IonInput,
  IonItem,
  toastController,
} from "@ionic/vue";

import {
  micOutline,
  closeCircleOutline,
  chevronBackCircleOutline,
} from "ionicons/icons";

export default {
  components: {
    IonButton,
    IonIcon,
    IonCol,
    IonGrid,
    IonRow,
    IonTextarea,
    IonRippleEffect,
    IonLabel,
    IonInput,
    IonItem,
  },
  data() {
    return {
      micOutline,
      closeCircleOutline,
      chevronBackCircleOutline,
      liveResult: undefined,
      transcribeFromFile: false,
      document: {
        title: undefined,
        id: undefined,
        lang: "en-GB",
        content: ["hello world"],
      },
      recognition: null,
      fromLocalStorage: undefined,
    };
  },

  mounted() {
    const getFile = JSON.parse(localStorage.getItem("Mydocuments"))?.find(
      (e) => e.id == this.$route.params.id
    );
    this.document.lang = this.$route.query.lang;
    if (getFile) {
      this.document = getFile;
    } else {
      this.document.id = parseInt(this.$route.params.id);
    }
  },
  methods: {
    startTouchRecord() {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = this.document.lang; // setup language
      this.recognition.interimResults = true; // if you want to show the results in process
      this.recognition.maxAlternatives = 1; // get mutliple result
      this.recognition.continuous = false;

      this.recognition.start();
      this.recognition.onresult = (event) => {
        this.liveResult = event.results[0][0].transcript;
        event.results[0].isFinal
          ? this.document.content.push(`${event.results[0][0].transcript}.`)
          : "";
      };
    },
    stopTouchRecord() {
      this.recognition.stop();
    },
    textRevised($event, i) {
      this.document.content[i] = $event.target.value;
      console.log(this.document.content[i]);
    },
    clear(i) {
      this.document.content.splice(i, 1);
    },
    async useClipboard() {
      await Clipboard.write({
        string: this.document.content.join(" "),
        label: "Copied",
      });
      this.presentToast("Text Copied!");
    },
    exportDoc() {
      const paragraphs = [];
      for (const key in this.document.content) {
        paragraphs.push(
          new Paragraph({
            text: this.document.content[key],
            spacing: {
              before: 200,
              after: 200,
            },
          })
        );
      }
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });
      Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        console.log("Document created successfully");
        if (navigator.msSaveBlob) {
          // IE 10+
          navigator.msSaveBlob(blob, "example.docx");
        } else {
          var link = document.createElement("a");
          if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "example.docx");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
    },
    saveLocaly() {
      let myDocuments = [];
      const saveNewDocument = () => {
        myDocuments.push(this.document);
      };
      if (localStorage.getItem("Mydocuments")) {
        myDocuments.push(...JSON.parse(localStorage.getItem("Mydocuments")));
        let indexExist = myDocuments.findIndex(
          (elt) => elt.id === this.document.id
        );
        if (indexExist != -1) {
          myDocuments.splice(indexExist, 1, this.document);
        } else {
          saveNewDocument();
        }
      } else {
        saveNewDocument();
      }
      localStorage.setItem("Mydocuments", JSON.stringify(myDocuments));
      this.fromLocalStorage = myDocuments;
      this.presentToast("File saved!");
    },
    async presentToast(text) {
      const toast = await toastController.create({
        message: text,
        duration: 1500,
        position: "top",
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
  line-height: 25px;
  font-weight: bold;
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
  background-color: #04cece;
  border: 2px solid rgb(190, 190, 190);
  z-index: 0;
  user-select: none;
}

.circle::after {
  content: "";
  opacity: 0;
  position: absolute;
  background-color: #04cece;
  z-index: -1;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  transition: opacity 1s ease-in-out;
}
.circle:active::after {
  opacity: 0.5;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.live_block {
  padding-top: 10px;
}
</style>
