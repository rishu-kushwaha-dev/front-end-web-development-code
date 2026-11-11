const form = document.getElementById('weddingForm');
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');
const previewPanel = document.querySelector('.preview-panel');
const previewContent = document.getElementById('previewContent');
const previewPlaceholder = previewContent.querySelector('.preview-placeholder');
const closePreview = document.getElementById('closePreview');
const previewBtn = document.getElementById('previewBtn');
const printPreview = document.getElementById('printPreview');
const generateBtn = document.getElementById('generateBtn');
const resetFormBtn = document.getElementById('resetForm');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === targetTab) {
                panel.classList.add('active');
            }
        });
    });
});

function getFormData() {
    const elements = form.elements;
    const data = {};

    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el.name || el.disabled) continue;

        if (el.type === 'checkbox') {
            if (!data[el.name]) data[el.name] = [];
            if (el.checked) data[el.name].push(el.value);
        } else if (el.type === 'radio') {
            if (el.checked) data[el.name] = el.value;
        } else if (el.tagName === 'SELECT' && el.multiple) {
            data[el.name] = Array.from(el.selectedOptions).map(o => o.value);
        } else {
            data[el.name] = el.value;
        }
    }

    return data;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateInvitationHTML(data) {
    const partner1 = escapeHtml(data.partner1 || '');
    const partner2 = escapeHtml(data.partner2 || '');
    const partner1Title = escapeHtml(data.partner1Title || '');
    const partner2Title = escapeHtml(data.partner2Title || '');
    const coupleMessage = escapeHtml(data.coupleMessage || 'Together with their families,');
    const weddingDate = formatDate(data.weddingDate);
    const ceremonyTime = formatTime(data.ceremonyTime);
    const eventType = escapeHtml(data.eventType || 'wedding');
    const dressCode = escapeHtml(data.dressCode || '');
    const venueName = escapeHtml(data.venueName || '');
    const venueAddress = escapeHtml(data.venueAddress || '').replace(/\n/g, '<br>');
    const venuePhone = escapeHtml(data.venuePhone || '');
    const parkingInstructions = escapeHtml(data.parkingInstructions || '');
    const ceremonyLocation = escapeHtml(data.ceremonyLocation || venueName);
    const officiant = escapeHtml(data.officiant || '');
    const ceremonyDescription = escapeHtml(data.ceremonyDescription || '');
    const ceremonyInstructions = escapeHtml(data.ceremonyInstructions || '');
    const receptionLocation = escapeHtml(data.receptionLocation || venueName);
    const receptionTime = formatTime(data.receptionTime);
    const receptionEndTime = formatTime(data.receptionEndTime);
    const receptionDescription = escapeHtml(data.receptionDescription || '');
    const menuHighlights = escapeHtml(data.menuHighlights || '');
    const rsvpDeadline = formatDate(data.rsvpDeadline);
    const rsvpContact = escapeHtml(data.rsvpContact || partner1);
    const rsvpEmail = escapeHtml(data.rsvpEmail || '');
    const rsvpPhone = escapeHtml(data.rsvpPhone || '');
    const rsvpMessage = escapeHtml(data.rsvpMessage || 'Kindly respond by the date above.');
    const bridesmaidsAttire = escapeHtml(data.bridesmaidsAttire || '');
    const groomsmenAttire = escapeHtml(data.groomsmenAttire || '');
    const additionalNotes = escapeHtml(data.additionalNotes || '');
    const registryWebsite = escapeHtml(data.registryWebsite || '');
    const hashtag = escapeHtml(data.hashtag || '');
    const guestCount = escapeHtml(data.guestCount || '');

    let html = `
<div class="invitation-preview">
<div class="invitation-header">
<span class="decorative">&#10084;</span>
<h1>${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Invitation</h1>
<div class="couple-names">${partner1Title ? partner1Title + '<br>' : ''}${partner1} &amp; ${partner2}${partner2Title ? '<br>' + partner2Title : ''}</div>
<p class="message">${coupleMessage}</p>
</div>

<div class="invitation-details">
<div class="detail-item">
<span class="detail-icon">&#128197;</span>
<div class="detail-text">
<h3>Date</h3>
<p>${weddingDate}</p>
</div>
</div>

<div class="detail-item">
<span class="detail-icon">&#128337;</span>
<div class="detail-text">
<h3>Time</h3>
<p>${ceremonyTime}</p>
</div>
</div>

<div class="detail-item">
<span class="detail-icon">&#127968;</span>
<div class="detail-text">
<h3>Venue</h3>
<p>${venueName}<br>${venueAddress}</p>
</div>
</div>

${ceremonyLocation && ceremonyLocation !== venueName ? `
<div class="detail-item">
<span class="detail-icon">&#9992;</span>
<div class="detail-text">
<h3>Ceremony Location</h3>
<p>${ceremonyLocation}</p>
</div>
</div>
` : ''}

${officiant ? `
<div class="detail-item">
<span class="detail-icon">&#128105;</span>
<div class="detail-text">
<h3>Officiant</h3>
<p>${officiant}</p>
</div>
</div>
` : ''}

${receptionDescription || receptionTime ? `
<div class="detail-item">
<span class="detail-icon">&#127881;</span>
<div class="detail-text">
<h3>Reception</h3>
<p>${receptionLocation}<br>${receptionTime}${receptionEndTime ? ' - ' + receptionEndTime : ''}</p>
</div>
</div>
` : ''}

${dressCode ? `
<div class="detail-item">
<span class="detail-icon">&#128091;</span>
<div class="detail-text">
<h3>Attire</h3>
<p>${dressCode}</p>
</div>
</div>
` : ''}

${bridesmaidsAttire || groomsmenAttire ? `
<div class="detail-item">
<span class="detail-icon">&#128100;</span>
<div class="detail-text">
<h3>Wedding Party Attire</h3>
<p>${bridesmaidsAttire ? 'Bridesmaids: ' + bridesmaidsAttire + '<br>' : ''}${groomsmenAttire ? 'Groomsmen: ' + groomsmenAttire : ''}</p>
</div>
</div>
` : ''}

${parkingInstructions ? `
<div class="detail-item">
<span class="detail-icon">&#128664;</span>
<div class="detail-text">
<h3>Parking</h3>
<p>${parkingInstructions}</p>
</div>
</div>
` : ''}

${ceremonyDescription ? `
<div class="detail-item full">
<span class="detail-icon">&#128149;</span>
<div class="detail-text">
<h3>About the Ceremony</h3>
<p>${ceremonyDescription}</p>
</div>
</div>
` : ''}

${ceremonyInstructions ? `
<div class="detail-item full">
<span class="detail-icon">&#128169;</span>
<div class="detail-text">
<h3>Special Instructions</h3>
<p>${ceremonyInstructions}</p>
</div>
</div>
` : ''}
</div>

<div class="invitation-footer">
${rsvpMessage ? `<p><em>${rsvpMessage}</em></p>` : ''}
<div class="rsvp-box">
<h3>RSVP</h3>
<p><strong>By:</strong> ${rsvpDeadline}</p>
<p><strong>Contact:</strong> ${rsvpContact}</p>
${rsvpEmail ? `<p><strong>Email:</strong> ${rsvpEmail}</p>` : ''}
${rsvpPhone ? `<p><strong>Phone:</strong> ${rsvpPhone}</p>` : ''}
</div>

${registryWebsite ? `<p><strong>Registry:</strong> <a href="${registryWebsite}" target="_blank">${registryWebsite}</a></p>` : ''}

${hashtag ? `<p class="hashtag">${hashtag}</p>` : ''}

<p style="margin-top: 1.5rem; font-size: 0.85rem; color: #999;">Guest count: ${guestCount} | Generated with Wedding Form Generator</p>
</div>
</div>
`;

    return html;
}

function renderPreview() {
    const data = getFormData();
    const html = generateInvitationHTML(data);
    previewContent.innerHTML = html;
    previewPlaceholder.style.display = 'none';
    previewPanel.style.display = 'flex';
    previewPanel.scrollIntoView({ behavior: 'smooth' });
}

previewBtn.addEventListener('click', renderPreview);

closePreview.addEventListener('click', () => {
    previewPanel.style.display = 'none';
    previewPlaceholder.style.display = 'block';
});

printPreview.addEventListener('click', () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wedding Invitation - Print</title>
<style>
body { font-family: 'Georgia', serif; color: #333; line-height: 1.6; padding: 2rem; }
.invitation-preview { max-width: 700px; margin: 0 auto; padding: 3rem 2rem; background: #fff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #ddd0e8; position: relative; overflow: hidden; }
.invitation-preview::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 8px; background: linear-gradient(90deg, #8e44ad, #c39bd3, #8e44ad); }
.invitation-header { text-align: center; margin-bottom: 2rem; }
.decorative { font-size: 2rem; color: #8e44ad; margin-bottom: 0.5rem; display: block; }
.invitation-header h1 { font-size: 3rem; color: #2c3e50; margin-bottom: 0.5rem; font-style: italic; letter-spacing: 2px; }
.couple-names { font-size: 2.2rem; color: #7d3c98; margin-bottom: 1rem; font-weight: 700; }
.message { font-style: italic; color: #666; max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.8; }
.invitation-details { margin-bottom: 2rem; }
.detail-item { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; page-break-inside: avoid; }
.detail-icon { flex-shrink: 0; color: #8e44ad; font-size: 1.2rem; margin-top: 0.2rem; }
.detail-text h3 { font-size: 1.1rem; color: #2c3e50; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 1px; }
.detail-text p { color: #333; line-height: 1.6; }
.invitation-footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #ddd0e8; }
.rsvp-box { background: rgba(142, 68, 173, 0.05); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; page-break-inside: avoid; }
.rsvp-box h3 { color: #7d3c98; margin-bottom: 0.75rem; }
.rsvp-box p { color: #666; margin-bottom: 0.5rem; }
.hashtag { color: #8e44ad; font-weight: 700; letter-spacing: 1px; }
@media print { body { padding: 0; } .invitation-preview { box-shadow: none; border: none; } }
</style>
</head>
<body>
${generateInvitationHTML(getFormData()).replace('class="invitation-preview"', 'class="invitation-preview"')}
</body>
</html>
`);
    previewWindow.document.close();
    previewWindow.focus();
    setTimeout(() => previewWindow.print(), 500);
});

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = getFormData();
    const html = generateInvitationHTML(data);

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wedding Invitation - ${escapeHtml(data.partner1 || '')} & ${escapeHtml(data.partner2 || '')}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital@0;1&display=swap');
* { box-sizing: border-box; }
body { font-family: 'Lora', serif; color: #333; line-height: 1.6; margin: 0; padding: 2rem; background: #f9f2fb; }
.invitation-preview { max-width: 700px; margin: 0 auto; padding: 3rem 2rem; background: #fff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #ddd0e8; position: relative; overflow: hidden; }
.invitation-preview::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 8px; background: linear-gradient(90deg, #8e44ad, #c39bd3, #8e44ad); }
.invitation-header { text-align: center; margin-bottom: 2rem; }
.decorative { font-size: 2rem; color: #8e44ad; margin-bottom: 0.5rem; display: block; }
.invitation-header h1 { font-family: 'Playfair Display', serif; font-size: 3rem; color: #2c3e50; margin-bottom: 0.5rem; font-style: italic; letter-spacing: 2px; }
.couple-names { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #7d3c98; margin-bottom: 1rem; font-weight: 700; }
.message { font-style: italic; color: #666; max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.8; }
.invitation-details { margin-bottom: 2rem; }
.detail-item { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; page-break-inside: avoid; }
.detail-icon { flex-shrink: 0; color: #8e44ad; font-size: 1.2rem; margin-top: 0.2rem; }
.detail-text h3 { font-size: 1.1rem; color: #2c3e50; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 1px; }
.detail-text p { color: #333; line-height: 1.6; }
.invitation-footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #ddd0e8; }
.rsvp-box { background: rgba(142, 68, 173, 0.05); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; page-break-inside: avoid; }
.rsvp-box h3 { color: #7d3c98; margin-bottom: 0.75rem; }
.rsvp-box p { color: #666; margin-bottom: 0.5rem; }
.hashtag { color: #8e44ad; font-weight: 700; letter-spacing: 1px; }
@media print { body { padding: 0; background: #fff; } .invitation-preview { box-shadow: none; border: none; } }
</style>
</head>
<body>
${html}
</body>
</html>
`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `Wedding-Invitation-${(data.partner1 || 'partner1').replace(/\s+/g, '-')}-and-${(data.partner2 || 'partner2').replace(/\s+/g, '-')}.html`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Wedding invitation HTML file downloaded: ' + filename);
});

resetFormBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all form fields?')) {
        form.reset();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

window.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('weddingDate');
    if (dateInput && !dateInput.value) {
        dateInput.min = today;
    }
    const rsvpInput = document.getElementById('rsvpDeadline');
    if (rsvpInput && !rsvpInput.value) {
        rsvpInput.min = today;
    }
});