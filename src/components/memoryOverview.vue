<template>
  <div v-if="memory" class="ion-text-center">
    <ion-img :src="memory.image"></ion-img>
    <h2>{{ memory.name }}</h2>
    <p>{{ memory.species }}</p>
    <p>{{ memory.gender }}</p>
  </div>
</template>

<script>
import { IonImg } from "@ionic/vue";

export default {
  components: {
    IonImg,
  },
  props: {
    memory: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped></style>
