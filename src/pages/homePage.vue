<template>
  <base-layout pageTitle="Speech to text" page-default-back-link="/memories">
    <div>
      <ion-checkbox v-model="transcribeFromFile"></ion-checkbox>
      <ion-icon :icon="micOutline"> </ion-icon>
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
      <ion-button @click="startRecord(transcribeFromFile)"
        >Start transcribe</ion-button
      >
      <ion-button @click="stopRecord">Stop transcribe</ion-button>
      <ion-button @click="ponctuation">Add ponctuation</ion-button>
      <ion-button @click="saveLocaly">localStorage</ion-button>
      <ion-button @click="exportDoc">export</ion-button>
      <ion-button
        v-for="lang in languages"
        :key="lang.country"
        small
        @click="langSelected = lang.code"
        :color="langSelected === lang.code ? 'primary' : 'secondary'"
        >{{ lang.country }}</ion-button
      >
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
    <div v-if="fromLocalStorage">
      <h2>from local storage</h2>
      <p>{{ fromLocalStorage }}</p>
    </div>
  </base-layout>
</template>

<script>
import { Document, Packer, Paragraph } from "docx";

import { IonButton, IonInput, IonCheckbox, IonIcon } from "@ionic/vue";

import { micOutline } from "ionicons/icons";

export default {
  components: {
    IonButton,
    IonInput,
    IonCheckbox,
    IonIcon,
  },
  data() {
    return {
      micOutline,
      transcribeFromFile: false,
      textRecord: [],
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
        fromFile ? this.audio.play() : "";
        this.recognition.onresult = (event) => {
          this.onlive = event.results[event.results.length - 1][0].transcript;
          /* event.results[event.results.length - 1].isFinal
          ? this.textRecord.push(
              ` ${event.results[event.results.length - 1][0].transcript}.`
            )
          : ""; */
          if (event.results[event.results.length - 1].isFinal) {
            this.textRecord.push(
              ` ${event.results[event.results.length - 1][0].transcript}.`
            );
            if (fromFile) {
              this.recognition.stop();
              this.audio.pause();
              setTimeout(() => {
                startTrancribing();
              }, 1000);
            }
          }
        };
      };

      startTrancribing();
    },
    stopRecord() {
      this.recognition.stop();
      this.transcribeFromFile ? this.audio.pause() : "";
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
  },
};
</script>

<style lang="scss" scoped></style>
