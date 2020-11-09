<template>
  <div class="scr-slot-select" v-click-outside="hideActions">
    <div
      :class="['scr-slot-select__header', { 'tw-rounded-b-none': visible }]"
      @click.stop="toggleActions"
    >
      {{ description }}
      <font-awesome-icon
        :icon="['fas', 'caret-down']"
        class="scr-slot-select__header-icon"
      />
    </div>
    <ul v-show="visible" class="scr-slot-select__options">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SlotSelect',
  props: {
    description: {
      type: String,
      default: 'Akce'
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    toggleActions () {
      this.visible = !this.visible
    },
    hideActions () {
      this.visible = false
    }
  }
}
</script>
