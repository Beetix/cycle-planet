<template>
  <div class="row flex items-center" v-if="myUserDetails">
    <q-btn
      class="q-my-sm row"
      v-if="locationSupported"
      :size="isWebApp ? 'md' : 'sm'"
      @click="loggedIn ? getLocation() : showLoginDialog()"
      icon="eva-navigation-2-outline"
      rounded
      :class="
        loggedIn
          ? myUserDetails.coordinates
            ? 'bg-secondary text-white'
            : 'bg-red text-white'
          : 'bg-red text-white'
      "
      >{{
        loggedIn
          ? myUserDetails
            ? myUserDetails.coordinates
              ? "update my location"
              : "find my location"
            : "find my location"
          : "add my location"
      }}</q-btn
    >
    <q-spinner v-if="locationLoading" color="secondary" size="2em" />
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { Geoapify } from "app/firebase-functions/shared/src/geoapify";
import { geoapify } from "../../boot/config.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      locationLoading: false,
    };
  },

  methods: {
    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          this.locationError(err);
        },
        { timeout: 7000 }
      );
    },
    getCityAndCountry(position) {
      new Geoapify(geoapify.apiKey)
        .reverseGeocode(position.coords.latitude, position.coords.longitude)
        .then((address) => {
          this.locationSuccess(address, position);
        })
        .catch((err) => {
          this.locationError(err);
        });
    },
    locationSuccess(address, position) {
      let randomNumber1 = Math.random() * 0.02 - 0.01;
      let randomNumber2 = Math.random() * 0.02 - 0.01;
      if (address) {
        this.updateItemAction({
          path: "Users/" + this.myUserId,
          data: {
            coordinates_updated: this.timeStamp,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            coordinates_approx: {
              lat: position.coords.latitude + randomNumber1,
              lng: position.coords.longitude + randomNumber2,
            },
          },
        });
      }
      this.locationLoading = false;
    },
    locationError(err) {
      console.log("locationError", err);
      this.$q.dialog({
        title: "Error",
        message: err,
      });
      this.locationLoading = false;
    },
  },
};
</script>

<style></style>
