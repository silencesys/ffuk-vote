<template>
  <div>
    <h1 class="section-title">
      {{ vote.name }}
    </h1>
    <table class="tw-w-full tw-rounded-t-lg tw-mt-4">
      <thead>
        <tr class="tw-bg-blue-500 tw-text-white">
          <th class="tw-py-2 tw-px-4 tw-rounded-tl-lg tw-text-left">
            {{ $t('vote.table:name') }}
          </th>
          <th class="tw-py-2 tw-px-4 tw-rounded-tr-lg tw-text-right">
            {{ $t('vote.table:votes') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="candidate in candidates"
          :key="candidate._id"
          class="even:tw-bg-gray-200"
        >
          <td class="tw-py-2 tw-px-4">
            {{ candidate.name }}
          </td>
          <td class="tw-text-right tw-py-2 tw-px-4">
            {{ candidate.votes }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="tw-mt-8 tw-text-blue-300">
      <strong>{{ $t('vote.total_vote_count') }}</strong> {{ totalVotes }} <br>
      <strong>{{ $t('vote.total_vote_available') }}</strong> {{ totalVoteAvailable }}
    </p>
    <h2 class="section-title__secondary tw-mt-10">
      {{ $t('vote.title-voters') }}
    </h2>
    <ul class="tw-text-blue-300 tw-grid tw-grid-cols-3">
      <li v-for="voter in voters" :key="voter._id">
        {{ voter.name }} ({{ voter.oidos }})
      </li>
    </ul>
    <div class="tw-mt-16">
      <router-link :to="{ name: 'index___cs' }" class="button__secondary">
        {{ $t('button.back') }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoteResults',
  middleware: ['isAuth', 'isAdmin'],
  async asyncData ({ $axios, params, redirect }) {
    try {
      const request = await $axios.$get(`/api/vote/${params.vote}`)
      const voters = await $axios.$get(`/api/voter/index/${params.vote}`)

      return { vote: request.vote, voters: voters.voters }
    } catch (error) {
      if (
        error.response.status === 422 &&
        error.response.data.i18n_message === 'vote:cant_be_accessed_before_ending'
      ) {
        // Redirect user back to home if vote shouldn't be accessed.
        redirect('/')
      } else {
        // Log all other errors in console.
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  },
  data () {
    return {
      vote: {
        candidates: []
      },
      voters: []
    }
  },
  computed: {
    humanReadableDate () {
      return new Date(this.vote.to).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    candidates () {
      const candidates = [...this.vote.candidates]
      candidates.sort((a, b) => {
        return b.votes - a.votes
      })
      return candidates
    },
    totalVotes () {
      return this.vote.candidates.reduce((a, b) => a + b.votes || 0, 0)
    },
    totalVoteAvailable () {
      return this.vote.max_votes * this.voters.length
    }
  }
}
</script>
