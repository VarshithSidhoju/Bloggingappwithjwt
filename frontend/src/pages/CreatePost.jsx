import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../api';

function CreatePost() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postAPI.create(formData);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;