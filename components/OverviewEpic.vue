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
  <div class="overview">
    <div
      class="overview__row" :class="{ row__open: isOpen }"
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
      <div class="overview__col overview__col--details">
        <Icon
          @click="isOpen = !isOpen"
          icon="icon-chevron"
          class="overview__icon"
          :class="{ 'overview__icon--open': isOpen }"
        />
      </div>

      <div class="overview__col overview__col--name">
        <span class="overview__name" @click="globalStore.scrollToEpic($route.params.id, id)">
          {{ name }}
        </span>
      </div>

      <div class="overview--realistic">
        <div class="overview__col">
          <span class="overview__hours">
            {{ numberDotSeperator(totalRealisticHours.toFixed(2).replace(".", ",")) }}
          </span>
        </div>
        <div class="overview__col">
          <span class="overview__price">
            {{ numberDotSeperator(totalRealisticPrice.toFixed(2).replace(".", ",")) }}
          </span>
        </div>
      </div>

      <div class="overview--pessimistic">
        <div class="overview__col">
          <span class="overview__hours">
            {{ numberDotSeperator(totalPessimisticHours.toFixed(2).replace(".", ",")) }}
          </span>
        </div>
        <div class="overview__col">
          <span class="overview__price">
            {{ numberDotSeperator(totalPessimisticPrice.toFixed(2).replace(".", ",")) }}
          </span>
        </div>
      </div>

      <div class="overview__col">
        <span class="overview__opt-out">
          {{ optOuts }}
        </span>
      </div>

      <div class="overview__col">
        <Input
          class="input__select--task overview__input--status"
          type="select"
          :placeholder="
            status.epicStatusName ? status.epicStatusName : 'Vælg status'
          "
          :options="epicStatusOptions"
          emit="updateEpicStatus"
          @updateEpicStatus="handleUpdateEpicStatus"
        />
      </div>

      <div class="overview__col">
        <Input
          class="input__select--task overview__input--responsible"
          type="select"
          :placeholder="
            userId ? `${user.firstName} ${user.lastName}` : 'Vælg ansvarlig'
          "
          :options="userOptions"
          emit="updateEpicUserId"
          @updateEpicUserId="handleUpdateEpicUserId"
        />
      </div>

      <div class="overview__col">
        <span class="overview__insecurity">
          0%
        </span>
      </div>

      <div class="overview__col overview__col--more">
        <Icon icon="icon-dots" class="overview__icon" />
      </div>

    </div>

    <div class="overview__details" v-show="isOpen">
      <div v-for="role in roles" class="overview__details-row">

        <div class="overview__role">
          <div class="overview__col">
            <span class="overview__role-name">
              {{ role.roleName }}
            </span>
          </div>
          <div class="overview__col">
            <span class="overview__role-price">
              {{ role.id > 0 ? numberDotSeperator(role.hourlyWage) : "0" }} kr./t
            </span>
          </div>
        </div>

        <div class="overview--realistic overview__details--realistic">
          <div class="overview__col">
            <span class="overview__hours">
              {{ numberDotSeperator(role.totalRealisticHours?.toFixed(2).replace(".", ",")) }}
            </span>
          </div>
          <div class="overview__col">
            <span class="overview__price">
              {{ role.id > 0 ? numberDotSeperator(role.totalRealisticPrice?.toFixed(2).replace(".", ",")) : "0,00" }}
            </span>
          </div>
        </div>

        <div class="overview--pessimistic overview__details--pessimistic">
          <div class="overview__col">
            <span class="overview__hours">
              {{ numberDotSeperator(role.totalPessimisticHours?.toFixed(2).replace(".", ",")) }}
            </span>
          </div>
          <div class="overview__col">
            <span class="overview__price">
              {{ role.id > 0 ? numberDotSeperator(role.totalPessimisticPrice?.toFixed(2).replace(".", ",")) : "0,00" }}
            </span>
          </div>
        </div>

        <div class="overview__col">
          <span class="overview__opt-out overview__details--opt-out">
            {{ role.optOuts }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.overview {
  &__row {
    display: grid;
    grid-template-columns: var(--table-columns-overview);
    // gap: var(--table-gap);
    color: var(--font-color-primary);
    background-color: var(--color-task);
    border-radius: 4px;
  }

  &__col {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--table-columns-padding);

    &--details {
      padding-left: calc(var(--table-columns-padding) * 7);
      padding-right: calc(var(--table-columns-padding) * 7);
    }
    &--name {
      justify-content: left;
    }
    &--more {
      padding-right: calc(var(--table-columns-padding) / 2 + var(--input-padding) / 2);
      padding-left: 0;
    }
  }
  &__name {
    margin: var(--input-padding);
    cursor: pointer;
  }
  &__icon {
    height: var(--width-icon);
    width: var(--width-icon);
    cursor: pointer;

    &--open {
      rotate: 180deg;
    }
  }
  &__hours {
    text-align: right;
    width: var(--width-hours-overview);
    margin: var(--input-padding);
  }
  &__price {
    text-align: right;
    width: var(--width-price-overview);
    margin: var(--input-padding);
  }
  &__opt-out {
    text-align: center;
    width: var(--width-opt-out);
    margin: var(--input-padding);
    font-weight: 600;
    color: var(--color-disabled);
    }
  &__insecurity {
    text-align: center;
    width: var(--width-insecurity-overview);
    margin: var(--input-padding);
  }
  &__input {
    &--status {
      width: var(--width-status-overview);
    }
    &--responsible {
      width: var(--width-responsible-overview);
    }
  }
  &--realistic,
  &--pessimistic {
    display: flex;
    color: var(--font-color-secondary);
    grid-column: span 2;
    font-weight: 600;
  }
  &--realistic {
    background-color: var(--color-realistic);
  }
  &--pessimistic {
    background-color: var(--color-pessimistic);
  }
  &__details {
    margin-left: calc(var(--width-icon) + var(--table-columns-padding) * 14);
    background-color: var(--color-tabs);
    color: var(--font-color-secondary);
    margin-bottom: 20px;
    margin-right: 438px;
    border-radius: 0 0 4px 4px;

    &-row {
      display: grid;
      grid-template-columns: 1fr repeat(5, auto);
    }

    &--realistic {
      background-color: var(--color-realistic-dark);
    }
    &--pessimistic {
      background-color: var(--color-pessimistic-dark);
    }
    &--opt-out {
      color: var(--font-color-secondary);
    }
  }
  &__role {
    display: flex;
    justify-content: space-between;

    &-name,
    &-price {
      padding: var(--input-padding);
    }
  }
}
</style>
