<template>
<AdminLayout>
        <div class="row mb-2">
            <div class="offset-10 col-sm-2">
                <button type="button" class="btn-primary" @click="openCreateModal()">Add Member</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card card-primary">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sl#</th>
                                <th>Member name</th>
                                <th>Member email</th>
                                <th>Member phone</th>
                                <th>Member address</th>
                                <th>Memberbership Issue Date</th>
                                <th>Memberbership Expiary Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(member,index) in members" :key="member.id">
                                <td>{{index+1}}</td>
                                <td>{{member.name}}</td>
                                <td>{{member.email}}</td>
                                <td>{{member.phone}}</td>
                                 <td>{{member.address}}</td>
                                <td>{{member.issue_date}}</td>
                                <td>{{member.expiary_date}}</td>
                                <td><button type="button" class="btn-danger" @click="deleteMember({...member})"><i class="fa fa-trash"></i></button><button type="button" class="btn-primary" @click="openEditModal({...member})"><i class="fa fa-edit"></i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <form @submit.prevent=" editMode ? editMember():addMember()">
            <ModalForm v-if="createMode" @close="close">
                <template v-slot:header> <h6 v-if="createMode">Add Member</h6></template>
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
                            <label for="name">Member Name</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter member name" v-model="form.name">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Member Email</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter member email" v-model="form.email">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Member Phone</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter member phone" v-model="form.phone">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Member Address</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter member address" v-model="form.address">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Issue Date</label>
                            <Datepicker v-model="form.issue_date"></Datepicker>
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Expiary Date</label>
                            <Datepicker v-model="form.expiary_date"></Datepicker>
                        </div>
                    </div>
                </template>
                <template v-slot:footer>
                    <button type="submit" class="btn-primary">
                        Submit
                        <span v-show="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                </template>
            </ModalForm>
            <ModalForm v-if="editMode" @close="close">
                <template v-slot:header><h6 v-if="editMode">Edit Member information</h6> </template>
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
                            <label for="name">Member Name</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter member name" v-model="form.name">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Member Email</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter member email" v-model="form.email">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Member Phone</label>
                            <input type="name" class="form-control" id="name" placeholder="Enter member phone" v-model="form.phone">
                        </div>
                        <div class="form-group mb-3">
                            <label for="name">Member Address</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter member address" v-model="form.address">
                        </div>
                        
                    </div>
                </template>
                <template v-slot:footer>
                    <button type="submit" class="btn-primary">
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
import axios from "axios";
import AdminLayout from '../layouts/AdminLayout.vue';
import ModalForm from "../components/Modal.vue";
export default {
  name: "LibraryMember",
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
                email:'',
                phone:'',
                address:'',
                issue_date:'',
                expiary_date:''
            },
            members:[],
            errors:[],
            unauthorized: false
        }
    },
    created() {
            const token = (localStorage.getItem('access-token'));
            axios.get('http://127.0.0.1:80/api/members',{
                    headers: {
                        authorization: "Bearer " + token
                    }
                })
                .then(response => {
                    this.members = response.data.results;
                    console.log(this.members)
                });
        },
        
    methods: {
        changeIsActiveValue(IsActiveValue) {
            this.isActive=IsActiveValue;
        },
        openCreateModal() {
            this.createMode = true;
        },
        openEditModal(members) {
            this.form=[];
            this.createMode = false;
            this.editMode = true;
            this.form=members;
        },
        close() {
            this.createMode = false;
            this.editMode=false;
            this.form=false;
        },

        addMember() {
            this.isLoading=true;
            const token = (localStorage.getItem('access-token'));
            axios.post('http://127.0.0.1:80/api/members', this.form,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.members.push(response.data.results);
                this.$swal(
                    'Created !',
                    'Members has been created.',
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
        editMember(){
            const token = (localStorage.getItem('access-token'));
            this.isLoading=true;
            axios.put('http://127.0.0.1:80/api/members/'+this.form.id, this.form,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.members.find((item,index)=>{
                    if(item.id==response.data.results.id){
                        this.members.splice(index,1,response.data.results);
                    }
                })
                this.$swal(
                        'Updated!',
                        'Member information has been updated.',
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

        deleteMember(member){
            this.$swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    console.log(result);
                    const token = (localStorage.getItem('access-token'));
                    axios.delete('http://127.0.0.1:80/api/members/'+member.id,{
                    headers: {
                        authorization: "Bearer " + token
                    }
                    }).then((response) =>{
                        this.$swal(
                            'Deleted!',
                            'Member information has been deleted.',
                            'success'
                            )
                        this.members.find((item,index)=>{
                            if(item.id==response.data.results.id){
                                this.members.splice(index,1);
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