<template>
  <div>
    <h2>Redirecting...</h2>
  </div>
</template>
  
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  
  const student = ref({} as any)

  onMounted(async () => {
    console.log("Entered")
    let user = await (await fetch("/api/user")).json()
    student.value = await (await fetch(`/api/user/${user.email}`)).json()
    window.location.href = `http://127.0.0.1:8096/student/${student.value.studentId}`
  })
</script>