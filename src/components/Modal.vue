<template>

  <transition name="modal-fade">
        <div class="modal"  role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
            <header class="modal-header" id="modalTitle">
            <slot name="header"> Default Header </slot>
            <button type="button" class="close-btn" @click="close" aria-label="Close Modal">x</button>
            </header>

            <main class="modal-body" id="modalDescription">
            <slot name="body"> Default body content </slot>
            </main>

            <footer class="modal-footer">
            <button type="button" class="btn-open-modal" @click="close" aria-label="Close Modal">Cancel</button>
            <slot name="footer"> Default Footer! </slot>

            </footer>
        </div>
  </transition>
</template>

<script>
export default {
  name: "ModalForm",
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  position: absolute;
  background: #FFFFFF;
  box-shadow: 2px 2px 10px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  top:10%;
  left: 30%;
  width: 60%;
  height: 60%;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid rgb(227, 231, 233);
  color: blue;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid rgb(227, 231, 233);
  flex-direction: row;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 10px 10px;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
}



.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: red;
  background: transparent;
}

.btn-open-modal {
  color: white;
  background: green;
  border: 1px solid green;
  border-radius: 4px;
  margin: 20px 5px;
  padding: 5px;
  width: 20%;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
