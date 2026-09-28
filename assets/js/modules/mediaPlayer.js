window.ZH = window.ZH || {};

/* ==========================================================================
   MEDIA PLAYER — one component behind the hero sales video, the five video
   testimonials, and the five voice notes.

   PROGRESSIVE ENHANCEMENT IS THE WHOLE DESIGN HERE.
   The markup ships a bare <video controls> / <audio controls>. If this module
   never runs (JS off, file blocked, a throw upstream), the visitor still gets
   a working native player. Everything custom — the big play button, the
   Reels-style control bar, the voice-note scrubber — is BUILT BY THIS FILE and
   only then is the native `controls` attribute removed. So the markup stays
   tiny and all six players are guaranteed identical.

   MARKUP CONTRACT
     <div class="vplayer" data-vplayer
          data-media-key="salesVideo"          <- key into window.ZH.media
          data-label="Ziad on what we do">     <- becomes the video's aria-label
       <div class="vplayer__frame">
         <video class="vplayer__video" preload="metadata" playsinline controls></video>
       </div>
     </div>

     <figure class="voicenote" data-voicenote data-media-key="voiceNote1">
       <div class="voicenote__bubble">
         <img class="voicenote__avatar" ... />
         <span class="voicenote__wave" data-wave><i style="--h:.5"></i>...</span>
         <audio preload="metadata" controls data-audio></audio>
       </div>
       <figcaption class="voicenote__meta">...</figcaption>
     </figure>

   URLs live in assets/js/media-config.js only — never in the HTML.
   ========================================================================== */
(function () {
  const HIDE_CONTROLS_MS = 2500;

  /* --- icons ------------------------------------------------------------ */
  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" fill="currentColor"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5.5" width="3.4" height="13" fill="currentColor"/><rect x="13.6" y="5.5" width="3.4" height="13" fill="currentColor"/></svg>',
    volume:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h3.5L12 19V5L7.5 9H4z"/><path d="M16 9.2a4 4 0 0 1 0 5.6"/><path d="M18.5 6.7a7.5 7.5 0 0 1 0 10.6"/></svg>',
    muted:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h3.5L12 19V5L7.5 9H4z"/><path d="M16 10l4 4"/><path d="M20 10l-4 4"/></svg>',
    expand:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H4v5"/><path d="M15 4h5v5"/><path d="M15 20h5v-5"/><path d="M9 20H4v-5"/></svg>',
  };

  /* --- helpers ---------------------------------------------------------- */

  // "0:07", "1:23", "12:05" — mm:ss, no hours (nothing here runs that long).
  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  function lookup(key) {
    const media = window.ZH.media || {};
    return (key && media[key]) || null;
  }

  function makeButton(className, label, icon) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = icon;
    return btn;
  }

  /* One item at a time, page-wide. Bound once, in the capture phase: media
     `play` events don't bubble, but they DO run through capture on the way
     down — which also catches playback started from the NATIVE controls (the
     no-JS-custom-UI fallback), not just from our own buttons. */
  let soloBound = false;
  function bindSoloPlayback() {
    if (soloBound) return;
    soloBound = true;
    document.addEventListener(
      "play",
      function (event) {
        const started = event.target;
        const all = document.querySelectorAll("video, audio");
        Array.prototype.forEach.call(all, function (other) {
          if (other !== started && !other.paused) other.pause();
        });
      },
      true
    );
  }

  /* ======================================================================
     VIDEO PLAYER
     ====================================================================== */
  function initVideoPlayer(root) {
    const video = root.querySelector(".vplayer__video");
    const frame = root.querySelector(".vplayer__frame");
    if (!video || !frame) return;

    const entry = lookup(root.dataset.mediaKey);
    const label = root.dataset.label || "Video";
    video.setAttribute("aria-label", label);

    // No entry, or an entry with no file yet: render the "coming soon" state
    // rather than a player that can only fail.
    if (!entry || !entry.src) {
      showMissing(root, video, entry);
      return;
    }

    if (entry.poster) video.poster = entry.poster;
    video.src = entry.src;
    video.addEventListener("error", function () {
      showMissing(root, video, entry);
    });

    /* --- build the custom UI, then drop the native controls --- */
    const big = makeButton("vplayer__big", "Play " + label, ICON.play);
    frame.appendChild(big);

    const bar = document.createElement("div");
    bar.className = "vplayer__bar";

    const toggle = makeButton("vplayer__btn", "Play", ICON.play);
    const seek = document.createElement("input");
    seek.type = "range";
    seek.className = "vplayer__seek";
    seek.min = "0";
    seek.max = "1000";
    seek.step = "1";
    seek.value = "0";
    seek.setAttribute("aria-label", "Seek");
    const time = document.createElement("span");
    time.className = "vplayer__time";
    time.textContent = "0:00 / 0:00";
    const mute = makeButton("vplayer__btn", "Mute", ICON.volume);
    const full = makeButton("vplayer__btn", "Fullscreen", ICON.expand);

    bar.appendChild(toggle);
    bar.appendChild(seek);
    bar.appendChild(time);
    bar.appendChild(mute);
    bar.appendChild(full);
    frame.appendChild(bar);

    // Only now is the custom UI real, so the native fallback can go.
    video.removeAttribute("controls");
    video.controls = false;
    root.classList.add("is-enhanced");

    /* --- playback --- */
    function play() {
      const attempt = video.play();
      // Safari/iOS reject the promise if the gesture wasn't trusted; swallow
      // it so it never lands in the console as an unhandled rejection.
      if (attempt && typeof attempt.catch === "function") attempt.catch(function () {});
    }

    function togglePlay() {
      if (video.paused || video.ended) play();
      else video.pause();
    }

    big.addEventListener("click", togglePlay);
    toggle.addEventListener("click", togglePlay);

    // Clicking the picture toggles too — but not clicks that land on the bar.
    frame.addEventListener("click", function (event) {
      if (event.target.closest(".vplayer__bar")) return;
      if (event.target.closest(".vplayer__big")) return;
      togglePlay();
    });

    video.addEventListener("play", function () {
      root.classList.add("is-playing");
      toggle.innerHTML = ICON.pause;
      toggle.setAttribute("aria-label", "Pause");
      big.setAttribute("aria-label", "Pause " + label);
      scheduleHide();
    });

    function onStop() {
      root.classList.remove("is-playing");
      toggle.innerHTML = ICON.play;
      toggle.setAttribute("aria-label", "Play");
      big.setAttribute("aria-label", "Play " + label);
      showControls();
    }
    video.addEventListener("pause", onStop);
    video.addEventListener("ended", onStop);

    /* --- seek + time --- */
    function paintSeek() {
      const ratio = video.duration ? video.currentTime / video.duration : 0;
      seek.style.setProperty("--seek", (ratio * 100).toFixed(2) + "%");
    }

    function paintTime() {
      time.textContent =
        formatTime(video.currentTime) + " / " + formatTime(video.duration);
    }

    let scrubbing = false;
    video.addEventListener("loadedmetadata", function () {
      paintTime();
      paintSeek();
    });
    video.addEventListener("timeupdate", function () {
      if (scrubbing) return;
      seek.value = String(
        video.duration ? (video.currentTime / video.duration) * 1000 : 0
      );
      paintSeek();
      paintTime();
    });

    seek.addEventListener("input", function () {
      scrubbing = true;
      if (video.duration) {
        video.currentTime = (Number(seek.value) / 1000) * video.duration;
      }
      paintSeek();
      paintTime();
    });
    seek.addEventListener("change", function () {
      scrubbing = false;
    });

    /* --- mute --- */
    mute.addEventListener("click", function () {
      video.muted = !video.muted;
    });
    video.addEventListener("volumechange", function () {
      const off = video.muted || video.volume === 0;
      mute.innerHTML = off ? ICON.muted : ICON.volume;
      mute.setAttribute("aria-label", off ? "Unmute" : "Mute");
    });

    /* --- fullscreen. iOS Safari has no Element.requestFullscreen, only the
           video element's own webkitEnterFullscreen. --- */
    full.addEventListener("click", function () {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        return;
      }
      if (frame.requestFullscreen) frame.requestFullscreen();
      else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });

    /* --- auto-hide the bar while playing --- */
    let hideTimer = 0;

    function showControls() {
      root.classList.remove("is-idle");
      window.clearTimeout(hideTimer);
    }

    function scheduleHide() {
      window.clearTimeout(hideTimer);
      if (video.paused) return;
      hideTimer = window.setTimeout(function () {
        // Never hide the bar out from under a keyboard user inside it.
        if (!video.paused && !root.contains(document.activeElement)) {
          root.classList.add("is-idle");
        }
      }, HIDE_CONTROLS_MS);
    }

    ["pointermove", "pointerdown", "touchstart", "focusin"].forEach(function (evt) {
      root.addEventListener(
        evt,
        function () {
          showControls();
          scheduleHide();
        },
        { passive: true }
      );
    });
    root.addEventListener("pointerleave", scheduleHide);
  }

  // Poster stays, controls go, a small label explains why. Never a broken player.
  function showMissing(root, video, entry) {
    root.classList.add("is-missing");
    root.classList.remove("is-enhanced");
    video.removeAttribute("controls");
    video.controls = false;
    if (entry && entry.poster) video.poster = entry.poster;
    if (root.querySelector(".vplayer__missing")) return;
    const note = document.createElement("p");
    note.className = "vplayer__missing";
    note.textContent = "Video coming soon";
    root.querySelector(".vplayer__frame").appendChild(note);
  }

  /* ======================================================================
     VOICE NOTE — WhatsApp-shaped, brand-coloured
     ====================================================================== */
  function initVoiceNote(root) {
    const audio = root.querySelector("[data-audio]");
    const wave = root.querySelector("[data-wave]");
    const bubble = root.querySelector(".voicenote__bubble");
    if (!audio || !bubble) return;

    const entry = lookup(root.dataset.mediaKey);
    const who = root.dataset.label || "this coach";

    if (!entry || !entry.src) {
      root.classList.add("is-missing");
      audio.removeAttribute("controls");
      audio.controls = false;
      if (!root.querySelector(".voicenote__missing")) {
        const note = document.createElement("span");
        note.className = "voicenote__missing";
        note.textContent = "Voice note coming soon";
        bubble.appendChild(note);
      }
      return;
    }

    audio.src = entry.src;
    audio.setAttribute("aria-label", "Voice note from " + who);

    const play = makeButton("voicenote__play", "Play voice note from " + who, ICON.play);
    const time = document.createElement("span");
    time.className = "voicenote__time";
    time.textContent = "0:00";

    // Insert the button at the start of the bubble and the clock at the end,
    // so the DOM order matches the visual order in both LTR and RTL.
    bubble.insertBefore(play, bubble.firstChild);
    bubble.appendChild(time);

    audio.removeAttribute("controls");
    audio.controls = false;
    root.classList.add("is-enhanced");

    const bars = wave
      ? Array.prototype.slice.call(wave.querySelectorAll("i"))
      : [];

    play.addEventListener("click", function () {
      if (audio.paused || audio.ended) {
        const attempt = audio.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(function () {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", function () {
      root.classList.add("is-playing");
      play.innerHTML = ICON.pause;
      play.setAttribute("aria-label", "Pause voice note from " + who);
    });

    function onStop() {
      root.classList.remove("is-playing");
      play.innerHTML = ICON.play;
      play.setAttribute("aria-label", "Play voice note from " + who);
    }
    audio.addEventListener("pause", onStop);

    audio.addEventListener("ended", function () {
      onStop();
      bars.forEach(function (bar) {
        bar.classList.remove("is-played");
      });
      time.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("loadedmetadata", function () {
      time.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", function () {
      time.textContent = formatTime(audio.currentTime);
      if (!bars.length || !audio.duration) return;
      // Light up every bar the playhead has passed. Heights differ per bar, so
      // a clip-path/mask fill would cut through them mid-stroke — per-bar state
      // is what actually reads as "played".
      const reached = (audio.currentTime / audio.duration) * bars.length;
      bars.forEach(function (bar, index) {
        bar.classList.toggle("is-played", index < reached);
      });
    });

    // Clicking the waveform scrubs, the same way the bar on a video does.
    if (wave) {
      wave.addEventListener("click", function (event) {
        if (!audio.duration) return;
        const box = wave.getBoundingClientRect();
        if (!box.width) return;
        let ratio = (event.clientX - box.left) / box.width;
        // Read direction off the document rather than assuming left-to-right,
        // so this keeps working when the Arabic (RTL) build lands.
        if (getComputedStyle(wave).direction === "rtl") ratio = 1 - ratio;
        audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
      });
    }
  }

  /* ====================================================================== */
  window.ZH.initMediaPlayers = function () {
    const videos = document.querySelectorAll("[data-vplayer]");
    const notes = document.querySelectorAll("[data-voicenote]");
    if (!videos.length && !notes.length) return;

    bindSoloPlayback();
    Array.prototype.forEach.call(videos, initVideoPlayer);
    Array.prototype.forEach.call(notes, initVoiceNote);
  };
})();
