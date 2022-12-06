<template>
  <body class="bg">
  <div class="pg">
    <div class="welcome">
      <p> Welcome, {{ staff?.username }} </p>
    </div>
    <div class="form-container">
      <p class="num-of-students"> Number of students in the queue: {{ queue.length }} </p>
      <b-table :items="queue" :fields="fields">
        <template #cell(question)="cellScope">
          <span v-if="cellScope.value">
            {{ cellScope.value }}
          </span>
        </template>
        <template #cell(email)="cellScope1">
          <span v-if="cellScope1.value">
          </span>
          <b-button @click="markAsSolved(cellScope1.value)">
            Mark as Solved
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
  </body>
  
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { RegisteredUsers, StudentWithQuestion } from "../../../server/data"

// props
interface Props {
  staffId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  staffId: "",
})

const staff: Ref<RegisteredUsers | null> = ref(null)
const queue: Ref<StudentWithQuestion[]> = ref([])

const name = computed(() => staff.value?.username || props.staffId)

async function refresh() {
  staff.value = await (await fetch(`/api/staff/${props.staffId}`)).json()
  let unfiltered_queue: StudentWithQuestion[] = await (await fetch("/api/queue/")).json()
  queue.value = unfiltered_queue.filter((student, index) => {
    return 'question' in student
  })
}
onMounted(refresh)

const fields = [{key: 'position', label: 'Position'}, {key: 'name', label: 'Student Name'}, {key: 'question', label: 'Question'}, {key: 'email', label: 'Email'}]

async function markAsSolved(email: string) {
  await fetch(
    "/api/staff/mark",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        email
      })
    }
  )
  await refresh()
}

</script>

<style scoped>
body {
  min-height: 100%;
}
.bg {
  background-image: url('assets/staff_bg.jpeg');
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
}

.welcome {
  background-color: white;
  opacity: 0.8;
  border-radius: 5px;
  padding-top: 3%;
  padding-bottom: 2%;
  padding-left: 2%;
  font-size: 70px;
  font-weight: 400;
}

.form-container {
  background-color: white;
  opacity: 0.8;
  border-radius: 5px;
  margin-top: 2%;
  padding-top: 3%;
  padding-bottom: 2%;
  padding-left: 3%;
  padding-right: 3%;
  min-height: 57%;
}

.num-of-students {
  text-align: center;
  font-size: 25px;
}

</style>