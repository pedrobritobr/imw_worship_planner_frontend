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
        <label htmlFor="file-upload" className="feedback-file-label">
          Selecionar arquivo
          <input type="file" id="file-upload" className="feedback-file-input" multiple accept="image/*" onChange={handleImageUpload} />
        </label>
        <button className="feedback-submit" type="button" onClick={handleSubmit}>Enviar Feedback</button>
        {images.length > 0 && (
          <div className="feedback-images-container">
            <p>Imagens selecionadas:</p>
            <div className="feedback-images">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Uploaded ${index}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
