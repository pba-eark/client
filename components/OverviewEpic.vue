<script setup>
import { useEpicStatusStore } from "~/store/epicStatus";
import { useEpicStore } from "~/store/epics";
import { useUserStore } from "~/store/users";
import { useGlobalStore } from "~/store";
import { useDetailsStore } from "~/store/details";

const epicStatusStore = useEpicStatusStore();
const epicStore = useEpicStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const detailsStore = useDetailsStore();

const isOpen = ref(false);
const props = defineProps({
  id: Number,
  name: String,
  comment: String,
  totalRealisticHours: Number,
  totalRealisticPrice: Number,
  totalPessimisticHours: Number,
  totalPessimisticPrice: Number,
  optOuts: Number,
  status: Object,
  roles: Array,
  userId: Number,
  user: Object,
});

const numberDotSeperator = (x) => {
  if (!x) return "0";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

props.roles.forEach((role) => {
  role.optOuts = 0;
  let totalRealisticHours = 0;
  let totalRealisticPrice = 0;
  let totalPessimisticHours = 0;
  let totalPessimisticPrice = 0;
  role.tasks.forEach((task) => {
    if (task.optOut) return role.optOuts++;
    totalRealisticHours += task.realisticHours;
    totalRealisticPrice += task.realisticPrice;
    totalPessimisticHours += task.pessimisticHours;
    totalPessimisticPrice += task.pessimisticPrice;
  });
  role.totalRealisticHours = totalRealisticHours;
  role.totalRealisticPrice = totalRealisticPrice;
  role.totalPessimisticHours = totalPessimisticHours;
  role.totalPessimisticPrice = totalPessimisticPrice;
});

const handleUpdateEpicStatus = async (val) => {
  const { id } = val;
  const epicToUpdate = epicStore.EPICS.filter((epic) => {
    return epic.id === props.id;
  })[0];

  epicToUpdate.epicStatusId = id;
  return await epicStore.updateEpic(epicToUpdate);
};

const handleUpdateEpicUserId = async (val) => {
  const { id } = val;
  const epicToUpdate = {
    ...epicStore.EPICS.filter((epic) => {
      return epic.id === props.id;
    })[0],
  };

  epicToUpdate.userId = id;
  return await epicStore.updateEpic(epicToUpdate);
};

const epicStatusOptions = computed(() => {
  return epicStatusStore.EPIC_STATUS.map((status) => {
    return { id: status.id, name: status.epicStatusName };
  });
});

const userOptions = computed(() => {
  return userStore.USERS.map((user) => {
    return { id: user.id, name: `${user.firstName} ${user.lastName}` };
  });
});
</script>

<template>
  <div
    v-bind="$attrs"
    @click="
      detailsStore.setDetails({
        id,
        epicName: name,
        comment,
        userId,
        estimateSheetId: parseInt($route.params.id),
        epicStatusId: status.id,
      })
    "
  >
    <div class="row" :class="{ row__open: isOpen }">
      <div>
        <Icon
          @click="isOpen = !isOpen"
          icon="icon-chevron"
          class="row__icon"
          :class="{ row__icon__open: isOpen }"
        />
      </div>
      <div>
        <span @click="globalStore.scrollToEpic($route.params.id, id)">
          {{ name }}
        </span>
      </div>
      <div>
        {{
          numberDotSeperator(totalRealisticHours.toFixed(2).replace(".", ","))
        }}
      </div>
      <div>
        {{
          numberDotSeperator(totalRealisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>
      <div>
        {{
          numberDotSeperator(totalPessimisticHours.toFixed(2).replace(".", ","))
        }}
      </div>
      <div>
        {{
          numberDotSeperator(totalPessimisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>
      <div>{{ optOuts }}</div>
      <div>
        <Input
          class="input__select--task"
          type="select"
          :placeholder="
            status.epicStatusName ? status.epicStatusName : 'Vælg status'
          "
          :options="epicStatusOptions"
          emit="updateEpicStatus"
          @updateEpicStatus="handleUpdateEpicStatus"
        />
      </div>
      <div>
        <Input
          class="input__select--task"
          type="select"
          :placeholder="
            userId ? `${user.firstName} ${user.lastName}` : 'Vælg ansvarsperson'
          "
          :options="userOptions"
          emit="updateEpicUserId"
          @updateEpicUserId="handleUpdateEpicUserId"
        />
      </div>
      <div></div>
    </div>

    <div v-for="role in roles" class="row__details" v-show="isOpen">
      <div>{{ role.roleName }}</div>
      <div>
        {{ role.id > 0 ? numberDotSeperator(role.hourlyWage) : "0" }}
        kr./t
      </div>
      <div>
        {{
          numberDotSeperator(
            role.totalRealisticHours?.toFixed(2).replace(".", ",")
          )
        }}
      </div>
      <div>
        {{
          role.id > 0
            ? numberDotSeperator(
                role.totalRealisticPrice?.toFixed(2).replace(".", ",")
              )
            : "0,00"
        }}
      </div>
      <div>
        {{
          numberDotSeperator(
            role.totalPessimisticHours?.toFixed(2).replace(".", ",")
          )
        }}
      </div>
      <div>
        {{
          role.id > 0
            ? numberDotSeperator(
                role.totalPessimisticPrice?.toFixed(2).replace(".", ",")
              )
            : "0,00"
        }}
      </div>
      <div>
        {{ role.optOuts }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  background: #fff;
  align-items: center;
  padding: 16px 8px;
  display: grid;
  grid-template-columns: var(--table-columns-overview);
  user-select: none;

  span {
    cursor: pointer;
  }

  &__icon {
    height: 15px;
    width: 15px;
    margin: 0 auto;
    display: block;
    cursor: pointer;

    &__open {
      rotate: 180deg;
    }
  }

  &__details {
    background: #444;
    color: #fff;
    width: 100%;
    display: grid;
    grid-template-columns: 60px 100px 108px 150px 150px 150px 125px 150px auto auto;

    > div:first-child {
      grid-column-start: 2;
    }
  }
}
</style>
