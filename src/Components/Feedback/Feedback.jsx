import React, { useState } from 'react';
import { toBlob } from 'html-to-image';
import imageCompression from 'browser-image-compression';

import { useDialog } from '@/Context/DialogContext';

import { postFeedback } from '@/service';

import './Feedback.css';

function Feedback() {
  const [feedbackText, setFeedbackText] = useState('');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showDialog } = useDialog();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    newImages.splice(index, 1);
    newImageFiles.splice(index, 1);
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!feedbackText) {
        showDialog({
          title: 'Campo de feedback obrigatório',
          message: 'Por favor, preencha o campo de feedback.',
          autoClose: true,
        });
        return;
      }

      const screenshotBlob = await toBlob(document.body, {
        filter: (node) => !(
          node.classList
          && node.classList.contains('menu-container')
          && node.classList.contains('open')
        ),
      });

      const compressionOptions = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const screenshotFile = new File([screenshotBlob], 'screenshot.png', {
        type: 'image/png',
      });

      const compressedScreenshot = await imageCompression(screenshotFile, compressionOptions);

      const compressedUserImages = await Promise.all(
        imageFiles.map((file) => imageCompression(file, compressionOptions)),
      );

      const formData = new FormData();
      formData.append('feedbackText', feedbackText);
      formData.append('image0', compressedScreenshot, 'screenshot.png');
      compressedUserImages.forEach((file, index) => formData.append(`image${index + 1}`, file, file.name));

      await postFeedback(formData);

      showDialog({
        title: 'Feedback enviado com sucesso!',
        message: 'Obrigado por nos ajudar a melhorar!',
        autoClose: true,
      });

      setFeedbackText('');
      setImages([]);
      setImageFiles([]);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      showDialog({
        title: 'Ocorreu um erro ao enviar seu feedback.',
        message: 'Por favor, tente novamente mais tarde.',
        autoClose: true,
      });
    } finally {
      setIsLoading(false);
    }
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
          <input
            type="file"
            id="file-upload"
            className="feedback-file-input"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
        <button className="feedback-submit" type="button" onClick={handleSubmit} disabled={isLoading}>
          {
            isLoading
              ? <span className="loader" />
              : 'Enviar Feedback'
          }
        </button>
        {images.length > 0 && (
          <div className="feedback-images-container">
            <p>Imagens selecionadas:</p>
            <div className="feedback-images">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => removeImage(index)}
                  aria-label={`Remover imagem ${index}`}
                >
                  <img src={image} alt={`Imagem ${index}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
