import { CapacitorHttp } from "@capacitor/core";

import { createStore } from "vuex";

const store = createStore({
  state: {
    datas: null,
  },
  mutations: {
    fetchDatas(state, datas) {
      state.datas = datas;
    },
    NEW_CHARACTER(state, data) {
      state.datas.push(data);
    },
  },
  actions: {
    async fetchDatas(context) {
      const options = {
        url: "https://rickandmortyapi.com/api/character",
      };
      const response = await CapacitorHttp.request({
        ...options,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        return new Promise((resolve) => {
          context.commit("fetchDatas", response.data.results);
          resolve(true);
        });
      }
    },
    newCharacter(context, data) {
      return new Promise((resolve) => {
        context.commit("NEW_CHARACTER", data);
        resolve(true);
      });
    },
  },
});

export default store;
