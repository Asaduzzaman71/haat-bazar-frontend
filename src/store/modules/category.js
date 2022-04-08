import axios from "axios";

const state = {
  categories: []
};
const getters = {
  allCategories : state => state.categories
};
const actions = {
  async getCategoris({ commit }) {
    const response = await axios.get("http://localhost:3000/products");

    commit("setCategories", response.data);
  },
  async addProduct({ commit }, product) {
    const response = await axios.post(
      "http://localhost:3000/products",
      product
    );

    commit("newProduct", response.data);
  },
  async deleteProduct({ commit }, id) {
    await axios.delete(`http://localhost:3000/products/${id}`);

    commit("removeProduct", id);
  }
};

const mutations = {
  setProducts: (state, categories) => (state.categories = categories),
  newProduct: (state, product) => state.products.unshift(product),
  removeProduct: (state, id) =>
    (state.products = state.products.filter(product => product.id !== id))
};

export default {
  state,
  getters,
  actions,
  mutations
};
