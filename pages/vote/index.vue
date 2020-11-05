<!-- eslint-disable vue/no-use-v-if-with-v-for -->
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
          <th class="tw-w-40 tw-p-2" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="vote in available_votes"
          :key="vote._id"
          :class="voteClasses(vote.voted)"
        >
          <td class="tw-p-2" @click="redirect(vote)">
            {{ vote.name }}
          </td>
          <td class="tw-text-right tw-p-2">
            {{ vote.candidates.length }}
          </td>
          <td class="tw-text-right tw-p-2">
            {{ new Date(vote.to).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </td>
          <td>
            <router-link
              v-if="!vote.voted && canBeChanged(vote.from)"
              :to="{ name: 'vote-vote-candidates___cs', params: { vote: vote._id } }"
            >
              Editovat
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  middleware: ['isAuth'],
  async asyncData ({ $axios }) {
    try {
      const votes = await $axios.$get('/api/vote/index')
      const votedIn = await $axios.$get('/api/voter')

      return { votes, voted_in: votedIn.voted_in }
    } catch (error) {
      console.error(error)
    }
  },
  data () {
    return {
      votes: [],
      voted_in: []
    }
  },
  computed: {
    available_votes () {
      return this.votes.map((item) => {
        if (this.voted_in.includes(item._id)) {
          item.voted = true
        }
        return item
      })
    }
  },
  methods: {
    redirect (vote) {
      if (!vote.voted) {
        this.$router.push(
          { name: 'vote-vote___cs', params: { vote: vote._id } }
        )
      }
    },
    voteClasses (voted) {
      return voted ? 'tw-bg-green-300' : ''
    },
    canBeChanged (date) {
      const startDate = new Date(date)
      const today = new Date()

      return startDate > today
    }
  }
}
</script>
