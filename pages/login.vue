<template>
  <div class="login__background tw-flex tw-justify-center tw-items-center">
    <div class="tw-bg-white tw-p-8 tw-rounded-xl tw-max-w-400 tw-text-center tw-shadow-xl">
      <h1 class="website-title">
        {{ $t('app-title') }}
      </h1>
      <div v-if="condition_enabled">
        <p class="tw-font-bold tw-text-blue-300 tw-mt-5">
          {{ conditions.text }}
        </p>
        <div class="tw-text-blue-300 tw-mt-6">
          <input id="conditions_agreement" v-model="agreement" type="checkbox" class="tw-border-blue-500">
          <label for="conditions_agreement">
            {{ $t('login_conditions.agree') }}
          </label>
          <br>
          <a
            :href="conditions.url"
            class="tw-text-blue-500 hover:tw-bg-green-100"
            target="_blank"
          >
            [{{ $t('login_conditions.link') }}]
          </a>
        </div>
      </div>
      <button :disabled="loginIsEnabled" class="button__primary tw-w-40 tw-mt-6" @click="proceedToLogin">
        {{ $t('button.login') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LoginPage',
  layout: 'image',
  async asyncData ({ $axios }) {
    try {
      const response = await $axios.$get('/api/settings?key=conditions')

      return { conditions: response.option, condition_enabled: true }
    } catch (error) {
      if (error.response.status === 404) {
        return {
          condition_enabled: false
        }
      } else {
        console.error(error)
      }
    }
  },
  data () {
    return {
      agreement: false,
      conditions: {},
      condition_enabled: false
    }
  },
  computed: {
    loginUrl () {
      return `/login/cas?redirect=${this.$route.query.redirect}`
    },
    loginIsEnabled () {
      if (this.condition_enabled) {
        return !this.agreement
      }
      return false
    }
  },
  methods: {
    ...mapMutations({
      updateConditionsState: 'user/updateConditionStatus'
    }),
    proceedToLogin () {
      this.updateConditionsState(true)
      location.replace(this.loginUrl)
    }
  }
}
</script>
