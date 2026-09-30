window.ZH = window.ZH || {};

/* ==========================================================================
   UI STRINGS — for text the JS builds, not text that sits in the HTML.

   The site ships in two languages as two documents (Arabic at /, English at
   /en/) sharing one set of scripts. Copy that lives in the markup is
   translated in the markup; this file exists only for the handful of labels
   the modules CREATE at runtime — player buttons, carousel arrows, form
   validation messages, generated alt text — which have no markup to live in.

   Language is read from <html lang>, so a page declares it once and every
   module follows. Anything missing from a dictionary falls back to English,
   and `t()` falls back to the key itself, so a typo degrades to something
   readable rather than to "undefined" in an aria-label.

   Call it as window.ZH.t("player.play"). Modules guard the call (see the
   `tr()` helper each one defines) so they still work if this file is absent.
   ========================================================================== */
(function () {
  var STRINGS = {
    en: {
      /* video / audio players (mediaPlayer.js) */
      "player.play": "Play",
      "player.pause": "Pause",
      "player.playLabel": "Play {0}",
      "player.pauseLabel": "Pause {0}",
      "player.seek": "Seek",
      "player.mute": "Mute",
      "player.unmute": "Unmute",
      "player.fullscreen": "Fullscreen",
      "player.video": "Video",
      "player.videoMissing": "Video coming soon",
      "player.noteMissing": "Voice note coming soon",
      "player.thisCoach": "this coach",
      "note.label": "Voice note from {0}",
      "note.play": "Play voice note from {0}",
      "note.pause": "Pause voice note from {0}",
      "note.seek": "Seek voice note from {0}",
      "note.position": "{0} of {1}",

      /* testimonial strip (carousel.js) */
      "carousel.prev": "Previous testimonial",
      "carousel.next": "Next testimonial",
      "carousel.goTo": "Go to testimonial {0}",

      /* work grid (projectGrid.js, data/projects.js) */
      "work.reelAlt": "Reel produced for a fitness coach",
      "work.reelAltViews":
        "A reel we scripted, shot, and edited for a fitness coach — {0} views",

      /* booking form (contactForm.js) */
      "form.nameRequired": "Please enter your name.",
      "form.nameInvalid": "Use letters, spaces, hyphens or apostrophes only.",
      "form.phoneRequired": "Please enter your phone number.",
      "form.phoneInvalid": "That doesn't look like a valid phone number.",
      "form.handleInvalid": "Handles use only letters, numbers, dots and underscores.",
      "form.messageRequired": "Tell us a little about your coaching.",
      "form.messageAngle": "Please remove any < or > characters.",
      "form.opening": "Opening WhatsApp with your details… nothing happened? ",
      "form.openingLink": "Tap here to send your booking.",

      /* the WhatsApp message the form hands off (contactForm.js) */
      "wa.title": "New call booking",
      "wa.name": "Name",
      "wa.phone": "Phone",
      "wa.handle": "Handle",
      "wa.package": "Package",
      "wa.time": "Preferred time",
      "wa.days": "Preferred days",
      "wa.anyPackage": "Not sure yet",
      "wa.anyTime": "Any time",
      "wa.anyDay": "Any day",
      "wa.package12": "12 Reels / month",
      "wa.package24": "24 Reels / month",
      "wa.slot9": "Morning (9am-12pm)",
      "wa.slot12": "Early afternoon (12pm-3pm)",
      "wa.slot15": "Late afternoon (3pm-6pm)",
      "wa.slot18": "Evening (6pm-9pm)",
      "wa.mon": "Mon",
      "wa.tue": "Tue",
      "wa.wed": "Wed",
      "wa.thu": "Thu",
      "wa.fri": "Fri",
      "wa.sat": "Sat",
      "wa.sun": "Sun",
    },

    ar: {
      "player.play": "تشغيل",
      "player.pause": "إيقاف مؤقت",
      "player.playLabel": "تشغيل {0}",
      "player.pauseLabel": "إيقاف {0}",
      "player.seek": "تحديد موضع التشغيل",
      "player.mute": "كتم الصوت",
      "player.unmute": "إلغاء كتم الصوت",
      "player.fullscreen": "ملء الشاشة",
      "player.video": "فيديو",
      "player.videoMissing": "الفيديو قريبًا",
      "player.noteMissing": "الرسالة الصوتية قريبًا",
      "player.thisCoach": "الكابتن",
      "note.label": "رسالة صوتية من {0}",
      "note.play": "تشغيل الرسالة الصوتية من {0}",
      "note.pause": "إيقاف الرسالة الصوتية من {0}",
      "note.seek": "تحديد موضع الرسالة الصوتية من {0}",
      "note.position": "{0} من {1}",

      "carousel.prev": "الشهادة السابقة",
      "carousel.next": "الشهادة التالية",
      "carousel.goTo": "اذهب إلى الشهادة {0}",

      "work.reelAlt": "ريل من إنتاجنا لكابتن لياقة",
      "work.reelAltViews": "ريل كتبناه وصوّرناه وعملنا مونتاجه لكابتن لياقة — {0} مشاهدة",

      "form.nameRequired": "اكتب اسمك من فضلك.",
      "form.nameInvalid": "استخدم حروفًا ومسافات وشرطات فقط.",
      "form.phoneRequired": "اكتب رقم موبايلك من فضلك.",
      "form.phoneInvalid": "ده مش شكل رقم موبايل صحيح.",
      "form.handleInvalid": "اسم الحساب بيتكوّن من حروف وأرقام ونقط وشرطة سفلية فقط.",
      "form.messageRequired": "كلّمنا شوية عن تدريبك.",
      "form.messageAngle": "من فضلك امسح أي علامة < أو >.",
      "form.opening": "بنفتح واتساب وبياناتك جاهزة… مفيش حاجة حصلت؟ ",
      "form.openingLink": "دوس هنا لإرسال الحجز.",

      "wa.title": "حجز مكالمة جديد",
      "wa.name": "الاسم",
      "wa.phone": "رقم الموبايل",
      "wa.handle": "الحساب",
      "wa.package": "الباكدج",
      "wa.time": "الوقت المفضّل",
      "wa.days": "الأيام المفضّلة",
      "wa.anyPackage": "لسه مش متأكد",
      "wa.anyTime": "أي وقت",
      "wa.anyDay": "أي يوم",
      "wa.package12": "12 ريل / شهر",
      "wa.package24": "24 ريل / شهر",
      "wa.slot9": "الصباح (9 - 12)",
      "wa.slot12": "بعد الظهر (12 - 3)",
      "wa.slot15": "العصر (3 - 6)",
      "wa.slot18": "المسا (6 - 9)",
      "wa.mon": "الاثنين",
      "wa.tue": "الثلاثاء",
      "wa.wed": "الأربعاء",
      "wa.thu": "الخميس",
      "wa.fri": "الجمعة",
      "wa.sat": "السبت",
      "wa.sun": "الأحد",
    },
  };

  var lang = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
  var dict = STRINGS[lang] || STRINGS.en;

  window.ZH.lang = lang;

  /* Positional slots {0} and {1} — positional rather than named so a
     translator can move them wherever the Arabic sentence needs them, which
     for "{0} of {1}" is the other way round. */
  window.ZH.t = function (key) {
    var out = dict[key];
    if (out == null) out = STRINGS.en[key];
    if (out == null) return key;
    for (var i = 1; i < arguments.length; i++) {
      out = out.replace("{" + (i - 1) + "}", String(arguments[i]));
    }
    return out;
  };
})();
