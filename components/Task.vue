<script setup>

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
});

let hoursRealistic = 2.25
let priceRealistic = 1125.00
let hoursPessimistic = 2.50
let pricePessimistic = 1250.00

</script>

<template>
    <div class="task__row">

      <div class="task__col">
        <Input />
      </div>

      <div class="task__col">
        <Input 
          type="select" 
          :options="[
            {id: 1, name: 'Lav'},
            {id: 2, name: 'Middel'},
            {id: 3, name: 'Høj'}
          ]" 
        />
      </div>

      <div class="task__col">
        <Input 
          type="select" 
          :options="[
            {id: 1, name: 'Vælg rolle'},
            {id: 2, name: 'Frontend developer'},
            {id: 3, name: 'Backend developer'},
            {id: 4, name: 'Projektleder'},
            {id: 5, name: 'Partner'}
          ]" 
        />
      </div>

      <div class="task__col task--number">
        <Input 
          type="number"
        />
      </div>

      <div class="task__col task--number task--realistic">
        {{ hoursRealistic }}
      </div>

      <div class="task__col task--number task--realistic">
        {{ priceRealistic }}
      </div>

      <div class="task__col task--number task--pessimistic">
        {{ hoursPessimistic }}
      </div>

      <div class="task__col task--number task--pessimistic">
        {{ pricePessimistic }}
      </div>

      <div class="task__col task--checkbox">
        <Input 
          type="checkbox"
        />
      </div>

    </div>
</template>

<style lang="scss" scoped>
.task {

  &__row {
    width: 100%;
    display: grid;
    grid-template-columns: auto 100px 200px 70px 70px 100px 70px 100px 75px;
    gap: 3px;
  }

  &__col {
    background-color: white;
    color: black;
    padding: 5px;
  }

  &--number {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  &--checkbox {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--realistic {
    background-color: green;
    color: white;
    padding: 10px;
  }

  &--pessimistic {
    background-color: blue;
    color: white;
    padding: 10px;
  }

}
</style>