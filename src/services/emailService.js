// Email Service - Real implementation with EmailJS
// To enable real emails, install EmailJS: npm install @emailjs/browser
import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    // EmailJS Configuration
    this.emailJSConfig = {
      serviceId: 'service_ctpb75g', // Replace with your EmailJS service ID
      templateId: 'template_2jvu2bu', // Replace with your EmailJS template ID
      publicKey: '5tqswFOrycJTy_tZq' // Replace with your EmailJS public key
    };
    this.fromEmail = 'fatihur17@gmail.com';
    this.fromName = 'CV Generator Pro';
    this.useRealEmail = true; // Set to true to enable real emails
  }

  // Convert HTML to plain text for EmailJS
  convertHtmlToText(html) {
    if (!html) return '';

    // Remove HTML tags and decode entities
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace
  }

  // Create simple message for EmailJS (plain text format)
  createSimpleMessage(emailData) {
    const template = emailData.template;
    const cvName = emailData.cvName || 'Untitled CV';

    console.log('📧 Creating message for template:', template, 'CV:', cvName);

    switch (template) {
      case 'profile-updated':
        return `Hi there!

Your profile has been updated successfully on CV Generator Pro.

✅ Profile Update Confirmed
Your changes are now live and will be reflected in your CVs.

What's Next?
• Create a new CV with your updated information
• Update your existing CVs
• Share your professional profile

If you didn't make these changes, please contact our support team immediately.

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro`;

      case 'password-changed':
        return `Hi there!

Your password has been changed successfully on CV Generator Pro.

🔒 Password Change Confirmed
Your account is now secured with your new password.

⚠️ Security Notice:
If you didn't make this change, please contact our support team immediately.

Security Tips:
• Use a strong, unique password
• Enable two-factor authentication
• Don't share your password with anyone
• Log out from public computers

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro`;

      case 'welcome':
        return `Welcome to CV Generator Pro! 🎉

Hi ${emailData.userName || 'there'}!

Thank you for joining CV Generator Pro - your journey to creating professional CVs starts now!

🚀 What You Can Do:
• Create unlimited professional CVs
• Use AI-powered content suggestions
• Export to PDF with beautiful templates
• Share your CVs with potential employers
• Track CV views and engagement

📋 Getting Started:
1. Complete your profile information
2. Create your first CV using our guided builder
3. Use AI assistance to improve your content
4. Export and share your professional CV

💡 Pro Tips:
• Keep your CV updated with latest experiences
• Customize CVs for different job applications
• Use our AI tools to enhance your descriptions
• Enable email notifications to stay informed

Need help? Our support team is here to assist you at any time.

Welcome aboard and best of luck with your career journey!

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro
Welcome sent at: ${new Date().toLocaleString()}`;

      case 'cv-created':
        return `Hi there!

Great news! Your CV has been created successfully on CV Generator Pro.

📄 CV Created: "${cvName}"
✅ Status: Ready to use

What's Next?
• Preview your CV to review the content
• Export to PDF for job applications
• Share your CV with potential employers
• Create additional versions for different roles

Your CV is now saved and ready to help you land your dream job!

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro
Created at: ${new Date().toLocaleString()}`;

      case 'cv-updated':
        return `Hi there!

Your CV has been updated successfully on CV Generator Pro.

📄 CV Updated: "${cvName}"
✅ Status: Changes saved

Recent Changes:
• CV content has been modified
• All updates are now live
• Ready for export and sharing

Your updated CV is now available in your dashboard.

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro
Updated at: ${new Date().toLocaleString()}`;

      case 'cv-deleted':
        return `Hi there!

A CV has been deleted from your CV Generator Pro account.

🗑️ CV Deleted: "${cvName}"
✅ Status: Permanently removed

This action cannot be undone. If this was a mistake, you'll need to recreate the CV.

Security Note:
If you didn't delete this CV, please contact our support team immediately and consider changing your password.

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro
Deleted at: ${new Date().toLocaleString()}`;

      case 'cv-shared':
        return `Hi there!

Your CV has been shared successfully on CV Generator Pro.

📤 CV Shared: "${cvName}"
🔗 Share Link: ${emailData.shareUrl || 'Link generated'}
⏰ Expires: ${emailData.expiryDate || 'Never'}

Sharing Details:
• Your CV is now accessible via the share link
• Recipients can view but not edit your CV
• You can manage shared links from your dashboard

Track who views your CV and manage your shared links anytime.

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro
Shared at: ${new Date().toLocaleString()}`;

      case 'test-email':
        return `Hi there!

This is a test email to verify that your email notifications are working correctly.

✅ Test Results:
• Email delivery: Working
• Template rendering: Working
• Notification system: Working

You can now be confident that you'll receive important notifications about your CV Generator account.

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih
© 2024 CV Generator Pro
Test sent at: ${new Date().toLocaleString()}`;

      default:
        return this.convertHtmlToText(emailData.html || emailData.message || 'No content available.');
    }
  }

  // Email templates
  getEmailTemplates() {
    return {
      'profile-updated': {
        subject: 'Profile Updated Successfully',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CV Generator Pro</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Profile Updated Successfully!</h2>
              <p style="color: #666; line-height: 1.6;">
                Your profile has been updated successfully. Your changes are now live and will be reflected in your CVs.
              </p>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
                <ul style="color: #666;">
                  <li>Create a new CV with your updated information</li>
                  <li>Update your existing CVs</li>
                  <li>Share your professional profile</li>
                </ul>
              </div>
              <p style="color: #666;">
                If you didn't make these changes, please contact our support team immediately.
              </p>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>© 2024 CV Generator Pro. Made with ❤️ by Fatih</p>
            </div>
          </div>
        `
      },
      'password-changed': {
        subject: 'Password Changed Successfully - CV Generator Pro',
        html: `Password Changed Successfully! Your account is now secured with your new password.`
      },
      'welcome': {
        subject: 'Welcome to CV Generator Pro! 🎉',
        html: `Welcome to CV Generator Pro! Thank you for joining us. Your journey to creating professional CVs starts now!`
      },
      'cv-created': {
        subject: 'CV Created Successfully - CV Generator Pro',
        html: `CV Created Successfully! Your new CV "${emailData.cvName || 'Untitled CV'}" has been created and is ready to use.`
      },
      'cv-updated': {
        subject: 'CV Updated Successfully - CV Generator Pro',
        html: `CV Updated Successfully! Your CV "${emailData.cvName || 'Untitled CV'}" has been updated with your latest changes.`
      },
      'cv-deleted': {
        subject: 'CV Deleted - CV Generator Pro',
        html: `CV Deleted. Your CV "${emailData.cvName || 'Untitled CV'}" has been permanently removed from your account.`
      },
      'cv-shared': {
        subject: 'CV Shared Successfully - CV Generator Pro',
        html: `CV Shared Successfully! Your CV "${emailData.cvName || 'Untitled CV'}" has been shared and is now accessible via the provided link.`
      },
      'test-email': {
        subject: 'Test Email from CV Generator',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CV Generator Pro</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Email Test Successful! ✅</h2>
              <p style="color: #666; line-height: 1.6;">
                This is a test email to verify that your email notifications are working correctly.
              </p>
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #155724; margin-top: 0;">Test Results:</h3>
                <ul style="color: #155724;">
                  <li>✅ Email delivery: Working</li>
                  <li>✅ Template rendering: Working</li>
                  <li>✅ Styling: Working</li>
                  <li>✅ Links: Working</li>
                </ul>
              </div>
              <p style="color: #666;">
                You can now be confident that you'll receive important notifications about your CV Generator account.
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="#" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Manage Notification Settings
                </a>
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>© 2024 CV Generator Pro. Made with ❤️ by Fatih</p>
              <p style="margin: 5px 0;">Test sent at: {{timestamp}}</p>
            </div>
          </div>
        `
      }
    };
  }

  // Send email (real or mock implementation)
  async sendEmail(emailData) {
    try {
      // Validate email data
      if (!emailData || !emailData.to || !emailData.subject) {
        throw new Error('Invalid email data: missing required fields');
      }

      if (this.useRealEmail) {
        return await this.sendRealEmail(emailData);
      } else {
        return await this.sendMockEmail(emailData);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  }

  // Send real email using EmailJS
  async sendRealEmail(emailData) {
    try {
      // Create simple text message for EmailJS
      const simpleMessage = this.createSimpleMessage(emailData);

      console.log('📧 Preparing EmailJS send:', {
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        messageLength: simpleMessage.length
      });

      const templateParams = {
        to_email: emailData.to,
        subject: emailData.subject,
        message: simpleMessage,
        from_name: this.fromName,
        reply_to: this.fromEmail,
        user_name: emailData.to.split('@')[0], // Extract name from email
        cv_name: emailData.cvName || 'Untitled CV'
      };

      const response = await emailjs.send(
        this.emailJSConfig.serviceId,
        this.emailJSConfig.templateId,
        templateParams,
        this.emailJSConfig.publicKey
      );

      console.log('📧 Real email sent:', {
        to: emailData.to,
        subject: emailData.subject,
        status: response.status,
        text: response.text
      });

      return {
        success: true,
        messageId: response.text,
        status: 'sent',
        timestamp: new Date().toISOString(),
        recipient: emailData.to,
        subject: emailData.subject,
        service: 'emailjs'
      };
    } catch (error) {
      console.error('EmailJS sending failed:', error);
      throw new Error('Failed to send real email: ' + error.message);
    }
  }

  // Send mock email (current implementation)
  async sendMockEmail(emailData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Mock API response
      const mockResponse = {
        success: true,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        status: 'sent',
        timestamp: new Date().toISOString(),
        recipient: emailData.to,
        subject: emailData.subject,
        service: 'mock'
      };

      console.log('📧 Mock email sent:', {
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        messageId: mockResponse.messageId,
        note: 'This is a simulation - no real email was sent'
      });

      return mockResponse;
    } catch (error) {
      throw new Error('Mock email failed: ' + error.message);
    }
  }

  // Send template email
  async sendTemplateEmail(to, templateName, variables = {}) {
    try {
      const templates = this.getEmailTemplates();
      const template = templates[templateName];

      if (!template) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      // Replace variables in template
      let html = template.html;
      let subject = template.subject;

      Object.keys(variables).forEach(key => {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, 'g'), variables[key]);
        subject = subject.replace(new RegExp(placeholder, 'g'), variables[key]);
      });

      // Add default variables
      html = html.replace(/{{timestamp}}/g, new Date().toLocaleString());
      html = html.replace(/{{shareDate}}/g, new Date().toLocaleDateString());
      html = html.replace(/{{expiryDate}}/g, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString());

      const emailData = {
        to,
        subject,
        html,
        template: templateName,
        from: {
          email: this.fromEmail,
          name: this.fromName
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Template email sending failed:', error);
      throw error;
    }
  }

  // Send bulk emails
  async sendBulkEmails(recipients, templateName, variables = {}) {
    try {
      const results = [];

      for (const recipient of recipients) {
        try {
          const result = await this.sendTemplateEmail(recipient, templateName, variables);
          results.push({ recipient, success: true, result });
        } catch (error) {
          results.push({ recipient, success: false, error: error.message });
        }

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return results;
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      throw error;
    }
  }

  // Validate email address
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get email statistics (mock)
  async getEmailStats(userId) {
    try {
      // Mock statistics
      return {
        totalSent: Math.floor(Math.random() * 100) + 10,
        delivered: Math.floor(Math.random() * 95) + 5,
        opened: Math.floor(Math.random() * 80) + 5,
        clicked: Math.floor(Math.random() * 30) + 2,
        bounced: Math.floor(Math.random() * 5),
        lastSent: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error('Failed to get email stats:', error);
      throw error;
    }
  }
}

export default new EmailService();
