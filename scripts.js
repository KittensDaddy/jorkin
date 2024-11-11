document.getElementById('combineBtn').addEventListener('click', async () => {
    const mediaLink = document.getElementById('mediaLink').value;
    const corner = document.getElementById('cornerSelect').value;

    // Validate the media link and size
    if (!mediaLink) {
        alert('Please enter a valid media link.');
        return;
    }

    // Send request to the server to combine GIFs
    const response = await fetch('/combine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaLink, corner }),
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('preview').innerHTML = `<img src="${result.combinedGif}" alt="Combined GIF" />`;
        document.getElementById('saveBtn').style.display = 'block';
    } else {
        alert('Error combining GIF: ' + result.message);
    }
});