const express = require('express');
const bodyParser = require('body-parser');
const sharp = require('sharp'); // For image processing
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('uploads'));

app.post('/combine', async (req, res) => {
    const { mediaLink, corner } = req.body;

    // Validate media link and process the GIF
    // (Add your logic to download the media, combine with jorkin.gif, and save the result)

    // Example response
    res.json({ success: true, combinedGif: 'path/to/combined.gif' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost