const form = document.getElementById("recoveryForm");
const message = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");
const problem = document.getElementById("problem");
const problemCount = document.getElementById("problemCount");
const submittedAt = document.getElementById("submittedAt");

const fields = {
  fullName: document.getElementById("fullName"),
  accountName: document.getElementById("accountName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  country: document.getElementById("country"),
  problem
};

const errors = {
  fullName: document.getElementById("fullNameError"),
  accountName: document.getElementById("accountNameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
  country: document.getElementById("countryError"),
  problem: document.getElementById("problemError")
};

const forbiddenPatterns = [
  /password/i,
  /2fa/i,
  /two[-\s]?factor/i,
  /verification code/i,
  /recovery code/i,
  /cvv/i,
  /card number/i
];

function setError(fieldName, text = "") {
  errors[fieldName].textContent = text;
}

function clearErrors() {
  Object.keys(errors).forEach((key) => setError(key));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isEmailJSConfigured() {
  const cfg = window.EMAILJS_CONFIG;

  if (!cfg) return false;

  return (
    cfg.publicKey &&
    cfg.serviceId &&
    cfg.templateId &&
    !cfg.publicKey.startsWith("YOUR_") &&
    !cfg.serviceId.startsWith("YOUR_") &&
    !cfg.templateId.startsWith("YOUR_")
  );
}

function validateForm() {
  clearErrors();

  const values = {
    fullName: fields.fullName.value.trim(),
    accountName: fields.accountName.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    country: fields.country.value,
    problem: fields.problem.value.trim()
  };

  let valid = true;

  if (values.fullName.length < 2) {
    setError("fullName", "Please enter your full name.");
    valid = false;
  }

  if (values.accountName.length < 2) {
    setError("accountName", "Please enter the account name.");
    valid = false;
  }

  if (!isValidEmail(values.email)) {
    setError("email", "Please enter a valid email address.");
    valid = false;
  }

  if (!/^[+0-9][0-9\s().-]{6,29}$/.test(values.phone)) {
    setError("phone", "Please enter a valid phone number.");
    valid = false;
  }

  if (!values.country) {
    setError("country", "Please select your country / region.");
    valid = false;
  }

  if (values.problem.length < 10) {
    setError("problem", "Please provide more details about the issue.");
    valid = false;
  }

  if (forbiddenPatterns.some((pattern) => pattern.test(values.problem))) {
    setError(
      "problem",
      "Do not include passwords, authentication codes, recovery codes, or payment card details."
    );
    valid = false;
  }

  return { valid, values };
}

problem.addEventListener("input", () => {
  problemCount.textContent = `${problem.value.length} / 2000`;
});

if (isEmailJSConfigured() && typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: window.EMAILJS_CONFIG.publicKey,
    blockHeadless: true,
    limitRate: {
      id: "recovery-form",
      throttle: 10000
    }
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.className = "form-message";
  message.textContent = "";


  const { valid } = validateForm();

  if (!valid) {
    message.classList.add("error");
    message.textContent = "Please review the highlighted fields.";
    return;
  }

  if (!isEmailJSConfigured()) {
    message.classList.add("error");
    message.textContent = "Email service is not configured yet.";
    return;
  }

  if (typeof emailjs === "undefined") {
    message.classList.add("error");
    message.textContent = "Email service could not be loaded. Please try again.";
    return;
  }

  submittedAt.value = new Date().toISOString();

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

try {
  const response = await emailjs.sendForm(
    window.EMAILJS_CONFIG.serviceId,
    window.EMAILJS_CONFIG.templateId,
    form
  );

  console.log("FORM EMAIL SUCCESS:", response.status, response.text);

  form.reset();
  problemCount.textContent = "0 / 2000";
  clearErrors();

  message.className = "form-message success";
  message.textContent =
    "Your recovery request has been submitted successfully.";

} catch (error) {
  console.error("FORM EMAIL FAILED:", error);

  message.className = "form-message error";
  message.textContent =
    "We could not submit your request. Please try again.";
} finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});
