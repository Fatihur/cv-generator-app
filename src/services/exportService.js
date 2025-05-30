import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import shareService from './shareService';

class ExportService {
  // Export CV to PDF as image (high quality)
  async exportToPDFAsImage(cvData, filename = 'CV') {
    try {
      const sanitizedFilename = this.sanitizeFilename(filename);

      // Create a temporary container for the CV
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '794px'; // A4 width in pixels (210mm at 96dpi)
      container.style.minHeight = '1123px'; // A4 height in pixels (297mm at 96dpi)
      container.style.backgroundColor = 'white';
      container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
      container.style.boxSizing = 'border-box';
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.6';

      // Generate CV HTML with template styles
      const cvHTML = this.generateStyledCVHTML(cvData);
      container.innerHTML = cvHTML;

      // Add to document temporarily
      document.body.appendChild(container);

      try {
        // Convert to canvas with high quality
        const canvas = await html2canvas(container, {
          scale: 2, // Good balance between quality and file size
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: container.offsetWidth,
          height: container.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          logging: false,
          removeContainer: false
        });

        // Create PDF with exact A4 dimensions
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

        // Calculate proper scaling to fit content
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Convert mm to points (1mm = 2.834645669 points)
        const pageWidthPx = pageWidth * 2.834645669;
        const pageHeightPx = pageHeight * 2.834645669;

        // Calculate scale to fit content properly
        const scaleX = pageWidthPx / canvasWidth;
        const scaleY = pageHeightPx / canvasHeight;
        const scale = Math.min(scaleX, scaleY);

        // Calculate final dimensions
        const finalWidth = (canvasWidth * scale) / 2.834645669;
        const finalHeight = (canvasHeight * scale) / 2.834645669;

        // Center the content
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL('image/png', 1.0);

        // Add image to PDF with proper scaling
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        // Save PDF
        pdf.save(`${sanitizedFilename}.pdf`);

        return true;
      } finally {
        // Clean up
        document.body.removeChild(container);
      }
    } catch (error) {
      console.error('Error exporting PDF as image:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }

  // Export CV to PDF with multiple format options (text-based)
  async exportToPDF(cvData, filename = 'CV', format = 'standard') {
    try {
      // Sanitize filename - remove invalid characters and limit length
      const sanitizedFilename = this.sanitizeFilename(filename);
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

      const { personal = {}, experience = [], education = [], skills = [], achievements = [], certificates = [] } = cvData;

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

          // Description - vary by format
          if (exp.description) {
            if (format === 'compact') {
              // Compact: Only first 100 characters
              const shortDesc = exp.description.length > 100 ? exp.description.substring(0, 100) + '...' : exp.description;
              addText(shortDesc, 10);
            } else if (format === 'detailed') {
              // Detailed: Full description with bullet points
              addText(exp.description, 10);
            } else {
              // Standard: Full description
              addText(exp.description, 10);
            }
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

        if (format === 'compact') {
          // Compact: Only skill names
          const skillNames = skills.map(skill => skill.name || 'Skill').join(', ');
          addText(skillNames, 10);
        } else {
          // Standard & Detailed: Include skill levels
          const skillsText = skills.map(skill => {
            const skillName = skill.name || 'Skill';
            const skillLevel = skill.level || 'Intermediate';
            return `${skillName} (${skillLevel})`;
          }).join(', ');
          addText(skillsText, 10);
        }
      }

      // Achievements (only for standard and detailed)
      if (achievements.length > 0 && format !== 'compact') {
        addSeparator();
        addText('ACHIEVEMENTS & AWARDS', 14, true, true);

        achievements.forEach((achievement, index) => {
          if (index > 0) yPosition += 3;

          // Achievement Title
          const title = achievement.title || 'Achievement Title';
          addText(title, 12, true);

          // Organization and Date
          const orgText = achievement.organization || '';
          const dateText = achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
          if (orgText || dateText) {
            addText(`${orgText}${orgText && dateText ? ' - ' : ''}${dateText}`, 10);
          }

          // Description (only for detailed)
          if (achievement.description && format === 'detailed') {
            addText(achievement.description, 10);
          }
        });
      }

      // Certificates (only for standard and detailed)
      if (certificates.length > 0 && format !== 'compact') {
        addSeparator();
        addText('CERTIFICATES & LICENSES', 14, true, true);

        certificates.forEach((certificate, index) => {
          if (index > 0) yPosition += 3;

          // Certificate Name
          const name = certificate.name || 'Certificate Name';
          addText(name, 12, true);

          // Issuer and Date
          const issuer = certificate.issuer || '';
          const dateText = certificate.date ? new Date(certificate.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
          if (issuer || dateText) {
            addText(`${issuer}${issuer && dateText ? ' - ' : ''}${dateText}`, 10);
          }

          // Credential ID and URL (only for detailed)
          if (format === 'detailed') {
            if (certificate.credentialId) {
              addText(`Credential ID: ${certificate.credentialId}`, 9);
            }
            if (certificate.url) {
              addText(`URL: ${certificate.url}`, 9);
            }
            if (certificate.expiryDate) {
              const expiryText = new Date(certificate.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
              addText(`Expires: ${expiryText}`, 9);
            }
          }
        });
      }

      // Save the PDF based on format
      switch (format) {
        case 'standard':
          pdf.save(`${sanitizedFilename}.pdf`);
          break;
        case 'compact':
          pdf.save(`${sanitizedFilename}_compact.pdf`);
          break;
        case 'detailed':
          pdf.save(`${sanitizedFilename}_detailed.pdf`);
          break;
        default:
          pdf.save(`${sanitizedFilename}.pdf`);
      }

      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }

  // Export CV to different formats
  async exportToFormat(cvData, filename = 'CV', format = 'pdf') {
    try {
      switch (format) {
        case 'pdf':
          return await this.exportToPDF(cvData, filename, 'standard');
        case 'pdf-compact':
          return await this.exportToPDF(cvData, filename, 'compact');
        case 'pdf-detailed':
          return await this.exportToPDF(cvData, filename, 'detailed');
        case 'pdf-visual':
          return await this.exportToPDFAsImage(cvData, filename);
        case 'txt':
          return await this.exportToTXT(cvData, filename);
        case 'json':
          return await this.exportToJSON(cvData, filename);
        default:
          return await this.exportToPDF(cvData, filename, 'standard');
      }
    } catch (error) {
      console.error('Error exporting to format:', error);
      throw new Error(`Failed to export to ${format}. Please try again.`);
    }
  }

  // Export CV to TXT format
  async exportToTXT(cvData, filename = 'CV') {
    try {
      const sanitizedFilename = this.sanitizeFilename(filename);
      const { personal = {}, experience = [], education = [], skills = [] } = cvData;

      let content = '';

      // Header
      if (personal.fullName) {
        content += `${personal.fullName.toUpperCase()}\n`;
        content += '='.repeat(personal.fullName.length) + '\n\n';
      }

      // Contact Info
      const contactInfo = [];
      if (personal.email) contactInfo.push(`Email: ${personal.email}`);
      if (personal.phone) contactInfo.push(`Phone: ${personal.phone}`);
      if (personal.location) contactInfo.push(`Location: ${personal.location}`);
      if (personal.website) contactInfo.push(`Website: ${personal.website}`);

      if (contactInfo.length > 0) {
        content += contactInfo.join(' | ') + '\n\n';
      }

      // Professional Summary
      if (personal.summary) {
        content += 'PROFESSIONAL SUMMARY\n';
        content += '-'.repeat(20) + '\n';
        content += personal.summary + '\n\n';
      }

      // Work Experience
      if (experience.length > 0) {
        content += 'WORK EXPERIENCE\n';
        content += '-'.repeat(15) + '\n';

        experience.forEach((exp, index) => {
          if (index > 0) content += '\n';
          content += `${exp.position || 'Position'} at ${exp.company || 'Company'}\n`;

          const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
          const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
          if (startDate || endDate) {
            content += `${startDate} - ${endDate}\n`;
          }

          if (exp.description) {
            content += exp.description + '\n';
          }
        });
        content += '\n';
      }

      // Education
      if (education.length > 0) {
        content += 'EDUCATION\n';
        content += '-'.repeat(9) + '\n';

        education.forEach((edu, index) => {
          if (index > 0) content += '\n';
          let degreeText = edu.degree || 'Degree';
          if (edu.field) degreeText += ` in ${edu.field}`;
          content += degreeText + '\n';

          if (edu.institution) {
            content += edu.institution + '\n';
          }

          if (edu.graduationYear) {
            content += `Graduated: ${edu.graduationYear}\n`;
          }
        });
        content += '\n';
      }

      // Skills
      if (skills.length > 0) {
        content += 'SKILLS\n';
        content += '-'.repeat(6) + '\n';

        const skillsText = skills.map(skill => {
          const skillName = skill.name || 'Skill';
          const skillLevel = skill.level || 'Intermediate';
          return `${skillName} (${skillLevel})`;
        }).join(', ');

        content += skillsText + '\n';
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sanitizedFilename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting TXT:', error);
      throw new Error('Failed to export TXT. Please try again.');
    }
  }

  // Export CV to JSON format
  async exportToJSON(cvData, filename = 'CV') {
    try {
      const sanitizedFilename = this.sanitizeFilename(filename);

      // Create clean JSON data
      const jsonData = {
        ...cvData,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sanitizedFilename}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw new Error('Failed to export JSON. Please try again.');
    }
  }

  // Generate styled HTML content for CV
  generateStyledCVHTML(cvData) {
    const { personal = {}, experience = [], education = [], skills = [], achievements = [], certificates = [] } = cvData;

    return `
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cv-container {
          max-width: none;
          margin: 0;
          padding: 40px;
          min-height: 1123px; /* A4 height in pixels */
          width: 794px; /* A4 width in pixels */
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #374151;
        }
        .cv-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 3px solid #e5e7eb;
          text-align: center;
        }
        .cv-name {
          font-size: 2.8rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
          letter-spacing: -0.025em;
        }
        .cv-contact {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 2rem;
          color: #6b7280;
          font-size: 0.95rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-icon {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }
        .cv-section {
          margin-bottom: 2.5rem;
        }
        .cv-section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cv-item-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          table-layout: fixed;
        }
        .cv-item-table:last-child {
          margin-bottom: 0;
        }
        .cv-item-row {
          border-bottom: 1px solid #f3f4f6;
        }
        .cv-item-row:last-child {
          border-bottom: none;
        }
        .cv-item-header {
          padding: 1rem 0;
          vertical-align: top;
        }
        .cv-item-left {
          width: 70%;
          padding-right: 2rem;
          vertical-align: top;
        }
        .cv-item-right {
          width: 30%;
          text-align: right;
          vertical-align: top;
          padding-left: 1rem;
        }
        .cv-item-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
        }
        .cv-item-subtitle {
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
          margin: 0 0 0.75rem 0;
        }
        .cv-item-date {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 600;
          white-space: nowrap;
          text-align: right;
          display: block;
        }
        .cv-item-description {
          color: #374151;
          line-height: 1.6;
          margin-top: 0.5rem;
        }
        .cv-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        .cv-skill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }
        .cv-skill-name {
          font-weight: 600;
          color: #1e293b;
        }
        .cv-skill-level {
          font-size: 0.85rem;
          color: #64748b;
          background: #e2e8f0;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-weight: 500;
        }

        /* Print-specific styles for better PDF rendering */
        @media print {
          .cv-item-table {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .cv-item-left {
            width: 70% !important;
          }
          .cv-item-right {
            width: 30% !important;
            text-align: right !important;
          }
          .cv-item-date {
            text-align: right !important;
            float: none !important;
            display: block !important;
          }
        }

        /* Force table layout */
        table.cv-item-table {
          display: table !important;
          width: 100% !important;
        }
        tr.cv-item-row {
          display: table-row !important;
        }
        td.cv-item-left, td.cv-item-right {
          display: table-cell !important;
        }
      </style>
      <div class="cv-container">
        <!-- Header Section -->
        <div class="cv-header">
          <h1 class="cv-name">
            ${personal?.fullName || 'Your Name'}
          </h1>
          <div class="cv-contact">
            ${personal?.email ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>${personal.email}</span>
              </div>
            ` : ''}
            ${personal?.phone ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>${personal.phone}</span>
              </div>
            ` : ''}
            ${personal?.location ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>${personal.location}</span>
              </div>
            ` : ''}
            ${personal?.website ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                <span>${personal.website}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${personal?.summary ? `
          <div class="cv-section">
            <h2 class="cv-section-title">Professional Summary</h2>
            <p style="line-height: 1.6;">${personal.summary}</p>
          </div>
        ` : ''}

        <!-- Work Experience -->
        ${experience.length > 0 ? `
          <div class="cv-section">
            <h2 class="cv-section-title">Work Experience</h2>
            ${experience.map(exp => `
              <table class="cv-item-table">
                <tbody>
                  <tr class="cv-item-row">
                    <td class="cv-item-header cv-item-left">
                      <h3 class="cv-item-title">${exp.position || 'Position Title'}</h3>
                      <p class="cv-item-subtitle">${exp.company || 'Company Name'}</p>
                      ${exp.description ? `<div class="cv-item-description">${exp.description.split('\n').map(line => `<p style="margin: 0.25rem 0;">${line}</p>`).join('')}</div>` : ''}
                    </td>
                    <td class="cv-item-header cv-item-right">
                      <div class="cv-item-date">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div class="cv-section">
            <h2 class="cv-section-title">Education</h2>
            ${education.map(edu => `
              <table class="cv-item-table">
                <tbody>
                  <tr class="cv-item-row">
                    <td class="cv-item-header cv-item-left">
                      <h3 class="cv-item-title">${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}</h3>
                      <p class="cv-item-subtitle">${edu.institution || 'Institution Name'}</p>
                    </td>
                    <td class="cv-item-header cv-item-right">
                      <div class="cv-item-date">${edu.graduationYear || this.formatDateRange(edu.startDate, edu.endDate, edu.current)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills.length > 0 ? `
          <div class="cv-section">
            <h2 class="cv-section-title">Skills</h2>
            <div class="cv-skills-grid">
              ${skills.map(skill => `
                <div class="cv-skill">
                  <span class="cv-skill-name">${skill.name || 'Skill Name'}</span>
                  <span class="cv-skill-level">${skill.level || 'Intermediate'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Achievements -->
        ${achievements.length > 0 ? `
          <div class="cv-section">
            <h2 class="cv-section-title">Achievements & Awards</h2>
            ${achievements.map(achievement => `
              <table class="cv-item-table">
                <tbody>
                  <tr class="cv-item-row">
                    <td class="cv-item-header cv-item-left">
                      <h3 class="cv-item-title">${achievement.title || 'Achievement Title'}</h3>
                      ${achievement.organization ? `<p class="cv-item-subtitle">${achievement.organization}</p>` : ''}
                      ${achievement.description ? `<div class="cv-item-description">${achievement.description.split('\n').map(line => `<p style="margin: 0.25rem 0;">${line}</p>`).join('')}</div>` : ''}
                    </td>
                    <td class="cv-item-header cv-item-right">
                      ${achievement.date ? `<div class="cv-item-date">${this.formatDate(achievement.date)}</div>` : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            `).join('')}
          </div>
        ` : ''}

        <!-- Certificates -->
        ${certificates.length > 0 ? `
          <div class="cv-section">
            <h2 class="cv-section-title">Certificates & Licenses</h2>
            ${certificates.map(certificate => `
              <table class="cv-item-table">
                <tbody>
                  <tr class="cv-item-row">
                    <td class="cv-item-header cv-item-left">
                      <h3 class="cv-item-title">${certificate.name || 'Certificate Name'}</h3>
                      ${certificate.issuer ? `<p class="cv-item-subtitle">${certificate.issuer}</p>` : ''}
                      <div class="cv-item-description">
                        ${certificate.credentialId ? `<p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">ID: ${certificate.credentialId}</p>` : ''}
                        ${certificate.url ? `<p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">URL: ${certificate.url}</p>` : ''}
                      </div>
                    </td>
                    <td class="cv-item-header cv-item-right">
                      <div class="cv-item-date">
                        ${certificate.date ? `<div>Issued: ${this.formatDate(certificate.date)}</div>` : ''}
                        ${certificate.expiryDate ? `<div>Expires: ${this.formatDate(certificate.expiryDate)}</div>` : ''}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Helper function to format single date
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  // Generate HTML content for CV (legacy)
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

  // Generate shareable link using Firebase
  async generateShareableLink(cvData) {
    try {
      console.log('Generating Firebase share link for CV:', cvData);

      // Use Firebase share service
      const shareUrl = await shareService.createShare(cvData);
      console.log('Generated Firebase share URL:', shareUrl);

      return shareUrl;
    } catch (error) {
      console.error('Error generating shareable link:', error);
      throw new Error('Failed to generate shareable link. Please try again.');
    }
  }

  // Get shared CV data by ID (using Firebase)
  async getSharedCV(shareId) {
    try {
      console.log('Getting shared CV from Firebase with ID:', shareId);

      const shareData = await shareService.getShare(shareId);
      if (!shareData) {
        throw new Error('Shared CV not found. The link may be invalid or the CV may have been removed.');
      }

      return shareData.cvData;
    } catch (error) {
      console.error('Error getting shared CV:', error);
      throw error;
    }
  }

  // Get all shared CVs (using Firebase)
  async getAllSharedCVs() {
    try {
      return await shareService.getAllShares();
    } catch (error) {
      console.error('Error getting all shared CVs:', error);
      return [];
    }
  }

  // Cleanup expired shared CVs (using Firebase)
  async cleanupExpiredShares() {
    try {
      return await shareService.cleanupExpiredShares();
    } catch (error) {
      console.error('Error during cleanup:', error);
      return 0;
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
        const shareUrl = await this.generateShareableLink(cvData);
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
  async shareViaEmail(cvData) {
    const subject = encodeURIComponent(`${cvData.personal?.fullName || 'Professional'} CV`);
    const shareUrl = await this.generateShareableLink(cvData);
    const body = encodeURIComponent(`Hi,\n\nI'd like to share my professional CV with you.\n\nYou can view it here: ${shareUrl}\n\nBest regards,\n${cvData.personal?.fullName || 'Professional'}`);

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  }

  // Share via WhatsApp
  async shareViaWhatsApp(cvData) {
    const shareUrl = await this.generateShareableLink(cvData);
    const message = encodeURIComponent(`Hi! I'd like to share my professional CV with you: ${shareUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  // Share via LinkedIn
  async shareViaLinkedIn(cvData) {
    const shareUrl = await this.generateShareableLink(cvData);
    const title = encodeURIComponent(`${cvData.personal?.fullName || 'Professional'} CV`);
    const summary = encodeURIComponent('Check out my professional CV');

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank');
  }

  // Export CV to TXT format
  async exportToTXT(cvData, filename = 'CV') {
    try {
      const { personal = {}, experience = [], education = [], skills = [], achievements = [], certificates = [] } = cvData;

      let txtContent = '';

      // Header
      if (personal.fullName) {
        txtContent += `${personal.fullName.toUpperCase()}\n`;
        txtContent += '='.repeat(personal.fullName.length) + '\n\n';
      }

      // Contact Information
      if (personal.email || personal.phone || personal.location || personal.website) {
        txtContent += 'CONTACT INFORMATION\n';
        txtContent += '-'.repeat(19) + '\n';
        if (personal.email) txtContent += `Email: ${personal.email}\n`;
        if (personal.phone) txtContent += `Phone: ${personal.phone}\n`;
        if (personal.location) txtContent += `Location: ${personal.location}\n`;
        if (personal.website) txtContent += `Website: ${personal.website}\n`;
        txtContent += '\n';
      }

      // Professional Summary
      if (personal.summary) {
        txtContent += 'PROFESSIONAL SUMMARY\n';
        txtContent += '-'.repeat(20) + '\n';
        txtContent += `${personal.summary}\n\n`;
      }

      // Work Experience
      if (experience.length > 0) {
        txtContent += 'WORK EXPERIENCE\n';
        txtContent += '-'.repeat(15) + '\n';
        experience.forEach((exp, index) => {
          if (index > 0) txtContent += '\n';
          txtContent += `${exp.position || 'Position Title'}\n`;
          txtContent += `${exp.company || 'Company Name'}\n`;
          const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
          const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
          if (startDate || endDate) {
            txtContent += `${startDate} - ${endDate}\n`;
          }
          if (exp.description) {
            txtContent += `${exp.description}\n`;
          }
        });
        txtContent += '\n';
      }

      // Education
      if (education.length > 0) {
        txtContent += 'EDUCATION\n';
        txtContent += '-'.repeat(9) + '\n';
        education.forEach((edu, index) => {
          if (index > 0) txtContent += '\n';
          txtContent += `${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}\n`;
          txtContent += `${edu.institution || 'Institution Name'}\n`;
          if (edu.graduationYear) {
            txtContent += `Graduated: ${edu.graduationYear}\n`;
          }
        });
        txtContent += '\n';
      }

      // Skills
      if (skills.length > 0) {
        txtContent += 'SKILLS\n';
        txtContent += '-'.repeat(6) + '\n';
        skills.forEach(skill => {
          txtContent += `• ${skill.name || 'Skill'} (${skill.level || 'Intermediate'})\n`;
        });
        txtContent += '\n';
      }

      // Achievements
      if (achievements.length > 0) {
        txtContent += 'ACHIEVEMENTS & AWARDS\n';
        txtContent += '-'.repeat(20) + '\n';
        achievements.forEach((achievement, index) => {
          if (index > 0) txtContent += '\n';
          txtContent += `${achievement.title || 'Achievement Title'}\n`;
          if (achievement.organization) txtContent += `${achievement.organization}\n`;
          if (achievement.date) {
            txtContent += `Date: ${new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}\n`;
          }
          if (achievement.description) txtContent += `${achievement.description}\n`;
        });
        txtContent += '\n';
      }

      // Certificates
      if (certificates.length > 0) {
        txtContent += 'CERTIFICATES & LICENSES\n';
        txtContent += '-'.repeat(23) + '\n';
        certificates.forEach((certificate, index) => {
          if (index > 0) txtContent += '\n';
          txtContent += `${certificate.name || 'Certificate Name'}\n`;
          if (certificate.issuer) txtContent += `Issuer: ${certificate.issuer}\n`;
          if (certificate.date) {
            txtContent += `Issued: ${new Date(certificate.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}\n`;
          }
          if (certificate.credentialId) txtContent += `Credential ID: ${certificate.credentialId}\n`;
          if (certificate.url) txtContent += `URL: ${certificate.url}\n`;
        });
      }

      // Create and download file
      const blob = new Blob([txtContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.sanitizeFilename(filename)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting to TXT:', error);
      throw new Error('Failed to export to TXT format. Please try again.');
    }
  }

  // Export CV to JSON format
  async exportToJSON(cvData, filename = 'CV') {
    try {
      // Create a clean copy of CV data with metadata
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          format: 'CV-JSON'
        },
        cvData: {
          ...cvData,
          exportedAt: new Date().toISOString()
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.sanitizeFilename(filename)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export to JSON format. Please try again.');
    }
  }

  // Sanitize filename for safe file download
  sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return 'CV';
    }

    // Remove invalid characters for filenames
    let sanitized = filename
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^\w\-_.]/g, '') // Keep only alphanumeric, dash, underscore, dot
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

    // Limit length to 100 characters
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 100);
    }

    // Ensure we have a valid filename
    return sanitized || 'CV';
  }


}

export default new ExportService();
