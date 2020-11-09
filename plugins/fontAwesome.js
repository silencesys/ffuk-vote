import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser, faArrowRight, faExternalLinkAlt, faCheck, faCaretDown, faUserEdit,
  faPollH, faEdit, faTrashAlt, faEye
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faUser, faArrowRight, faExternalLinkAlt, faCheck, faCaretDown, faUserEdit,
  faPollH, faEdit, faTrashAlt, faEye
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
