# 📧 Email Setup Guide - CV Generator Pro

Saat ini aplikasi menggunakan **mock email service** (simulasi). Untuk mengirim email sungguhan, ikuti panduan di bawah ini.

## 🎯 Current Status
- ✅ **Mock Emails**: Berfungsi (hanya log di console)
- ❌ **Real Emails**: Belum dikonfigurasi

## 🚀 Option 1: EmailJS (Recommended - Paling Mudah)

EmailJS memungkinkan mengirim email langsung dari frontend tanpa backend.

### Step 1: Install EmailJS
```bash
npm install @emailjs/browser
```

### Step 2: Setup EmailJS Account
1. Buka [EmailJS.com](https://www.emailjs.com/)
2. Daftar akun gratis
3. Buat Email Service (Gmail, Outlook, dll)
4. Buat Email Template
5. Dapatkan Service ID, Template ID, dan Public Key

### Step 3: Configure EmailJS Template
Buat template dengan variables berikut:
```
To: {{to_email}}
Subject: {{subject}}
From: {{from_name}}
Reply-To: {{reply_to}}

Message:
{{message}}
```

### Step 4: Update Configuration
Edit `src/services/emailService.js`:
```javascript
this.emailJSConfig = {
  serviceId: 'service_xxxxxxx', // Your EmailJS service ID
  templateId: 'template_xxxxxxx', // Your EmailJS template ID
  publicKey: 'xxxxxxxxxxxxxxx' // Your EmailJS public key
};
this.useRealEmail = true; // Enable real emails
```

### Step 5: Test
1. Update profile atau change password
2. Email akan terkirim ke alamat yang terdaftar

---

## 🛠️ Option 2: Backend Integration (Advanced)

Untuk production yang lebih robust, gunakan backend service.

### Services yang Direkomendasikan:
- **SendGrid**: Enterprise-grade email service
- **Mailgun**: Developer-friendly email API
- **AWS SES**: Amazon Simple Email Service
- **Nodemailer**: Node.js email library

### Implementation Steps:
1. Buat backend API endpoint untuk email
2. Integrate dengan email service provider
3. Update `emailService.js` untuk call backend API
4. Handle authentication dan rate limiting

---

## 🔧 Current Mock Implementation

Saat ini aplikasi menggunakan mock implementation yang:

### ✅ Yang Berfungsi:
- Log email details ke console
- Simpan notification ke Firebase
- Show success/error messages
- Template system lengkap
- Error handling

### ❌ Yang Tidak Berfungsi:
- Email tidak benar-benar terkirim
- Tidak ada delivery confirmation
- Tidak ada bounce handling

---

## 🧪 Testing Current Implementation

### Test Mock Emails:
1. Buka Profile → Preferences
2. Enable "Email Notifications"
3. Update profile atau change password
4. Check browser console untuk email logs

### Console Output Example:
```
📧 Mock email sent: {
  to: "user@example.com",
  subject: "Profile Updated Successfully",
  template: "profile-updated",
  messageId: "msg_1703123456789_abc123",
  note: "This is a simulation - no real email was sent"
}
```

---

## 🎨 Email Templates Available

Aplikasi sudah memiliki template untuk:

1. **Profile Updated** (`profile-updated`)
   - Trigger: Saat user update profile
   - Content: Konfirmasi profile berhasil diupdate

2. **Password Changed** (`password-changed`)
   - Trigger: Saat user change password
   - Content: Security notification + tips

3. **CV Created** (`cv-created`)
   - Trigger: Saat user buat CV baru
   - Content: Congratulations + next steps

4. **CV Shared** (`cv-shared`)
   - Trigger: Saat user share CV
   - Content: Share confirmation + tracking info

5. **Test Email** (`test-email`)
   - Trigger: Manual test
   - Content: Email functionality test

---

## 🔐 Security Considerations

### For EmailJS:
- ✅ Public key aman untuk frontend
- ✅ Rate limiting built-in
- ✅ Template validation
- ⚠️ Limited customization

### For Backend Integration:
- ✅ Full control over email content
- ✅ Advanced security features
- ✅ Better error handling
- ⚠️ Requires backend development

---

## 📊 Email Analytics

Setelah setup real emails, Anda bisa track:
- Email delivery rates
- Open rates (jika supported)
- Click rates
- Bounce rates
- User engagement

---

## 🚨 Troubleshooting

### Common Issues:

1. **EmailJS not working**
   - Check service ID, template ID, public key
   - Verify template variables match
   - Check browser console for errors

2. **Emails going to spam**
   - Setup SPF, DKIM, DMARC records
   - Use verified sender domain
   - Avoid spam trigger words

3. **Rate limiting**
   - EmailJS free plan: 200 emails/month
   - Implement user-side rate limiting
   - Consider paid plans for higher volume

---

## 💡 Next Steps

1. **Immediate**: Setup EmailJS untuk testing
2. **Short-term**: Implement email preferences
3. **Long-term**: Backend integration untuk production

---

## 📞 Support

Jika ada pertanyaan tentang email setup:
1. Check EmailJS documentation
2. Test dengan email pribadi dulu
3. Monitor browser console untuk errors
4. Verify Firebase rules untuk notification logging

---

**Made with ❤️ by Fatih**
