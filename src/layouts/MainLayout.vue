<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="modern-header">
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-medium text-center">
          🎅 {{ activeConfig.appTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="modern-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { activeConfig } from 'src/boot/config';

defineOptions({
  name: 'MainLayout',
});
</script>

<style scoped>
.modern-header {
  background: linear-gradient(135deg, #2b6cb0 0%, #1e4db3 100%);
  box-shadow: 0 2px 12px rgba(43, 108, 176, 0.3);
}

.modern-bg {
  background: transparent;
  min-height: 100vh;
}
</style>
