<template>
  <div>
    <h1 class="tw-text-2xl tw-mb-2">
      {{ vote.name }}
    </h1>
    <div v-if="message" class="tw-p-5 tw-border tw-rounded-md tw-mb-4" :class="statusClasses">
      {{ $t(`server_responses.${message}`) }}
    </div>
    <table class="tw-w-full">
      <thead>
        <tr class="tw-bg-red-200">
          <th class="tw-w-1/3 tw-p-2">
            {{ $t('candidates.table:name') }}
          </th>
          <th class="tw-w-1/3 tw-p-2">
            {{ $t('candidates.table:web_url') }}
          </th>
          <th class="tw-w-1/3 tw-p-2" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="candidate in vote.candidates"
          :key="candidate.oidos"
          :class="selectedClasses(candidate.oidos)"
          @click="pushCandidate(candidate.oidos)"
        >
          <td class="tw-p-2">
            {{ candidate.name }}
          </td>
          <td class="tw-text-right tw-p-2">
            {{ candidate.web_url }}
          </td>
          <td class="tw-text-right tw-p-2">
            {{ candidate.description }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="vote.condition_url">
      <input id="agreement" v-model="form.accepted_conditions" type="checkbox">
      <label for="agreement">
        {{ $t('voting.label:agreement') }}.
      </label>
      <a :href="vote.condition_url">
        [ {{ $t('voting.label:agreement_link') }} ]
      </a>
    </div>
    <div class="tw-mt-10">
      <button
        class="tw-bg-red-600 tw-border-red-600 tw-border-2 tw-py-2 tw-px-4 tw-rounded-full tw-text-white tw-text-sm tw-inline-block tw-mr-2"
        @click.prevent="submitVotes"
      >
        {{ $t('voting.label:submit') }}
      </button>
      <router-link
        :to="{ name: 'vote___cs' }"
        class="tw-border-gray-500 tw-border-2 tw-py-2 tw-px-4 tw-rounded-full tw-text-gray-700 tw-text-sm"
      >
        {{ $t('button:back') }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoteSingle',
  middleware: ['isAuth'],
  async asyncData ({ $axios, params }) {
    const request = await $axios.$get(`/api/vote/${params.vote}`)
    return { vote: request.vote }
  },
  data () {
    return {
      vote: [],
      form: {
        candidates: [],
        accepted_conditions: false
      },
      message: '',
      status: 'success'
    }
  },
  computed: {
    statusClasses () {
      if (this.status === 'success') {
        return 'tw-bg-green-300 tw-border-green-500'
      }
      return 'tw-bg-red-300 tw-border-red-500'
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    votes: function () {
      this.message = ''
    }
  },
  methods: {
    pushCandidate (candidate) {
      if (this.form.candidates.includes(candidate)) {
        const index = this.form.candidates.indexOf(candidate)
        this.form.candidates.splice(index, 1)
      } else if (this.form.candidates.length < this.vote.max_votes) {
        this.form.candidates.push(candidate)
      } else {
        this.message = 'voting:too_many_selections'
        this.status = 'error'
      }
    },
    selectedClasses (candidate) {
      if (this.form.candidates.includes(candidate)) {
        return 'tw-bg-green-300'
      }
    },
    async submitVotes () {
      try {
        const response = await this.$axios.$post(`/api/voter/vote/${this.$route.params.vote}`, {
          ...this.form
        })

        console.log(response)
      } catch (error) {
        this.message = error.response.data.i18n_message
        this.status = error.response.data.status
        console.error(error)
      }
    }
  }
}
</script>
