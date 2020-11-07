<template>
  <div>
    <h1 class="section-title">
      {{ vote.name }}
    </h1>
    <p class="tw-text-blue-300">
      {{ $t('vote.voting_lasts', { date_to: humanReadableDate }) }}
    </p>
    <div v-if="message" :class="['form__error-message', messageClass, 'tw-mt-8']">
      {{ $t(`server_responses.${message}`) }}
    </div>
    <div class="tw-mt-12 tw-grid tw-grid-cols-2 tw-col-gap-16">
      <div
        v-for="candidate in vote.candidates"
        :key="candidate._id"
        class="card card--flex"
      >
        <div @click="pushCandidate(candidate.oidos)">
          <div :class="['selection-circle', 'tw-cursor-pointer', ...selectedCandidate(candidate.oidos)]" />
        </div>
        <div>
          <h2 class="card__title">
            {{ candidate.name }}
          </h2>
          <p>
            <font-awesome-icon :icon="['fas', 'external-link-alt']" class="tw-text-blue-500 tw-mr-2" />
            <a :href="candidate.web_url" class="tw-text-blue-300 hover:tw-text-green-100">
              {{ candidate.web_url }}
            </a>
          </p>
        </div>
      </div>
    </div>
    <div v-if="vote.condition_url">
      <p class="tw-text-blue-500 tw-font-bold tw-mb-2">
        {{ $t('voting.agreement_text') }}
      </p>
      <input id="agreement" v-model="form.accepted_conditions" type="checkbox">
      <label for="agreement" class="tw-text-blue-300">
        {{ $t('voting.label:agreement') }}.
      </label>
      <a :href="vote.condition_url" class="tw-text-blue-300">
        [ {{ $t('voting.label:agreement_link') }} ]
      </a>
    </div>
    <div class="tw-mt-10">
      <button
        v-if="votingStarted"
        class="button__primary tw-mr-4"
        :disabled="votingCanBeSubmitted"
        @click.prevent="submitVotes"
      >
        {{ $t('voting.label:submit') }}
      </button>
      <router-link
        :to="{ name: 'index___cs' }"
        class="button__secondary"
      >
        {{ $t('button.back') }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoteSingle',
  middleware: ['isAuth'],
  async asyncData ({ $axios, params, redirect }) {
    try {
      const request = await $axios.$get(`/api/vote/${params.vote}`)
      return { vote: request.vote }
    } catch (error) {
      if (
        error.response.status === 422 &&
        error.response.data.i18n_message === 'vote:cant_be_accessed_before_start'
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
    humanReadableDate () {
      return new Date(this.vote.to).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    hasVotes () {
      return this.form.candidates.length === this.vote.max_votes
    },
    messageClass () {
      return this.status === 'success' ? 'success' : 'error'
    },
    votingStarted () {
      const today = new Date()
      const voteDate = new Date(this.vote.from)

      return voteDate <= today
    },
    votingCanBeSubmitted () {
      if (this.vote.condition_url) {
        return !this.form.accepted_conditions
      }
      return false
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
    selectedCandidate (candidate) {
      const classList = []
      if (this.form.candidates.includes(candidate)) {
        classList.push('selected')
      }
      if (this.form.candidates.length === this.vote.max_votes) {
        classList.push('disabled')
      }

      return classList
    },
    async submitVotes () {
      try {
        const response = await this.$axios.$post(`/api/voter/vote/${this.$route.params.vote}`, {
          ...this.form
        })
        // eslint-disable-next-line no-console
        if (response.status === 'success') {
          this.$router.push('/')
        }
      } catch (error) {
        this.message = error.response.data.i18n_message
        this.status = error.response.data.status
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }
}
</script>
