<template>
  <div>
    <h1 class="section-title">
      {{ $t('settings.page:title') }}
    </h1>
    <form action="/settings/save" class="tw-mt-4 msm:tw-grid tw-grid-cols-2 tw-gap-5 tw-col-gap-16">
      <div class="sm:tw-mb-6">
        <label for="condition_text" class="form__label">{{ $t('settings.label:condition_text') }}</label>
        <input id="condition_text" v-model="form.conditions.text" type="text" class="form__input">
      </div>
      <div class="sm:tw-mb-6">
        <label for="condition_url" class="form__label">{{ $t('settings.label:condition_url') }}</label>
        <input id="condition_url" v-model="form.conditions.url" type="text" class="form__input">
      </div>
      <div class="tw-col-span-2 tw-mt-10">
        <button
          class="button__primary tw-mr-4"
          @click.prevent="updateSettings"
        >
          {{ $t('settings.button:save') }}
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
  name: 'Settings',
  middleware: ['isAuth', 'isAdmin'],
  async asyncData ({ $axios }) {
    try {
      const response = await $axios.$get('/api/settings/all')

      if (response.conditions === undefined) {
        response.conditions = { text: '', url: '' }
      }

      return {
        form: response
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  data () {
    return {
      form: {
        conditions: {
          text: '',
          url: ''
        }
      }
    }
  },
  methods: {
    async updateSettings () {
      try {
        const response = await this.$axios.post(
          '/api/settings/save',
          this.form
        )
        if (response.data.status === 'success') {
          this.$router.push('/')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }
}
</script>
