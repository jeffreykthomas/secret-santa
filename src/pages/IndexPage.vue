<template>
  <q-page class="index-page">
    <div class="page-container">
      <secret-santa />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SecretSanta from 'components/SecretSanta.vue';

defineOptions({
  name: 'IndexPage',
});
</script>

<style scoped>
.page-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}
</style>
