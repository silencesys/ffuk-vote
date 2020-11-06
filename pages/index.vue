<template>
  <div class="tw-flex tw-flex-col">
    <div
      v-for="vote in available_votes"
      :key="vote._id"
      class="card"
      :class="[{'tw-cursor-pointer': !vote.canBeModified && !vote.voted}]"
      @click="openVote(vote)"
    >
      <div class="tw-w-full">
        <h2 class="card__title">
          {{ vote.name }}
        </h2>
        <ul class="vote__details tw-mt-2">
          <li>
            {{ $t('vote.number_of_candidates', { number: vote.candidates.length }) }}
            <router-link
              v-if="vote.canBeModified && userIsAdmin"
              :to="{ name: 'vote-vote-candidate___cs', params: { vote: vote._id } }"
              class="tw-text-blue-500 tw-mt-8 hover:tw-bg-green-100"
            >
              [ {{ $t('vote.button:add_candidates') }} ]
            </router-link>
          </li>
          <li>
            {{ $t('vote.voting_lasts', { date_to: vote.date_to }) }}
          </li>
        </ul>
      </div>
      <div
        v-if="!vote.voted"
        :class="[{'tw-cursor-pointer': vote.canBeModified && userIsAdmin}]"
        @click="openVote(vote, userIsAdmin)"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          class="tw-text-5xl tw-text-blue-500"
        />
      </div>
      <div
        v-else-if="vote.voted"
        :class="[{'tw-cursor-pointer': vote.canBeModified && userIsAdmin}]"
        @click="openVote(vote, userIsAdmin)"
      >
        <font-awesome-icon
          :icon="['fas', 'check']"
          class="tw-text-5xl tw-text-green-100"
        />
      </div>
    </div>
    <router-link
      v-if="userIsAdmin"
      :to="{ name: 'vote-editor___cs' }"
      class="button__primary tw-self-center tw-mt-16"
    >
      {{ $t('button.new_voting') }}
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VoteIndex',
  middleware: ['isAuth'],
  async asyncData ({ $axios }) {
    try {
      const votes = await $axios.$get('/api/vote/index')
      const votedIn = await $axios.$get('/api/voter')

      return { votes, voted_in: votedIn.voted_in }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  data () {
    return {
      votes: [],
      voted_in: []
    }
  },
  computed: {
    ...mapState({
      userRole: state => state.user.role
    }),
    userIsAdmin () {
      return this.userRole === 'admin'
    },
    available_votes () {
      return this.votes.map((item) => {
        if (this.voted_in.includes(item._id)) {
          item.voted = true
        }
        item.canBeModified = this.voteCanBeModified(item.to)
        item.date_to = this.translateDate(item.to)

        return item
      })
    }
  },
  methods: {
    voteCanBeModified (date) {
      const today = new Date()
      const voteDate = new Date(date)

      return voteDate > today
    },
    openVote (vote, ignore) {
      if (!this.voteCanBeModified(vote.to) && !vote.voted) {
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
    }
  }
}
</script>
