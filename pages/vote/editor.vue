<template>
  <div>
    <h1 class="section-title tw-mb-6">
      {{ $t('editor.title:vote') }}
    </h1>
    <div v-if="error_message" :class="['form__error-message', messageClass]">
      {{ $t(`server_responses.${error_message}`) }}
    </div>
    <form action="/vote/store" class="tw-mt-4 msm:tw-grid tw-grid-cols-2 tw-gap-5 tw-col-gap-16">
      <div class="sm:tw-mb-6">
        <label for="name" class="form__label">{{ $t('editor.label:name') }}</label>
        <input id="name" v-model="form.name" type="text" class="form__input">
        <div v-if="errors.name" class="form__error">
          {{ $t(`validator.${errors.name}`) }}
        </div>
      </div>
      <div class="sm:tw-mb-6">
        <label for="max_votes" class="form__label">{{ $t('editor.label:max_votes') }}</label>
        <input id="max_votes" v-model="form.max_votes" type="number" class="form__input" value="1">
        <div v-if="errors.max_votes" class="form__error">
          {{ $t(`validator.${errors.max_votes}`) }}
        </div>
      </div>
      <div class="sm:tw-mb-6">
        <label for="date_from" class="form__label">{{ $t('editor.label:date_from') }}</label>
        <input id="date_from" v-model="form.date_from" type="date" class="form__input">
        <div v-if="errors.date_from" class="form__error">
          {{ $t(`validator.${errors.date_from}`) }}
        </div>
      </div>
      <div class="sm:tw-mb-6">
        <label for="date_to" class="form__label">{{ $t('editor.label:date_to') }}</label>
        <input id="date_to" v-model="form.date_to" type="date" class="form__input">
        <div v-if="errors.date_to" class="form__error">
          {{ $t(`validator.${errors.date_to}`) }}
        </div>
      </div>
      <div class="sm:tw-mb-6">
        <label for="condition_url" class="form__label">
          {{ $t('editor.label:condition_url') }}
          <span class="tw-text-red-800">({{ $t('optional') }})</span>
        </label>
        <input id="condition_url" v-model="form.condition_url" type="text" class="form__input">
        <div v-if="errors.condition_url" class="form__error">
          {{ $t(`validator.${errors.condition_url}`) }}
        </div>
      </div>
      <div class="tw-col-span-2 tw-mt-10">
        <button
          class="button__primary tw-mr-4"
          @click.prevent="storeVote"
        >
          {{ $t('editor.label:create') }}
        </button>
        <router-link :to="{ name: 'index___cs' }" class="button__secondary">
          {{ $t('button.back') }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'VoteEditor',
  middleware: ['isAuth', 'isAdmin'],
  data () {
    return {
      form: {
        name: '',
        max_votes: 1,
        date_from: null,
        date_to: null,
        condition_url: null
      },
      errors: {
        name: null,
        max_votes: null,
        date_from: null,
        date_to: null,
        condition_url: null
      },
      status: 'success',
      error_message: ''
    }
  },
  computed: {
    messageClass () {
      return this.status === 'success' ? 'success' : 'error'
    }
  },
  watch: {
    form: {
    // eslint-disable-next-line object-shorthand
      handler: function () {
        this.errors = {
          name: null,
          max_votes: null,
          date_from: null,
          date_to: null,
          condition_url: null
        }
        this.error_message = ''
      },
      deep: true
    }
  },
  methods: {
    async storeVote () {
      try {
        const response = await this.$axios.post('/api/vote/create', this.form)
        if (response.data.status === 'success') {
          this.$router.push({
            name: 'vote-vote-candidate___cs',
            params: {
              vote: response.data.vote._id
            }
          })
        }
      } catch (error) {
        if (error.response.status === 422) {
          error.response.data.errors.forEach((error) => {
          // eslint-disable-next-line no-console
            console.error(error)
            this.errors[error.param] = error.msg
          })
          this.status = error.response.data.status
          this.error_message = error.response.data.i18n_message
        } else {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      }
    }
  }
}
</script>
