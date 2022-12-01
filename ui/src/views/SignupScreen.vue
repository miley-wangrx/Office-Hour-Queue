<template>
  <body class="bg">
    <div class="pg">
    <div class="content">
      <p class="title"> CS590 Office Hour Queue</p>
      <div class="input-cell"><b-form-input placeholder="Enter your username" class="mb-2"/></div>
      <div class="input-cell"><b-form-input :type="'password'" placeholder="Enter your password" class="mb-2"/></div>
      <div class="input-cell"><b-button href="/api/login">Register</b-button> &emsp; <b-button href="/api/login">Log In</b-button></div>
    </div>
    </div>
  </body>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue'
  
function login(){

}

function register(){

}
</script>

<style scoped>
body {
  min-height: 100%;
}
.bg {
  background-image: url('assets/signup_bg.jpeg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 1000px;
}

.pg {
  height: 100%;
  width: 100%;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 2%;
  padding-right: 2%;
  text-align: center;
}

.content {
  background-color: white;
  opacity: 0.8;
  margin: auto;
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: 5%;
  margin-right: 5%;
  padding:auto;
  padding-top: 5%;
  padding-bottom: 5%;
  border-radius: 5px;
  text-align: center;
}

.title {
  font-size: 60px;
  color: black
}

.input-cell {
  text-align: center;
  padding-top: 1%;
  padding-bottom: 1%;
  padding-left: 1%;
  padding-right: 1%;
  width:300px;
  min-width: 200px;
  font-size: 30px;
  font-weight: 400;
}
</style>