<template>
  <div>
    <h1 class="tw-text-2xl tw-mb-2">
      {{ $t('candidate_editor.title') }}
    </h1>
    <div v-if="message" class="tw-p-5 tw-border  tw-rounded-md" :class="statusClasses">
      {{ $t(`server_responses.${message}`) }}
    </div>
    <form action="/vote/store" class="tw-grid tw-grid-cols-2 tw-mt-4 tw-gap-6 tw-font-body">
      <div>
        <label for="name" class="tw-block tw-mb-1">{{ $t('candidate_editor.label:oidos') }}</label>
        <input
          id="name"
          v-model="form.oidos"
          type="text"
          class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md"
        >
        <div v-if="errors.oidos" class="tw-text-red-700 tw-mt-1">
          {{ $t(`validator.${errors.oidos}`) }}
        </div>
        <div class="tw-mt-2">
          <strong>{{ $t('candidate_editor.label:found_person') }}:</strong>
          {{ person }}
        </div>
      </div>
      <div>
        <label for="name" class="tw-block tw-mb-1">{{ $t('candidate_editor.label:web_url') }}</label>
        <input
          id="name"
          v-model="form.web_url"
          type="text"
          class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md"
        >
        <div v-if="errors.web_url" class="tw-text-red-700 tw-mt-1">
          {{ $t(`validator.${errors.web_url}`) }}
        </div>
      </div>
      <div class="tw-col-span-2">
        <label for="name" class="tw-block tw-mb-1">
          {{ $t('candidate_editor.label:description') }}
          <span class="tw-text-red-800">({{ $t('optional') }})</span>
        </label>
        <textarea
          id="name"
          v-model="form.description"
          type="text"
          class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md"
        />
        <div v-if="errors.description" class="tw-text-red-700 tw-mt-1">
          {{ errors.description }}
        </div>
      </div>
      <div>
        <button
          class="tw-bg-red-600 tw-border-red-600 tw-border-2 tw-py-2 tw-px-4 tw-rounded-full tw-text-white tw-text-sm tw-inline-block tw-mr-2"
          @click.prevent="registerCandidate"
        >
          {{ $t('candidate_editor.label:add') }}
        </button>
        <router-link
          :to="{ name: 'vote___cs' }"
          class="tw-border-gray-500 tw-border-2 tw-py-2 tw-px-4 tw-rounded-full tw-text-gray-700 tw-text-sm"
        >
          {{ $t('button:back') }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  middleware: ['isAuth'],
  data () {
    return {
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
      person: 'Žádná osoba nenalezena',
      timeout: 0,
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
        this.message = ''
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
          this.form = {
            oidos: null,
            description: null,
            web_url: null
          }
        }
        this.message = response.i18n_message
      } catch (error) {
        this.message = error.response.data.i18n_message
        this.status = error.response.data.status
        if (error.response.status === 422 && error.response.data.errors !== undefined) {
          error.response.data.errors.forEach((error) => {
            this.errors[error.param] = error.msg
          })
        } else {
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
        this.person = candidate[0].fullNameWithTitles || 'Žádná osoba nenalezena'
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
