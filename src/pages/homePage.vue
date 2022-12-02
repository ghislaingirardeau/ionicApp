<template>
  <base-layout pageTitle="Speech to text" :key="reload">
    <template v-slot:actions-end>
      <ion-button router-link="/transcribe/file">
        <slot name="icon-only"
          ><ion-icon :icon="documentOutline"> </ion-icon
        ></slot>
      </ion-button>
    </template>
    <ion-grid>
      <ion-row>
        <ion-col
          size="2"
          class="ion-text-center"
          v-for="lang in languages"
          :key="lang.country"
          ><ion-button
            small
            @click="langSelected = lang.code"
            :color="langSelected === lang.code ? 'primary' : 'secondary'"
            >{{ lang.country }}</ion-button
          ></ion-col
        >
        <ion-col size="6" class="ion-text-center">
          <ion-button @click="exportDoc">To Docx</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-grid>
      <ion-row class="ion-margin-bottom">
        <ion-col class="ion-text-center wrapper-ripple">
          <!-- <ion-button @click="startRecord(transcribeFromFile)"
            ><ion-icon :icon="micOutline"> </ion-icon>
          </ion-button> -->
          <div
            class="ion-activatable ripple-parent circle"
            @touchstart="startTouchRecord"
            @touchend="stopTouchRecord"
          >
            <ion-icon :icon="micOutline" class="mic_icon--size"> </ion-icon>
            <ion-ripple-effect
              type="unbounded"
              class="custom-ripple"
            ></ion-ripple-effect>
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-label>Name Doc : </ion-label>
          <ion-input
            placeholder="Your title"
            v-model="document.title"
          ></ion-input>
        </ion-col>
      </ion-row>
      <ion-row
        v-for="(text, i) in textRecord"
        :key="i"
        class="ion-align-items-center"
      >
        <ion-col size="12" class="ion-text-center">
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
    <div>
      <ion-button @click="ponctuation">Auto Correct</ion-button>
    </div>

    <ion-button @click="saveLocaly">save</ion-button>
    <ion-button @click="createNewDocument">new</ion-button>

    <ion-list v-if="fromLocalStorage">
      <!-- <ion-item
        v-for="file in fromLocalStorage"
        :key="file.id"
        @click="loadFile(file)"
      >
        {{ file.title }}
        <ion-icon
          :icon="closeCircleOutline"
          @click="cleanLocalStorage(file.id)"
          class="delete_icon"
        >
        </ion-icon>
      </ion-item> -->
      <ion-item-sliding v-for="file in fromLocalStorage" :key="file.id">
        <ion-item @click="loadFile(file)">
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
import { Document, Packer, Paragraph } from "docx";

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
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  toastController,
} from "@ionic/vue";

import {
  micOutline,
  micCircleOutline,
  closeCircleOutline,
  documentOutline,
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
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  },
  data() {
    return {
      micOutline,
      micCircleOutline,
      closeCircleOutline,
      documentOutline,
      isRecording: false,
      transcribeFromFile: false,
      docTitle: undefined,
      document: {
        title: undefined,
        id: undefined,
      },
      textRecord: ["bonjour ceci est mon premier enregistremm"],
      recognition: null,
      languages: [
        {
          country: "KM",
          code: "km-KH",
        },
        {
          country: "FR",
          code: "fr-FR",
        },
        {
          country: "EN",
          code: "en-GB",
        },
      ],
      langSelected: "en-GB",
      reload: 0,
      fromLocalStorage: undefined,
    };
  },
  mounted() {
    if (localStorage.getItem("Mydocuments")) {
      this.fromLocalStorage = JSON.parse(localStorage.getItem("Mydocuments"));
    }
  },
  methods: {
    startTouchRecord() {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = this.langSelected; // setup language
      this.recognition.interimResults = true; // if you want to show the results in process
      this.recognition.maxAlternatives = 1; // get mutliple result
      this.recognition.continuous = false;

      this.recognition.start();
      this.isRecording = true;
    },
    stopTouchRecord() {
      this.recognition.onresult = (event) => {
        event.results[0].isFinal
          ? this.textRecord.push(` ${event.results[0][0].transcript}.`)
          : "";
      };
      this.isRecording = false;
    },
    textRevised($event, i) {
      this.textRecord[i] = $event.target.value;
      console.log(this.textRecord[i]);
    },
    clear(i) {
      this.textRecord.splice(i, 1);
    },
    ponctuation() {
      this.textRecord = this.textRecord.map((elt) => {
        return elt.replaceAll(" dot", ".");
      });
      this.textRecord = this.textRecord.map((elt) => {
        return elt.replaceAll(" coma", ",");
      });
      this.textRecord = this.textRecord.map((elt) => {
        return elt.replaceAll(" question mark", "?");
      });
      console.log(this.textRecord);
    },
    exportDoc() {
      const paragraphs = [];
      for (const key in this.textRecord) {
        paragraphs.push(
          new Paragraph({
            text: this.textRecord[key],
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
        myDocuments.push({
          id: Date.now(),
          title:
            this.document.title === undefined ? "docTest" : this.document.title,
          content: this.textRecord,
        });
      };
      if (localStorage.getItem("Mydocuments")) {
        myDocuments.push(...JSON.parse(localStorage.getItem("Mydocuments")));
        let indexExist = myDocuments.findIndex(
          (elt) => elt.id === this.document.id
        );
        if (indexExist != -1) {
          myDocuments.splice(indexExist, 1, {
            id: this.document.id,
            title: this.document.title,
            content: this.textRecord,
          });
        } else {
          saveNewDocument();
        }
      } else {
        saveNewDocument();
      }
      localStorage.setItem("Mydocuments", JSON.stringify(myDocuments));
      this.fromLocalStorage = myDocuments;
      this.reload++;
    },
    async createNewDocument() {
      const toast = await toastController.create({
        message: "Do you want to save your current work ?",
        buttons: [
          {
            text: "Yes",
            role: "info",
            handler: () => {
              this.saveLocaly();
              this.cleanData();
            },
          },
          {
            text: "No",
            role: "cancel",
            handler: () => {
              this.cleanData();
            },
          },
        ],
      });

      await toast.present();
    },
    cleanLocalStorage(id) {
      const updateStorage = this.fromLocalStorage.filter((elt) => elt.id != id);
      localStorage.setItem("Mydocuments", JSON.stringify(updateStorage));
      this.fromLocalStorage = updateStorage;
      this.cleanData();
    },
    cleanData() {
      this.document = {
        title: undefined,
        id: undefined,
      };
      this.textRecord = [];
      this.reload++;
    },
    loadFile(file) {
      this.textRecord = file.content;
      this.document.title = file.title;
      this.document.id = file.id;
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
</style>
