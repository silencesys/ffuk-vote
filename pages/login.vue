<template>
  <div class="login__background tw-flex tw-justify-center tw-items-center">
    <div class="tw-bg-white tw-p-8 tw-rounded-xl tw-max-w-400 tw-text-center tw-shadow-xl">
      <h1 class="website-title">
        {{ $t('app-title') }}
      </h1>
      <p class="tw-font-bold tw-text-blue-300 tw-mt-5">
        {{ $t('login_conditions.text') }}
      </p>
      <div class="tw-text-blue-300 tw-my-6">
        <input id="conditions_agreement" v-model="agreement" type="checkbox" class="tw-border-blue-500">
        <label for="conditions_agreement">
          {{ $t('login_conditions.label') }}
        </label>
      </div>
      <button :disabled="!agreement" class="button__primary tw-w-40" @click="proceedToLogin">
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
  data () {
    return {
      agreement: false
    }
  },
  computed: {
    loginUrl () {
      return `/login/cas?redirect=${this.$route.query.redirect}`
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
