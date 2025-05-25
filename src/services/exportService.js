import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class ExportService {
  // Export CV to PDF
  async exportToPDF(cvData, filename = 'CV') {
    try {
      // Create a temporary div to render CV content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.minHeight = '297mm'; // A4 height
      tempDiv.style.padding = '20mm';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.5';
      tempDiv.style.color = '#333';

      // Generate HTML content for CV
      tempDiv.innerHTML = this.generateCVHTML(cvData);
      
      // Add to document
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
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
