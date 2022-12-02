<template>
  <body class="bg">

  <div class="pg">
    <div class="welcome">
      <p> Welcome, student </p>
    </div>
    <b-card-group deck class="bcard">
    <b-card title="Please write down:" >
      <div class="bcard-element">
        <p class="form-section">Your name:</p>
        <b-form-input v-model="name" placeholder="John Doe" class="mb-2" />
      </div>
      <div class="bcard-element">
        <p class="form-section">In a few words, briefly explain your question:</p>
        <b-form-textarea v-model="question" placeholder="I have a question about ..." class="mb-2" rows="3" />
        <em>Note: must save before submitting</em>
      </div>
        <b-button @click="save">Save</b-button> &emsp; <!--b-button @click="submit">Submit</b-button--> 
      <div>
      </div>
    </b-card>
    <b-card title="Preview">
      <div class="bcard-element">
        <p class="form-section"> Name: {{ student?.name }}</p>
        <p><em> {{ name }} </em></p>
      </div>
      <div class="bcard-element">
        <p class="form-section">  Question: {{ student?.question }}</p>
        <p><em>{{question}} </em></p>
      </div>
    </b-card>
    </b-card-group>

    <div class="bottom-card">
      <p> Hi {{name}}, your position in the queue is: {{position}} </p>
      <b-button @click="leaveQueue" class="mb-2">Leave the Queue</b-button>
    </div>
    <!--div>
      <p> Total Cost: </p>
      {{ draftOrderIngredientIds.reduce(
        (acc, curr) => acc + (possibleIngredients.find(c => c._id == curr)?.price || 0 ), 0
      )
      }}
    </div-->
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

// const customer: Ref<CustomerWithOrders | null> = ref(null)
const student: Ref<StudentWithQuestion | null> = ref(null)
const name: Ref<string | null> = ref(null)
// computed(() => student.value?.name || props.studentId)
const question: Ref<string | null> = ref(null)
const position = computed(() => student.value?.position || 0)

// const draftOrderIngredientIds: Ref<string[]> = ref([])
const possibleIngredients: Ref<Ingredient[]> = ref([])
// const fields = ["_id", "state",
//   {
//     key: 'ingredientIds',
//     label: 'Ingredients',
//     formatter: (ingredientIds: string[]) => 
//       ingredientIds.map(_id => possibleIngredients.value.find(ingredients => ingredients._id == _id)?.name).join(', ') 
//   }
// ]

async function refresh() {
  // student.value = await (await fetch("/api/possible-ingredients")).json()
  if (props.studentId) {
    student.value = await (await fetch("/api/student/" + encodeURIComponent(props.studentId))).json()
    question.value = student.value?.question || 'Please enter your question'
    // draftOrderIngredientIds.value = (await (await fetch("/api/student/" + encodeURIComponent(props.studentId) + "/draft-question")).json())?.ingredientIds || []
  }
}
onMounted(refresh)

function leaveQueue() {

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

}

// async function submit() {
//   await fetch(
//     "/api/student/" + encodeURIComponent(props.studentId) + "/submit-draft-question",
//     { method: "POST" }
//   )
//   await refresh()
// }

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
  text-shadow:0.03em 0.03em whitesmoke;
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
}

</style>