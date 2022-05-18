import axios from "axios";

const state = {
  categories: [],
  products: []
};
const getters = {
  allProducts : state => state.products,
};
const actions = {
    async getProducts({ commit }) {
        const token = localStorage.getItem('access-token');
        const response = await axios.get('products',{
                        headers: {
                            authorization: "Bearer " + token
                        }
                    });
        commit("setProducts", response.data.results);
    },

    async addProduct({ commit }, product ) {
        const token = (localStorage.getItem('access-token'));
        const response  = await axios.post('products', product,{
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
            }
        });
        commit("newProduct", response.data.results);
    },

    async updateProduct({ commit }, product) {
        console.log(product.get('id'));
        console.log(product.get('category_id'));
        const token = (localStorage.getItem('access-token'));
        const response = await axios.post('products/'+product.get('id'), product,{
                headers: {
                    authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data"
                }
            });
        commit('updateExistingProduct', response.data.results);
    },

    async removeProduct({ commit }, product) {
        const token = (localStorage.getItem('access-token'));
        await axios.delete('products/'+product.id,{
            headers: {
                authorization: "Bearer " + token
            }
        })
        commit('deleteProduct', product.id);
    },
    async searchProductByName({ commit },seacrhKey) {
        const token = (localStorage.getItem('access-token'));
        const response = await axios.post('product-search-by-name',seacrhKey,{
            headers: {
                authorization: "Bearer " + token
            }
        })
        commit("setProducts", response.data.results);
    },
    async fetchProductByPageNumber({ commit }, pageNumber){
        const token = localStorage.getItem('access-token');
        const response = await axios.get('products?page='+pageNumber,{
                        headers: {
                            authorization: "Bearer " + token
                        }
                    });
        commit("setProducts", response.data.results);

    }
    
};

const mutations = {
    setCategories: (state, categories) => (state.categories = categories),
    setProducts: (state, products) => (state.products = products),
    newProduct: (state, product) => (state.products.push(product)),
    updateExistingProduct: (state, updatedProduct) => {
        state.products.find((item,index)=>{
            if(item.id == updatedProduct.id){
                state.products.splice(index,1,updatedProduct);
            }
        })
    },
    deleteProduct: (state, id) =>  (state.products = state.products.filter(product => product.id !== id)),
};

export default {
  state,
  getters,
  actions,
  mutations
};
