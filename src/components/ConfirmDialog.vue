<template>
  <q-dialog ref="dialogRef">
    <q-card class="border-black-sm">
      <q-card-section>
        <div class="q-pa-md text-center">
          <h6 class="heading text-dark q-my-none">
            Are you sure your name is
            <b class="font-weight-bold text-negative">{{ yourName }}</b
            >?
          </h6>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="negative" @click="onDialogCancel()" label="Whoops" />
        <q-btn outline @click="onDialogOK(true)" label="Pretty sure" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

defineProps<{
  yourName: string;
}>();
</script>
<style scoped>
.border-black-sm {
  border: 1px solid #000;
}
</style>
