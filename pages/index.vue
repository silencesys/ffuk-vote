<template>
  <div class="tw-flex tw-flex-col">
    <div v-if="error_message" :class="['form__error-message', messageClass]">
      {{ $t(`server_responses.${error_message}`) }}
    </div>
    <div
      v-for="vote in available_votes"
      :key="vote._id"
      class="card"
      :class="[{'tw-cursor-pointer hover:tw-shadow-sm': vote.can_open, 'disabled': !vote.can_open}]"
      @click="openVote(vote)"
    >
      <div class="card--flex">
        <div class="tw-w-full">
          <h2 class="card__title">
            {{ vote.name }}
          </h2>
          <ul class="vote__details tw-mt-2">
            <li>
              {{ $t('vote.number_of_candidates', { number: vote.candidates.length }) }}
            </li>
            <li>
              {{ $t('vote.voting_lasts', { date_to: vote.date_to }) }}
            </li>
          </ul>
        </div>
        <div v-if="!vote.voted" class="sm:tw-hidden">
          <font-awesome-icon
            :icon="['fas', 'arrow-right']"
            class="tw-text-5xl tw-text-blue-500 card__icon"
          />
        </div>
        <div v-else-if="vote.voted" class="sm:tw-hidden">
          <font-awesome-icon
            :icon="['fas', 'check']"
            class="tw-text-5xl tw-text-green-100"
          />
        </div>
      </div>
      <div v-if="userIsAdmin" class="tw-mt-5 tw-text-sm">
        <slot-select class="tw-w-1/4 sm:tw-w-full" :description="$t('vote.editing_options')">
          <li>
            <button
              v-if="vote.canBeModified"
              class="scr-table__button"
              @click.stop="openVote(vote, userIsAdmin)"
            >
              <font-awesome-icon :icon="['fas', 'eye']" class="tw-mr-1" />
              {{ $t('vote.button:show') }}
            </button>
          </li>
          <li>
            <button
              v-if="!vote.voting_ended"
              class="scr-table__button"
              @click.stop="openEditor(vote._id)"
            >
              <font-awesome-icon :icon="['fas', 'edit']" class="tw-mr-1" />
              {{ $t('vote.button:edit') }}
            </button>
          </li>
          <li>
            <router-link
              v-if="vote.canBeModified"
              :to="{ name: 'vote-vote-candidate___cs', params: { vote: vote._id } }"
              class="scr-table__button"
            >
              <font-awesome-icon :icon="['fas', 'user-edit']" class="tw-mr-1" />
              {{ $t('vote.button:add_candidates') }}
            </router-link>
          </li>
          <li>
            <router-link
              v-if="vote.voting_ended"
              :to="{ name: 'vote-vote-results___cs', params: { vote: vote._id } }"
              class="scr-table__button"
            >
              <font-awesome-icon :icon="['fas', 'poll-h']" class="tw-mr-1" />
              {{ $t('vote.button:show_results') }}
            </router-link>
          </li>
          <li>
            <button class="scr-table__button" @click.stop="deleteVote(vote)">
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="tw-mr-1" />
              {{ $t('vote.button:delete') }}
            </button>
          </li>
        </slot-select>
      </div>
    </div>
    <router-link
      v-if="userIsAdmin && !fuctions_disabled"
      :to="{ name: 'vote-editor___cs' }"
      class="button__primary tw-self-center msm:tw-mt-16 sm:tw-mt-8"
    >
      {{ $t('button.new_voting') }}
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SlotSelect from '../components/slotSelect'

export default {
  name: 'VoteIndex',
  middleware: ['isAuth'],
  components: {
    'slot-select': SlotSelect
  },
  async asyncData ({ $axios }) {
    try {
      const votes = await $axios.$get('/api/vote/index')
      const votedIn = await $axios.$get('/api/voter')

      return { votes, voted_in: votedIn.voted_in }
    } catch (error) {
      if (error.response.status === 403 && error.response.data.i18n_message === 'error:registrations_enabled') {
        return {
          error_message: error.response.data.i18n_message,
          fuctions_disabled: true,
          status: error.response.data.status
        }
      }
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  data () {
    return {
      votes: [],
      voted_in: [],
      error_message: '',
      fuctions_disabled: false,
      status: 'success'
    }
  },
  computed: {
    ...mapState({
      userRole: state => state.user.role
    }),
    messageClass () {
      return this.status === 'success' ? 'success' : 'error'
    },
    userIsAdmin () {
      return this.userRole === 'admin'
    },
    available_votes () {
      return this.votes.map((item) => {
        item.voted = this.voted_in.includes(item._id)
        item.canBeModified = this.voteCanBeModified(item.from)
        item.date_to = this.translateDate(item.to)
        item.voting_ended = this.votingEnded(item.to)
        item.can_open = !item.voted && !item.canBeModified && !item.voting_ended
        item.actions_available = this.checkAvailableActions(item)

        return item
      }).sort((a, b) => b.can_open - a.can_open)
    }
  },
  methods: {
    voteCanBeModified (date) {
      const today = new Date()
      const voteDate = new Date(date)

      return voteDate > today
    },
    votingEnded (date) {
      const today = new Date()
      const voteDate = new Date(date)

      return today > voteDate
    },
    checkAvailableActions (vote) {
      if (this.userIsAdmin) {
        if (vote.canBeModified || this.votingEnded(vote.to)) {
          return true
        }
        return false
      }
      return false
    },
    openVote (vote, ignore) {
      if (vote.can_open) {
        this.$router.push({ name: 'vote-vote___cs', params: { vote: vote._id } })
      } else if (ignore) {
        this.$router.push({ name: 'vote-vote___cs', params: { vote: vote._id } })
      }
    },
    translateDate (date) {
      return new Date(date)
        .toLocaleDateString('cs-CZ', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
    },
    openEditor (id) {
      this.$router.push({ name: 'vote-vote-editor___cs', params: { vote: id } })
    },
    async deleteVote (vote) {
      if (window.confirm(this.$t('vote.confirm_deletion', { name: vote.name }))) {
        try {
          const response = await this.$axios.$delete(`/api/vote/delete/${vote._id}`)

          this.error_message = response.i18n_message
          this.status = response.status

          const removedVote = this.votes.findIndex(item => item._id === vote._id)
          this.votes.splice(removedVote, 1)

          window.scrollTo(0, 0)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>
