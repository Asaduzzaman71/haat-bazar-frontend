<template>
 
 <div class="wrapper">
  <!-- Navbar -->
  <NavBar />
  <!-- /.navbar -->
  <MainSidebar />
      
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <ContentHeader />
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
         <slot></slot>
      </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
  <FooterComponent />

  
</div>
<!-- ./wrapper -->
</template>
<script>
import FooterComponent from '../components/Footer.vue'
import MainSidebar from '../components/MainSidebar.vue'
import NavBar from '../components/NavBar.vue'
import ContentHeader from '../components/ContentHeader.vue'

export default {
  name: 'AdminLayout',
  components: {
    MainSidebar,NavBar,ContentHeader,FooterComponent
  }
}
</script>