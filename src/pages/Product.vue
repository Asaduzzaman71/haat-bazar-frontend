<template>
    <AdminLayout>
        <div class="row mb-2">
            <div class="offset-10 col-sm-2 d-flex justify-content-end">
                <button type="button" class="btn btn-primary" @click="openCreateModal()">Create Product</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card card-primary">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sl#</th>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Product Description</th>
                                <th>Price</th>
                                <th>Available Products</th>
                                <th>status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product,index) in books" :key="product.id">
                                <td>{{index+1}}</td>
                                <td><img :src="'http://127.0.0.1:80/storage/'+product.image" class="rounded" alt="Services" width="100" height="100"></td>
                                <td>{{product.name}}</td>
                                <td>{{product.description}}</td>
                                <td>{{product.unit_price}}</td>
                                <td>{{product.no_of_available_products}}</td>
                                <td>{{product.status}}</td>
                                <td><button type="button" class="btn-danger" @click="deleteProduct({...product})"><i class="fa fa-trash"></i></button><button type="button" class="btn-primary" @click="openEditModal({...product})"><i class="fa fa-edit"></i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <form @submit.prevent=" editMode ? editProduct():addProduct()" enctype="multipart/form-data">
            <ModalForm v-if="createMode" @close="close">
                <template v-slot:header> <h6 v-if="createMode"> Create Product </h6></template>

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
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter Book title" v-model="name">
                        </div>
                        <div class="form-group mb-3">
                            <div>Choose category</div>
                            <select  v-model="category_id" class="form-control" id="category_list">
                                <option  v-for="category in categories" :key="category.id" :value="category.id">
                                    {{category.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label for="unit_price">Unit Price </label>
                            <input type="number" class="form-control" id="unit_price" placeholder="Enter unit price" v-model="unit_price">
                        </div>
                        <div class="form-group mb-3">
                            <label for="no_of_available_products">No of available products</label>
                            <input type="number" class="form-control" id="no_of_available_products" placeholder="Enter no of available products" v-model="no_of_available_products">
                        </div>
                        <div  class="image-preview-container">
                            <div v-for="(previewFile, key) in previewFiles" :key="key">
                                <div class ="image-preview-wrapper">
                                    <img class="preview" :src=previewFile  />
                                    <button @click='removePreviewImage(key)' class="close close-button">
                                        <span>&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <input type="file" style="display:none" multiple accept="image/*" @change="onFileChange" ref="fileInput"/>
                            <button @click.prevent="$refs.fileInput.click()">Choose Image</button>
                        </div>
                        <div class="form-group mb-3">
                            <div>Status</div>
                            <select  v-model="status"  id="status" class="form-control">
                                <option   :value="1">Publish</option>
                                <option   :value="0">Unpublish</option>
                            </select>
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
                <template v-slot:header><h6 v-if="editMode">Edit Product</h6> </template>
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
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter Book title" v-model="name">
                        </div>
                        <div class="form-group mb-3">
                            <div>Choose category</div>
                            <select  v-model="category_id" class="form-control" id="category_list">
                                <option  v-for="category in categories" :key="category.id" :value="category.id">
                                    {{category.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label for="unit_price">Unit Price </label>
                            <input type="number" class="form-control" id="unit_price" placeholder="Enter unit price" v-model="unit_price">
                        </div>
                        <div class="form-group mb-3">
                            <label for="no_of_available_products">No of available products</label>
                            <input type="number" class="form-control" id="no_of_available_products" placeholder="Enter no of available products" v-model="no_of_available_products">
                        </div>
                        <div  class="image-preview-container">
                            <div v-for="(uploadedImage, key) in uploadedImages" :key="key">
                                <div class ="image-preview-wrapper">
                                    <img class ="preview" :src = "'/storage/'+uploadedImage.image"  />
                                    <button @click.prevent ='removeUploadedImage(uploadedImage,key)' class="close close-button">
                                        <span>&times;</span>
                                    </button>
                                </div>
                            </div>
                            <div v-for="(previewFile, key) in previewFiles" :key="key">
                                <div class="image-preview-wrapper">
                                    <img class="preview" :src=previewFile  />
                                    <button @click='removePreviewImage(key)' class="close close-button">
                                        <span>&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <input type="file" style="display:none" multiple accept="image/*" @change="onFileChange" ref="fileInput"/>
                            <button @click.prevent="$refs.fileInput.click()">Choose Image</button>
                        </div>
                        <div class="form-group mb-3">
                            <div>Status</div>
                            <select  v-model="status"  id="status" class="form-control">
                                <option   :value="1">Publish</option>
                                <option   :value="0">Unpublish</option>
                            </select>
                        </div>
                    </div>
                </template>

                <template v-slot:footer>
                    <button type="submit" class="btn-primary">
                        <span v-show="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
    name:"ProductPage",
    components: {
        AdminLayout,ModalForm
    },
    data () {
        return {
            isActive: false,
            createMode: false,
            editMode:false,
            isLoading:false,
            name:'',
            category_id:null,
            unit_price:'',
            no_of_available_products:'',
            description:'',
            status:1,
            products:[],
            categories:[],
            productId : null,
            errors:[],
            unauthorized: false,
            form:[],
            images: [],
            previewFiles: [],
            uploadedImages:[],
        }
    },
    created() {
            const token = (localStorage.getItem('access-token'));
            axios.get('http://127.0.0.1:80/api/products',{
                    headers: {
                        authorization: "Bearer " + token,
                    }
                })
                .then(response => {
                    this.products = response.data.results;
                    console.log(this.products );

                });
            axios.get('http://127.0.0.1:80/api/products',{
                    headers: {
                        authorization: "Bearer " + token
                    }
                })
                .then( response => {
                    this.products = response.data.results;
                    this.product_id = this.products[0].id;

                });
        },
    methods: {
        changeIsActiveValue(IsActiveValue) {
            this.isActive=IsActiveValue;
        },
        openCreateModal() {
            this.createMode = true;
        },
        openEditModal(product) {
            this.form = [];
            this.createMode = false;
            this.editMode = true;
            this.bookId = product.id;
            this.name = product.book_name;
            this.category_id = product.category_id;
            this.unit_price = product.unit_price;
            this.no_of_available_products = product.no_of_available_products;
            this.description = product.description;
            this.status = product.status;
            this.uploadedImages = product.images.map(( image ) => image);
        },
        close() {
            this.createMode = false;
            this.editMode = false;
            this.form = false;
            this.category_id = null;
            this.uploadedImages= [];
        },
        onFileChange(event) {
            const selectedFiles = event.target.files;
             for (let i = 0; i < selectedFiles.length; i++) {
                this.images.push(selectedFiles[i]);
                let reader = new FileReader();
                reader.onload = () => {
                    this.previewFiles[i] = reader.result;//make base 64 encoded
                };
                reader.readAsDataURL(selectedFiles[i]);
            }
        },
        removePreviewImage(key){
              this.images.splice(key,1);
              this.previewFiles.splice(key,1);
        },
        removeUploadedImage(uploadedImage,key){
             const token = (localStorage.getItem('access-token'));
             axios.delete('/api/books/images/'+uploadedImage.id,{
                    headers: {
                        authorization: "Bearer " + token
                    }
            }).then(() =>{
                this.uploadedImages.splice(key,1);
            }).catch(() =>{

            });

        },
        addProduct() {
            this.isLoading = true;
            const token = (localStorage.getItem('access-token'));
            let formData = new FormData();
            formData.append('book_name',this.book_name);
            formData.append('isbn',this.isbn);
            formData.append('author_name',this.author_name);
            formData.append('publisher',this.publisher);
            formData.append('edition',this.edition);
            formData.append('rack_no',this.rack_no);
            formData.append('no_of_copies',this.no_of_copies);
            formData.append('category_id',this.category_id);
            formData.append('status',this.status);
            for( var i = 0; i < this.images.length; i++ ){
                formData.append('images[' + i + ']', this.images[i]);
            }
            console.log(formData);
            axios.post('http://127.0.0.1:80/api/books', formData,{
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
            }
            }).then((response) =>{
                this.books.push(response.data.results);
                this.$swal(
                            'Created!',
                            'Books has been created.',
                            'success'
                            )
                this.createMode=false;
                this.errors=[];
                this.form=[];
                this.previewFiles=[];
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
            }).finally(() => {
                      this.isLoading = false;
                    });
        },
        editProduct(){
           
            this.isLoading = true;
            let formData = new FormData();
            formData.append('book_name',this.book_name);
            formData.append('isbn',this.isbn);
            formData.append('author_name',this.author_name);
            formData.append('publisher',this.publisher);
            formData.append('edition',this.edition);
            formData.append('rack_no',this.rack_no);
            formData.append('no_of_copies',this.no_of_copies);
            formData.append('category_id',this.category_id);
            formData.append('status',this.status);
            for( var i = 0; i < this.images.length; i++ ){
                formData.append('images[' + i + ']', this.images[i]);
            }
            formData.append("_method", "PUT");
           
            const token = (localStorage.getItem('access-token'));
            axios.post('http://127.0.0.1:80/api/products/'+this.productId, formData,{
                headers: {
                    authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data"
                }
            }).then(( response ) =>{
                this.books.find(( item,index ) => {
                    if( item.id == response.data.results.id ){
                        this.books.splice(index,1,response.data.results);
                    }
                })
                this.$swal(
                        'Updated!',
                        'Book information has been updated.',
                        'success'
                        )
                this.editMode=false;
                this.images=[];
                this.previewFiles=[];
                this.uploadedImages = [];
                this.errors=[];
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
            }).finally(() => {
                    this.isLoading = false;
                });
        },

        deleteProduct(product){

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
                    axios.delete('http://127.0.0.1:80/api/products/'+product.id,{
                    headers: {
                        authorization: "Bearer " + token
                    }
                    }).then((response) =>{
                        this.$swal(
                            'Deleted!',
                            'Boo has been deleted.',
                            'success'
                            )
                        this.books.find(( item,index ) => {
                            if(item.id == response.data.results.id){
                                this.books.splice(index,1);
                            }
                        })
                        this.errors = [];
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

<style scoped>







a[data-toggle="collapse"] {
    position: relative;
}
/*
a[aria-expanded="false"]::before, a[aria-expanded="true"]::before {
    content: '\e259';
    display: block;
    position: absolute;
    right: 20px;
    font-family: 'Glyphicons Halflings';
    font-size: 0.6em;
}
a[aria-expanded="true"]::before {
    content: '\e260';
} */


ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;

}
.left-padding{
    padding-left:3rem;
}
.right-padding{
    padding-right:.5rem;
}
.image-preview-container{
      display: flex;
      justify-content: flex-start;
      border: 1px solid black;
      border-radius: 2px;
}
.image-preview-wrapper{
       position: relative;
}
.preview{
        cursor: pointer;
        width: 100px;
        height: 100px;
        background-position: center center;
        background-size: cover;
        margin:5px;
    }

.close-button{
  position: absolute;
  z-index: 1;
  right: 8px;
  top:5px;
  background: yellowgreen;
  color:rgb(255, 0, 0);
  border:none;
}



/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */
#content {
    padding: 20px;
    min-height: 100vh;
    transition: all 0.3s;
    width:100%;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */
@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
    }
    #sidebar.active {
        margin-left: 0;
    }
    #sidebarCollapse span {
        display: none;
    }
}

.card-header{
    background-color: #007bff;
    height:50px;

}
button.btn-primary{
    color: white;
    background: blue;
    border: 1px solid blue;
    border-radius: 4px;
    margin: 20px 5px;
    padding: 5px 10px;
}
button.btn-danger{
    color: white;
    background: red;
    border: 1px solid red;
    border-radius: 4px;
    margin: 20px 5px;
    padding: 5px 10px;
}




</style>
