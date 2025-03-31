<script setup>
import {ref} from 'vue';
import {VPSocialLink} from 'vitepress/theme';

const {companies} = defineProps({companies: Array});

const expandedRow = ref(null);

// Function to handle row expansion logic
const toggleExpand = index => {
  expandedRow.value = expandedRow.value === index ? null : index;
};

const socials = ['linkedIn', 'twitter', 'instagram', 'facebook', 'tiktok', 'github'];
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>Country</th>
        <th>Social</th>
        <th>Supported Languages</th>
        <th>Funding<br />(last round)</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(company, index) in companies" :key="company.name">
        <tr>
          <td>
            <span class="expand-arrow" @click="toggleExpand(index)">
              {{ expandedRow === index ? '▼' : '▶' }}
            </span>
            <a :href="company.website" target="_blank" rel="noopener">
              {{ company.name }}
            </a>
          </td>
          <td v-if="!company.incorporation">
            {{ company.country }}
          </td>
          <td v-else>
            <a :href="company.incorporation" target="_blank" rel="noopener">
              {{ company.country }}
            </a>
          </td>
          <td>
            <template v-for="social in socials">
              <VPSocialLink
                v-if="company.social?.[social]"
                :icon="social.toLowerCase()"
                :link="company.social?.[social]" />
            </template>
          </td>
          <td>{{ company.languages.join(', ') }}</td>
          <td v-if="company.funding?.url">
            <a :href="company.funding.url" target="_blank" rel="noopener">
              {{ company.funding.total }}
            </a>
            <template v-if="company.funding.lastRound">
              <br />
              (<a :href="company.funding.lastRound.url" target="_blank" rel="noopener">
                {{ company.funding.lastRound.total }} </a
              >)
            </template>
          </td>
          <td v-else>{{ company.funding?.total }}</td>
        </tr>
        <tr v-show="expandedRow === index" class="expand-content">
          <td colspan="100%">
            <strong>Key Features:</strong> {{ company.keyFeatures }}
            <br />
            <strong>Key Customers:</strong> {{ company.customers }}
            <br />
            <strong>Full description:</strong>
            <div v-html="company.fullDescription"></div>
            <iframe
              v-if="company.video"
              credentialless
              :src="company.video"
              width="100%"
              height="315"
              frameborder="0"></iframe>
            <a v-if="company.deepDive" :href="company.deepDive"> [More info] </a>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
}

.expand-arrow {
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  margin-inline-end: 5px;
}
</style>
