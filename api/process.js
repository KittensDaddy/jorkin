const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new FormData();
      const file = req.body;  // Get the file from the request

      // Ensure the file is valid
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Process the file (image or video)
      const output = path.join('/tmp', 'output.gif');
      if (file.mimetype.startsWith('image')) {
        // Image processing with sharp
        await sharp(file.buffer)
          .resize(400)
          .composite([{ input: 'public/jorkin.gif', gravity: 'center' }])
          .toFile(output);
        res.sendFile(output);
      } else if (file.mimetype.startsWith('video')) {
        // Video processing with ffmpeg
        ffmpeg(file.buffer)
          .input('public/jorkin.gif')
          .complexFilter(['[0:v][1:v] overlay=W-w-10:H-h-10 [out]'])
          .output(output)
          .on('end', () => {
            res.sendFile(output);
          })
          .on('error', (err) => {
            res.status(500).json({ error: 'Error processing the video' });
          })
          .run();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error processing media' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
