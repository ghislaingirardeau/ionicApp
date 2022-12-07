import { CapacitorHttp } from "@capacitor/core";

import { createStore } from "vuex";

const store = createStore({
  state: {
    datas: null,
    lang: "en-GB",
  },
  mutations: {
    fetchDatas(state, datas) {
      state.datas = datas;
    },
    NEW_CHARACTER(state, data) {
      state.datas.push(data);
    },
    SET_LANG(state, data) {
      state.lang = data.lang;
      console.log(state.lang);
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
    setLang(context, data) {
      context.commit("SET_LANG", data);
    },
  },
});

export default store;
