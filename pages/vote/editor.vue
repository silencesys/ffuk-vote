<template>
  <div>
    <h1 class="tw-text-2xl tw-mb-2">
      {{ $t('editor.title:vote') }}
    </h1>
    <form action="/vote/store" class="tw-mt-4 tw-grid tw-grid-cols-2 tw-gap-12 tw-font-body">
      <div>
        <label for="name" class="tw-block tw-mb-1">{{ $t('editor.label:name') }}</label>
        <input id="name" v-model="form.name" type="text" class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md">
        <div v-if="errors.name" class="tw-text-red-700 tw-mt-1">
          {{ errors.name }}
        </div>
      </div>
      <div>
        <label for="max_votes" class="tw-block tw-mb-1">{{ $t('editor.label:max_votes') }}</label>
        <input id="max_votes" v-model="form.max_votes" type="number" class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md" value="1">
        <div v-if="errors.max_votes" class="tw-text-red-700 tw-mt-1">
          {{ errors.max_votes }}
        </div>
      </div>
      <div class="tw-col-span-2">
        <label for="condition_url" class="tw-block tw-mb-1">
          {{ $t('editor.label:condition_url') }}
          <span class="tw-text-red-800">({{ $t('optional') }})</span>
        </label>
        <input id="condition_url" v-model="form.condition_url" type="text" class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md">
        <div v-if="errors.condition_url" class="tw-text-red-700 tw-mt-1">
          {{ errors.condition_url }}
        </div>
      </div>
      <div>
        <label for="date_from" class="tw-block tw-mb-1">{{ $t('editor.label:date_from') }}</label>
        <input id="date_from" v-model="form.date_from" type="date" class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md">
        <div v-if="errors.date_from" class="tw-text-red-700 tw-mt-1">
          {{ errors.date_from }}
        </div>
      </div>
      <div>
        <label for="date_to" class="tw-block tw-mb-1">{{ $t('editor.label:date_to') }}</label>
        <input id="date_to" v-model="form.date_to" type="date" class="tw-border tw-py-1 tw-px-2 tw-border-gray-400 tw-w-full tw-rounded-md">
        <div v-if="errors.date_to" class="tw-text-red-700 tw-mt-1">
          {{ errors.date_to }}
        </div>
      </div>
      <div>
        <button
          class="tw-bg-red-600 tw-border-red-600 tw-border-2 tw-py-2 tw-px-4 tw-rounded-full tw-text-white tw-text-sm tw-inline-block"
          @click.prevent="storeVote"
        >
          {{ $t('editor.label:create') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'VoteEditor',
  middleware: ['isAuth'],
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
        name: '',
        max_votes: '',
        date_from: '',
        date_to: '',
        condition_url: ''
      }
    }
  },
  methods: {
    async storeVote () {
      try {
        const response = await this.$axios.post('/api/vote/create', this.form)
        if (response.data.status === 'success') {
          this.$router.push('/vote')
        }
      } catch (error) {
        if (error.response.status === 422) {
          error.response.data.errors.forEach((error) => {
            console.log(error)
            this.errors[error.param] = error.msg
          })
        } else {
          console.error(error)
        }
      }
    }
  }
}
</script>
