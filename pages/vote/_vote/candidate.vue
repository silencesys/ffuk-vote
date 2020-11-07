<template>
  <div class="tw-mb-20">
    <h1 class="section-title tw-mb-6">
      {{ $t('candidate_editor.title') }}
    </h1>
    <div v-if="error_message" :class="['form__error-message', messageClass]">
      {{ $t(`server_responses.${error_message}`) }}
    </div>
    <form action="/candidate/store" class="tw-mt-4 tw-grid tw-grid-cols-2 tw-gap-5 tw-col-gap-16">
      <div>
        <label for="name" class="form__label">
          {{ $t('candidate_editor.label:oidos') }}
        </label>
        <input
          id="name"
          v-model="form.oidos"
          type="text"
          class="form__input"
        >
        <div v-if="errors.oidos" class="form__error">
          {{ $t(`validator.${errors.oidos}`) }}
        </div>
        <div class="tw-mt-2 tw-text-blue-300">
          <strong>{{ $t('candidate_editor.label:found_person') }}:</strong>
          {{ person }}
        </div>
      </div>
      <div>
        <label for="name" class="form__label">
          {{ $t('candidate_editor.label:web_url') }}
        </label>
        <input
          id="name"
          v-model="form.web_url"
          type="text"
          class="form__input"
        >
        <div v-if="errors.web_url" class="form__error">
          {{ $t(`validator.${errors.web_url}`) }}
        </div>
      </div>
      <!--
      <div class="tw-col-span-2">
        <label for="name" class="form__label">
          {{ $t('candidate_editor.label:description') }}
          <span class="tw-text-red-800">({{ $t('optional') }})</span>
        </label>
        <textarea
          id="name"
          v-model="form.description"
          type="text"
          class="form__textarea"
        />
        <div v-if="errors.description" class="form__error">
          {{ errors.description }}
        </div>
      </div>
      -->
      <div class="tw-col-span-2 tw-mt-10">
        <button
          class="button__primary tw-mr-4"
          @click.prevent="registerCandidate"
        >
          {{ $t('candidate_editor.label:add') }}
        </button>
        <router-link
          :to="{ name: 'index___cs' }"
          class="button__secondary"
        >
          {{ $t('button.back') }}
        </router-link>
      </div>
    </form>
    <div v-if="assignedCandidates.length > 0" class="tw-mt-12">
      <h2 class="section-title__secondary">
        {{ $t('candidate_editor.title_list') }}
      </h2>
      <ul class="tw-text-blue-300 tw-grid tw-grid-cols-3">
        <li
          v-for="(candidate, index) in assignedCandidates"
          :key="index"
          class="tw-my-1"
        >
          {{ candidate }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CandidateEditor',
  middleware: ['isAuth', 'isAdmin'],
  async asyncData ({ $axios, params }) {
    try {
      const request = await $axios.$get(`/api/vote/${params.vote}`)
      return { vote: request.vote }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  data () {
    return {
      vote: {
        candidates: []
      },
      form: {
        oidos: null,
        description: null,
        web_url: null
      },
      errors: {
        oidos: null,
        description: null,
        web_url: null
      },
      person: null,
      timeout: 0,
      error_message: '',
      status: 'success',
      newlyAddedCandidates: []
    }
  },
  computed: {
    messageClass () {
      return this.status === 'success' ? 'success' : 'error'
    },
    assignedCandidates () {
      const candidates = this.vote.candidates.map((item) => {
        return item.name
      })
      return [...candidates, ...this.newlyAddedCandidates]
    },
    personName () {
      return this.person || this.$t('candidates.label:no_person_found')
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    'form.oidos': function () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.findCandidate()
      }, 500)
    },
    form: {
    // eslint-disable-next-line object-shorthand
      handler: function () {
        this.errors = {
          oidos: null,
          description: null,
          web_url: null
        }
        this.error_message = ''
      },
      deep: true
    }
  },
  methods: {
    async registerCandidate () {
      try {
        const response = await this.$axios.$post('/api/candidate/store', {
          ...this.form,
          vote_id: this.$route.params.vote
        })
        if (response.status === 'success') {
          this.newlyAddedCandidates.push(this.person)
          this.form = {
            oidos: null,
            description: null,
            web_url: null
          }
        }
        this.error_message = response.i18n_message
        this.person = null
      } catch (error) {
        this.error_message = error.response.data.i18n_message
        this.status = error.response.data.status
        if (error.response.status === 422 && error.response.data.errors !== undefined) {
          error.response.data.errors.forEach((error) => {
            this.errors[error.param] = error.msg
          })
        } else {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      }
    },
    async findCandidate () {
      try {
        const candidate = await this.$axios.$post('/api/student/find', {
          field: 'SIDOS',
          values: [this.form.oidos]
        })
        this.person = candidate[0].fullNameWithTitles || null
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }
}
</script>
