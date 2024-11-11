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

        // Prepare gif.js to generate the animated GIF
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height
        });

        // Create a frame for each overlay position
        gif.addFrame(canvas, { delay: 500, copy: true });  // You can add multiple frames if necessary

        // Add the overlay GIF as another frame
        gif.addFrame(overlayImage, { delay: 500, copy: true });

        // Finalize the GIF and display the result
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            displayPreview(url);  // Show the result as a preview
            enableDownload(url);  // Enable download link for the GIF
        });

        // Start generating the GIF
        gif.render();

        // Display processing message
        document.getElementById('status').innerText = "Processing...";

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

// Function to enable download of the generated GIF
function enableDownload(url) {
    const downloadButton = document.getElementById('downloadButton');
    const downloadLink = document.getElementById('downloadLink');
    
    // Check if URL is valid
    if (url) {
        downloadLink.href = url;  // Set the download link to the GIF Blob URL
        downloadLink.download = 'processed-image.gif';  // Set the default filename for download
        downloadButton.style.display = 'inline-block';  // Show the download button
        console.log('Download button should now be visible.');
    } else {
        console.log('Error: Blob URL is invalid.');
    }
}

// Event listener for process button
document.getElementById('processButton').addEventListener('click', processAndOverlay);
