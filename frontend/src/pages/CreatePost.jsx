import { useState, useEffect } from 'react';
import { 
  PenTool, 
  Save, 
  Eye, 
  Type, 
  AlignLeft, 
  Hash, 
  Calendar, 
  Globe, 
  Lock, 
  Image, 
  Link,
  Bold,
  Italic,
  List,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  X,
  Plus
} from 'lucide-react';

// Mock API for demonstration
const postAPI = {
  create: async (postData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation
    if (postData.title.length < 5) {
      throw new Error('Title must be at least 5 characters long');
    }
    
    return {
      data: {
        id: Date.now(),
        ...postData,
        createdAt: new Date().toISOString()
      }
    };
  }
};

function CreatePost() {
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    category: 'Tutorial',
    tags: [],
    isPublic: true,
    scheduledDate: '',
    excerpt: '',
    coverImage: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [currentTag, setCurrentTag] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  const categories = [
    'Tutorial', 'Guide', 'Opinion', 'Education', 'News', 
    'Review', 'Interview', 'Case Study', 'Research'
  ];

  // Calculate word count and reading time
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadTime(Math.max(1, Math.ceil(words / 200))); // Average reading speed: 200 wpm
  }, [formData.content]);

  // Auto-generate excerpt
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const excerpt = formData.content.substring(0, 150).trim();
      setFormData(prev => ({ 
        ...prev, 
        excerpt: excerpt + (formData.content.length > 150 ? '...' : '') 
      }));
    }
  }, [formData.content, formData.excerpt]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }
    
    if (formData.scheduledDate && new Date(formData.scheduledDate) <= new Date()) {
      newErrors.scheduledDate = 'Scheduled date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      e.preventDefault();
      addTag();
    }
  };

  const insertFormatting = (format) => {
    const textarea = document.querySelector('textarea[name="content"]');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertText = '';
    switch (format) {
      case 'bold':
        insertText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        insertText = `*${selectedText || 'italic text'}*`;
        break;
      case 'list':
        insertText = `\n- ${selectedText || 'list item'}`;
        break;
      default:
        return;
    }
    
    const newContent = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 0);
  };

  const saveDraft = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      setNotification({ message: 'Nothing to save as draft', type: 'info' });
      return;
    }
    
    setIsDraft(true);
    setNotification({ message: 'Draft saved successfully!', type: 'success' });
    
    // Simulate saving to localStorage or API
    setTimeout(() => setIsDraft(false), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({ message: 'Please fix the errors below', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await postAPI.create(formData);
      setNotification({ 
        message: 'Post created successfully! Redirecting...', 
        type: 'success' 
      });
      
      // Simulate navigation
      setTimeout(() => {
        alert('Redirecting to home page...');
      }, 2000);
      
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to create post. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled Post'}</h1>
      
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{formData.category}</span>
        <span>{readTime} min read</span>
        <span>{wordCount} words</span>
      </div>
      
      {formData.excerpt && (
        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-gray-700 italic">{formData.excerpt}</p>
        </div>
      )}
      
      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {formData.content || 'Start writing your content...'}
      </div>
      
      {formData.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center space-x-1">
                    <Type className="h-4 w-4" />
                    <span>{wordCount} words</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <AlignLeft className="h-4 w-4" />
                    <span>{readTime} min read</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={saveDraft}
                disabled={isDraft}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Draft</span>
              </button>
              
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  previewMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {previewMode ? (
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderPreview()}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Title */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter an engaging title..."
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 text-xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    maxLength="100"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.title ? (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    ) : (
                      <div></div>
                    )}
                    <span className="text-sm text-gray-500">{formData.title.length}/100</span>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b px-6 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Content</span>
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          type="button"
                          onClick={() => insertFormatting('bold')}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                          title="Bold"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('italic')}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                          title="Italic"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('list')}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                          title="Bullet List"
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <textarea
                      name="content"
                      rows="16"
                      placeholder="Start writing your post content here...

You can use basic markdown formatting:
- **bold text**
- *italic text*
- Create lists with dashes

Share your knowledge, insights, or stories with the community!"
                      value={formData.content}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.content && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Optional)
                  </label>
                  <textarea
                    name="excerpt"
                    rows="3"
                    placeholder="Brief description of your post..."
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    maxLength="200"
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/200</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 flex items-center space-x-1">
                      {formData.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      <span>{formData.isPublic ? 'Public' : 'Private'}</span>
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule for Later (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="tagInput"
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="20"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim() || formData.tags.length >= 5}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  {formData.tags.length}/5 tags added
                </p>
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <PenTool className="h-5 w-5" />
                  <span>{formData.scheduledDate ? 'Schedule Post' : 'Publish Post'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
