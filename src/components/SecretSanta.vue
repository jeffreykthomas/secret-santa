<template>
  <div class="full-width">
    <div class="row justify-center q-pt-md">
      <div class="col-12 col-sm-6 col-md-3 q-mx-auto">
        <q-img :src="SantaImage" alt="Santa" />
      </div>
    </div>
    <div class="row" v-show="!confirmed">
      <div class="col-12 col-sm-6 col-md-3 q-mx-auto q-py-sm q-px-lg">
        <q-select
          class="mx-auto h3 text-danger"
          :options="familyMembers"
          v-model="yourName"
          behavior="menu"
          label="What's your name?"
          @update:model-value="onNameSelected"
        />
      </div>
    </div>
    <div class="row justify-center q-pt-none" v-show="confirmed">
      <div class="col-12 col-lg-6 text-center">
        <h4 class="text-weight-bold text-h5 q-mb-none">
          You are the Secret Santa for:
        </h4>
        <h3
          class="text-negative font-weight-bold text-italic q-my-none"
          v-show="confirmed"
        >
          {{ yourSanta }}
        </h3>
      </div>
    </div>

    <div v-show="confirmed">
      <!-- Ideas for the giftee -->
      <div>
        <p
          class="text-center text-negative q-mt-md text-weight-bold text-h5 q-pb-lg"
          v-if="
            yourSantaObject?.giftIdeas && yourSantaObject?.giftIdeas.length > 0
          "
        >
          Ideas for
          {{ yourSanta }}
        </p>
        <p
          v-else
          class="text-center text-dark text-italic q-mt-md text-weight-bold text-h5 q-pb-lg"
        >
          {{ yourSanta }} has no gift ideas yet.
        </p>
        <div
          class="row justify-center text-left q-px-md q-px-md-none"
          v-for="(gift, index) in yourSantaObject?.giftIdeas"
          :key="index"
        >
          <div class="col-10 col-sm-4 col-md-5 q-px-none">
            <p
              class="text-h5 text-weight-bold text-primary text-capitalize q-ml-sm q-mb-sm q-mt-none"
              v-html="formatGiftIdea(gift.idea, index)"
            ></p>
          </div>
        </div>
      </div>

      <!-- Ideas for the yourself -->
      <div>
        <p
          class="text-center text-negative q-mt-lg text-weight-bold text-h5 q-pb-lg"
        >
          Add ideas for
          {{ yourName?.name }}
        </p>
        <div
          class="row justify-center text-left q-px-md q-px-md-none"
          v-for="(gift, index) in yourName?.giftIdeas"
          :key="index"
        >
          <div class="col-10 col-sm-4 col-md-5 q-px-none">
            <p
              class="text-h5 text-weight-bold text-primary text-capitalize q-ml-sm q-mb-sm q-mt-none"
              v-html="formatGiftIdea(gift.idea, index)"
            ></p>
          </div>
          <div class="col-2 q-my-auto">
            <q-icon
              name="delete"
              class="text-negative pointer float-right q-mr-sm"
              size="xs"
              @click="deleteGiftIdea(yourName, index)"
            />
          </div>
        </div>
        <div class="row q-px-md q-px-md-none justify-center">
          <div class="col-12 col-sm-6 col-md-7 q-pb-lg">
            <q-input
              class="q-ma-none q-pt-sm"
              placeholder="Add Gift Idea"
              standout
              type="text"
              v-model="newGiftIdea"
            >
              <template v-slot:append>
                <q-icon
                  name="add_circle_outline"
                  class="text-primary pointer"
                  size="sm"
                  @click="addGiftIdea(yourName, { idea: newGiftIdea })"
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
import { onMounted, ref } from 'vue';
import { db, collection, setDoc, doc, getDoc } from 'src/boot/firebase';
import { FamilyMember, GiftIdea } from 'src/components/models';
import { useQuasar } from 'quasar';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import SantaImage from 'src/assets/santa.jpeg';

const $q = useQuasar();

const familyMembers = ref<FamilyMember[]>([
  {
    name: 'Frank',
    label: 'Frank',
    value: 1,
    partner: 'Eva',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Eva',
    label: 'Eva',
    value: 2,
    partner: 'Frank',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Cayden',
    label: 'Cayden',
    value: 3,
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Joan',
    label: 'Joan',
    value: 4,
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Chris',
    label: 'Chris',
    value: 5,
    partner: 'Jill',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Jill',
    label: 'Jill',
    value: 6,
    partner: 'Chris',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Brian',
    label: 'Brian',
    value: 7,
    partner: 'Megan',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Megan',
    label: 'Megan',
    value: 8,
    partner: 'Brian',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Jeff',
    label: 'Jeff',
    value: 9,
    partner: 'Shannon',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
  {
    name: 'Shannon',
    label: 'Shannon',
    value: 10,
    partner: 'Jeff',
    assigned: false,
    hasSanta: false,
    santaFor: '',
    giftIdeas: [],
  },
]);
const yourSanta = ref('');
const yourSantaObject = ref<FamilyMember | undefined>();
const yourName = ref<FamilyMember | undefined>();
const confirmed = ref(false);
const newGiftIdea = ref('');

const formatGiftIdea = (idea: string, index: number) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedIdea = idea.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" class="text-primary">Link</a>`;
  });
  return `${index + 1}. ${formattedIdea}`;
};
// ... existing code ...

const writeSantaData = async (familyMembers: FamilyMember[]) => {
  const santaRef = doc(collection(db, 'santas'), '2024');

  const familyMembersMap = familyMembers.reduce((acc, member) => {
    acc[member.name] = member; // Use member.name or another unique identifier
    return acc;
  }, {} as Record<string, FamilyMember>);

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
    const santaRef = doc(collection(db, 'santas'), year);
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
    yourSanta.value = familyMembers.value[santa].santaFor;
    yourSantaObject.value = familyMembers.value.find(
      (member) => member.name === yourSanta.value
    );
    $q.loading.hide();
  } else {
    const pastAssignments = await fetchPastAssignments();
    let newArray = familyMembers.value
      .filter((member) => !member.hasSanta && member.name !== familyMember.name)
      .slice();

    // Shuffle the array to randomize selection
    for (let i = newArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    // Prefer new pairings and avoid pairing with partners
    newArray.sort((a, b) => {
      const aPastPairings =
        pastAssignments[familyMember.name]?.filter((name) => name === a.name)
          .length || 0;
      const bPastPairings =
        pastAssignments[familyMember.name]?.filter((name) => name === b.name)
          .length || 0;

      // Check if the potential pairing is with the person's partner
      const aIsPartner = a.name === familyMember.partner ? 1 : 0;
      const bIsPartner = b.name === familyMember.partner ? 1 : 0;

      // Sort by past pairings first, then by partner status
      return aPastPairings - bPastPairings || aIsPartner - bIsPartner;
    });

    yourSanta.value = newArray[0].name;
    console.log('yourSanta', yourSanta.value);

    familyMembers.value[santa].assigned = true;
    familyMembers.value[santa].santaFor = newArray[0].name;

    let newGiftee = familyMembers.value.findIndex(
      (member: FamilyMember) => member.name === newArray[0].name
    );
    familyMembers.value[newGiftee].hasSanta = true;

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

onMounted(async () => {
  const santaRef = doc(collection(db, 'santas'), '2024');
  const docSnap = await getDoc(santaRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.familyMembers) {
      familyMembers.value = Object.values(data.familyMembers) as FamilyMember[];
      console.log('data', data);
    }
  }
});
</script>
<style>
h3 {
  font-weight: normal;
  padding-top: 20px;
  padding-bottom: 30px;
}
p {
  color: #969696;
  margin-bottom: 0;
  font-size: 14px;
}
.dropdown-content li > a,
.dropdown-content li > span {
  font-size: 1.2rem;
  color: #0e3d67;
  font-weight: 300;
  text-align: center;
}
.caret-style {
  font-size: 0.6em !important;
  padding-top: 5px;
  color: #ba180f !important;
}

.line-height-increase {
  line-height: 2em;
}

.capitalize-text {
  text-transform: capitalize;
}

.pointer {
  cursor: pointer;
}
</style>
