<template>
  <q-page class="row items-center justify-evenly">
    <secret-santa />
  </q-page>
</template>

<script setup lang="ts">
import SecretSanta from 'components/SecretSanta.vue';

defineOptions({
  name: 'IndexPage',
});
</script>
