<template>
  <div class="constrain bg-white" v-if="userData" style="min-height: 100%;">
    <div class="q-pa-md text-center no-padding">
      <q-img :src="userData.backgroundimageurl" :ratio="16 / 9"></q-img>
      <q-avatar style="margin-top: -70px;" size="140px" class="">
        <img :src="userData.imageurl" style="border: 2px solid white;" />
      </q-avatar>

      <div class="justify-center">
        <div class="cp-h2 no-margin">{{ userData.fullname }}</div>

        <q-chip
          outline
          :color="
            userData.hosting.status === 'Touring'
              ? 'primary'
              : userData.hosting.status === 'Available for hosting'
              ? 'red'
              : 'grey'
          "
        >
          <q-avatar>
            <img :src="markerlist[userData.hosting.status].iconurl" />
          </q-avatar>
          {{ userData.hosting.status }}
        </q-chip>

        <div class="row justify-center">
          <div>
            <b
              class="cursor-pointer"
              @click="
                loggedIn ? clickFollowDialog('followers') : showLoginDialog()
              "
              clickable
              >{{
                otherFollowData
                  ? otherFollowData.followers
                    ? Object.keys(otherFollowData.followers).length
                    : 0
                  : 0
              }}</b
            >
            followers
          </div>
          <div class="q-mx-sm">•</div>
          <div>
            <b
              class="cursor-pointer"
              @click="
                loggedIn ? clickFollowDialog('following') : showLoginDialog()
              "
              clickable
              >{{
                otherFollowData
                  ? otherFollowData.following
                    ? Object.keys(otherFollowData.following).length
                    : 0
                  : 0
              }}</b
            >
            following
          </div>
        </div>
        <div class="row justify-center q-mt-sm">
          <div>
            <b class="cursor-pointer" @click="markerDialogAdded()">{{
              userData.points.markers_added
                ? Object.keys(userData.points.markers_added).length
                : 0
            }}</b>
            markers added
          </div>
          <div class="q-mx-sm">•</div>
          <div>
            <b class="cursor-pointer" @click="markerDialogChecked()">{{
              userData.points.markers_checked
                ? Object.keys(userData.points.markers_checked).length
                : 0
            }}</b>
            markers checked
          </div>
          <div class="q-mx-sm">•</div>
          <div>
            <b class="cursor-pointer" @click="markerDialogLiked()">{{
              userData.points.markers_liked
                ? Object.keys(userData.points.markers_liked).length
                : 0
            }}</b>
            markers liked
          </div>
        </div>
      </div>

      <div class="q-mb-sm q-pa-sm">
        <q-btn
          :style="buttonStyle"
          v-if="myProfile"
          label="Edit profile"
          @click="editProfileForm = true"
        />
        <q-btn
          :style="buttonStyle"
          v-if="loggedIn && !myProfile"
          label="Send host request"
          @click="hostRequestDialog = true"
        />

        <div v-if="!myProfile" class="q-ma-sm row justify-center">
          <modal-follow-button :otherUserId="userData.userId" class="q-ma-sm" />
          <modal-message-button
            :otherUserId="userData.userId"
            class="q-ma-sm"
          />
        </div>
      </div>

      <div class="row justify-center q-gutter-x-md">
        <a v-if="userData.website" @click="openUrl(userData.website)"
          ><img src="social_icons/icon_wordpress.png" style="width: 34px;"
        /></a>
        <a v-if="userData.facebook" @click="openUrl(userData.facebook)"
          ><img src="social_icons/icon_facebook.png" style="width: 34px;"
        /></a>
        <a v-if="userData.instagram" @click="openIGUrl(userData.instagram)"
          ><img src="social_icons/icon_instagram.png" style="width: 34px;"
        /></a>
        <a v-if="userData.youtube" @click="openUrl(userData.youtube)"
          ><img src="social_icons/icon_youtube.png" style="width: 34px;"
        /></a>
      </div>
    </div>

    <div class="q-mt-xs" v-if="loggedIn">
      <q-tabs v-model="tab" dense class="text-black" align="justify">
        <q-tab name="about" label="About" />
        <q-tab name="hosting" label="Hosting" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated v-if="userData">
        <q-tab-panel name="about">
          <about-tab :userId="userId" :userData="userData" />
        </q-tab-panel>

        <q-tab-panel name="hosting">
          <hosting-tab :userId="userId" :userData="userData" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div
      class="justify-center flex q-my-lg"
      style="padding-bottom: 50px;"
      v-if="!loggedIn"
    >
      You need to login to see more information
    </div>

    <q-dialog v-model="followDialog">
      <q-card style="min-width: 60%;" class="no-padding">
        <q-card-section class="no-padding no-margin">
          <modal-header>{{
            followType === "followers" ? "Followers" : "Following"
          }}</modal-header>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="full-width" separator>
            <div v-if="otherFollowData">
              <div v-if="otherFollowData[followType]">
                <div
                  v-for="(followuser, key) in otherFollowData[followType]"
                  :key="key"
                >
                  <q-item class="no-padding" v-if="users[key]">
                    <q-item-section avatar clickable @click="clickuser(key)">
                      <q-avatar
                        :style="buttonStyle"
                        text-color="white"
                        class="cursor-pointer"
                        :size="screenwidthbig ? 'lg' : 'md'"
                      >
                        <img :src="users[key].imageurl" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section
                      clickable
                      @click="clickuser(key)"
                      class="cursor-pointer"
                    >
                      {{ users[key].fullname }}
                    </q-item-section>

                    <q-item-section side v-if="key !== myUserId">
                      <modal-follow-button :otherUserId="key" />
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>

            <div v-else>
              <p>
                It seems that {{ userData.fullname }} doesn't
                {{
                  followType === "followers"
                    ? "have followers"
                    : "follow anyone yet"
                }}...
              </p>
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="editProfileForm">
      <edit-profile
        v-if="!isWebApp"
        :userData="userData"
        @close="editProfileForm = false"
      />
      <edit-profile-web
        v-if="isWebApp"
        :userData="userData"
        @close="editProfileForm = false"
      />
    </q-dialog>

    <q-dialog :maximized="true" v-model="markerAddedDialog" class="bg-white">
      <markerlist-dialog
        :markersArray="
          userData.points.markers_added
            ? Object.values(userData.points.markers_added)
            : 0
        "
        :title="'Added markers'"
      />
    </q-dialog>

    <q-dialog :maximized="true" v-model="markerCheckedDialog" class="bg-white">
      <markerlist-dialog
        :markersArray="
          userData.points.markers_checked
            ? Object.values(userData.points.markers_checked)
            : 0
        "
        :title="'Checked markers'"
      />
    </q-dialog>

    <q-dialog :maximized="true" v-model="markerLikedDialog" class="bg-white">
      <markerlist-dialog
        :markersArray="
          userData.points.markers_liked
            ? Object.keys(userData.points.markers_liked)
            : 0
        "
        :title="'Liked markers'"
      />
    </q-dialog>

    <q-dialog v-model="hostRequestDialog" :maximized="!isWebApp">
      <host-request :otherUserId="userId" @close="hostRequestDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["userData"],
  data() {
    return {
      editProfileForm: false,
      tab: "about",
      newMessage: "",
      showMessages: false,
      followDialog: false,
      followType: "followers",
      markerAddedDialog: false,
      markerCheckedDialog: false,
      markerLikedDialog: false,
      hostRequestDialog: false,
    };
  },

  components: {
    "edit-profile": require("components/Profile/EditProfile.vue").default,
    "edit-profile-web": require("components/Profile/EditProfileWeb.vue")
      .default,
    "trips-tab": require("components/Profile/Tabs/TripsTab.vue").default,
    "about-tab": require("components/Profile/Tabs/AboutTab.vue").default,
    "hosting-tab": require("components/Profile/Tabs/HostingTab.vue").default,
    "modal-follow-button": require("components/Shared/Modals/FollowButton.vue")
      .default,
    "modal-message-button": require("components/Shared/Modals/MessageButton.vue")
      .default,
    "hosting-stats": require("components/Shared/Modals/HostingStats.vue")
      .default,
    "markerlist-dialog": require("components/Marker/MarkerListDialog.vue")
      .default,
    "host-request": require("components/Chat/HostRequestDialog.vue").default,
  },

  computed: {
    userId() {
      return this.$route.params.otherUserId;
    },
    myProfile() {
      if (this.userId === this.myUserId) return true;
      else return false;
    },

    otherFollowData() {
      return this.followData[this.userId];
    },
  },

  methods: {
    ...mapActions("auth", ["setFollow", "setUnfollow", "firebaseGetFollowers"]),
    ...mapActions("country", ["destroyData"]),
    ...mapActions("profile", ["getUserDetails"]),

    clickFollowDialog(type) {
      this.followType = type;
      this.followDialog = true;
    },

    markerDialogAdded() {
      this.markerAddedDialog = true;
    },
    markerDialogChecked() {
      this.markerCheckedDialog = true;
    },
    markerDialogLiked() {
      this.markerLikedDialog = true;
    },
  },
  created() {
    this.getPosts();
    this.firebaseGetFollowers();
  },

  destroyed() {
    //call a method when page is left
    this.destroyData();
  },
};
</script>
<style>
.userImages {
  width: 30%;
}
</style>
