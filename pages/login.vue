<template>
  <div class="login__background tw-flex tw-justify-center tw-flex-col tw-clearfix tw-px-64 tw-font-body md:tw-px-32">
    <div class="tw-grid tw-grid-cols-2">
      <div class="login__app-title tw-max-w-400">
        <h1 class="tw-text-white tw-text-5xl tw-font-bold tw-font-display">
          {{ $t('app.name') }}
        </h1>
        <img src="/img/ff_logo.png" alt="" width="300px">
      </div>
      <div class="login__form tw-p-8 tw-bg-white tw-shadow-lg tw-rounded-md tw-items-end tw-clearfix tw-max-w-500">
        <h2 class="tw-text-3xl tw-font-black tw-mb-6">
          {{ $t('section.login.title') }}
        </h2>
        <div>
          <a
            :href="loginUrl"
            class="tw-bg-red-600 tw-text-white tw-w-full tw-rounded-full tw-py-3 tw-text-sm tw-block tw-text-center hover:tw-bg-red-800"
          >
            {{ $t('button.sign-in-cas') }}
          </a>
          <div class="tw-text-center tw-font-light tw-text-gray-600 tw-mt-6 tw-mb-6">
            <p class="tw-px-3 tw-bg-white tw-inline-block">
              {{ $t('section.login.divider:or') }}
            </p>
            <hr class="tw-w-full tw-t-border tw-border-gray-300 tw--mt-3">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    loginUrl () {
      return `/login/cas?redirect=${this.$route.query.redirect}`
    }
  }
}
</script>
