<template>
  <base-layout pageTitle="One memory" page-default-back-link="/memories">
    <memory-overview :memory="memoryItem"></memory-overview>
  </base-layout>
</template>

<script>
import memoryOverview from "../components/memoryOverview.vue";

export default {
  components: { memoryOverview },
  data() {
    return {
      memoryId: this.$route.params.id,
      dataFetch: null,
    };
  },
  computed: {
    memoryItem() {
      return this.$store.state.datas.find(
        (e) => e.id === parseInt(this.memoryId)
      );
    },
  },
  watch: {
    $route(newId) {
      this.memoryId = newId.params.id;
    },
  },
  /* created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.$route.params.id ? this.fetch() : "";
      },
      { immediate: true }
    );
  }, */
  /* methods: {
    async fetch() {
      const options = {
        url: `https://rickandmortyapi.com/api/character/${this.$route.params.id}`,
      };
      const response = await CapacitorHttp.request({
        ...options,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        this.dataFetch = response.data;
      }
    },
  }, */
};
</script>

<style lang="scss" scoped></style>
