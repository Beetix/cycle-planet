<template>
  <div>
    <div class="text-h4">Country chips</div>
    <div>
      <div class="text-h6">modal-countrychip</div>
      <div class="row items-center">
        <b>Example:</b><modal-countrychip :countryKey="'Togo'" />
      </div>
      <div><b>props:</b> countryKey</div>
    </div>
    <div>
      <div class="text-h6">modal-countrychip2</div>
      <div class="row items-center">
        <b>Example:</b><modal-countrychip2 :countryKey="'Togo'" />
      </div>
      <div><b>props:</b> countryKey</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
};
</script>

<style></style>
