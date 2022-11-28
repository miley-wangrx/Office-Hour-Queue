<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, student`" />
    <b-card-group deck>
    <b-card title="Sign Up">
      <div class>
        <p>Please enter your name:</p>
        <b-form-input v-model="name" class="mb-2" /> <br>
      </div>
      <p>In a few words, briefly explain your question:</p>
      <b-form-input v-model="question" class="mb-4" /> <br>
      <div>
      <b-button @click="save">Save</b-button> &emsp; <b-button @click="submit">Submit</b-button> <br>
      Note: must save before submitting
      </div>
    </b-card>

    <b-card title="Preview">
      <div>
      <p> Name: {{ name }} </p>
      <p> Question: {{question}} </p>
      </div>
    </b-card>

  </b-card-group>

    <!--b-form-checkbox-group v-model="draftOrderIngredients" :options="possibleIngredients" /-->
    <!--p><b-button @click="draftOrderIngredientIds.push(possibleIngredient._id)" 
      v-for="possibleIngredient in possibleIngredients"> 
        Add {{ possibleIngredient.name }}
    </b-button></p-->
    <!-- Display what has been added -->
    <div>
      <h3> Hi {{name}}, your position in the queue is: {{position}} </h3>
      <b-button @click="leaveQueue" class="mb-2">Leave the Queue</b-button>
      <!--div v-for="draftOrderIngredientId, i in draftOrderIngredientIds">
      {{ possibleIngredients.find(ingredient => ingredient._id == draftOrderIngredientId)?.name }}
      <b-button @click="draftOrderIngredientIds.splice(i, 1)"> Delete </b-button>
      </div-->
    </div>
    <div>
      <p> Total Cost: </p>
      {{ draftOrderIngredientIds.reduce(
        (acc, curr) => acc + (possibleIngredients.find(c => c._id == curr)?.price || 0 ), 0
      )
      }}
    </div>
    
    <div class="mt-2">
      
    </div>
  </div>
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
const question = computed(() => student.value?.question || props.studentId)
const position = computed(() => student.value?.question || 0)

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
  student.value = await (await fetch("/api/possible-ingredients")).json()

  if (props.studentId) {
    student.value = await (await fetch("/api/student/" + encodeURIComponent(props.studentId))).json()
    draftOrderIngredientIds.value = (await (await fetch("/api/student/" + encodeURIComponent(props.studentId) + "/draft-order")).json())?.ingredientIds || []
  }
}
onMounted(refresh)

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

</script>