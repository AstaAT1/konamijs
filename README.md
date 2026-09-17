# eFootball Recovery Form - EmailJS V3

This version sends recovery requests to your email through EmailJS.

## 1. Create / configure EmailJS

In your EmailJS dashboard:

1. Add an Email Service.
2. Create an Email Template.
3. Get your Public Key from Account settings.

## 2. Template variables

Use these variables in the EmailJS template:

```text
{{fullName}}
{{accountName}}
{{email}}
{{phone}}
{{country}}
{{problem}}
{{submittedAt}}
```

Suggested email subject:

```text
eFootball Recovery Request - {{accountName}}
```

Suggested email body:

```text
New eFootball recovery request

Full name: {{fullName}}
Account name: {{accountName}}
Email: {{email}}
Phone: {{phone}}
Country / Region: {{country}}
Submitted at: {{submittedAt}}

Problem:
{{problem}}
```

Set your own support email in EmailJS as the template recipient.

Optional:
Set Reply-To to:

```text
{{email}}
```

## 3. Put your IDs into the project

Open:

```text
emailjs-config.js
```

Replace:

```text
YOUR_PUBLIC_KEY
YOUR_SERVICE_ID
YOUR_TEMPLATE_ID
```

with the real values from your EmailJS account.

Only use the EmailJS Public Key in frontend code. Never add private keys, email passwords, or SMTP passwords.

## 4. Test locally

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Fill the form and submit it.

## 5. Deploy

Commit the changed files and push them, then redeploy on Netlify.

Example:

```bash
git add .
git commit -m "add EmailJS form delivery"
git push
```

## Security

This form intentionally does not request passwords, 2FA codes, recovery codes, or full payment-card details.

For a public production form, consider domain restrictions and CAPTCHA/rate-limit controls.
