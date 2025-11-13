<template>
  <q-page class="modern-admin-page">
    <q-scroll-area
      ref="scrollAreaRef"
      class="full-height"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
    >
      <div class="page-container">
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Family Members</h1>
          <p class="page-subtitle">Manage your Secret Santa participants</p>
        </div>

        <!-- Collection Info -->
        <div class="info-card">
          <div class="info-content">
            <q-icon name="info_outline" size="20px" class="info-icon" />
            <span class="info-text"
              >Collection: <code>{{ activeConfig.collectionName }}</code></span
            >
          </div>
        </div>

        <!-- Configuration Switcher (Testing Mode) -->
        <div v-if="isTestingMode()" class="config-switcher">
          <div class="switcher-header">
            <q-icon name="science" size="20px" />
            <span class="switcher-title">Testing Mode</span>
          </div>
          <q-btn-toggle
            v-model="currentConfig"
            toggle-color="primary"
            :options="configOptions"
            @update:model-value="onConfigChange"
            class="modern-toggle"
            unelevated
            spread
            no-caps
          />
          <div class="switcher-info">
            <strong>{{ activeConfig.appTitle }}</strong> •
            {{ activeConfig.gifteesPerSanta }} giftee{{
              activeConfig.gifteesPerSanta > 1 ? 's' : ''
            }}
          </div>
        </div>

        <!-- Add Couple Section -->
        <div class="add-member-card">
          <h2 class="section-title">Add Couple / Person</h2>
          <div class="form-grid">
            <q-input
              v-model="newCouple.person1"
              label="Person 1"
              outlined
              dense
              class="modern-input"
            />
            <q-input
              v-model="newCouple.person2"
              label="Person 2 (optional)"
              outlined
              dense
              class="modern-input"
            />
          </div>
          <q-btn
            :label="newCouple.person2 ? 'Add Couple' : 'Add Person'"
            :icon="newCouple.person2 ? 'favorite' : 'person_add'"
            color="primary"
            unelevated
            @click="addCouple"
            :disable="!newCouple.person1"
            class="add-btn"
          />
        </div>

        <!-- Members List -->
        <div ref="membersSectionRef" class="members-section">
          <div class="section-header">
            <h2 class="section-title">Members ({{ familyMembers.length }})</h2>
          </div>

          <div v-if="familyMembers.length === 0" class="empty-state">
            <q-icon name="people_outline" size="48px" color="grey-5" />
            <p>No family members yet</p>
            <span class="empty-hint">Add your first member above</span>
          </div>

          <div v-else class="members-grid">
            <div
              v-for="(member, index) in familyMembers"
              :key="member.value"
              class="member-card"
            >
              <div class="member-avatar">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.name }}</div>
                <div v-if="member.partner" class="member-meta">
                  Partner: {{ member.partner }}
                </div>
                <div v-if="member.santaFor" class="member-meta">
                  <span v-if="Array.isArray(member.santaFor)">
                    Santa for: {{ member.santaFor.join(', ') }}
                  </span>
                  <span v-else> Santa for: {{ member.santaFor }} </span>
                </div>
              </div>
              <div class="member-actions">
                <q-btn
                  icon="edit"
                  flat
                  round
                  dense
                  size="sm"
                  @click="editMember(member, index)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  flat
                  round
                  dense
                  size="sm"
                  color="negative"
                  @click="deleteMember(member, index)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <q-btn
            label="Reset Assignments"
            icon="refresh"
            outline
            color="warning"
            @click="resetAssignments"
            class="action-btn"
          />
          <q-btn
            label="Back to App"
            icon="home"
            unelevated
            color="primary"
            :to="backToAppLink"
            class="action-btn"
          />
        </div>
      </div>
    </q-scroll-area>

    <!-- Edit Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card class="edit-dialog">
        <q-card-section class="dialog-header">
          <q-icon name="edit" size="32px" class="header-icon" />
          <div class="header-title">Edit Member</div>
        </q-card-section>

        <q-card-section class="dialog-body">
          <q-input
            v-model="editingMember.name"
            label="Name"
            outlined
            class="q-mb-md modern-input"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-select
            v-model="editingMember.partner"
            :options="partnerOptionsForEdit"
            label="Partner (optional)"
            outlined
            clearable
            class="modern-input"
          >
            <template v-slot:prepend>
              <q-icon name="favorite" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            v-close-popup
            class="action-btn"
          />
          <q-btn
            label="Save Changes"
            color="primary"
            icon-right="check"
            unelevated
            @click="saveEdit"
            :disable="!editingMember.name"
            class="action-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { db, collection, doc, getDoc, setDoc } from 'src/boot/firebase';
import { FamilyMember } from 'src/components/models';
import { useQuasar, QScrollArea } from 'quasar';
import {
  activeConfig,
  activeConfigVersion,
  switchConfig,
  configurations,
  isTestingMode,
} from 'src/boot/config';

defineOptions({
  name: 'AdminPage',
});

const $q = useQuasar();
const currentConfig = ref(activeConfigVersion.value);
const scrollAreaRef = ref<QScrollArea | null>(null);
const membersSectionRef = ref<HTMLElement | null>(null);

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

const scrollToTop = () => {
  if (scrollAreaRef.value) {
    scrollAreaRef.value.setScrollPosition('vertical', 0, 300);
  }
};

const scrollToMembers = async () => {
  await nextTick();
  if (scrollAreaRef.value && membersSectionRef.value) {
    const scrollTarget = membersSectionRef.value.offsetTop - 20;
    scrollAreaRef.value.setScrollPosition('vertical', scrollTarget, 500);
  }
};

const configOptions = computed(() => {
  return Object.keys(configurations).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: key,
  }));
});

const familyMembers = ref<FamilyMember[]>([]);
const newCouple = ref({
  person1: '',
  person2: '',
});

const showEditDialog = ref(false);
const editingMember = ref<FamilyMember>({
  name: '',
  label: '',
  value: 0,
  partner: '',
  assigned: false,
  hasSanta: false,
  santaFor: '',
  giftIdeas: [],
});
const editingIndex = ref(-1);

const partnerOptionsForEdit = computed(() => {
  return familyMembers.value
    .map((m) => m.name)
    .filter((name) => name !== editingMember.value.name);
});

const backToAppLink = computed(() => {
  if (activeConfigVersion.value === 'default') {
    return '/';
  }
  return `/?version=${activeConfigVersion.value}`;
});

const onConfigChange = (newConfig: string) => {
  switchConfig(newConfig);
  $q.notify({
    type: 'info',
    message: `Switched to ${configurations[newConfig].appTitle}`,
    position: 'top',
  });
  loadFamilyMembers();
  scrollToTop();
};

const writeSantaData = async (members: FamilyMember[]) => {
  const santaRef = doc(
    collection(db, activeConfig.value.collectionName),
    '2024'
  );

  const familyMembersMap = members.reduce((acc, member) => {
    acc[member.name] = member;
    return acc;
  }, {} as Record<string, FamilyMember>);

  await setDoc(santaRef, { familyMembers: familyMembersMap }, { merge: true });
};

const addCouple = async () => {
  const person1Name = newCouple.value.person1.trim();
  const person2Name = newCouple.value.person2.trim();

  if (!person1Name) {
    $q.notify({
      type: 'negative',
      message: 'Please enter at least Person 1',
      position: 'top',
    });
    return;
  }

  // Check if person1 already exists
  if (familyMembers.value.some((m) => m.name === person1Name)) {
    $q.notify({
      type: 'negative',
      message: `${person1Name} already exists`,
      position: 'top',
    });
    return;
  }

  // Check if person2 already exists (if provided)
  if (person2Name && familyMembers.value.some((m) => m.name === person2Name)) {
    $q.notify({
      type: 'negative',
      message: `${person2Name} already exists`,
      position: 'top',
    });
    return;
  }

  const maxValue = Math.max(...familyMembers.value.map((m) => m.value), 0);

  // Create person 1
  const member1: FamilyMember = {
    name: person1Name,
    label: person1Name,
    value: maxValue + 1,
    partner: person2Name || undefined,
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  };

  familyMembers.value.push(member1);

  // Create person 2 if provided
  if (person2Name) {
    const member2: FamilyMember = {
      name: person2Name,
      label: person2Name,
      value: maxValue + 2,
      partner: person1Name,
      assigned: false,
      hasSanta: false,
      santaFor: '',
      giftIdeas: [],
    };
    familyMembers.value.push(member2);
  }

  await writeSantaData(familyMembers.value);

  const message = person2Name
    ? `Added couple: ${person1Name} & ${person2Name}`
    : `Added ${person1Name}`;

  $q.notify({
    type: 'positive',
    message: message,
    position: 'top',
  });

  newCouple.value = { person1: '', person2: '' };

  // Scroll to members section to show the newly added member
  scrollToMembers();
};

const editMember = (member: FamilyMember, index: number) => {
  editingMember.value = { ...member };
  editingIndex.value = index;
  showEditDialog.value = true;
};

const saveEdit = async () => {
  if (!editingMember.value.name.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Please enter a name',
      position: 'top',
    });
    return;
  }

  editingMember.value.label = editingMember.value.name.trim();

  familyMembers.value[editingIndex.value] = { ...editingMember.value };
  await writeSantaData(familyMembers.value);

  $q.notify({
    type: 'positive',
    message: `Updated ${editingMember.value.name}`,
    position: 'top',
  });

  showEditDialog.value = false;

  // Scroll to members section to show the updated member
  scrollToMembers();
};

const deleteMember = async (member: FamilyMember, index: number) => {
  $q.dialog({
    title: 'Delete Member',
    message: `Are you sure you want to remove ${member.name} from the list?`,
    cancel: {
      label: 'Cancel',
      flat: true,
      color: 'grey-7',
    },
    ok: {
      label: 'Delete',
      color: 'negative',
      unelevated: true,
    },
    persistent: true,
    class: 'modern-dialog',
  }).onOk(async () => {
    familyMembers.value.splice(index, 1);
    await writeSantaData(familyMembers.value);

    $q.notify({
      type: 'positive',
      message: `Deleted ${member.name}`,
      position: 'top',
    });
  });
};

const resetAssignments = () => {
  $q.dialog({
    title: 'Reset All Assignments',
    message:
      'Are you sure you want to clear all Secret Santa assignments? This action cannot be undone.',
    cancel: {
      label: 'Cancel',
      flat: true,
      color: 'grey-7',
    },
    ok: {
      label: 'Reset All',
      color: 'warning',
      unelevated: true,
    },
    persistent: true,
    class: 'modern-dialog',
  }).onOk(async () => {
    familyMembers.value.forEach((member) => {
      member.assigned = false;
      member.hasSanta = false;
      member.santaFor = '';
    });

    await writeSantaData(familyMembers.value);

    $q.notify({
      type: 'positive',
      message: 'All assignments reset',
      position: 'top',
    });
  });
};

const loadFamilyMembers = async () => {
  $q.loading.show();

  const santaRef = doc(
    collection(db, activeConfig.value.collectionName),
    '2024'
  );
  const docSnap = await getDoc(santaRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.familyMembers) {
      familyMembers.value = Object.values(data.familyMembers) as FamilyMember[];
    } else {
      familyMembers.value = [];
    }
  } else {
    familyMembers.value = [];
  }

  $q.loading.hide();
};

onMounted(() => {
  loadFamilyMembers();
  scrollToTop();
});

watch(activeConfigVersion, () => {
  currentConfig.value = activeConfigVersion.value;
});
</script>

<style scoped>
.modern-admin-page {
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

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

.info-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
  border: 1px solid #60a5fa;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.9rem;
  color: #1e40af;
}

.info-text code {
  background: rgba(255, 255, 255, 0.5);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
}

.config-switcher {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  border: 1px solid #86efac;
}

.switcher-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #166534;
}

.switcher-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.modern-toggle {
  margin-bottom: 0.75rem;
  width: 100%;
}

.modern-toggle :deep(.q-btn) {
  background: white;
  color: #166534;
  border: 2px solid #86efac;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.modern-toggle :deep(.q-btn:hover) {
  background: #f0fdf4;
  border-color: #4ade80;
}

.modern-toggle :deep(.q-btn.q-btn--active) {
  background: linear-gradient(135deg, #2b6cb0 0%, #1e4db3 100%);
  color: white;
  border-color: #2b6cb0;
  box-shadow: 0 2px 8px rgba(43, 108, 176, 0.3);
}

.switcher-info {
  font-size: 0.85rem;
  color: #14532d;
}

.add-member-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.add-btn {
  width: 100%;
  padding: 0.5rem;
  font-weight: 500;
}

.members-section {
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem 0;
}

.empty-hint {
  font-size: 0.9rem;
  color: #d1d5db;
}

.members-grid {
  display: grid;
  gap: 1rem;
}

.member-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.member-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2b6cb0 0%, #1e4db3 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.member-meta {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.member-actions {
  display: flex;
  gap: 0.25rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 180px;
  padding: 0.5rem 1.5rem;
}

.edit-dialog {
  min-width: 450px;
  max-width: 550px;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #2b6cb0 0%, #1e4db3 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
}

.header-icon {
  opacity: 0.9;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.dialog-body {
  padding: 2rem 1.5rem 1.5rem;
}

.modern-input {
  font-size: 1rem;
}

.dialog-actions {
  padding: 1rem 1.5rem 1.5rem;
  gap: 0.5rem;
}

.dialog-actions .action-btn {
  padding: 0.5rem 1.5rem;
  font-weight: 500;
}

@media (max-width: 500px) {
  .edit-dialog {
    min-width: unset;
    width: 90vw;
  }

  .header-title {
    font-size: 1.25rem;
  }

  .header-icon {
    font-size: 28px !important;
  }
}
</style>
