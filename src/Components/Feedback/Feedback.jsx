import React, { useState } from 'react';
import html2canvas from 'html2canvas';

import './Feedback.css';

function Feedback() {
  const [feedbackText, setFeedbackText] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [images, setImages] = useState([]);

  const handleScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body);
      const screenshotData = canvas.toDataURL('image/png');
      setScreenshot(screenshotData);
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  const handleSubmit = () => {
    const feedbackData = {
      text: feedbackText,
      screenshot,
      images,
    };
    console.log('Feedback submitted:', feedbackData);
    // Here you can send the feedbackData to your backend
    handleScreenshot();
  };

  return (
    <div className="Feedback">
      <h2>Feedback</h2>
      <div className="feedback-container">
        <textarea
          placeholder="Digite sua solicitação aqui..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="feedback-textarea"
        />
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        {images.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <h4>Imagens enviadas:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Uploaded ${index}`} style={{ maxWidth: '100px' }} />
              ))}
            </div>
          </div>
        )}
        <button className="feedback-button" type="button" onClick={handleSubmit}>Enviar Feedback</button>
      </div>
    </div>
  );
}

export default Feedback;
