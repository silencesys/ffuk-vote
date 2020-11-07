<template>
  <div class="tw-py-10">
    <div class="tw-grid tw-grid-cols-2 tw-align-middle">
      <h1 class="website-title">
        {{ $t('app-title') }}
      </h1>
      <div class="tw-h-full tw-flex tw-flex-col tw-items-end tw-justify-center tw-text-gray-700">
        <div class="tw-h-full tw-flex tw-flex-row tw-align-middle tw-items-center">
          <a v-if="!isAuthenticated" href="/login/cas" class="tw-cursor-pointer">
            {{ $t('button.login') }}
          </a>
          <a v-else class="tw-cursor-pointer hover:tw-text-green-100" @click.prevent="logoutUser">
            {{ $t('button.logout') }}
          </a>
          <div v-if="isAuthenticated" class="l tw-flex tw-flex-row tw-align-middle tw-items-center">
            <div
              class=" tw-text-white tw-mx-3 tw-py-1 tw-text-xs tw-px-2 tw-rounded-full"
              :class="avatarColor"
            >
              <font-awesome-icon :icon="['fas', 'user']" />
            </div>
            {{ loggedUserName }}
          </div>
        </div>
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
      isAuthenticated: state => state.user.authenticated,
      userRole: state => state.user.role
    }),
    isAdmin () {
      return this.userRole === 'admin'
    },
    avatarColor () {
      return this.isAdmin ? 'tw-bg-green-100' : 'tw-bg-blue-500'
    }
  },
  methods: {
    /**
     * Handle user sign out.
     *
     * First send request to the server to remove session cookie, then delete
     * user data from the storage and redirect back to the login page.
     */
    async logoutUser () {
      const response = await this.$axios.post('/logout')

      if (response.data.success) {
        this.$router.push('/login')
      }
    }
  }
}
</script>
