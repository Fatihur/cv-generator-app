import jsPDF from 'jspdf';

class ExportService {
  // Export CV to PDF (Text-based, not image)
  async exportToPDF(cvData, filename = 'CV') {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 6;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text, fontSize = 10, isBold = false, isTitle = false) => {
        if (!text) return;

        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

        const maxWidth = pageWidth - (margin * 2);
        const lines = pdf.splitTextToSize(text, maxWidth);

        // Check if we need a new page
        if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        if (isTitle) {
          yPosition += 5; // Extra space before titles
        }

        lines.forEach(line => {
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        if (isTitle) {
          yPosition += 3; // Extra space after titles
        }
      };

      // Helper function to add a line separator
      const addSeparator = () => {
        yPosition += 3;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      };

      const { personal = {}, experience = [], education = [], skills = [] } = cvData;

      // Header - Personal Information
      if (personal.fullName) {
        addText(personal.fullName, 18, true, true);
      }

      // Contact Information
      const contactInfo = [];
      if (personal.email) contactInfo.push(`Email: ${personal.email}`);
      if (personal.phone) contactInfo.push(`Phone: ${personal.phone}`);
      if (personal.location) contactInfo.push(`Location: ${personal.location}`);
      if (personal.website) contactInfo.push(`Website: ${personal.website}`);

      if (contactInfo.length > 0) {
        addText(contactInfo.join(' | '), 10);
        yPosition += 5;
      }

      // Professional Summary
      if (personal.summary) {
        addSeparator();
        addText('PROFESSIONAL SUMMARY', 14, true, true);
        addText(personal.summary, 10);
      }

      // Work Experience
      if (experience.length > 0) {
        addSeparator();
        addText('WORK EXPERIENCE', 14, true, true);

        experience.forEach((exp, index) => {
          if (index > 0) yPosition += 5; // Space between experiences

          // Position and Company
          const positionText = exp.position || 'Position Title';
          const companyText = exp.company || 'Company Name';
          addText(`${positionText} at ${companyText}`, 12, true);

          // Date Range
          const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
          const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
          if (startDate || endDate) {
            addText(`${startDate} - ${endDate}`, 10);
          }

          // Description
          if (exp.description) {
            addText(exp.description, 10);
          }
        });
      }

      // Education
      if (education.length > 0) {
        addSeparator();
        addText('EDUCATION', 14, true, true);

        education.forEach((edu, index) => {
          if (index > 0) yPosition += 3;

          // Degree and Field
          let degreeText = edu.degree || 'Degree';
          if (edu.field) degreeText += ` in ${edu.field}`;
          addText(degreeText, 12, true);

          // Institution
          if (edu.institution) {
            addText(edu.institution, 10);
          }

          // Graduation Year
          if (edu.graduationYear) {
            addText(`Graduated: ${edu.graduationYear}`, 10);
          }
        });
      }

      // Skills
      if (skills.length > 0) {
        addSeparator();
        addText('SKILLS', 14, true, true);

        const skillsText = skills.map(skill => {
          const skillName = skill.name || 'Skill';
          const skillLevel = skill.level || 'Intermediate';
          return `${skillName} (${skillLevel})`;
        }).join(', ');

        addText(skillsText, 10);
      }

      // Save the PDF
      pdf.save(`${filename}.pdf`);

      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }

  // Generate HTML content for CV
  generateCVHTML(cvData) {
    const { personal = {}, experience = [], education = [], skills = [] } = cvData;

    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #333;">
            ${personal.fullName || 'Your Name'}
          </h1>
          <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; color: #666; font-size: 14px;">
            ${personal.email ? `<span>📧 ${personal.email}</span>` : ''}
            ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
            ${personal.location ? `<span>📍 ${personal.location}</span>` : ''}
            ${personal.website ? `<span>🌐 ${personal.website}</span>` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${personal.summary ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">
              Professional Summary
            </h2>
            <p style="margin: 0; line-height: 1.6; color: #555;">
              ${personal.summary}
            </p>
          </div>
        ` : ''}

        <!-- Work Experience -->
        ${experience.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">
              Work Experience
            </h2>
            ${experience.map(exp => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                  <div>
                    <h3 style="margin: 0; font-size: 16px; color: #333;">
                      ${exp.position || 'Position Title'}
                    </h3>
                    <p style="margin: 2px 0; font-weight: bold; color: #666;">
                      ${exp.company || 'Company Name'}
                    </p>
                  </div>
                  <div style="font-size: 12px; color: #888;">
                    ${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </div>
                </div>
                ${exp.description ? `
                  <div style="color: #555; line-height: 1.5; margin-top: 8px;">
                    ${exp.description.split('\n').map(line => `<p style="margin: 3px 0;">${line}</p>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">
              Education
            </h2>
            ${education.map(edu => `
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div>
                  <h3 style="margin: 0; font-size: 16px; color: #333;">
                    ${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <p style="margin: 2px 0; color: #666;">
                    ${edu.institution || 'Institution Name'}
                  </p>
                </div>
                <div style="font-size: 12px; color: #888;">
                  ${edu.graduationYear || this.formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">
              Skills
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              ${skills.map(skill => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                  <span style="color: #333; font-weight: 500;">
                    ${skill.name || 'Skill Name'}
                  </span>
                  <span style="font-size: 11px; color: #666; background: #f0f0f0; padding: 2px 8px; border-radius: 10px;">
                    ${skill.level || 'Intermediate'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Format date range
  formatDateRange(startDate, endDate, isCurrent) {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return start && end ? `${start} - ${end}` : '';
  }

  // Generate shareable link
  generateShareableLink(cvData) {
    try {
      // Encode CV data
      const encodedData = btoa(JSON.stringify(cvData));
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/shared-cv/${encodedData}`;

      return shareUrl;
    } catch (error) {
      console.error('Error generating shareable link:', error);
      throw new Error('Failed to generate shareable link.');
    }
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  }

  // Share via Web Share API (if supported)
  async shareViaWebAPI(cvData) {
    if (navigator.share) {
      try {
        const shareUrl = this.generateShareableLink(cvData);
        await navigator.share({
          title: `${cvData.personal?.fullName || 'CV'} - Professional Resume`,
          text: 'Check out my professional CV',
          url: shareUrl
        });
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
        return false;
      }
    }
    return false;
  }

  // Share via email
  shareViaEmail(cvData) {
    const subject = encodeURIComponent(`${cvData.personal?.fullName || 'Professional'} CV`);
    const shareUrl = this.generateShareableLink(cvData);
    const body = encodeURIComponent(`Hi,\n\nI'd like to share my professional CV with you.\n\nYou can view it here: ${shareUrl}\n\nBest regards,\n${cvData.personal?.fullName || 'Professional'}`);

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  }

  // Share via WhatsApp
  shareViaWhatsApp(cvData) {
    const shareUrl = this.generateShareableLink(cvData);
    const message = encodeURIComponent(`Hi! I'd like to share my professional CV with you: ${shareUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  // Share via LinkedIn
  shareViaLinkedIn(cvData) {
    const shareUrl = this.generateShareableLink(cvData);
    const title = encodeURIComponent(`${cvData.personal?.fullName || 'Professional'} CV`);
    const summary = encodeURIComponent('Check out my professional CV');

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank');
  }
}

export default new ExportService();
