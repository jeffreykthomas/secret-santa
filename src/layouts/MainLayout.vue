<template>
  <q-layout view="hHh lpr fff">
    <q-header class="festive-header">
      <div class="snow snow-near" aria-hidden="true"></div>
      <div class="snow snow-far" aria-hidden="true"></div>
      <div class="header-content">
        <div class="header-title">🎅 {{ activeConfig.appTitle }}</div>
        <div class="header-countdown">{{ countdownText }}</div>
      </div>
    </q-header>

    <q-page-container class="modern-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { activeConfig } from 'src/boot/config';
import { watchEffect } from 'vue';

defineOptions({
  name: 'MainLayout',
});

const daysUntilChristmas = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const christmas = new Date(now.getFullYear(), 11, 25);
  return Math.round((christmas.getTime() - today.getTime()) / 86400000);
};

const days = daysUntilChristmas();
const countdownText =
  days > 1
    ? `🎄 ${days} days until Christmas`
    : days === 1
    ? '🎄 Christmas is tomorrow!'
    : days === 0
    ? '🎄 Merry Christmas!'
    : '🎄 Happy holidays!';

// Dynamically update document title based on active config
watchEffect(() => {
  document.title = activeConfig.value.appTitle;
});
</script>

<style scoped>
.festive-header {
  background: linear-gradient(160deg, #0b1f4b 0%, #173a8a 55%, #2156c9 100%);
  box-shadow: 0 2px 16px rgba(11, 31, 75, 0.35);
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 1;
  padding: 0.9rem 1rem 0.85rem;
  text-align: center;
}

.header-title {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
}

.header-countdown {
  display: inline-block;
  margin-top: 0.4rem;
  padding: 0.15rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 0.8rem;
  font-weight: 500;
  color: #e6eeff;
}

/* Snowfall: two tiled layers of dots drifting at different speeds */
.snow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.snow-near {
  background-image: radial-gradient(
      2px 2px at 20px 30px,
      rgba(255, 255, 255, 0.9) 50%,
      transparent 51%
    ),
    radial-gradient(
      2.5px 2.5px at 90px 110px,
      rgba(255, 255, 255, 0.8) 50%,
      transparent 51%
    ),
    radial-gradient(
      2px 2px at 150px 60px,
      rgba(255, 255, 255, 0.85) 50%,
      transparent 51%
    );
  background-size: 180px 160px;
  animation: snowfall 9s linear infinite;
}

.snow-far {
  background-image: radial-gradient(
      1.5px 1.5px at 40px 80px,
      rgba(255, 255, 255, 0.55) 50%,
      transparent 51%
    ),
    radial-gradient(
      1px 1px at 110px 20px,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 51%
    ),
    radial-gradient(
      1.5px 1.5px at 70px 130px,
      rgba(255, 255, 255, 0.45) 50%,
      transparent 51%
    );
  background-size: 140px 150px;
  animation: snowfall-far 16s linear infinite;
}

@keyframes snowfall {
  to {
    background-position: 30px 160px;
  }
}

@keyframes snowfall-far {
  to {
    background-position: -20px 150px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .snow {
    animation: none;
  }
}

.modern-bg {
  background: transparent;
  min-height: 100vh;
}
</style>
