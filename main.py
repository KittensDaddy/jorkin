from flask import Flask, render_template, request, send_file
from moviepy.editor import VideoFileClip, CompositeVideoClip, ImageClip
from PIL import Image, ImageSequence
import os
import requests

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

# Path to the fixed overlay GIF
OVERLAY_GIF_PATH = 'static/jorkin.gif'

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_links():
    try:
        main_media_link = request.form['main_media']
        print(f"Received media link: {main_media_link}")

        # Ensure the upload folder exists (double-check)
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
            print(f"Created directory: {app.config['UPLOAD_FOLDER']}")

        # Paths for the downloaded media and output GIF
        main_media_path = os.path.join(app.config['UPLOAD_FOLDER'], 'main_media')
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output.gif')
        print(f"Saving media to: {main_media_path}")

        # Download the main media file from URL
        download_file(main_media_link, main_media_path)

        # Handle WebP format based on whether it's a static image or an animated GIF
        if main_media_path.endswith('.webp'):
            if is_webp_animated(main_media_path):
                print("Processing animated WebP...")
                process_video_or_gif(main_media_path, output_path)
            else:
                print("Converting static WebP to PNG...")
                main_media_path = convert_webp_to_png(main_media_path)
                process_image(main_media_path, output_path)
        elif main_media_path.endswith(('.png', '.jpg', '.jpeg', '.gif')):
            print("Processing image...")
            process_image(main_media_path, output_path)
        elif main_media_path.endswith('.mp4'):
            print("Processing video...")
            process_video_or_gif(main_media_path, output_path)

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print(f"Error occurred: {e}")
        return f"Internal Server Error: {str(e)}", 500

def download_file(url, dest_path):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(dest_path, 'wb') as f:
                f.write(response.content)
            print(f"File downloaded to {dest_path}")
        else:
            raise Exception(f"Failed to download file from {url}, status code {response.status_code}")
    except Exception as e:
        print(f"Error downloading file: {e}")
        raise

def is_webp_animated(webp_path):
    """Check if the WebP file is an animated WebP."""
    try:
        with Image.open(webp_path) as img:
            frames = len([frame for frame in ImageSequence.Iterator(img)])
            print(f"WebP is animated: {frames > 1}")
            return frames > 1
    except Exception as e:
        print(f"Error checking if WebP is animated: {e}")
        raise

def convert_webp_to_png(webp_path):
    """Convert WebP to PNG if it's a static image."""
    try:
        png_path = webp_path.replace('.webp', '.png')
        with Image.open(webp_path) as img:
            img.save(png_path, 'PNG')
        print(f"Converted WebP to PNG: {png_path}")
        return png_path
    except Exception as e:
        print(f"Error converting WebP to PNG: {e}")
        raise

def process_image(image_path, output_path):
    """Process static images (PNG, JPG, GIF) with overlay."""
    try:
        base_clip = ImageClip(image_path).set_duration(5)
        overlay_clip = VideoFileClip(OVERLAY_GIF_PATH).set_duration(5).resize(base_clip.size)
        composite = CompositeVideoClip([base_clip, overlay_clip])
        composite.write_gif(output_path)
        print(f"Image processed and saved to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")
        raise

def process_video_or_gif(media_path, output_path):
    """Process videos or animated GIFs with overlay."""
    try:
        base_clip = VideoFileClip(media_path)
        overlay_clip = VideoFileClip(OVERLAY_GIF_PATH).set_duration(base_clip.duration).resize(base_clip.size)
        composite = CompositeVideoClip([base_clip, overlay_clip])
        composite.write_gif(output_path)
        print(f"Video/GIF processed and saved to {output_path}")
    except Exception as e:
        print(f"Error processing video or GIF: {e}")
        raise

if __name__ == '__main__':
    app.run(debug=True)
