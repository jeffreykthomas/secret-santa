<template>
  <div class="full-width">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Secret Santa</h1>
      <p class="page-subtitle">Find out who you're gifting to this year!</p>
    </div>

    <!-- Santa Image -->
    <div class="santa-image-container">
      <q-img :src="SantaImage" alt="Santa" class="santa-image" />
    </div>

    <!-- No Family Members Message -->
    <div v-if="familyMembers.length === 0 && !loading" class="content-section">
      <div class="empty-state-card">
        <q-icon name="people_outline" size="64px" color="grey-5" />
        <h3 class="empty-title">No Family Members Yet</h3>
        <p class="empty-text">
          Add family members to get started with Secret Santa
        </p>
        <q-btn
          unelevated
          color="primary"
          label="Set Up Admin"
          icon="settings"
          :to="adminLink"
          class="empty-btn"
        />
      </div>
    </div>

    <!-- Warning for multiple giftees mode -->
    <div
      v-if="gifteesPerSanta > 1 && familyMembers.length > 0 && !confirmed"
      class="content-section"
    >
      <div class="warning-card">
        <q-icon name="info" size="24px" class="warning-icon" />
        <div class="warning-content">
          <div class="warning-title">Multiple Giftees Mode</div>
          <div class="warning-text">
            Each person will be assigned {{ gifteesPerSanta }} giftees. If you
            get an error saying there aren't enough people available, reset the
            assignments and have people select in a different random order.
          </div>
        </div>
      </div>
    </div>

    <!-- Name Selection -->
    <div
      v-show="!confirmed && familyMembers.length > 0"
      class="content-section"
    >
      <div class="select-card">
        <h3 class="select-title">Who are you?</h3>
        <q-select
          :options="familyMembers"
          v-model="yourName"
          behavior="menu"
          outlined
          @update:model-value="onNameSelected"
          class="modern-select"
        />
      </div>
    </div>
    <!-- Secret Santa Reveal -->
    <div v-show="confirmed" class="content-section">
      <div class="reveal-card">
        <h4 class="reveal-title">You are the Secret Santa for:</h4>
        <div
          class="santa-name"
          v-for="(santa, index) in yourSantas"
          :key="index"
        >
          {{ santa }}
        </div>
      </div>
    </div>

    <!-- Gift Ideas Sections -->
    <div v-show="confirmed">
      <!-- Ideas for the giftees -->
      <div
        v-for="(santaObject, gifteeIndex) in yourSantaObjects"
        :key="gifteeIndex"
        class="content-section"
      >
        <div class="gift-ideas-card">
          <h3 class="section-title">
            <q-icon
              name="card_giftcard"
              size="24px"
              class="q-mr-sm"
              color="negative"
            />
            <span
              v-if="santaObject?.giftIdeas && santaObject?.giftIdeas.length > 0"
            >
              Ideas for {{ santaObject.name }}
            </span>
            <span v-else class="no-ideas-text">
              {{ santaObject?.name }} has no gift ideas yet
            </span>
          </h3>

          <div
            v-if="santaObject?.giftIdeas && santaObject?.giftIdeas.length > 0"
            class="ideas-list"
          >
            <div
              v-for="(gift, index) in santaObject?.giftIdeas"
              :key="index"
              class="idea-item"
              :class="{ 'gift-purchased': gift.purchasedBy }"
            >
              <div class="gift-content">
                <span
                  class="idea-text"
                  v-html="formatGiftIdea(gift.idea, index)"
                ></span>
                <div v-if="gift.purchasedBy" class="purchased-badge">
                  <q-icon name="shopping_bag" size="16px" />
                  <span class="purchased-text">
                    {{ gift.purchasedBy === yourName?.name ? 'Purchased by you' : 'Purchased by another Santa' }}
                  </span>
                </div>
              </div>
              <div class="gift-actions">
                <q-btn
                  v-if="!gift.purchasedBy"
                  icon="shopping_cart"
                  flat
                  round
                  dense
                  size="sm"
                  color="positive"
                  @click="markAsPurchased(santaObject, index)"
                  class="purchase-btn"
                >
                  <q-tooltip>Mark as purchased</q-tooltip>
                </q-btn>
                <q-btn
                  v-else-if="gift.purchasedBy === yourName?.name"
                  icon="undo"
                  flat
                  round
                  dense
                  size="sm"
                  color="warning"
                  @click="unmarkAsPurchased(santaObject, index)"
                  class="undo-btn"
                >
                  <q-tooltip>Unmark as purchased</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ideas for yourself -->
      <div class="content-section">
        <div class="gift-ideas-card your-ideas">
          <h3 class="section-title">
            <q-icon
              name="lightbulb"
              size="24px"
              class="q-mr-sm"
              color="negative"
            />
            Your Gift Ideas
          </h3>
          <p class="section-subtitle">Add ideas for {{ yourName?.name }}</p>

          <div
            v-if="yourName?.giftIdeas && yourName.giftIdeas.length > 0"
            class="ideas-list"
          >
            <div
              v-for="(gift, index) in yourName?.giftIdeas"
              :key="index"
              class="idea-item"
            >
              <span
                class="idea-text"
                v-html="formatGiftIdea(gift.idea, index)"
              ></span>
              <q-btn
                icon="delete"
                flat
                round
                dense
                size="sm"
                color="negative"
                @click="deleteGiftIdea(yourName, index)"
                class="delete-btn"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="add-idea-section">
            <q-input
              v-model="newGiftIdea"
              placeholder="Add a gift idea..."
              outlined
              dense
              class="idea-input"
              @keyup.enter="addGiftIdea(yourName, { idea: newGiftIdea })"
            >
              <template v-slot:append>
                <q-btn
                  icon="add_circle"
                  flat
                  round
                  dense
                  color="primary"
                  @click="addGiftIdea(yourName, { idea: newGiftIdea })"
                  :disable="!newGiftIdea.trim()"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { db, collection, setDoc, doc, getDoc } from 'src/boot/firebase';
import { FamilyMember, GiftIdea } from 'src/components/models';
import { useQuasar } from 'quasar';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import SantaImage from 'src/assets/santa.jpeg';
import { activeConfig, activeConfigVersion } from 'src/boot/config';

const $q = useQuasar();

const gifteesPerSanta = computed(() => activeConfig.value.gifteesPerSanta);
const collectionName = computed(() => activeConfig.value.collectionName);

const adminLink = computed(() => {
  if (activeConfigVersion.value === 'default') {
    return '/admin';
  }
  return `/admin?version=${activeConfigVersion.value}`;
});

// Family members will be loaded from Firestore (managed via admin UI)
const familyMembers = ref<FamilyMember[]>([]);
const yourSantas = ref<string[]>([]);
const yourSantaObjects = ref<FamilyMember[]>([]);
const yourName = ref<FamilyMember | undefined>();
const confirmed = ref(false);
const newGiftIdea = ref('');
const loading = ref(true);

const formatGiftIdea = (idea: string, index: number) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedIdea = idea.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" class="text-primary">Link</a>`;
  });
  return `${index + 1}. ${formattedIdea}`;
};
// ... existing code ...

const writeSantaData = async (familyMembers: FamilyMember[]) => {
  const santaRef = doc(collection(db, collectionName.value), '2024');

  const familyMembersMap = familyMembers.reduce((acc, member) => {
    // Clean up the member object to remove undefined values
    const cleanMember: Partial<FamilyMember> = {};
    Object.keys(member).forEach((key) => {
      const value = member[key as keyof FamilyMember];
      if (value !== undefined) {
        cleanMember[key as keyof FamilyMember] = value as never;
      }
    });
    acc[member.name] = cleanMember;
    return acc;
  }, {} as Record<string, Partial<FamilyMember>>);

  await setDoc(santaRef, { familyMembers: familyMembersMap }, { merge: true });
};

const onNameSelected = (familyMember: FamilyMember | undefined) => {
  $q.dialog({
    component: ConfirmDialog,
    componentProps: {
      yourName: familyMember?.label,
    },
  })
    .onOk(() => {
      showSecretSanta(familyMember);
    })
    .onCancel(() => {
      console.log('cancelled');
    });
};

interface SantaListEntry {
  couple: number;
  assigned: boolean;
  text: string;
  value: string;
  hasSanta: boolean;
  santaFor: string;
}

// Define a type for the past assignments
type PastAssignments = Record<string, string[]>;

const fetchPastAssignments = async (): Promise<PastAssignments> => {
  const pastAssignments: PastAssignments = {};
  const years = ['2020', '2021', '2022', '2023'];

  for (const year of years) {
    const santaRef = doc(collection(db, collectionName.value), year);
    const docSnap = await getDoc(santaRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.santaLists) {
        (data.santaLists as SantaListEntry[]).forEach((entry) => {
          if (!pastAssignments[entry.text]) {
            pastAssignments[entry.text] = [];
          }
          pastAssignments[entry.text].push(entry.santaFor);
        });
      }
    }
  }
  console.log('pastAssignments', pastAssignments);
  return pastAssignments;
};

const showSecretSanta = async (familyMember: FamilyMember | undefined) => {
  if (!familyMember) {
    return;
  }
  $q.loading.show();
  confirmed.value = true;
  yourName.value = familyMember;

  let santa = familyMembers.value.findIndex(
    (member) => member.value === familyMember.value
  );

  if (familyMembers.value[santa].assigned === true) {
    // Handle both single and multiple giftees
    const santaFor = familyMembers.value[santa].santaFor;
    yourSantas.value = Array.isArray(santaFor) ? santaFor : [santaFor];
    yourSantaObjects.value = yourSantas.value
      .map((name) => familyMembers.value.find((member) => member.name === name))
      .filter((obj): obj is FamilyMember => obj !== undefined);
    $q.loading.hide();
  } else {
    const pastAssignments = await fetchPastAssignments();

    // Count how many times each person has been assigned as a giftee
    const assignmentCounts: Record<string, number> = {};
    familyMembers.value.forEach((member) => {
      assignmentCounts[member.name] = 0;
    });

    familyMembers.value.forEach((member) => {
      if (member.assigned && member.santaFor) {
        const santaForArray = Array.isArray(member.santaFor)
          ? member.santaFor
          : [member.santaFor];
        santaForArray.forEach((name) => {
          assignmentCounts[name] = (assignmentCounts[name] || 0) + 1;
        });
      }
    });

    // Filter members who haven't been assigned the maximum number of times yet
    let newArray = familyMembers.value
      .filter(
        (member) =>
          member.name !== familyMember.name &&
          (assignmentCounts[member.name] || 0) < gifteesPerSanta.value
      )
      .slice();

    // Shuffle the array to randomize selection
    for (let i = newArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    // Prefer new pairings and avoid pairing with partners
    // MOST IMPORTANTLY: prioritize people who have been assigned fewer times as giftees
    newArray.sort((a, b) => {
      // Priority 1: People who have been assigned fewer times (for balanced distribution)
      const aAssignmentCount = assignmentCounts[a.name] || 0;
      const bAssignmentCount = assignmentCounts[b.name] || 0;

      if (aAssignmentCount !== bAssignmentCount) {
        return aAssignmentCount - bAssignmentCount;
      }

      // Priority 2: Avoid past pairings
      const aPastPairings =
        pastAssignments[familyMember.name]?.filter((name) => name === a.name)
          .length || 0;
      const bPastPairings =
        pastAssignments[familyMember.name]?.filter((name) => name === b.name)
          .length || 0;

      if (aPastPairings !== bPastPairings) {
        return aPastPairings - bPastPairings;
      }

      // Priority 3: Avoid pairing with partners
      const aIsPartner = a.name === familyMember.partner ? 1 : 0;
      const bIsPartner = b.name === familyMember.partner ? 1 : 0;

      return aIsPartner - bIsPartner;
    });

    // Validate there are enough available people
    if (newArray.length < gifteesPerSanta.value) {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: `Not enough available people to assign! Only ${newArray.length} available but need ${gifteesPerSanta.value}. Please reset assignments and try a different order.`,
        timeout: 5000,
        position: 'top',
      });
      // Reset the selection
      yourName.value = undefined;
      confirmed.value = false;
      return;
    }

    // Select the configured number of giftees
    const selectedGiftees = newArray.slice(0, gifteesPerSanta.value);
    const selectedNames = selectedGiftees.map((g) => g.name);

    yourSantas.value = selectedNames;
    yourSantaObjects.value = selectedGiftees;
    console.log('yourSantas', yourSantas.value);

    familyMembers.value[santa].assigned = true;
    familyMembers.value[santa].santaFor =
      gifteesPerSanta.value === 1 ? selectedNames[0] : selectedNames;

    // Mark all selected giftees as having a santa
    // Update hasSanta based on whether they've reached the max assignment count
    selectedGiftees.forEach((giftee) => {
      let gifteeIndex = familyMembers.value.findIndex(
        (member: FamilyMember) => member.name === giftee.name
      );
      assignmentCounts[giftee.name]++;
      familyMembers.value[gifteeIndex].hasSanta =
        assignmentCounts[giftee.name] >= gifteesPerSanta.value;
    });

    var docData = familyMembers.value;
    console.log(docData);
    await writeSantaData(docData);
    $q.loading.hide();
  }
};

const addGiftIdea = async (
  familyMember: FamilyMember | undefined,
  gift: GiftIdea
) => {
  if (!familyMember) {
    return;
  }
  let giftee = familyMembers.value.findIndex(
    (index: FamilyMember) => index.name === familyMember.name
  );
  familyMembers.value[giftee].giftIdeas.push(gift);
  var docData = familyMembers.value;
  await writeSantaData(docData);
  newGiftIdea.value = '';
};

const deleteGiftIdea = async (
  familyMember: FamilyMember | undefined,
  index: number
) => {
  if (!familyMember) {
    return;
  }
  let giftee = familyMembers.value.findIndex(
    (index: FamilyMember) => index.name === familyMember.name
  );
  familyMembers.value[giftee].giftIdeas.splice(index, 1);
  var docData = familyMembers.value;
  await writeSantaData(docData);
};

const markAsPurchased = async (
  familyMember: FamilyMember | undefined,
  index: number
) => {
  if (!familyMember || !yourName.value) {
    return;
  }
  let giftee = familyMembers.value.findIndex(
    (member: FamilyMember) => member.name === familyMember.name
  );
  familyMembers.value[giftee].giftIdeas[index].purchasedBy = yourName.value.name;
  var docData = familyMembers.value;
  await writeSantaData(docData);
  
  $q.notify({
    type: 'positive',
    message: 'Gift marked as purchased!',
    timeout: 2000,
    position: 'top',
  });
};

const unmarkAsPurchased = async (
  familyMember: FamilyMember | undefined,
  index: number
) => {
  if (!familyMember) {
    return;
  }
  let giftee = familyMembers.value.findIndex(
    (member: FamilyMember) => member.name === familyMember.name
  );
  delete familyMembers.value[giftee].giftIdeas[index].purchasedBy;
  var docData = familyMembers.value;
  await writeSantaData(docData);
  
  $q.notify({
    type: 'info',
    message: 'Purchase status removed',
    timeout: 2000,
    position: 'top',
  });
};

onMounted(async () => {
  loading.value = true;
  const santaRef = doc(collection(db, collectionName.value), '2024');
  const docSnap = await getDoc(santaRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.familyMembers) {
      familyMembers.value = Object.values(data.familyMembers) as FamilyMember[];
      console.log('data', data);
    }
  }
  loading.value = false;
});
</script>
<style scoped>
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

.santa-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.santa-image {
  max-width: 300px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-section {
  margin-bottom: 2rem;
}

.empty-state-card {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 1rem 0 0.5rem 0;
}

.empty-text {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.empty-btn {
  padding: 0.5rem 2rem;
  font-weight: 500;
}

.warning-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #fbbf24;
}

.warning-icon {
  color: #d97706;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.warning-text {
  font-size: 0.9rem;
  color: #78350f;
  line-height: 1.5;
}

.select-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.select-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.modern-select {
  font-size: 1.1rem;
}

.reveal-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #60a5fa;
}

.reveal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 1rem 0;
}

.santa-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1e40af;
  font-style: italic;
  margin: 0.5rem 0;
}

.gift-ideas-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.gift-ideas-card.your-ideas {
  border: 2px solid #2563eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.no-ideas-text {
  color: #6b7280;
  font-style: italic;
}

.ideas-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.idea-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.idea-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.idea-item.gift-purchased {
  background: #f0fdf4;
  border-color: #86efac;
}

.idea-item.gift-purchased:hover {
  background: #dcfce7;
  border-color: #4ade80;
}

.gift-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gift-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.purchased-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  border-radius: 6px;
  color: #065f46;
  font-size: 0.85rem;
  font-weight: 500;
  width: fit-content;
}

.purchased-text {
  font-size: 0.85rem;
}

.purchase-btn,
.undo-btn {
  flex-shrink: 0;
}

.idea-text {
  flex: 1;
  font-size: 1rem;
  color: #1a1a1a;
  word-break: break-word;
}

.idea-text :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.delete-btn {
  margin-left: 0.5rem;
}

.add-idea-section {
  margin-top: 1rem;
}

.idea-input {
  font-size: 1rem;
}

.pointer {
  cursor: pointer;
}

@media (max-width: 600px) {
  .page-title {
    font-size: 1.75rem;
  }

  .santa-name {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .santa-image {
    max-width: 250px;
  }
}
</style>
