window.ZH = window.ZH || {};

/* ==========================================================================
   Contact form — input validation & hardening (CLIENT SIDE)

   READ THIS before trusting it for a database:
   This code runs in the visitor's browser, so it is NOT a security boundary.
   Anyone can disable JS or POST straight to your endpoint and skip all of it.
   Its jobs are (1) give the user instant, friendly validation and (2) normalise
   and bound what the form sends.

   The REAL injection defense lives on the SERVER once you wire up a backend:
     - SQL injection  -> ALWAYS use parameterized queries / prepared statements
       (bind values as parameters). With parameters a literal "--", "'" or ";"
       is stored as plain data and can never change your query, so you do NOT
       need to strip dashes or quotes, and stripping them would corrupt real
       messages. NEVER build SQL by string-concatenating these values.
     - Stored XSS     -> HTML-escape / framework-encode the value on OUTPUT, when
       you render it back into a page or email.
     - NoSQL / command / header injection -> validate and use safe driver APIs.

   What this file does defensively: trims, caps length, strips control &
   zero-width characters, rejects angle brackets / HTML tags and null bytes,
   and strictly format-checks name / email / handle / package. The free-text
   message keeps normal punctuation (it's legitimate) but is bounded and
   control-stripped. Send the returned `data` object to your backend, never the
   raw field values.
   ========================================================================== */
(function () {
  var LIMITS = { name: 80, email: 254, handle: 30, message: 2000 };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var HANDLE_RE = /^@?[A-Za-z0-9._]{1,30}$/;
  // Letters from any language (\p{L}) + combining marks, space, dot, apostrophe, hyphen.
  var NAME_RE = /^[\p{L}\p{M} .'\-]{1,80}$/u;
  var ALLOWED_PACKAGES = ["", "12-reels", "24-reels"];
  var ALLOWED_TIMESLOTS = ["", "9-12", "12-15", "15-18", "18-21"];
  var ALLOWED_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  // WhatsApp handoff. On a valid submit we don't POST anywhere — we open a
  // wa.me link with the normalised details pre-filled so the visitor just hits
  // send. REPLACE with the studio's real number in full international format,
  // digits only (no +, spaces or dashes). e.g. Egypt 010 1234 5678 -> "201012345678".
  var WHATSAPP_NUMBER = "201090842990";

  // Human labels for the coded <select> / checkbox values, used in the message.
  var PACKAGE_LABELS = { "12-reels": "12 Reels / month", "24-reels": "24 Reels / month" };
  var TIMESLOT_LABELS = {
    "9-12": "Morning (9am-12pm)",
    "12-15": "Early afternoon (12pm-3pm)",
    "15-18": "Late afternoon (3pm-6pm)",
    "18-21": "Evening (6pm-9pm)",
  };
  var DAY_LABELS = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
  };

  // Control-char strippers, built from escape strings so this source stays pure
  // ASCII. CONTROL_ALL removes every C0 control char + DEL + zero-width joiners +
  // BOM; CONTROL_KEEP_NL is the same but spares TAB (u0009) and LF (u000A) so the
  // multi-line message can keep its line breaks.
  var CONTROL_ALL = new RegExp("[\\u0000-\\u001F\\u007F\\u200B-\\u200D\\uFEFF]", "g");
  var CONTROL_KEEP_NL = new RegExp(
    "[\\u0000-\\u0008\\u000B-\\u001F\\u007F\\u200B-\\u200D\\uFEFF]",
    "g"
  );

  function stripControl(str, keepNewlines) {
    return str.replace(keepNewlines ? CONTROL_KEEP_NL : CONTROL_ALL, "");
  }

  function hasAngle(str) {
    return /[<>]/.test(str); // blocks the start of any HTML/script tag at the source
  }

  // Normalise a value: coerce to string, strip control chars, trim, cap length,
  // and collapse runaway whitespace.
  function clean(raw, limit, keepNewlines) {
    var s = String(raw == null ? "" : raw);
    s = stripControl(s, keepNewlines).trim();
    if (s.length > limit) s = s.slice(0, limit);
    if (keepNewlines) {
      return s.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n");
    }
    return s.replace(/\s+/g, " ");
  }

  function fieldWrap(input) {
    return input.closest(".form-field");
  }

  function clearFeedback(form) {
    form.querySelectorAll(".form-field.has-error").forEach(function (fw) {
      fw.classList.remove("has-error");
      var msg = fw.querySelector(".form-error");
      if (msg) msg.remove();
      var input = fw.querySelector("input, textarea, select");
      if (input) input.removeAttribute("aria-invalid");
    });
    var status = form.querySelector(".form-status");
    if (status) status.remove();
  }

  function showError(input, message) {
    var fw = fieldWrap(input);
    if (!fw || fw.querySelector(".form-error")) return;
    fw.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    var el = document.createElement("p");
    el.className = "form-error";
    el.setAttribute("role", "alert");
    el.textContent = message;
    fw.appendChild(el);
  }

  window.ZH.initContactForm = function () {
    var form = document.querySelector("form[data-unwired]");
    if (!form) return;

    form.setAttribute("novalidate", "");

    var fields = {
      name: form.querySelector('[name="name"]'),
      email: form.querySelector('[name="email"]'),
      handle: form.querySelector('[name="handle"]'),
      package: form.querySelector('[name="package"]'),
      timeslot: form.querySelector('[name="timeslot"]'),
      days: form.querySelectorAll('[name="days"]'),
      message: form.querySelector('[name="message"]'),
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearFeedback(form);

      var data = {};
      var firstBad = null;

      // Name — letters/spaces/./'/- only, no HTML.
      data.name = clean(fields.name.value, LIMITS.name, false);
      if (!data.name) {
        showError(fields.name, "Please enter your name.");
        firstBad = firstBad || fields.name;
      } else if (hasAngle(data.name) || !NAME_RE.test(data.name)) {
        showError(fields.name, "Use letters, spaces, hyphens or apostrophes only.");
        firstBad = firstBad || fields.name;
      }

      // Email — normalised to lower case and format-checked.
      data.email = clean(fields.email.value, LIMITS.email, false).toLowerCase();
      if (!data.email) {
        showError(fields.email, "Please enter your email.");
        firstBad = firstBad || fields.email;
      } else if (!EMAIL_RE.test(data.email)) {
        showError(fields.email, "That doesn't look like a valid email address.");
        firstBad = firstBad || fields.email;
      }

      // Handle — optional. Letters/numbers/dot/underscore, single leading @.
      data.handle = clean(fields.handle.value, LIMITS.handle, false);
      if (data.handle) {
        if (!HANDLE_RE.test(data.handle)) {
          showError(fields.handle, "Handles use only letters, numbers, dots and underscores.");
          firstBad = firstBad || fields.handle;
        } else if (data.handle.charAt(0) !== "@") {
          data.handle = "@" + data.handle;
        }
      }

      // Package — must be one of the known option values, else treated as unset.
      data.package =
        ALLOWED_PACKAGES.indexOf(fields.package.value) > -1 ? fields.package.value : "";

      // Preferred call time — must be one of the known slots, else treated as "any".
      data.timeslot =
        ALLOWED_TIMESLOTS.indexOf(fields.timeslot.value) > -1 ? fields.timeslot.value : "";

      // Preferred days — collect only checked, whitelisted values, in week order.
      var checkedDays = {};
      Array.prototype.forEach.call(fields.days, function (cb) {
        if (cb.checked && ALLOWED_DAYS.indexOf(cb.value) > -1) checkedDays[cb.value] = true;
      });
      data.days = ALLOWED_DAYS.filter(function (d) {
        return checkedDays[d];
      });

      // Message — free text; keeps punctuation but no HTML tags / control chars.
      data.message = clean(fields.message.value, LIMITS.message, true);
      if (!data.message) {
        showError(fields.message, "Tell us a little about your coaching.");
        firstBad = firstBad || fields.message;
      } else if (hasAngle(data.message)) {
        showError(fields.message, "Please remove any < or > characters.");
        firstBad = firstBad || fields.message;
      }

      if (firstBad) {
        firstBad.focus();
        return;
      }

      // Valid + normalised. Build a plain-text summary and hand off to WhatsApp.
      // `data` is already trimmed / length-capped / control-stripped and angle
      // brackets are rejected, so it's safe to drop straight into the message.
      var lines = ["New call booking", "", "Name: " + data.name, "Email: " + data.email];
      if (data.handle) lines.push("Handle: " + data.handle);
      lines.push("Package: " + (PACKAGE_LABELS[data.package] || "Not sure yet"));
      lines.push("Preferred time: " + (TIMESLOT_LABELS[data.timeslot] || "Any time"));
      lines.push(
        "Preferred days: " +
        (data.days.length
          ? data.days
            .map(function (d) {
              return DAY_LABELS[d];
            })
            .join(", ")
          : "Any day")
      );
      lines.push("", data.message);

      var waUrl =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(waUrl, "_blank", "noopener");

      var status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      status.append(
        "Opening WhatsApp with your details… nothing happened? "
      );
      var link = document.createElement("a");
      link.href = waUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Tap here to send your booking.";
      status.append(link);
      form.appendChild(status);
    });
  };
})();
