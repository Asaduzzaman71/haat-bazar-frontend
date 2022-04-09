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
                            <tr v-for="(category,index) in allCategories" :key="category.id">
                                <td>{{index+1}}</td>
                                <td>{{category.name}}</td>
                                <td>{{category.status == 1 ? 'Published' : 'Pending'}}</td>
                                <td><button type="button" class="btn btn-danger" @click="deleteCategory({...category})"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-primary" @click="openEditModal({...category})"><i class="fa fa-edit"></i></button></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <form @submit.prevent=" editMode ? editCategory():addNewCategory()">
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
import { mapGetters , mapActions } from "vuex";
import AdminLayout from '../layouts/AdminLayout.vue';
import ModalForm from "../components/Modal.vue";
export default {
    name: "CategoryIndex",
    components: {
        AdminLayout,ModalForm
    },
    computed: mapGetters(["allCategories"]),
    created() {
        this.getCategories();
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
            errors:[],
            unauthorized: false
        }
    },

    methods: {
        ...mapActions(["getCategories","addCategory","updateCategory","removeCategory"]),
        changeIsActiveValue(IsActiveValue) {
            this.isActive=IsActiveValue;
        },
        openCreateModal() {
            this.createMode = true;
        },
        openEditModal(category) {
            
            this.createMode = false;
            this.editMode = true;
            this.form=category;
        },
        close() {
            this.createMode = false;
            this.editMode=false;
            this.form=[];
        },
        addNewCategory(){
            this.isLoading = true;
            console.log(this.form);
            this.addCategory(this.form).then( ( ) =>{
                this.$swal(
                            'Created!',
                            'New Category has been created.',
                            'success'
                            )
                this.createMode=false;
                this.errors=[];
                this.form.id=null;
                this.form.name = '';
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
            this.isLoading=true;
            this.updateCategory(this.form).then(() =>{
                this.$swal(
                        'Updated!',
                        'Category has been updated.',
                        'success'
                        )
                this.editMode=false;
                this.form.id=null;
                this.form.name = '';
                this.errors=[];
                this.unauthorized = false;
            }).catch((error) =>{
                console.log(error);
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
                    
                    this.removeCategory(category).then(() =>{
                        this.$swal(
                            'Deleted!',
                            'Category has been deleted.',
                            'success'
                            )
                        this.errors=[];
                        this.unauthorized = false;
                    }).catch((error) =>{
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