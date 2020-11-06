<template>
  <div class="tw-max-w-900 tw-w-full tw-mx-auto">
    <page-header />
    <Nuxt class="tw-pt-3 tw-pb-20" />
  </div>
</template>

<script>
import PageHeader from '../components/pageHeader'

export default {
  name: 'DefaultLayout',
  components: {
    'page-header': PageHeader
  }
}
</script>
