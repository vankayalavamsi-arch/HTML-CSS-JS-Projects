// Set default date to today
document.getElementById('dateInput').valueAsDate = new Date();

function generateCertificate() {
    // Get input values
    const name = document.getElementById('nameInput').value || "Your Name Here";
    const title = document.getElementById('titleInput').value || "Certificate of Achievement";
    const desc = document.getElementById('descInput').value || "Has successfully completed the requirements";
    const dateVal = document.getElementById('dateInput').value;
    const sign = document.getElementById('signInput').value || "Jane Smith";

    // Format date (e.g., January 1, 2024)
    let formattedDate = "January 1, 2024";
    if (dateVal) {
        const dateObj = new Date(dateVal + "T00:00:00");
        formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // Apply values to certificate
    document.getElementById('certName').innerText = name;
    document.getElementById('certTitle').innerText = title;
    document.getElementById('certDesc').innerText = desc;
    document.getElementById('certDate').innerText = formattedDate;
    document.getElementById('certSign').innerText = sign;
}

function downloadCertificate() {
    // Ensure certificate is up to date before downloading
    generateCertificate();

    const certificateEl = document.getElementById('certificate');
    
    // Use html2canvas to take a picture of the div
    html2canvas(certificateEl, {
        scale: 2, // Higher resolution
        backgroundColor: null
    }).then(canvas => {
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.download = 'certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}