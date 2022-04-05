<template>
<AdminLayout>
        <div class="row mb-2">
            <div class="offset-10 col-sm-2">
                <button type="button" class="btn btn-primary" @click="openCreateModal()">Add category</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card card-primary">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sl#</th>
                                <th>Category name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(category,index) in categories" :key="category.id">
                                <td>{{index+1}}</td>
                                <td>{{category.name}}</td>
                                <td>{{category.name}}</td>
                                <td>{{category.name}}</td>
                                <td><button type="button" class="btn btn-danger" @click="deleteCategory({...category})"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-primary" @click="openEditModal({...category})"><i class="fa fa-edit"></i></button></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <form @submit.prevent=" editMode ? editCategory():addCategory()">
            <ModalForm v-if="createMode" @close="close">
                <template v-slot:header> <h6 v-if="createMode">Add Category</h6></template>

                <template v-slot:body>
                        <div v-if="unauthorized">
                        <span class="text-danger">{{ errors}} </span>
                    </div>
                    <div v-else>
                        <div v-for="(errorArray, index) in errors" :key="index">
                            <div v-for="(allErrors, index) in errorArray" :key="index">
                                <span class="text-danger">{{ allErrors}} </span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-3">
                            <label for="name">Category Title</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter Blog category name" v-model="form.name">
                        </div>
                    </div>
                </template>

                <template v-slot:footer>
                    <button type="submit" class="btn btn-primary">
                        Submit
                        <span v-show="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                </template>
            </ModalForm>
            <ModalForm v-if="editMode" @close="close">
                <template v-slot:header><h6 v-if="editMode">Edit Category</h6> </template>

                <template v-slot:body>
                        <div v-if="unauthorized">
                        <span class="text-danger">{{ errors}} </span>
                    </div>
                    <div v-else>
                        <div v-for="(errorArray, index) in errors" :key="index">
                            <div v-for="(allErrors, index) in errorArray" :key="index">
                                <span class="text-danger">{{ allErrors}} </span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-3">
                            <label for="name">Category Title</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter Blog category name" v-model="form.name">
                        </div>
                    </div>
                </template>

                <template v-slot:footer>
                    <button type="submit" class="btn btn-primary">
                        <div v-show="isLoading"  class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                        </div>
                        Submit
                    </button>


                </template>
            </ModalForm>
        </form>
            
</AdminLayout>
</template>

<script>
import axios from "axios"
import AdminLayout from '../layouts/AdminLayout.vue'
import ModalForm from "../components/Modal.vue";
export default {
  name: "CategoryIndex",
  components: {
    AdminLayout,ModalForm
  },
  data () {
        return {
            isActive: false,
            createMode: false,
            editMode:false,
            isLoading:false,
            form:{
                id:null,
                name: '',
            },
            categories:[],
            errors:[],
            unauthorized: false
        }
    },
    created() {
            const token = (localStorage.getItem('access-token'));
            axios.get('http://127.0.0.1:80/api/categories',{
                    headers: {
                        authorization: "Bearer " + token
                    }
                })
                .then(response => {
                    this.categories = response.data.results;
                    console.log(this.categories);
                });
        },
    methods: {
        changeIsActiveValue(IsActiveValue) {
            this.isActive=IsActiveValue;
        },
        openCreateModal() {
            this.createMode = true;
        },
        openEditModal(category) {
            this.form=[];
            this.createMode = false;
            this.editMode = true;
            this.form=category;
        },
        close() {
            this.createMode = false;
            this.editMode=false;
            this.form=false;
        },

        addCategory() {
            this.isLoading=true;
            const token = (localStorage.getItem('access-token'));
            axios.post('http://127.0.0.1:80/api/categories', this.form,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.categories.push(response.data.results);
                this.$swal(
                            'Updated!',
                            'Category has been updated.',
                            'success'
                            )
                this.createMode=false;
                this.errors=[];
                this.form=[];
                this.unauthorized = false;
            }).catch((error) =>{
                console.log(error.response.data.errors);
                if(error.response.status == 422){
                    this.unauthorized = false;
                    this.errors = error.response.data.errors;

                }
                else if(error.response.status == 401){
                    this.unauthorized = true;
                    this.errors = error.response.data.error;
                }
            }).finally(() => {
                      this.isLoading = false;
                    });
        },
        editCategory(){
            const token = (localStorage.getItem('access-token'));
            this.isLoading=true;
            axios.put('http://127.0.0.1:80/api/categories/'+this.form.id, this.form,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.categories.find((item,index)=>{
                    if(item.id==response.data.results.id){
                        this.categories.splice(index,1,response.data.results);
                    }
                })
                this.$swal(
                        'Updated!',
                        'Category has been updated.',
                        'success'
                        )
                this.editMode=false;
                this.form=[];
                this.errors=[];
                this.unauthorized = false;
            }).catch((error) =>{
                console.log(error.response.data.errors);

                if(error.response.status == 422){
                    this.unauthorized = false;
                    this.errors = error.response.data.errors;

                }
                else if(error.response.status == 401){
                    this.unauthorized = true;
                    this.errors = error.response.data.error;
                }
            }).finally(() => {
                      this.isLoading = false;
                    });
        },

        deleteCategory(category){
            this.$swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then(() => {
                    const token = (localStorage.getItem('access-token'));
                    axios.delete('http://127.0.0.1:80/api/categories/'+category.id,{
                    headers: {
                        authorization: "Bearer " + token
                    }
                    }).then((response) =>{
                        this.$swal(
                            'Deleted!',
                            'Category has been deleted.',
                            'success'
                            )
                        this.categories.find((item,index)=>{
                            if(item.id==response.data.results.id){
                                this.categories.splice(index,1);
                            }
                        })
                        this.errors=[];
                        this.unauthorized = false;
                    }).catch((error) =>{
                        console.log(error.response);
                        if(error.response.status == 422){
                            this.unauthorized = false;
                            this.errors = error.response.data.errors;
                        }
                        else if(error.response.status == 404){
                            this.unauthorized = true;
                            this.errors = error.response.data.error;
                        }
                    })
                })

        },

    }


}
</script>

<style>

</style>