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
   and strictly format-checks name / phone / handle, and allowlists every
   multiple-choice answer. The free-text
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

  var LIMITS = { name: 80, phone: 32, handle: 30, message: 2000 };

  // Phone, not email: the booking is handed off to WhatsApp, so a number is
  // what the studio can actually act on. Punctuation people really type is
  // allowed (+, spaces, dashes, brackets); the digit COUNT is what is checked,
  // against E.164's 15-digit ceiling.
  var PHONE_CHARS_RE = /^[+()\d][\d\s().-]*$/;
  var PHONE_MIN_DIGITS = 7;
  var PHONE_MAX_DIGITS = 15;

  // Arabic-Indic (U+0660..0669) and Extended Arabic-Indic (U+06F0..06F9) digits
  // are what an Arabic keyboard produces, and \d does not match them. Fold them
  // to ASCII first, so a number typed in Arabic validates and reaches WhatsApp
  // in a form the studio can dial.
  function foldDigits(str) {
    // Built from a RegExp string so this source stays pure ASCII, the same way
    // the control-char strippers below are.
    return str.replace(new RegExp("[\u0660-\u0669\u06F0-\u06F9]", "g"), function (ch) {
      var code = ch.charCodeAt(0);
      return String((code >= 0x06F0 ? code - 0x06F0 : code - 0x0660));
    });
  }

  var HANDLE_RE = /^@?[A-Za-z0-9._]{1,30}$/;
  // Letters from any language (\p{L}) + combining marks, space, dot, apostrophe, hyphen.
  var NAME_RE = /^[\p{L}\p{M} .'\-]{1,80}$/u;
  var ALLOWED_TIMESLOTS = ["", "9-12", "12-15", "15-18", "18-21"];
  var ALLOWED_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  // WhatsApp handoff. On a valid submit we don't POST anywhere — we open a
  // wa.me link with the normalised details pre-filled so the visitor just hits
  // send. REPLACE with the studio's real number in full international format,
  // digits only (no +, spaces or dashes). e.g. Egypt 010 1234 5678 -> "201012345678".
  var WHATSAPP_NUMBER = "201090842990";

  // Human labels for the coded radio / checkbox values, used in the message.
  // Coded value -> string key, resolved through tr() at submit time so the
  // studio reads the booking in the language the visitor filled it in.
  // Each map doubles as the allowlist for its question: a value that is not a
  // key here is treated as unanswered.
  var COACHING_KEYS = {
    online: "wa.coachOnline", "in-person": "wa.coachInPerson", both: "wa.coachBoth",
  };
  var REVENUE_KEYS = {
    "5-10": "wa.rev5", "10-20": "wa.rev10", "20-30": "wa.rev20", "30+": "wa.rev30",
    private: "wa.revPrivate",
  };
  var START_KEYS = { now: "wa.startNow", "30-days": "wa.start30", later: "wa.startLater" };
  var PACKAGE_KEYS = {
    "12-reels": "wa.package12", "24-reels": "wa.package24", unsure: "wa.anyPackage",
  };
  var BUDGET_KEYS = {
    "under-5": "wa.budget0", "5-10": "wa.budget5", "10-15": "wa.budget10", "15+": "wa.budget15",
  };
  var DECISION_KEYS = { solo: "wa.decSolo", partner: "wa.decPartner" };
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

  function clearField(fw) {
    fw.classList.remove("has-error");
    var msg = fw.querySelector(".form-error");
    if (msg) msg.remove();
    fw.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  }

  // Clears errors inside `scope` — the whole form, or just the step being left.
  function clearFeedback(scope) {
    scope.querySelectorAll(".form-field.has-error").forEach(clearField);
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

  function checkedValue(form, name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  // "Label: value" for a coded answer, through its key map.
  function line(labelKey, map, value, fallbackKey) {
    return tr(labelKey) + ": " + (map[value] ? tr(map[value]) : tr(fallbackKey));
  }

  window.ZH.initContactForm = function () {
    var form = document.querySelector("form[data-unwired]");
    if (!form) return;

    form.setAttribute("novalidate", "");

    var fields = {
      name: form.querySelector('[name="name"]'),
      phone: form.querySelector('[name="phone"]'),
      handle: form.querySelector('[name="handle"]'),
      days: form.querySelectorAll('[name="days"]'),
      message: form.querySelector('[name="message"]'),
    };

    // A required radio question: whitelisted value, or an error on its group.
    function pick(data, name, map) {
      var value = checkedValue(form, name);
      data[name] = map[value] ? value : "";
      if (data[name]) return null;
      var first = form.querySelector('input[name="' + name + '"]');
      if (first) showError(first, tr("form.pickOne"));
      return first;
    }

    /* One validator per step, in step order. Each writes its normalised values
       into `data` and returns the first bad control (or null). Submit runs all
       four; Continue runs only the current one. */
    var validators = [
      // 1 — About you
      function (data) {
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

        // Phone — Arabic digits folded to ASCII, then shape- and length-checked.
        data.phone = foldDigits(clean(fields.phone.value, LIMITS.phone, false));
        var phoneDigits = data.phone.replace(/\D/g, "");
        if (!data.phone) {
          showError(fields.phone, tr("form.phoneRequired"));
          firstBad = firstBad || fields.phone;
        } else if (
          !PHONE_CHARS_RE.test(data.phone) ||
          phoneDigits.length < PHONE_MIN_DIGITS ||
          phoneDigits.length > PHONE_MAX_DIGITS
        ) {
          showError(fields.phone, tr("form.phoneInvalid"));
          firstBad = firstBad || fields.phone;
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
        return firstBad;
      },

      // 2 — Your coaching
      function (data) {
        var a = pick(data, "coaching", COACHING_KEYS);
        var b = pick(data, "revenue", REVENUE_KEYS);
        var c = pick(data, "start", START_KEYS);
        return a || b || c;
      },

      // 3 — The plan
      function (data) {
        var a = pick(data, "package", PACKAGE_KEYS);
        var b = pick(data, "budget", BUDGET_KEYS);
        var c = pick(data, "decision", DECISION_KEYS);
        return a || b || c;
      },

      // 4 — The call
      function (data) {
        // Preferred call time — must be one of the known slots, else "any".
        var slot = checkedValue(form, "timeslot");
        data.timeslot = ALLOWED_TIMESLOTS.indexOf(slot) > -1 ? slot : "";

        // Preferred days — collect only checked, whitelisted values, in week order.
        var checkedDays = {};
        Array.prototype.forEach.call(fields.days, function (cb) {
          if (cb.checked && ALLOWED_DAYS.indexOf(cb.value) > -1) checkedDays[cb.value] = true;
        });
        data.days = ALLOWED_DAYS.filter(function (d) {
          return checkedDays[d];
        });

        // Message — optional free text; keeps punctuation but no HTML tags /
        // control chars.
        data.message = clean(fields.message.value, LIMITS.message, true);
        if (data.message && hasAngle(data.message)) {
          showError(fields.message, tr("form.messageAngle"));
          return fields.message;
        }
        return null;
      },
    ];

    /* --- steps ------------------------------------------------------------
       Built here, not in the markup, so a no-JS visitor still gets one plain
       stacked form. */
    var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
    var nav = form.querySelector("[data-form-nav]");
    var submitBtn = form.querySelector('button[type="submit"]');
    var lastOnly = form.querySelectorAll("[data-last-only]");
    var current = 0;
    var stepped = steps.length > 1 && nav && submitBtn;
    var progressLabel, progressFill, backBtn, nextBtn;

    // An all-choice step (no typing) moves on by itself once every required
    // question in it has an answer, the way a quiz does.
    function isAllChoice(step) {
      return !step.querySelector('input[type="text"], input[type="tel"], textarea');
    }

    function isComplete(step) {
      return Array.prototype.every.call(step.querySelectorAll("[data-required]"), function (g) {
        return !!g.querySelector("input:checked");
      });
    }

    function show(index, moveFocus) {
      current = index;
      var last = current === steps.length - 1;
      steps.forEach(function (step, i) {
        step.hidden = i !== current;
      });
      backBtn.hidden = current === 0;
      nextBtn.hidden = last;
      submitBtn.hidden = !last;
      Array.prototype.forEach.call(lastOnly, function (el) {
        el.hidden = !last;
      });
      progressLabel.textContent = tr("form.step", current + 1, steps.length);
      progressFill.style.setProperty("--progress", (current + 1) / steps.length);

      if (!moveFocus) return;
      // Bring the top of the form back into view if the step change left it
      // above the fold (a long step on a phone), then hand focus to the step.
      var top = form.getBoundingClientRect().top;
      if (top < 0) {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
      steps[current].focus({ preventScroll: true });
    }

    function next() {
      var step = steps[current];
      clearFeedback(step);
      var bad = validators[current]({});
      if (bad) {
        bad.focus();
        return;
      }
      if (current < steps.length - 1) show(current + 1, true);
    }

    if (stepped) {
      form.classList.add("is-stepped");

      var progress = document.createElement("div");
      progress.className = "form-progress";
      progress.innerHTML =
        '<p class="form-progress__label" aria-live="polite"></p>' +
        '<div class="form-progress__track" aria-hidden="true"><span class="form-progress__fill"></span></div>';
      form.insertBefore(progress, form.firstChild);
      progressLabel = progress.querySelector(".form-progress__label");
      progressFill = progress.querySelector(".form-progress__fill");

      backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn--outline form-nav__back";
      backBtn.textContent = tr("form.back");
      backBtn.addEventListener("click", function () {
        clearFeedback(steps[current]);
        show(current - 1, true);
      });

      nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "btn btn--primary";
      nextBtn.textContent = tr("form.continue");
      nextBtn.addEventListener("click", next);

      nav.insertBefore(backBtn, nav.firstChild);
      nav.insertBefore(nextBtn, submitBtn);

      steps.forEach(function (step) {
        step.setAttribute("tabindex", "-1");
      });

      form.addEventListener("change", function (e) {
        var input = e.target;
        if (input.type !== "radio") return;
        // Answering a question clears its own error straight away.
        var group = input.closest(".form-field");
        if (group && group.classList.contains("has-error")) clearField(group);
        var step = steps[current];
        if (step.contains(input) && isAllChoice(step) && isComplete(step)) {
          // A beat, so the tap visibly lands before the step slides away.
          setTimeout(function () {
            if (steps[current] === step) next();
          }, 250);
        }
      });

      show(0, false);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Enter in a text field mid-way through is a Continue, not a send.
      if (stepped && current < steps.length - 1) {
        next();
        return;
      }

      clearFeedback(form);
      var oldStatus = form.querySelector(".form-status");
      if (oldStatus) oldStatus.remove();

      var data = {};
      var badStep = -1;
      var firstBad = null;
      validators.forEach(function (validate, i) {
        var bad = validate(data);
        if (bad && !firstBad) {
          firstBad = bad;
          badStep = i;
        }
      });

      if (firstBad) {
        if (stepped) show(badStep, false);
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
        tr("wa.phone") + ": " + data.phone,
      ];
      if (data.handle) lines.push(tr("wa.handle") + ": " + data.handle);
      lines.push(
        line("wa.coaching", COACHING_KEYS, data.coaching),
        line("wa.revenue", REVENUE_KEYS, data.revenue),
        line("wa.start", START_KEYS, data.start),
        line("wa.package", PACKAGE_KEYS, data.package, "wa.anyPackage"),
        line("wa.budget", BUDGET_KEYS, data.budget),
        line("wa.decision", DECISION_KEYS, data.decision),
        line("wa.time", TIMESLOT_KEYS, data.timeslot, "wa.anyTime"),
        tr("wa.days") + ": " +
          (data.days.length
            ? data.days
              .map(function (d) {
                return tr(DAY_KEYS[d]);
              })
              .join(", ")
            : tr("wa.anyDay"))
      );
      if (data.message) lines.push("", data.message);

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
