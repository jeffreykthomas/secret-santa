<template>
  <q-page class="modern-index-page">
    <q-scroll-area
      ref="scrollAreaRef"
      class="full-height"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
    >
      <div class="page-container">
        <secret-santa />
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QScrollArea } from 'quasar';
import SecretSanta from 'components/SecretSanta.vue';

defineOptions({
  name: 'IndexPage',
});

const scrollAreaRef = ref<QScrollArea | null>(null);

const thumbStyle = {
  right: '4px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '8px',
  opacity: '0.75',
};

const barStyle = {
  right: '2px',
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '12px',
  opacity: '0.2',
};

onMounted(() => {
  // Scroll to top when page loads
  if (scrollAreaRef.value) {
    scrollAreaRef.value.setScrollPosition('vertical', 0, 300);
  }
});
</script>

<style scoped>
.modern-index-page {
  padding: 0;
  position: relative;
  height: 100%;
}

.full-height {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
