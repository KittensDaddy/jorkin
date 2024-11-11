let previewBlobURL = '';

document.getElementById('overlay-btn').addEventListener('click', function() {
  const fileURL = document.getElementById('file-input').value;
  if (!fileURL) {
    alert("Please enter a valid URL.");
    return;
  }

  const outputContainer = document.getElementById('output-container');
  outputContainer.innerHTML = "Processing...";

  // Clear any previous result
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

function addOverlayToImage(imageURL) {
  const image = new Image();
  image.src = imageURL;
  image.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image and overlay
    ctx.drawImage(image, 0, 0);
    const overlayImage = new Image();
    overlayImage.src = 'jorkin.gif';  // Your fixed GIF
    overlayImage.onload = function() {
      // Draw overlay on the image
      ctx.drawImage(overlayImage, 50, 50);  // Adjust the position of the overlay

      // Allow the UI to update by using setTimeout or requestAnimationFrame
      setTimeout(() => {
        canvas.toBlob(function(blob) {
          previewBlobURL = URL.createObjectURL(blob);
          displayPreview(previewBlobURL);
        }, 'image/gif');
      }, 0); // Ensure UI refresh
    };
  };

  image.onerror = function() {
    alert("There was an error loading the image.");
    document.getElementById('output-container').innerHTML = "";
  };
}

function addOverlayToVideo(videoURL) {
  const video = document.createElement('video');
  video.src = videoURL;
  video.onloadeddata = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw first frame of video
    video.play();
    video.addEventListener('play', function() {
      ctx.drawImage(video, 0, 0);

      // Load the overlay and apply
      const overlayImage = new Image();
      overlayImage.src = 'jorkin.gif';  // Your fixed GIF
      overlayImage.onload = function() {
        ctx.drawImage(overlayImage, 50, 50);  // Adjust the position of the overlay

        // Allow UI to update
        setTimeout(() => {
          canvas.toBlob(function(blob) {
            previewBlobURL = URL.createObjectURL(blob);
            displayPreview(previewBlobURL);
          }, 'image/gif');
        }, 0); // Ensure UI refresh
      };
    });
  };

  video.onerror = function() {
    alert("There was an error loading the video.");
    document.getElementById('output-container').innerHTML = "";
  };
}

function displayPreview(blobURL) {
  const outputContainer = document.getElementById('output-container');
  outputContainer.innerHTML = '';

  const resultGif = document.createElement('img');
  resultGif.src = blobURL;
  outputContainer.appendChild(resultGif);

  // Show preview and save buttons
  document.getElementById('preview-btn').style.display = 'inline-block';
  document.getElementById('save-btn').style.display = 'inline-block';
}

document.getElementById('preview-btn').addEventListener('click', function() {
  if (previewBlobURL) {
    const previewWindow = window.open(previewBlobURL);
    previewWindow.document.write('<img src="' + previewBlobURL + '" />');
  } else {
    alert("No preview available.");
  }
});

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
