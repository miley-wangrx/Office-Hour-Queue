<template>
  <body class="bg">

  <div class="pg">
    <b-jumbotron class="welcome" bg-variant="white" text-variant="black" :header="`Welcome, student`" />
    <b-card-group deck class="bcard">
    <b-card title="Sign Up" >
      <div class="bcard-element">
        <p>Please enter your name:</p>
        <b-form-input v-model="name" class="mb-2" />
      </div>
      <div class="bcard-element">
        <p>In a few words, briefly explain your question:</p>
        <b-form-textarea v-model="question" class="mb-2" rows="3" />
        Note: must save before submitting
      </div>
        <b-button @click="save">Save</b-button> &emsp; <b-button @click="submit">Submit</b-button> 
      <div>
      </div>
    </b-card>
    <b-card title="Preview">
      <div class="bcard-element">
        <p> Name: </p>
        <p> {{ name }} </p>
      </div>
      <div class="bcard-element">
        <p> Question: </p>
        <p> {{question}} </p>
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

const name = computed(() => student.value?.name || props.studentId)
const question: Ref<string | null> = ref(null)
const position = computed(() => student.value?.position || 0)

const draftOrderIngredientIds: Ref<string[]> = ref([])
const possibleIngredients: Ref<Ingredient[]> = ref([])
const fields = ["_id", "state",
  {
    key: 'ingredientIds',
    label: 'Ingredients',
    formatter: (ingredientIds: string[]) => 
      ingredientIds.map(_id => possibleIngredients.value.find(ingredients => ingredients._id == _id)?.name).join(', ') 
  }
]

async function refresh() {
  // student.value = await (await fetch("/api/possible-ingredients")).json()
  if (props.studentId) {
    student.value = await (await fetch("/api/student/" + encodeURIComponent(props.studentId))).json()
    question.value = student.value?.question || 'Please enter your question'
    draftOrderIngredientIds.value = (await (await fetch("/api/student/" + encodeURIComponent(props.studentId) + "/draft-question")).json())?.ingredientIds || []
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

async function submit() {
  await fetch(
    "/api/student/" + encodeURIComponent(props.studentId) + "/submit-draft-question",
    { method: "POST" }
  )
  await refresh()
}

// async function save() {
//   await fetch(
//     "/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order",
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "PUT",
//       body: JSON.stringify({ ingredientIds: draftOrderIngredientIds.value })
//     }
//   )
// }

// async function submit() {
//   await fetch(
//     "/api/customer/" + encodeURIComponent(props.customerId) + "/submit-draft-order",
//     { method: "POST" }
//   )
//   await refresh()
// }

</script>

<style scoped>
.bg {
  background-color: cadetblue;
  background-image: url('assets/index_cover.jpeg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
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
  opacity: 0.8;
  height: 20%;
}
.bcard {
  opacity:0.8;
}
.bcard-element {
  padding-bottom: 3%;
}
.bottom-card {
  font-size: xx-large;
  font-style: italic;
  font-weight: 300;
  /*font-family: Georgia, 'Times New Roman', Times, serif;*/
  color:beige;
  text-shadow:0.03em 0.03em whitesmoke;
  text-align: center;
  margin-top: 1%;
  margin-bottom: 1%;
}

</style>