document.getElementById('combineBtn').addEventListener('click', async () => {
    const gifUrl = document.getElementById('gifUrl').value;
    const jorkinUrl = 'jorkin.gif'; // Replace with the actual path to jorkin.gif

    // Validate URL and file size
    const response = await fetch(gifUrl);
    const blob = await response.blob();
    if (blob.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
    }

    // Create a combined GIF
    const combinedGif = document.createElement('canvas');
    const ctx = combinedGif.getContext('2d');

    const userGif = await loadImage(gifUrl);
    const jorkinGif = await loadImage(jorkinUrl);

    // Set canvas size
    combinedGif.width = userGif.width;
    combinedGif.height = userGif.height;

    // Draw user GIF
    ctx.drawImage(userGif, 0, 0);

    // Draw jorkin GIF
    ctx.drawImage(jorkinGif, 0, userGif.height - jorkinGif.height / 2, jorkinGif.width / 2, jorkinGif.height / 2);

    // Set the combined GIF as the source for preview
    document.getElementById('combinedGif').src = combinedGif.toDataURL('image/gif');
});

// Function to load an image
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle CORS
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}