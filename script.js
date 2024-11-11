let previewBlobURL = '';

// Event listener for the overlay button
document.getElementById('overlay-btn').addEventListener('click', function() {
  const fileURL = document.getElementById('file-input').value;
  if (!fileURL) {
    alert("Please enter a valid URL.");
    return;
  }

  const outputContainer = document.getElementById('output-container');
  outputContainer.innerHTML = "Processing...";  // Initial Processing message

  document.getElementById('preview-btn').style.display = 'none';
  document.getElementById('save-btn').style.display = 'none';

  const fileExtension = fileURL.split('.').pop().toLowerCase();
  if (fileExtension === "gif" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
    addOverlayToImage(fileURL);
  } else if (fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "webm") {
    addOverlayToVideo(fileURL);
  } else {
    alert("Unsupported file type.");
    outputContainer.innerHTML = "";
  }
});

// Function to handle adding overlay to images
function addOverlayToImage(imageURL) {
  const image = new Image();
  image.src = imageURL;

  image.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0); // Draw the image onto the canvas

    const overlayImage = new Image();
    overlayImage.src = '/jorkin.gif';  // Your fixed GIF overlay

    overlayImage.onload = function() {
      ctx.drawImage(overlayImage, 50, 50);  // Position of overlay image on the main image

      // Use setTimeout to allow the UI to refresh between processing
      setTimeout(() => {
        canvas.toBlob(function(blob) {
          previewBlobURL = URL.createObjectURL(blob);
          displayPreview(previewBlobURL);
        }, 'image/gif');
      }, 0); // Non-blocking refresh of UI
    };

    overlayImage.onerror = function() {
      alert("There was an error loading the overlay image.");
    };
  };

  image.onerror = function() {
    alert("There was an error loading the image.");
    document.getElementById('output-container').innerHTML = "";
  };
}

// Function to handle adding overlay to video
function addOverlayToVideo(videoURL) {
  const video = document.createElement('video');
  video.src = videoURL;

  video.onloadeddata = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the first frame of the video
    video.play();
    video.addEventListener('play', function() {
      ctx.drawImage(video, 0, 0);

      const overlayImage = new Image();
      overlayImage.src = '/jorkin.gif';  // Your fixed GIF overlay

      overlayImage.onload = function() {
        ctx.drawImage(overlayImage, 50, 50);  // Position of overlay image on the video frame

        setTimeout(() => {
          canvas.toBlob(function(blob) {
            previewBlobURL = URL.createObjectURL(blob);
            displayPreview(previewBlobURL);
          }, 'image/gif');
        }, 0); // Non-blocking refresh of UI
      };

      overlayImage.onerror = function() {
        alert("There was an error loading the overlay image.");
      };
    });
  };

  video.onerror = function() {
    alert("There was an error loading the video.");
    document.getElementById('output-container').innerHTML = "";
  };
}

// Function to display the preview image or video
function displayPreview(blobURL) {
  const outputContainer = document.getElementById('output-container');
  outputContainer.innerHTML = '';  // Clear any previous content

  const resultGif = document.createElement('img');
  resultGif.src = blobURL;
  outputContainer.appendChild(resultGif);

  // Display preview and save buttons
  document.getElementById('preview-btn').style.display = 'inline-block';
  document.getElementById('save-btn').style.display = 'inline-block';
}

// Preview button to show the result in a new window
document.getElementById('preview-btn').addEventListener('click', function() {
  if (previewBlobURL) {
    const previewWindow = window.open(previewBlobURL);
    previewWindow.document.write('<img src="' + previewBlobURL + '" />');
  } else {
    alert("No preview available.");
  }
});

// Save button to download the result
document.getElementById('save-btn').addEventListener('click', function() {
  if (previewBlobURL) {
    const a = document.createElement('a');
    a.href = previewBlobURL;
    a.download = 'result.gif';
    a.click();
  } else {
    alert("No result available to save.");
  }
});
