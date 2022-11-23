<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, ${name}`" />

    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" :fields="fields"/>
    
    <h2>Draft Order</h2>
    <p>Select the ingredients you want:</p>
    <!--b-form-checkbox-group v-model="draftOrderIngredients" :options="possibleIngredients" /-->
    <p><b-button @click="draftOrderIngredientIds.push(possibleIngredient._id)" 
      v-for="possibleIngredient in possibleIngredients"> 
        Add {{ possibleIngredient.name }}
    </b-button></p>
    <!-- Display what has been added -->
    <div>
      <p> Ingredients added: </p>
      <div v-for="draftOrderIngredientId, i in draftOrderIngredientIds">
      {{ possibleIngredients.find(ingredient => ingredient._id == draftOrderIngredientId)?.name }}
      <b-button @click="draftOrderIngredientIds.splice(i, 1)"> Delete </b-button><!--https://stackoverflow.com/a/11848579-->
      </div>
    </div>
    <div>
      <p> Total Cost: </p>
      {{ draftOrderIngredientIds.reduce(
        (acc, curr) => acc + (possibleIngredients.find(c => c._id == curr)?.price || 0 ), 0
      )
      }}
    </div>
    <b-button @click="save">Save</b-button>
    <div class="mt-2">
      <b-button @click="submit">Submit</b-button>
      Note: must save before submitting
    </div>
  </div>
</template>

<script setup lang="ts">
import { BJumbotron, BButton, BTable } from 'bootstrap-vue';
import { onMounted, ref, computed, Ref, onRenderTracked } from 'vue'
import { CustomerWithOrders, Ingredient } from "../../../server/data"

// props
interface Props {
  customerId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  customerId: "",
})

const customer: Ref<CustomerWithOrders | null> = ref(null)

const name = computed(() => customer.value?.name || props.customerId)
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
//const draftOrderIngredientsID: number

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()

  if (props.customerId) {
    customer.value = await (await fetch("/api/customer/" + encodeURIComponent(props.customerId))).json()
    draftOrderIngredientIds.value = (await (await fetch("/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order")).json())?.ingredientIds || []
  }
}
onMounted(refresh)

async function save() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ingredientIds: draftOrderIngredientIds.value })
    }
  )
}

async function submit() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/submit-draft-order",
    { method: "POST" }
  )
  await refresh()
}
</script>