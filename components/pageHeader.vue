<template>
  <div class="tw-py-5 tw-border-b tw-w-full tw-border-red-500">
    <div class="tw-grid tw-grid-cols-2 tw-align-middle">
      <h1 class="tw-font-bold tw-text-xl tw-font-display tw-leading-relaxed">
        {{ $t('app-title') }}
      </h1>
      <div class="tw-h-full tw-flex tw-flex-col tw-items-end tw-justify-center tw-text-gray-700">
        Přihlásit
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      loggedUserName: state => state.user.name,
      userRole: state => state.user.role
    })
  }
}
</script>
