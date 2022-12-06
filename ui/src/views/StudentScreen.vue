<template>
  <body class="bg">
  <div class="pg">
    <div class="welcome">
      <p> Welcome, student </p>
    </div>
    <b-card-group deck class="bcard">
    <b-card title="Please write down:" >
      <div class="bcard-element">
        <p class="form-section">In a few words, briefly explain your question:</p>
        <b-form-textarea v-model="question" placeholder="I have a question about ..." class="mb-2" rows="5" />
      </div>
        <b-button @click="save"> Submit </b-button>
      <div>
      </div>
    </b-card>
    <b-card title="Preview">
      <div class="bcard-element">
        <p class="form-section"> Name: </p>
        <p><em> {{ student?.name }} </em></p>
      </div>
      <div class="bcard-element">
        <p class="form-section">  Question: </p>
        <p><em>{{ question }} </em></p>
      </div>
    </b-card>
    </b-card-group>

    <div class="bottom-card" v-if="position">
      <p> Hi {{ student?.name }}, your position in the queue is: {{ position }} </p>
      <b-button @click="leaveQueue" class="mb-2">Leave the Queue</b-button>
    </div>
  </div>
</body>
</template>

<script setup lang="ts">
import { BJumbotron, BButton, BTable, BIconQuestion } from 'bootstrap-vue';
import { onMounted, ref, computed, Ref, onRenderTracked } from 'vue'
import { StudentWithQuestion, CustomerWithOrders, Ingredient } from "../../../server/data"

// props
interface Props {
  // customerId: string
  studentId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // customerId: "",
  studentId: "",
})

const student: Ref<StudentWithQuestion | null> = ref(null)
const name: Ref<string | null> = ref(null)
const question: Ref<string | null> = ref(null)
const position = computed(() => student.value?.position || 0)

async function refresh() {
  if (props.studentId) {
    student.value = await (await fetch("/api/student/" + encodeURIComponent(props.studentId))).json()
    question.value = student.value?.question || 'Please enter your question'
  }
}
onMounted(refresh)

async function leaveQueue() {
  await fetch(
    "/api/staff/mark",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        email: student.value?.email
      })
    }
  )
  await refresh()
}

async function save() {
  await fetch(
    "/api/student/" + encodeURIComponent(props.studentId) + "/draft-question",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ 
       name: name.value,
       question: question.value,
       position: position.value
      })
    }
  )
  refresh()
}

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

.pg {
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

.bcard {
  margin-top: 2%;
  margin-bottom: 2%;
  opacity:0.8;
}

.bcard-element {
  padding-bottom: 3%;
}

.form-section {
  font-weight: 500;
}

.bottom-card {
  font-size: xx-large;
  /*font-style: italic;*/
  font-weight: 300;
  /*font-family: Georgia, 'Times New Roman', Times, serif;*/
  color:white;
  text-shadow:0.05em 0.05em black;
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
}

</style>