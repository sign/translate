<script setup>
import { data as companies } from './companies.data';
import CompaniesTable from './CompaniesTable.vue';

const sectors = new Set(companies.map((company) => company.sector));
</script>

# Sign Language Companies

Here, we list companies that are working on sign language technologies.
The list is not exhaustive, and we cannot guarantee the accuracy of the information.
We encourage public contributions to improve the data quality.

<template v-for="sector in sectors">
  <h2>{{ sector }}</h2>
  <CompaniesTable :companies="companies.filter((company) => company.sector === sector)" />
</template>
