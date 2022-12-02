<template>
  <body class="bg">
  <div>
    <h2>Redirecting...</h2>
  </div>
</body>
</template>
  
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  
  const student = ref({} as any)

  onMounted(async () => {
    console.log("Entered")
    let user = await (await fetch("/api/user")).json()
    student.value = await (await fetch(`/api/user/${user.email}`)).json()
    window.location.href = `http://127.0.0.1:8096/student/${student.value._id}`
  })
</script>

<style scoped>
.bg {
  background-image: url('assets/student_bg.jpeg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 1000px;
}
</style>