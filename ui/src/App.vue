<template>
  <router-view />
</template>

<!--script setup lang="ts">
import { onMounted, ref, provide } from 'vue'

const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  let student = await (await fetch(`/api/user/${user.value.email}`)).json()
  console.log(user.value.email)
  window.location.href = `/student/${student.studentId}`
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}
</script-->