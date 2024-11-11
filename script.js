document.getElementById('overlay-btn').addEventListener('click', function() {
  const fileURL = document.getElementById('file-input').value;
  if (!fileURL) {
    alert("Please enter a valid URL.");
    return;
  }

  const outputContainer = document.getElementById('output-container');
  outputContainer.innerHTML = "Processing...";

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
    ctx.drawImage(image, 0, 0);
    const overlayImage = new Image();
    overlayImage.src = 'jorkin.gif';  // Your fixed GIF
    overlayImage.onload = function() {
      ctx.drawImage(overlayImage, 50, 50);  // Adjust the position of the overlay
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        displayResult(url);
      }, 'image/gif');
    };
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
    video.play();
    ctx.drawImage(video, 0, 0);
    const overlayImage = new Image();
    overlayImage.src = 'jorkin.gif';  // Your fixed GIF
    overlayImage.onload = function() {
      ctx.drawImage(overlayImage, 50, 50);  // Adjust the position of the overlay
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        displayResult(url);
      }, 'image/gif');
    };
  };
}

function displayResult(blobURL) {
  const outputContainer = document.getElementById('output-container');
  outputContainer.innerHTML = '';
  const resultGif = document.createElement('img');
  resultGif.src = blobURL;
  outputContainer.appendChild(resultGif);
}
