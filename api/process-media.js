const sharp = require('sharp');
const fetch = require('node-fetch');
const path = require('path');

module.exports = async (req, res) => {
    try {
        // Ensure the method is POST
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Only POST requests are allowed' });
        }

        // Read the media and URL data from the request
        const mediaFile = req.body.media; // Assuming this comes as form-data
        const mediaUrl = req.body.url;    // URL input from the frontend

        // Process the media with sharp (for images or GIFs)
        let mediaBuffer;

        if (mediaFile) {
            // Process the file input
            mediaBuffer = await sharp(mediaFile.buffer)
                .composite([{ input: path.join(__dirname, 'public', 'jorkin.gif'), gravity: 'southwest' }])
                .toBuffer();
        } else if (mediaUrl) {
            // Download and process the media from a URL
            const response = await fetch(mediaUrl);
            const buffer = await response.buffer();
            mediaBuffer = await sharp(buffer)
                .composite([{ input: path.join(__dirname, 'public', 'jorkin.gif'), gravity: 'southwest' }])
                .toBuffer();
        }

        res.setHeader('Content-Type', 'image/gif');
        res.send(mediaBuffer); // Return the combined GIF
    } catch (error) {
        res.status(500).json({ error: 'Error processing media: ' + error.message });
    }
};
