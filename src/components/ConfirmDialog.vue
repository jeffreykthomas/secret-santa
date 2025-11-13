<template>
  <q-dialog ref="dialogRef">
    <q-card class="modern-confirm-dialog">
      <q-card-section class="dialog-header">
        <div class="dialog-icon">
          <q-icon name="help_outline" size="48px" />
        </div>
        <h3 class="dialog-title">Confirm Your Identity</h3>
      </q-card-section>
      <q-card-section class="dialog-body">
        <p class="dialog-message">
          Are you sure your name is
          <strong class="dialog-name">{{ yourName }}</strong
          >?
        </p>
        <div class="dialog-hint">
          Once confirmed, your Secret Santa assignment will be revealed!
        </div>
      </q-card-section>
      <q-card-actions align="right" class="dialog-actions">
        <q-btn
          flat
          label="Whoops, no"
          color="grey-7"
          @click="onDialogCancel()"
          class="cancel-btn"
        />
        <q-btn
          unelevated
          label="Yes, that's me!"
          color="primary"
          icon-right="check_circle"
          @click="onDialogOK(true)"
          class="confirm-btn"
        />
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
.modern-confirm-dialog {
  min-width: 400px;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #2b6cb0 0%, #1e4db3 100%);
  color: white;
  text-align: center;
  padding: 2rem 1.5rem 1.5rem;
}

.dialog-icon {
  margin-bottom: 1rem;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.dialog-body {
  padding: 2rem 1.5rem;
  text-align: center;
}

.dialog-message {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.dialog-name {
  color: #1e40af;
  font-size: 1.25rem;
  font-weight: 700;
}

.dialog-hint {
  font-size: 0.9rem;
  color: #1e40af;
  background: #dbeafe;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #2563eb;
}

.dialog-actions {
  padding: 1rem 1.5rem 1.5rem;
  gap: 0.5rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.5rem 1.5rem;
  font-weight: 500;
}

@media (max-width: 500px) {
  .modern-confirm-dialog {
    min-width: unset;
    width: 90vw;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .dialog-message {
    font-size: 1rem;
  }

  .dialog-name {
    font-size: 1.1rem;
  }
}
</style>
