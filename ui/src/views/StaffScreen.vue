<template>
  <body class="bg">
  <div class="pg">
    <div class="welcome">
      <p> Welcome, staff </p>
    </div>
    <div class="form-container">
      <p> Number of students in the queue: </p>
    </div>
  </div>
  </body>
  <!--div class="mx-3 my-3">
    <b-jumbotron bg-variant="info" text-variant="white" :header="`Current Queue`" />
    <h2>Questions</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="studentwithquestion" :fields="fields">
      <template #cell(operatorId)="cellScope">
        <span v-if="cellScope.value">
          {{ cellScope.value }}
          <b-button @click="updateOrder(cellScope.item._id, 'done')" v-if="cellScope.value === operatorId && cellScope.item.state !== 'done'">
            Done
          </b-button>
        </span>
        <b-button v-else @click="updateOrder(cellScope.item._id, 'blending')">Start Blending</b-button>
      </template>
    </b-table>
  </div-->
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { Ingredient, Operator, Order, StudentWithQuestion } from "../../../server/data"

// props
interface Props {
  // operatorId: string
  staffName: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  staffName: "",
})

const operator: Ref<Operator | null> = ref(null)
// const orders: Ref<Order[]> = ref([])
// const possibleIngredients: Ref<Ingredient[]> = ref([])
const studentwithquestion: Ref<StudentWithQuestion[]> = ref([])

const name = computed(() => operator.value?.name || props.staffName)

async function refresh() {
  // possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json
  if (props.staffName) {
    operator.value = await (await fetch("/api/staff/" + encodeURIComponent(props.staffName))).json()
  }
  studentwithquestion.value = await (await fetch("/api/student/")).json()
}
onMounted(refresh)

const fields = ["Position", "Student Name", "Question"
  // {
  //   key: 'ingredientIds',
  //   label: 'Ingredients',
  //   formatter: (ingredientIds: string[]) => 
  //     ingredientIds.map(_id => possibleIngredients.value.find(ingredients => ingredients._id == _id)?.name).join(', ') 
  // }
  ]

// async function updateOrder(orderId: string, state: string) {
//   await fetch(
//     "/api/order/" + encodeURIComponent(orderId),
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "PUT",
//       body: JSON.stringify({
//         operatorId: props.operatorId,
//         state,
//       })
//     }
//   )
//   await refresh()
// }
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
  padding-left: 2%;
  min-height: 57%;
}

</style>