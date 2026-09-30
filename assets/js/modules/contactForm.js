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
  /* User-facing strings come from assets/js/i18n.js, which picks its dictionary
     off <html lang>, so the Arabic build's errors and WhatsApp message are
     Arabic without a second copy of this module. Guarded so the form still
     validates if that file is absent. */
  function tr() {
    return window.ZH.t ? window.ZH.t.apply(null, arguments) : arguments[0];
  }

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
  // Coded value -> string key, resolved through tr() at submit time so the
  // studio reads the booking in the language the visitor filled it in.
  var PACKAGE_KEYS = { "12-reels": "wa.package12", "24-reels": "wa.package24" };
  var TIMESLOT_KEYS = {
    "9-12": "wa.slot9",
    "12-15": "wa.slot12",
    "15-18": "wa.slot15",
    "18-21": "wa.slot18",
  };
  var DAY_KEYS = {
    mon: "wa.mon", tue: "wa.tue", wed: "wa.wed", thu: "wa.thu",
    fri: "wa.fri", sat: "wa.sat", sun: "wa.sun",
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
        showError(fields.name, tr("form.nameRequired"));
        firstBad = firstBad || fields.name;
      } else if (hasAngle(data.name) || !NAME_RE.test(data.name)) {
        showError(fields.name, tr("form.nameInvalid"));
        firstBad = firstBad || fields.name;
      }

      // Email — normalised to lower case and format-checked.
      data.email = clean(fields.email.value, LIMITS.email, false).toLowerCase();
      if (!data.email) {
        showError(fields.email, tr("form.emailRequired"));
        firstBad = firstBad || fields.email;
      } else if (!EMAIL_RE.test(data.email)) {
        showError(fields.email, tr("form.emailInvalid"));
        firstBad = firstBad || fields.email;
      }

      // Handle — optional. Letters/numbers/dot/underscore, single leading @.
      data.handle = clean(fields.handle.value, LIMITS.handle, false);
      if (data.handle) {
        if (!HANDLE_RE.test(data.handle)) {
          showError(fields.handle, tr("form.handleInvalid"));
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
        showError(fields.message, tr("form.messageRequired"));
        firstBad = firstBad || fields.message;
      } else if (hasAngle(data.message)) {
        showError(fields.message, tr("form.messageAngle"));
        firstBad = firstBad || fields.message;
      }

      if (firstBad) {
        firstBad.focus();
        return;
      }

      // Valid + normalised. Build a plain-text summary and hand off to WhatsApp.
      // `data` is already trimmed / length-capped / control-stripped and angle
      // brackets are rejected, so it's safe to drop straight into the message.
      var lines = [
        tr("wa.title"),
        "",
        tr("wa.name") + ": " + data.name,
        tr("wa.email") + ": " + data.email,
      ];
      if (data.handle) lines.push(tr("wa.handle") + ": " + data.handle);
      lines.push(
        tr("wa.package") + ": " +
        (PACKAGE_KEYS[data.package] ? tr(PACKAGE_KEYS[data.package]) : tr("wa.anyPackage"))
      );
      lines.push(
        tr("wa.time") + ": " +
        (TIMESLOT_KEYS[data.timeslot] ? tr(TIMESLOT_KEYS[data.timeslot]) : tr("wa.anyTime"))
      );
      lines.push(
        tr("wa.days") + ": " +
        (data.days.length
          ? data.days
            .map(function (d) {
              return tr(DAY_KEYS[d]);
            })
            .join(", ")
          : tr("wa.anyDay"))
      );
      lines.push("", data.message);

      var waUrl =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(waUrl, "_blank", "noopener");

      var status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      status.append(tr("form.opening"));
      var link = document.createElement("a");
      link.href = waUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = tr("form.openingLink");
      status.append(link);
      form.appendChild(status);
    });
  };
})();
