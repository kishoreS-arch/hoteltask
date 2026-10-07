import { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  description: '',
  latitude: '',
  longitude: '',
  price: '',
  image: '',
};

function HotelForm({ mode = 'add', initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    ...defaultForm,
    ...initialData,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.image ? `http://localhost:5000${initialData.image}` : ''
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const nextFormData = {
      ...defaultForm,
      ...initialData,
    };

    setFormData(nextFormData);
    setImageFile(null);
    setImagePreview(initialData?.image ? `http://localhost:5000${initialData.image}` : '');
  }, [
    mode,
    initialData?.title,
    initialData?.description,
    initialData?.latitude,
    initialData?.longitude,
    initialData?.price,
    initialData?.image,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title || !formData.title.trim()) {
      nextErrors.title = 'Title is required.';
    }

    if (!formData.description || !formData.description.trim()) {
      nextErrors.description = 'Description is required.';
    }

    if (!formData.latitude || Number.isNaN(Number(formData.latitude))) {
      nextErrors.latitude = 'Latitude must be a valid number.';
    }

    if (!formData.longitude || Number.isNaN(Number(formData.longitude))) {
      nextErrors.longitude = 'Longitude must be a valid number.';
    }

    if (!formData.price || Number(formData.price) <= 0 || Number.isNaN(Number(formData.price))) {
      nextErrors.price = 'Price must be a valid positive number.';
    }

    if (mode === 'add' && !imageFile) {
      nextErrors.image = 'Image is required.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('latitude', String(formData.latitude));
    submitData.append('longitude', String(formData.longitude));
    submitData.append('price', String(formData.price));

    if (imageFile) {
      submitData.append('image', imageFile);
    }

    if (onSubmit) {
      onSubmit(submitData, formData);
    }
  };

  const handleFormKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <div className="form-grid">
        <div className="form-group form-group--full">
          <label htmlFor="image">Hotel Image</label>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          {errors.image && <span className="error-message">{errors.image}</span>}
          {imagePreview && (
            <img src={imagePreview} alt="Hotel preview" className="image-preview" />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
          />
          {errors.latitude && <span className="error-message">{errors.latitude}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
          />
          {errors.longitude && <span className="error-message">{errors.longitude}</span>}
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {mode === 'edit' ? 'Update Hotel' : 'Create Hotel'}
        </button>
      </div>
    </form>
  );
}

export default HotelForm;
