import Vue from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { date, uid, Notify } from "quasar";
import { openURL } from "quasar";
import { version } from "../../package.json";
import { Platform } from "quasar";
import { LocalStorage } from "quasar";
import { getCountryData, countryConstants, getCountryDataByName, reverseCountryCodes } from "app/firebase-functions/shared/src/country-constants.js";

import Embed from "v-video-embed";
Vue.use(Embed);

export default {
  data() {
    return {
      version: version,
	  getCountryData: getCountryData,
      countryConstants: countryConstants,
      getCountryDataByName: getCountryDataByName,
      reverseCountryCodes: reverseCountryCodes,
      
    };
  },

  computed: {
    ...mapState("auth", ["myUserIdState", "followData", "loggedIn","showedpromotionstate"]),
    ...mapState("markers", ["markerlist", "mapsettings", "markeruserlist"]),
    ...mapState("markers", [
      "landMarkers",
      "usermarkeroptions",
      "markerCounts",
    ]),
    ...mapState("country", ["refsextra"]),
    ...mapState("admin", ["adminData"]),
    ...mapState("post", ["postData"]),
    ...mapState("countries", ["allCountryData"]),

    ...mapGetters("auth", ["users", "usersWithMapLocation"]),
    ...mapGetters("countries", ["countriesFiltered"]),
    ...mapGetters("chat", ["unreadchatlistnew", "userMessagesSortedByDate"]),
    ...mapGetters("post", [
      "blogPostsSorted",
      "blogPostsSortedByDate",
      "videoPostsSorted",
      "videoPostsSortedByDate",
      "routePostsSorted",
    ]),

    countryKeys() {
		return Object.keys(this.reverseCountryCodes()).sort()
    },

    isLoggedIn() {
      if (LocalStorage.getItem("loggedIn")) {
        return true;
      } else {
        return false;
      }
    },

    loadedPosts() {
      if (Object.keys(this.blogPostsSorted).length) {
        return true;
      } else {
        return false;
      }
    },
   

    myUserId() {
      return this.myUserIdState;
    },
    myUserDetails() {
      return this.users[this.myUserId];
    },
    admin() {
      if (this.myUserDetails) {
        if (
          this.myUserDetails.role === "admin" ||
          this.myUserDetails.role === "team" ||
          this.myUserId === "ieMGYdJeX6ZyKgKeeGhMXPFZkax2"
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    teamMember() {
      if (this.myUserDetails) {
        if (
          this.myUserDetails.role === "team" ||
          this.myUserDetails.role === "admin"
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    roleEditor() {
      if (this.myUserDetails) {
        if (
          this.myUserDetails.role === "editor" ||
          this.myUserDetails.role === "team" ||
          this.myUserDetails.role === "admin"
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    screenwidthbig() {
      let screenWidth = screen.width;
      if (screenWidth < 768) {
        return false;
      } else {
        return true;
      }
    },
    screenwidthbigsize() {
      return screen.width;
    },

    timeStampGMT() {
      let timeStamp = new Date();
      return timeStamp;
    },
    timeStampCode() {
      let timeStamp = Date.now();
      let formattedString = date.formatDate(
        timeStamp,
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      return formattedString;
    },

    timeStamp() {
      let timeStamp = Date.now();
      let formattedString = date.formatDate(timeStamp, "YYYY-MM-DDTHH:mm:ss");
      return formattedString;
    },
    statisticsTimeStamp() {
      let timeStamp = Date.now();
      let formattedString = date.formatDate(timeStamp, "YYYY-MM-DD");
      return formattedString;
    },
    niceTimeStamp() {
      let timeStamp = Date.now();
      let formattedString = date.formatDate(timeStamp, "DD-MM-YYYY");
      return formattedString;
    },
    dynamicSize() {
      return [this.mapsettings.iconSize, this.mapsettings.iconSize * 1.0];
    },
    dynamicAnchor() {
      return [this.mapsettings.iconSize / 2, this.mapsettings.iconSize * 1.0];
    },
    itemUserCreatedMixin() {
      if (this.users[this.itemUserCreated]) {
        return this.users[this.itemUserCreated].id;
      } else {
        return "RYFRjpH3DfdWPpRfG9MIFBSPzH33";
      }
    },
    locationSupported() {
      if ("geolocation" in navigator) {
        return true;
      } else {
        return false;
      }
    },
    isWebApp() {
      if (this.$q.platform.is.cordova || this.$q.platform.has.touch) {
        return false;
      } else {
        return true;
      }
    },
    isApple() {
      if (this.$q.platform.is.ios) {
        return true;
      } else {
        return false;
      }
    },
    isCordova() {
      if (this.$q.platform.is.cordova) {
        return true;
      } else {
        return false;
      }
    },
    hasTouch() {
      if (this.$q.platform.has.touch) {
        return true;
      } else {
        return false;
      }
    },
    screenWidth() {
      let screenWidth = screen.width;
      return screenWidth;
    },
    screenHeight() {
      return screen.height;
    },
    screenInnerHeight() {
      return window.innerHeight;
    },
    screenViewHeight() {
      return (
        view.window?.windowScene?.statusBarManager?.statusBarFrame.height ?? 0
      );
    },

    buttonStyle() {
      return { "background-color": "#2A898C", color: "white" };
    },
  },

  methods: {
    ...mapActions("other", [
      "setItemAction",
      "deleteItemAction",
      "updateItemAction",
    ]),
    ...mapActions("other", [
      "setItemActionFs",
      "setItemActionFs2",
      "deleteItemActionFs",
      "updateItemActionFs",
    ]),
    ...mapActions("markers", ["updateMarkerAction"]),
    ...mapActions("post", ["getPosts"]),

    

    countryCoordinatesWithKey(country) {
		if(!this.markerCounts) return
		const cc = this.getCountryDataByName(country).iso2
      	return this.markerCounts[cc].location;
    },
    countryCoordinatesWithCode(countrycode) {
      return this.markerCounts[countrycode].location;
    },

    flagUrlFor(cc) {
      return "countryflagsnew/" + cc + ".svg";
    },

    updateAppVersion() {
      if (this.users[this.myUserId]) {
        this.updateItemAction({
          data: {
            deviceData: {
              version: this.version,
            },
          },
          path: "Users/" + this.myUserId,
        });
      }
    },

    clickuser(userId) {
      this.$router.push("/user/" + userId);
    },
    clickedcountry(countryKey) {
      this.$router.push("/country/" + countryKey);
    },
    clickedcontinent(continentId) {
      this.$router.push("/continent/" + continentId);
    },

    openMapUrl(lat, lng) {
      window.location = "geo:" + lat + "," + lng;
    },
    openUrl(url) {
      if (url.substring(0, 3) === "www") {
        var res = url.split("www");
        url = "https://www" + res[1];
      }
      if (!this.isWebApp) {
        cordova.InAppBrowser.open(url, "_blank", "location=yes");
      } else {
        window.open(url, "_blank");
      }
    },

    openIGUrl(url) {
      var res = url.split("www");
      var res1 = url.split("https");
      var res2 = url.split("instagram");
      if (res2[1]) {
        if (res1[1]) {
        } else {
          url = "https://" + res1[0];
        }
      } else {
        url = "https://www.instagram.com/" + url;
      }
      if (!this.isWebApp) {
        cordova.InAppBrowser.open(url, "_blank", "location=yes");
      } else {
        window.open(url, "_blank");
      }
    },
    showLoginDialog() {
      this.$q
        .dialog({
          title: "Login",
          message: "You need to login to continue, do you want to continue?",
          ok: {
            color: "secondary",
            push: true,
          },
          cancel: true,

          persistent: true,
        })
        .onOk(() => {
          this.$router.push("/auth");
        });
    },
    niceDateMethod(dateprop) {
      let date_created = dateprop;
      let timeStamp = Date.now();
      let show_date = date.formatDate(date_created, "D MMMM YYYY");

      // let unit = 'days'
      let diff_years = date.getDateDiff(timeStamp, date_created, "years");
      let diff_months = date.getDateDiff(timeStamp, date_created, "months");
      let diff_days = date.getDateDiff(timeStamp, date_created, "days");
      let diff_hours = date.getDateDiff(timeStamp, date_created, "hours");
      let diff_minutes = date.getDateDiff(timeStamp, date_created, "minutes");
      let diff_seconds = date.getDateDiff(timeStamp, date_created, "seconds");
      // let formattedString = date.formatDate(difference, 'D-MMM-YYYY')
      if (diff_days > 15) {
        return show_date;
      } else if (diff_hours > 24) {
        return diff_days + " days ago";
      } else if (diff_minutes > 60) {
        return diff_hours + " hours ago";
      } else if (diff_seconds > 120) {
        return diff_minutes + " minutes ago";
      } else if (diff_seconds > 60) {
        return diff_minutes + " minute ago";
      } else if (diff_seconds > 0) {
        return diff_seconds + " seconds ago";
      } else if (diff_seconds === 0) {
        return "now";
      } else {
        return date_created;
      }
    },
    pasteCapture(evt) {
      // Let inputs do their thing, so we don't break pasting of links.
      if (evt.target.nodeName === "INPUT") return;
      let text, onPasteStripFormattingIEPaste;
      evt.preventDefault();
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          this.$refs.editor_ref.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    },
    daysToGo(dateProposal) {
      let date_created = dateProposal;
      let year = date_created.split("-")[2];
      let month = date_created.split("-")[1];
      let day = date_created.split("-")[0];

      let timeStamp = Date.now();
      let show_date = date.formatDate(timeStamp, "YYYY-MM-DD");

      let yearNow = show_date.split("-")[0];
      let monthNow = show_date.split("-")[1];
      let dayNow = show_date.split("-")[2];
      // let diff = date.getDateDiff(timeStamp, date_created, 'days')
      let date1 = new Date(year, month, day);
      let date2 = new Date(yearNow, monthNow, dayNow);
      let unit = "days";

      let diff = date.getDateDiff(date1, date2, unit);
      return diff;
    },
    addPoints(points) {
      this.updateItemAction({
        path: "Users/" + this.myUserId + "/points",
        data: {
          score: this.myUserDetails.points.score + points,
        },
      });
    },
  },
  components: {
    "nice-date": require("components/Shared/Modals/NiceDate.vue").default,
    "nice-date-short": require("components/Shared/Modals/NiceDateShort.vue")
      .default,
    "nice-date2": require("components/Shared/Modals/NiceDate2.vue").default,
    "modal-countrychip": require("components/Shared/Modals/ModalCountryChip.vue")
      .default,
    "modal-countrychip2": require("components/Shared/Modals/ModalCountryChip2.vue")
      .default,
    "modal-countrychip3": require("components/Shared/Modals/ModalCountryChip3.vue")
      .default,
    "modal-countrychip4": require("components/Shared/Modals/ModalCountryChip4.vue")
      .default,
    "modal-username": require("components/Shared/Modals/ModalUsername.vue")
      .default,
    "modal-username2": require("components/Shared/Modals/ModalUsername2.vue")
      .default,
    "modal-username3": require("components/Shared/Modals/ModalUsername3.vue")
      .default,
    "modal-username4": require("components/Shared/Modals/ModalUsername4.vue")
      .default,
    "modal-title": require("components/Shared/Modals/ModalTitle.vue").default,
    "modal-description": require("components/Map/Modals/Shared/ModalDescription.vue")
      .default,
    "modal-banner": require("components/Map/Modals/Shared/ModalBanner.vue")
      .default,
    "modal-location": require("components/Shared/Modals/ModalLocation.vue")
      .default,
    "city-country": require("components/Shared/Modals/CityCountry.vue").default,
    "marker-title": require("components/Shared/Modals/MarkerTitle.vue").default,
    // 'modal-follow-button': require('components/Shared/Modals/FollowButton.vue').default,

    "loading-page": require("components/Shared/Modals/LoadingPage.vue").default,

    "mobile-header": require("components/Shared/Modals/MobileHeader.vue")
      .default,
    "modal-header": require("src/components/Shared/Modals/ModalHeader.vue")
      .default,
    "modal-buttons": require("src/components/Shared/Modals/ModalButtons.vue")
      .default,
    "modal-task-country": require("src/components/Shared/Modals/ModalTaskName.vue")
      .default,

    "chart-line": require("src/components/Stats/ChartLine.vue").default,
    // 'chart-bar': 	require('src/components/Stats/ChartBar.vue').default,
  },
};
