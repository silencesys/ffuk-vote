<template>
  <div>
    <h1 class="tw-text-2xl tw-mb-2">
      {{ $t('vote.title') }}
    </h1>
    <table class="tw-w-full">
      <thead>
        <tr class="tw-bg-red-200">
          <th class="tw-p-2">
            {{ $t('vote.table:name') }}
          </th>
          <th class="tw-w-40 tw-p-2">
            {{ $t('vote.table:candidates_number') }}
          </th>
          <th class="tw-w-1/3 tw-p-2">
            {{ $t('vote.table:date_to') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vote in votes" :key="vote._id">
          <td class="tw-p-2">
            {{ vote.name }}
          </td>
          <td class="tw-text-right tw-p-2">
            {{ vote.candidates.length }}
          </td>
          <td class="tw-text-right tw-p-2">
            {{ new Date(vote.to).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  async asyncData ({ $axios, votes }) {
    const request = await $axios.$get('/vote/index')
    return { votes: request }
  },
  data () {
    return {
      votes: []
    }
  }
}
</script>
