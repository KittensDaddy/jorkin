// Function to load image with CORS support
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";  // Enable cross-origin loading
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image loading failed'));
    });
}

// Function to load video with CORS support
function loadVideo(src) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.crossOrigin = "Anonymous";  // Enable cross-origin loading
        video.src = src;
        video.onloadeddata = () => resolve(video);
        video.onerror = () => reject(new Error('Video loading failed'));
    });
}

// Function to process and overlay GIF onto image/video
async function processAndOverlay() {
    const imageSrc = document.getElementById('imageUrl').value;  // User input image URL
    const overlaySrc = '/assets/jorkin.gif'; // Overlay GIF path

    try {
        // Load the main image
        const image = await loadImage(imageSrc);

        // Load the overlay GIF
        const overlayImage = await loadImage(overlaySrc);

        // Set up canvas to draw image and overlay
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the main image onto the canvas
        ctx.drawImage(image, 0, 0);

        // Draw the overlay image (GIF) onto the canvas
        ctx.drawImage(overlayImage, 50, 50);  // Change position as needed

        // Display processing message
        document.getElementById('status').innerText = "Processing...";

        // Convert canvas to GIF Blob
        canvas.toBlob(function(blob) {
            if (blob) {
                const url = URL.createObjectURL(blob);
                displayPreview(url);  // Show the result as a preview
            } else {
                console.error("Error: Failed to create blob from canvas.");
            }

            // Reset status
            document.getElementById('status').innerText = "Done!";
        }, 'image/gif');
    } catch (error) {
        console.error('Error loading resources:', error);
        document.getElementById('status').innerText = "Error loading resources";
    }
}

// Function to display the generated GIF preview
function displayPreview(url) {
    const previewImg = document.getElementById('preview');
    previewImg.src = url;  // Set the preview image source to the Blob URL
    previewImg.style.display = 'block';  // Show the preview image
}

// Event listener for process button
document.getElementById('processButton').addEventListener('click', processAndOverlay);
