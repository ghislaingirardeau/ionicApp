<template>
  <base-layout pageTitle="Speech to text" page-default-back-link="/memories">
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
      <ion-row>
        <ion-col class="ion-text-center">
          <h1>Voice to text</h1>
        </ion-col>
      </ion-row>
      <ion-row>
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
      <!-- <ion-row>
        <ion-col class="ion-text-center">
          <p>
            <span v-for="(text, i) in textRecord" :key="i">
              {{ text }}
            </span>
          </p>
        </ion-col>
      </ion-row> -->
      <ion-row
        v-for="(text, i) in textRecord"
        :key="i"
        class="ion-align-items-center"
      >
        <ion-col size="12" class="ion-text-center">
          <ion-textarea
            :label="'my record ' + i"
            :value="text"
            @keyup="doThis($event, i)"
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
      <ion-checkbox v-model="transcribeFromFile"></ion-checkbox>
      <ion-icon v-if="isRecording" :icon="micCircleOutline"> </ion-icon>
      <div v-if="transcribeFromFile">
        <h2>Pick a file and transcribe from it</h2>
        <div v-if="fileAudioLoad">
          <figure>
            <figcaption>Listen to the T-Rex:</figcaption>
            <audio controls id="audioPlayer">
              <source :src="fileAudioLoad" type="audio/mpeg" />
            </audio>
          </figure>
          <ion-button @click="playFile(true)">play</ion-button>
          <ion-button @click="playFile(false)">stop</ion-button>
        </div>
        <div>
          <ion-input
            label="Pick audio file"
            type="file"
            id="audiofileInput"
            @change="audioFileToRead"
          ></ion-input>
        </div>
      </div>

      <ion-button @click="ponctuation">Add ponctuation</ion-button>

      <ion-button @click="stopRecord">Stop transcribe</ion-button>
    </div>

    <h2>My text recorded</h2>
    <p>ON live : {{ onlive }}</p>
    <div v-if="textRecord.length > 0">
      <!-- FORMAT AREA WITH MODIFICATION -->
      <!-- <v-textarea
        v-for="(text, i) in textRecord"
        :key="i"
        :label="'my record ' + i"
        :value="text"
        @keyup="doThis($event, i)"
        rows="1"
        append-icon="mdi-plus"
        @click:append="clear(i)"
        auto-grow
      ></v-textarea> -->

      <!-- TEXT FORMAT -->
      <p>
        <span v-for="(text, i) in textRecord" :key="i">
          {{ text }}
        </span>
      </p>
    </div>
    <ion-button @click="saveLocaly">save</ion-button>
    <ion-button @click="cleanLocal">clean</ion-button>

    <div v-if="fromLocalStorage">
      <h2>from local storage</h2>
      <p>{{ fromLocalStorage }}</p>
    </div>
  </base-layout>
</template>

<script>
import { Document, Packer, Paragraph } from "docx";

import {
  IonButton,
  IonInput,
  IonCheckbox,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonTextarea,
  IonRippleEffect,
} from "@ionic/vue";

import {
  micOutline,
  micCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";

export default {
  components: {
    IonButton,
    IonInput,
    IonCheckbox,
    IonIcon,
    IonCol,
    IonGrid,
    IonRow,
    IonTextarea,
    IonRippleEffect,
  },
  data() {
    return {
      micOutline,
      micCircleOutline,
      closeCircleOutline,
      isRecording: false,
      transcribeFromFile: false,
      textRecord: ["bonjour ceci est mon premier enregistremm"],
      recognition: null,
      onlive: "",
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
      audio: null,
      fileAudioLoad: undefined,
      fromLocalStorage: undefined,
    };
  },
  mounted() {
    /* const audio_file = require("@/assets/media/220905_001.mp3");
    this.audio = new Audio(audio_file); */

    if (localStorage.getItem("transcribe")) {
      this.fromLocalStorage = JSON.parse(localStorage.getItem("transcribe"));
    }
  },
  methods: {
    audioFileToRead() {
      document
        .querySelector("#audiofileInput")
        .getInputElement()
        .then((results) => {
          console.log(results.files);
          const loanFiles = [...Object.values(results.files)];
          const loanFilesURL = URL.createObjectURL(loanFiles[0]);
          this.fileAudioLoad = loanFilesURL;
        });
    },
    playFile(params) {
      this.audio = document.getElementById("audioPlayer");
      /* this.audio.playbackRate = 0.9; */
      if (params) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
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
    startRecord(fromFile) {
      fromFile ? (this.audio = document.getElementById("audioPlayer")) : "";

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = this.langSelected; // setup language
      this.recognition.interimResults = true; // if you want to show the results in process
      this.recognition.maxAlternatives = 1; // get mutliple result
      this.recognition.continuous = false;

      const startTrancribing = () => {
        this.recognition.start();
        this.isRecording = true;
        fromFile ? this.audio.play() : "";
        this.recognition.onresult = (event) => {
          this.onlive = event.results[0][0].transcript;
          /* event.results[event.results.length - 1].isFinal
          ? this.textRecord.push(
              ` ${event.results[event.results.length - 1][0].transcript}.`
            )
          : ""; */
          if (event.results[0].isFinal) {
            this.textRecord.push(` ${event.results[0][0].transcript}.`);
            if (fromFile) {
              this.recognition.stop();
              this.audio.pause();
              setTimeout(() => {
                startTrancribing();
              }, 1000);
            }
            this.isRecording = false;
          }
        };
      };

      startTrancribing();
    },
    stopRecord() {
      this.recognition.stop();
      this.transcribeFromFile ? this.audio.pause() : "";
      this.isRecording = false;
    },
    doThis($event, i) {
      this.textRecord[i] = $event.target.value;
      console.log(this.textRecord[i]);
      this.reload++;
    },
    clear(i) {
      this.textRecord.splice(i, 1);
      this.reload++;
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
      this.reload++;
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
      localStorage.setItem("transcribe", JSON.stringify(this.textRecord));
    },
    cleanLocal() {
      localStorage.removeItem("transcribe");
      this.fromLocalStorage = undefined;
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
  top: 40%;
  right: 15px;
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
