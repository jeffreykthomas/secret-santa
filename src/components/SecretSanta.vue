<template>
  <div class="full-width">
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <!-- No Family Members Message -->
    <div v-else-if="familyMembers.length === 0" class="content-section">
      <div class="card empty-state-card">
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

    <!-- Name Selection -->
    <div v-else-if="!confirmed" class="content-section">
      <div class="card select-card">
        <q-img :src="SantaImage" alt="Santa" class="santa-image" />
        <h1 class="select-title">Who are you?</h1>
        <p class="select-subtitle">
          Tap your name to find out who you're gifting to this year
        </p>
        <div class="name-grid">
          <button
            v-for="member in sortedMembers"
            :key="member.name"
            type="button"
            class="name-chip"
            @click="onNameSelected(member)"
          >
            <span class="avatar" :style="avatarStyle(member.name)">
              {{ member.name.charAt(0).toUpperCase() }}
            </span>
            <span class="name-chip-label">{{ member.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Greeting -->
      <div class="greeting">
        <div class="greeting-who">
          <span class="avatar" :style="avatarStyle(yourName?.name || '')">
            {{ yourName?.name.charAt(0).toUpperCase() }}
          </span>
          <span class="greeting-text">Hi, {{ yourName?.name }}!</span>
        </div>
        <q-btn
          flat
          dense
          no-caps
          color="grey-8"
          icon="swap_horiz"
          label="Not you?"
          @click="switchUser"
        />
      </div>

      <!-- Secret Santa Reveal -->
      <div class="content-section">
        <div v-if="drawing" class="reveal-card reveal-drawing">
          <div class="reveal-title">Drawing from the hat...</div>
          <div
            class="santa-name shuffle-name"
            v-for="(name, index) in shuffleNames"
            :key="index"
          >
            {{ name }}
          </div>
        </div>
        <button
          v-else-if="!revealed"
          type="button"
          class="reveal-card reveal-closed"
          @click="onReveal"
        >
          <span class="gift-emoji" aria-hidden="true">🎁</span>
          <span class="reveal-cta">
            {{ hasSeenDraw ? 'Tap to reveal' : 'Tap to draw' }}
          </span>
          <span class="reveal-hint">
            Make sure nobody is peeking over your shoulder
          </span>
        </button>
        <div
          v-else
          class="reveal-card reveal-open"
          :class="{ 'just-drawn': justDrawn }"
        >
          <div v-if="justDrawn" class="confetti" aria-hidden="true">
            <span
              v-for="(piece, index) in confettiPieces"
              :key="index"
              class="confetti-piece"
              :style="piece.style"
              >{{ piece.emoji }}</span
            >
          </div>
          <div class="reveal-title">You are the Secret Santa for</div>
          <div
            class="santa-name"
            v-for="(santa, index) in yourSantas"
            :key="index"
          >
            {{ santa }}
          </div>
          <q-btn
            flat
            dense
            no-caps
            color="white"
            icon="visibility_off"
            label="Hide"
            class="hide-btn"
            @click="revealed = false"
          />
        </div>
      </div>

      <!-- Ideas for the giftees (only once revealed, since they name them) -->
      <template v-if="revealed">
        <div
          v-for="(santaObject, gifteeIndex) in yourSantaObjects"
          :key="gifteeIndex"
          class="content-section"
        >
          <div class="card gift-ideas-card">
            <h3 class="section-title">
              <span class="avatar" :style="avatarStyle(santaObject.name)">
                {{ santaObject.name.charAt(0).toUpperCase() }}
              </span>
              {{ santaObject.name }}'s wish list
            </h3>

            <p v-if="!santaObject.giftIdeas?.length" class="no-ideas-text">
              {{ santaObject.name }} hasn't added any ideas yet. Check back
              later!
            </p>

            <div v-else class="ideas-list">
              <div
                v-for="(gift, index) in santaObject.giftIdeas"
                :key="index"
                class="idea-item"
                :class="{ 'gift-purchased': gift.purchasedBy }"
              >
                <span class="idea-number">{{ index + 1 }}</span>
                <div class="gift-content">
                  <span class="idea-text">
                    <template
                      v-for="(part, partIndex) in parseIdea(gift.idea)"
                      :key="partIndex"
                    >
                      <a
                        v-if="part.url"
                        :href="part.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="idea-link"
                        ><q-icon name="open_in_new" size="14px" />{{
                          part.text
                        }}</a
                      >
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </span>
                  <div v-if="gift.purchasedBy" class="purchased-badge">
                    <q-icon name="check_circle" size="16px" />
                    <span>
                      {{
                        gift.purchasedBy === yourName?.name
                          ? 'Purchased by you'
                          : 'Purchased by another Santa'
                      }}
                    </span>
                  </div>
                </div>
                <div class="gift-actions">
                  <q-btn
                    v-if="!gift.purchasedBy"
                    icon="shopping_cart"
                    label="Got it"
                    outline
                    dense
                    no-caps
                    color="positive"
                    @click="markAsPurchased(santaObject, index)"
                    class="purchase-btn"
                  >
                    <q-tooltip>Mark as purchased</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else-if="gift.purchasedBy === yourName?.name"
                    icon="undo"
                    label="Undo"
                    flat
                    dense
                    no-caps
                    color="grey-8"
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
      </template>

      <!-- Ideas for yourself -->
      <div class="content-section">
        <div class="card gift-ideas-card your-ideas">
          <h3 class="section-title">
            <q-icon name="lightbulb" size="24px" color="warning" />
            Your wish list
          </h3>
          <p class="section-subtitle">
            Help your Secret Santa out. You can paste links too.
          </p>

          <div
            v-if="yourName?.giftIdeas && yourName.giftIdeas.length > 0"
            class="ideas-list"
          >
            <div
              v-for="(gift, index) in yourName?.giftIdeas"
              :key="index"
              class="idea-item"
            >
              <span class="idea-number">{{ index + 1 }}</span>
              <span class="idea-text">
                <template
                  v-for="(part, partIndex) in parseIdea(gift.idea)"
                  :key="partIndex"
                >
                  <a
                    v-if="part.url"
                    :href="part.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="idea-link"
                    ><q-icon name="open_in_new" size="14px" />{{ part.text }}</a
                  >
                  <template v-else>{{ part.text }}</template>
                </template>
              </span>
              <q-btn
                icon="delete_outline"
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
              @keyup.enter="submitGiftIdea"
            >
              <template v-slot:append>
                <q-btn
                  icon="add_circle"
                  flat
                  round
                  dense
                  color="primary"
                  @click="submitGiftIdea"
                  :disable="!newGiftIdea.trim()"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { db, collection, setDoc, doc, getDoc } from 'src/boot/firebase';
import { FamilyMember, GiftIdea } from 'src/components/models';
import { useQuasar } from 'quasar';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import SantaImage from 'src/assets/santa.jpeg';
import { activeConfig, activeConfigVersion } from 'src/boot/config';
import { CURRENT_YEAR, fetchPastAssignments } from 'src/utils/santa-data';
import { pairingPenalty } from 'src/utils/draw';

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

const revealed = ref(false);

// The first reveal on a device plays a short "drawing from the hat" animation
const drawing = ref(false);
const justDrawn = ref(false);
const hasSeenDraw = ref(false);
const shuffleNames = ref<string[]>([]);
let shuffleTimer: ReturnType<typeof setTimeout> | undefined;

const CONFETTI_EMOJIS = ['🎉', '❄️', '⭐', '🎄', '✨', '🎁'];
const confettiPieces = Array.from({ length: 14 }, (_, index) => {
  const angle = (index / 14) * Math.PI * 2;
  const distance = 110 + (index % 3) * 35;
  return {
    emoji: CONFETTI_EMOJIS[index % CONFETTI_EMOJIS.length],
    style: {
      '--dx': `${Math.round(Math.cos(angle) * distance)}px`,
      '--dy': `${Math.round(Math.sin(angle) * distance * 0.7)}px`,
      animationDelay: `${(index % 4) * 40}ms`,
    },
  };
});

const stopDrawAnimation = () => {
  clearTimeout(shuffleTimer);
  drawing.value = false;
  justDrawn.value = false;
};
onBeforeUnmount(stopDrawAnimation);

const sortedMembers = computed(() =>
  familyMembers.value.slice().sort((a, b) => a.name.localeCompare(b.name))
);

// Remember who is using this device so they don't have to pick every visit
const rememberKey = computed(
  () => `secretSanta:${collectionName.value}:${CURRENT_YEAR}:name`
);

// A stable colour per person for their initial avatar
const avatarStyle = (name: string) => {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return { background: `hsl(${hash}, 55%, 42%)` };
};

interface IdeaPart {
  text: string;
  url?: string;
}

// Split an idea into plain text and links (links are shown as the site name)
const parseIdea = (idea: string): IdeaPart[] => {
  return idea
    .split(/(https?:\/\/[^\s]+)/g)
    .filter((part) => part !== '')
    .map((part) => {
      if (!/^https?:\/\//.test(part)) {
        return { text: part };
      }
      try {
        return {
          text: new URL(part).hostname.replace(/^www\./, ''),
          url: part,
        };
      } catch {
        return { text: part };
      }
    });
};

const writeSantaData = async (familyMembers: FamilyMember[]) => {
  const santaRef = doc(collection(db, collectionName.value), CURRENT_YEAR);

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

const seenDrawKey = (name: string) => `${rememberKey.value}:seen:${name}`;

const onReveal = () => {
  const name = yourName.value?.name;
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (!name || hasSeenDraw.value || reducedMotion) {
    justDrawn.value = false;
    revealed.value = true;
    return;
  }

  // Flick through other people's names, slowing down, then land on the result
  const pool = familyMembers.value
    .map((member) => member.name)
    .filter((other) => other !== name);
  const slots = yourSantas.value.length;
  let delay = 70;
  let last: string[] = [];

  const tick = () => {
    if (delay > 420) {
      drawing.value = false;
      justDrawn.value = true;
      revealed.value = true;
      hasSeenDraw.value = true;
      localStorage.setItem(seenDrawKey(name), '1');
      return;
    }
    const fresh = pool.filter((other) => !last.includes(other));
    last = (fresh.length >= slots ? fresh : pool)
      .sort(() => Math.random() - 0.5)
      .slice(0, slots);
    shuffleNames.value = last;
    delay *= 1.12;
    shuffleTimer = setTimeout(tick, delay);
  };

  drawing.value = true;
  tick();
};

const switchUser = () => {
  stopDrawAnimation();
  localStorage.removeItem(rememberKey.value);
  yourName.value = undefined;
  yourSantas.value = [];
  yourSantaObjects.value = [];
  confirmed.value = false;
  revealed.value = false;
  newGiftIdea.value = '';
};

const showSecretSanta = async (familyMember: FamilyMember | undefined) => {
  if (!familyMember) {
    return;
  }
  $q.loading.show();
  confirmed.value = true;
  revealed.value = false;
  stopDrawAnimation();
  hasSeenDraw.value =
    localStorage.getItem(seenDrawKey(familyMember.name)) === '1';
  yourName.value = familyMember;
  localStorage.setItem(rememberKey.value, familyMember.name);

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
    const pastAssignments = await fetchPastAssignments(collectionName.value);

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

    // Avoid pairing with partners and prefer new pairings
    // MOST IMPORTANTLY: prioritize people who have been assigned fewer times as giftees
    newArray.sort((a, b) => {
      // Priority 1: People who have been assigned fewer times (for balanced distribution)
      const aAssignmentCount = assignmentCounts[a.name] || 0;
      const bAssignmentCount = assignmentCounts[b.name] || 0;

      if (aAssignmentCount !== bAssignmentCount) {
        return aAssignmentCount - bAssignmentCount;
      }

      // Priority 2: Avoid partners, then repeats of past years
      return (
        pairingPenalty(familyMember, a, pastAssignments) -
        pairingPenalty(familyMember, b, pastAssignments)
      );
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
      switchUser();
      return;
    }

    // Select the configured number of giftees
    const selectedGiftees = newArray.slice(0, gifteesPerSanta.value);
    const selectedNames = selectedGiftees.map((g) => g.name);

    yourSantas.value = selectedNames;
    yourSantaObjects.value = selectedGiftees;

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
    await writeSantaData(docData);
    $q.loading.hide();
  }
};

const addGiftIdea = async (
  familyMember: FamilyMember | undefined,
  gift: GiftIdea
) => {
  if (!familyMember || !gift.idea.trim()) {
    return;
  }
  let giftee = familyMembers.value.findIndex(
    (index: FamilyMember) => index.name === familyMember.name
  );
  familyMembers.value[giftee].giftIdeas.push({ idea: gift.idea.trim() });
  var docData = familyMembers.value;
  await writeSantaData(docData);
  newGiftIdea.value = '';
};

const submitGiftIdea = () =>
  addGiftIdea(yourName.value, { idea: newGiftIdea.value });

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
  familyMembers.value[giftee].giftIdeas[index].purchasedBy =
    yourName.value.name;
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
  const santaRef = doc(collection(db, collectionName.value), CURRENT_YEAR);
  const docSnap = await getDoc(santaRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.familyMembers) {
      familyMembers.value = Object.values(data.familyMembers) as FamilyMember[];
    }
  }
  loading.value = false;

  // Returning visitor who has already drawn: skip the name picker
  const rememberedName = localStorage.getItem(rememberKey.value);
  const remembered = familyMembers.value.find(
    (member) => member.name === rememberedName
  );
  if (remembered?.assigned) {
    await showSecretSanta(remembered);
  } else if (rememberedName) {
    localStorage.removeItem(rememberKey.value);
  }
});
</script>
<style scoped>
.content-section {
  margin-bottom: 1.25rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06),
    0 8px 24px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e9f2;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

/* Empty state */
.empty-state-card {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 1rem 0 0.5rem 0;
  line-height: 1.3;
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

/* Name picker */
.select-card {
  text-align: center;
}

.santa-image {
  width: 132px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
}

.select-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f172a;
  margin: 1rem 0 0.25rem;
  line-height: 1.3;
}

.select-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
}

.name-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.6rem;
}

.name-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #dbe2ee;
  background: #f8fafc;
  font: inherit;
  font-size: 1rem;
  font-weight: 500;
  color: #0f172a;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, transform 0.15s,
    box-shadow 0.15s;
}

.name-chip:hover,
.name-chip:focus-visible {
  border-color: #2563eb;
  background: #eff5ff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  outline: none;
}

.name-chip:active {
  transform: scale(0.97);
}

.name-chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Greeting */
.greeting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.greeting-who {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.greeting-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

/* Reveal */
.reveal-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  text-align: center;
  color: white;
  border: none;
  font: inherit;
  background: linear-gradient(150deg, #b91c1c 0%, #dc2626 60%, #ef4444 100%);
  box-shadow: 0 8px 24px rgba(185, 28, 28, 0.3);
}

.reveal-closed {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.reveal-closed:hover,
.reveal-closed:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(185, 28, 28, 0.38);
  outline: none;
}

.gift-emoji {
  font-size: 3.5rem;
  line-height: 1;
  animation: gift-wiggle 2.4s ease-in-out infinite;
}

.reveal-cta {
  font-size: 1.35rem;
  font-weight: 700;
  margin-top: 0.75rem;
}

.reveal-hint {
  font-size: 0.85rem;
  opacity: 0.85;
  margin-top: 0.25rem;
}

.reveal-open {
  position: relative;
  animation: reveal-pop 0.45s cubic-bezier(0.2, 1.4, 0.4, 1);
}

.reveal-open.just-drawn {
  animation: reveal-land 0.7s cubic-bezier(0.2, 1.6, 0.4, 1);
}

.reveal-drawing .reveal-title {
  animation: drawing-pulse 0.9s ease-in-out infinite;
}

.shuffle-name {
  opacity: 0.75;
  filter: blur(0.6px);
}

.confetti {
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  font-size: 1.4rem;
  opacity: 0;
  animation: confetti-burst 1.3s ease-out forwards;
}

@keyframes reveal-land {
  0% {
    transform: scale(0.85);
  }
  55% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes drawing-pulse {
  50% {
    opacity: 0.55;
  }
}

@keyframes confetti-burst {
  0% {
    transform: translate(-50%, -50%) scale(0.4);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)))
      scale(1.1) rotate(40deg);
    opacity: 0;
  }
}

.reveal-title {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.santa-name {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.25;
}

.hide-btn {
  margin-top: 0.75rem;
  opacity: 0.85;
}

@keyframes gift-wiggle {
  0%,
  70%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  76% {
    transform: rotate(-9deg) scale(1.08);
  }
  82% {
    transform: rotate(9deg) scale(1.08);
  }
  88% {
    transform: rotate(-5deg) scale(1.04);
  }
  94% {
    transform: rotate(5deg) scale(1.02);
  }
}

@keyframes reveal-pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gift-emoji,
  .reveal-open {
    animation: none;
  }
}

/* Wish lists */
.gift-ideas-card.your-ideas {
  border-top: 4px solid #2563eb;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.your-ideas .section-title {
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.no-ideas-text {
  color: #6b7280;
  margin: 0;
}

.ideas-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.gift-ideas-card:not(.your-ideas) .ideas-list {
  margin-bottom: 0;
}

.idea-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e9f2;
}

.idea-item.gift-purchased {
  background: #f0fdf4;
  border-color: #86efac;
}

.idea-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gift-purchased .idea-number {
  background: #bbf7d0;
  color: #166534;
}

.gift-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.idea-text {
  flex: 1;
  min-width: 0;
  font-size: 1rem;
  color: #0f172a;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.idea-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.05rem 0.55rem;
  border-radius: 999px;
  background: #e0ebff;
  color: #1d4ed8;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  vertical-align: baseline;
}

.idea-link:hover {
  background: #c7dbff;
}

.purchased-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #166534;
  font-size: 0.85rem;
  font-weight: 500;
}

.gift-actions {
  flex-shrink: 0;
}

.purchase-btn,
.undo-btn {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.idea-input {
  font-size: 1rem;
}

@media (max-width: 600px) {
  .card {
    padding: 1.25rem;
  }

  .santa-name {
    font-size: 1.9rem;
  }

  .name-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
