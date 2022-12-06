<template>
  <body class="bg">
    <div class="pg">
    <div class="content">
      <p class="title"> CS590 Office Hour Queue</p>
      <!-- server.ts to switch to keycloak -->
      <b-button href="/api/login">Sign In / Sign Up </b-button></div>
    </div>
  </body>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue'

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

</style>