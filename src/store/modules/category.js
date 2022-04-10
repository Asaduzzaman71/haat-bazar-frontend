import axios from "axios";

const state = {
  categories: []
};
const getters = {
  allCategories : state => state.categories
};
const actions = {
    
    async getCategories({ commit }) {
        const token = localStorage.getItem('access-token');
        const response = await axios.get('categories',{
                        headers: {
                            authorization: "Bearer " + token
                        }
                    });
        commit("setCategories", response.data.results);
    },

    async addCategory({ commit }, category ) {
        const token = (localStorage.getItem('access-token'));
        const response  = await axios.post('categories', category,{
            headers: {
                authorization: "Bearer " + token
            }
        });
        commit("newCategory", response.data.results);
    },

    async updateCategory({ commit }, category) {
        const token = (localStorage.getItem('access-token'));
        const response = await axios.put('categories/'+category.id, category,{
                headers: {
                    authorization: "Bearer " + token
                }
            });
        commit('updateExistingCategory', response.data.results);
    },

    async removeCategory({ commit }, category) {
        const token = (localStorage.getItem('access-token'));
        axios.delete('categories/'+category.id,{
            headers: {
                authorization: "Bearer " + token
            }
        })
        commit('deleteCategory', category.id);
    },
    
};

const mutations = {
    setCategories: (state, categories) => (state.categories = categories),
    newCategory: (state, category) => (state.categories.push(category)),
    updateExistingCategory: (state, updatedCategory) => {
        state.categories.find((item,index)=>{
            if(item.id == updatedCategory.id){
                state.categories.splice(index,1,updatedCategory);
            }
        })
    },
    deleteCategory: (state, id) =>  (state.categories = state.categories.filter(category => category.id !== id)),
    
};

export default {
  state,
  getters,
  actions,
  mutations
};
