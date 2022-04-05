<template>
<AdminLayout>
        <div class="row mb-2">
            <div class="offset-10 col-sm-2">
                <button type="button" class="btn btn-primary" @click="openCreateModal()">Add Book For Issue </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card card-primary">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sl#</th>
                                <th>Issued by</th>
                                <th>Issued book</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Return status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(issue,index) in issues" :key="issue.id">
                                <td>{{index+1}}</td>
                                <td>{{issue.member.name}}</td>
                                <td>{{issue.book.book_name}}</td>
                                <td>{{issue.issue_date}}</td>
                                <td>{{issue.due_date}}</td>
                                <td>
                                   <button type="button" :class="issue.return_status=='Pending' ? 'btn btn-warning':'btn btn-success'" @click="updateStatus({...issue})">{{issue.return_status}}</button>
                                </td>
                                <td><button type="button" class="btn btn-danger" @click="deleteIssue({...issue})"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-primary" @click="openEditModal({...issue})"><i class="fa fa-edit"></i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <form @submit.prevent=" editMode ? editIssue():addIssue()">
            <ModalForm v-if="createMode" @close="close">
                <template v-slot:header> <h6 v-if="createMode">Add Issue Information</h6></template>
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
                            <div>Select Member</div>
                            <select  v-model="form.member_id" class="form-control" id="member_list">
                                <option  v-for="member in members" :key="member.id" :value="member.id">
                                    {{member.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <div>Select Book</div>
                            <select  v-model="form.book_id" class="form-control" id="book_list">
                                <option  v-for="book in books" :key="book.id" :value="book.id">
                                    {{book.book_name}}
                                </option>
                            </select>
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
                <template v-slot:header><h6 v-if="editMode">Edit Issue information</h6> </template>
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
                            <div>Select Member</div>
                            <select  v-model="form.member_id" class="form-control" id="member_id">
                                <option  v-for="member in members" :key="member.id" :value="member.id">
                                    {{member.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <div>Select Book</div>
                            <select  v-model="form.book_id" class="form-control" id="category_list">
                                <option  v-for="book in books" :key="book.id" :value="book.id">
                                    {{book.book_name}}
                                </option>
                            </select>
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
import axios from "axios";
import AdminLayout from '../layouts/AdminLayout.vue';
import ModalForm from "../components/Modal.vue";

export default {
    name: "IssueBook",
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
                book_id: '',
                member_id:'',
                issue_date:'',
                due_date:''
            },
            books:[],
            issues:[],
            members:[],
            errors:[],
            unauthorized: false,
            warningButton:'btn btn-warning',
            successButton:'btn btn-success'

        }
    },
   
    created() {
        const token = (localStorage.getItem('access-token'));
        axios.get('http://127.0.0.1:80/api/issues',{
            headers: {
                authorization: "Bearer " + token
            }
        })
        .then(response => {
            this.issues = response.data.results;
        });
        axios.get('http://127.0.0.1:80/api/members',{
                headers: {
                    authorization: "Bearer " + token
                }
            })
            .then(response => {
                this.members = response.data.results;
            });
        axios.get('http://127.0.0.1:80/api/books',{
                headers: {
                    authorization: "Bearer " + token
                }
            })
            .then(response => {
                this.books = response.data.results;
            });
    },
    methods: {

        changeIsActiveValue(IsActiveValue) {
            this.isActive=IsActiveValue;
        },
        openCreateModal() {
            this.createMode = true;
            this.form.member_id = this.members[0].id;
            this.form.book_id = this.books[0].id;
        },
        openEditModal(issue) {
            this.form=issue;
            console.log(this.form)
            this.createMode = false;
            this.editMode = true;
        },
        close() {
            this.createMode = false;
            this.editMode=false;
            this.form.issue_date='';
            this.form.due_date='';
        },
        async updateStatus(issue){
            const token = (localStorage.getItem('access-token'));
            await axios.get('http://127.0.0.1:80/api/update-return-status/'+issue.id,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.issues.forEach((item,index)=>{
                    if(item.id==response.data.results.id){
                        this.issues.splice(index,1,response.data.results);
                        //this.issues[index] = response.data.results ;
                    }
                })
                console.log(this.issues);
                this.$swal(
                        'Updated!',
                        'Book return status has been updated.',
                        'success'
                        )
                this.unauthorized = false;
            }).catch((error) =>{
                if(error.response.status == 401){
                        this.unauthorized = true;
                        this.errors = error.response.data.error;
                    }
                else if(error.response.status == 403){
                    this.unauthorized = true;
                    this.errors = error.response.data.message;
                }
            })
        },
        addIssue() {
            this.isLoading=true;
            const token = (localStorage.getItem('access-token'));
            axios.post('http://127.0.0.1:80/api/issues', this.form,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.issues.push(response.data.results);
                this.$swal(
                    'Created !',
                    'Book issue has been created.',
                    'success'
                    )
                console.log(this.issues);
                this.createMode=false;
                this.errors=[];
                this.form=[];
                this.unauthorized = false;
            }).catch((error) =>{
                if(error.response.status == 422){
                    this.unauthorized = false;
                    this.errors = error.response.data.errors;
                }
                else if(error.response.status == 401){
                    this.unauthorized = true;
                    this.errors = error.response.data.error;
                }
                else if(error.response.status == 403){
                    this.unauthorized = true;
                    this.errors = error.response.data.message;
                }
            }).finally(() => {
                this.isLoading = false;
            });
        },
        editIssue(){
            const token = (localStorage.getItem('access-token'));
            this.isLoading=true;
            axios.put('http://127.0.0.1:80/api/issues/'+this.form.id, this.form,{
            headers: {
                authorization: "Bearer " + token
            }
            }).then((response) =>{
                this.issues.find((item,index)=>{
                    if(item.id==response.data.results.id){
                        this.issues.splice(index,1,response.data.results);
                    }
                })
                
                this.$swal(
                        'Updated!',
                        'Issue has been updated.',
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
                 else if(error.response.status == 403){
                        this.unauthorized = true;
                        this.errors = error.response.data.message;
                    }
            }).finally(() => {
                    this.isLoading = false;
                });
        },
      
        deleteIssue(issue){
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
                    axios.delete('http://127.0.0.1:80/api/issues/'+issue.id,{
                    headers: {
                        authorization: "Bearer " + token
                    }
                    }).then((response) =>{
                        this.$swal(
                            'Deleted!',
                            'Issue information has been deleted.',
                            'success'
                            )
                        this.issues.find((item,index)=>{
                            if(item.id==response.data.results.id){
                                this.issues.splice(index,1);
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
                });
            },
            
        },
        
            

        
}
</script>

<style>

</style>