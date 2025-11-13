<template>
  <q-page class="modern-index-page">
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
.modern-index-page {
  padding: 0;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
