import { createStore } from 'vuex';
import category from "./modules/category";
import product from "./modules/product";

const Store = createStore({
    modules: {
        category,
        product
    },
  })
export default Store;