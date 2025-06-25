import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  User,
  Calendar,
  Eye,
  TrendingUp,
  RefreshCw,
  Plus,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Mock API for demonstration
const postAPI = {
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      data: [
        {
          _id: '1',
          title: 'Getting Started with React Hooks',
          content: 'React Hooks have revolutionized how we write React components. In this comprehensive guide, we\'ll explore useState, useEffect, and custom hooks to build powerful, reusable components.',
          author: { name: 'Sarah Johnson', avatar: '👩‍💻' },
          createdAt: '2024-06-20T10:30:00Z',
          likes: 42,
          comments: 8,
          views: 156,
          tags: ['React', 'JavaScript', 'Frontend'],
          category: 'Tutorial',
          readTime: 5
        },
        {
          _id: '2',
          title: 'The Future of Web Development',
          content: 'As we move into 2024, web development continues to evolve rapidly. From AI-powered tools to new frameworks, let\'s explore what\'s coming next in the world of web development.',
          author: { name: 'Mike Chen', avatar: '👨‍🚀' },
          createdAt: '2024-06-19T14:20:00Z',
          likes: 89,
          comments: 23,
          views: 342,
          tags: ['Web Development', 'AI', 'Future Tech'],
          category: 'Opinion',
          readTime: 8
        },
        {
          _id: '3',
          title: 'Building Scalable APIs with Node.js',
          content: 'Learn how to create robust, scalable APIs using Node.js and Express. We\'ll cover best practices, error handling, authentication, and deployment strategies.',
          author: { name: 'Alex Rivera', avatar: '🧑‍💼' },
          createdAt: '2024-06-18T09:15:00Z',
          likes: 67,
          comments: 15,
          views: 201,
          tags: ['Node.js', 'API', 'Backend'],
          category: 'Tutorial',
          readTime: 12
        },
        {
          _id: '4',
          title: 'CSS Grid vs Flexbox: When to Use What',
          content: 'Both CSS Grid and Flexbox are powerful layout tools, but knowing when to use each one can be tricky. This guide breaks down the differences and use cases.',
          author: { name: 'Emma Wilson', avatar: '🎨' },
          createdAt: '2024-06-17T16:45:00Z',
          likes: 134,
          comments: 31,
          views: 445,
          tags: ['CSS', 'Layout', 'Design'],
          category: 'Guide',
          readTime: 6
        },
        {
          _id: '5',
          title: 'Introduction to Machine Learning',
          content: 'Machine learning doesn\'t have to be intimidating. This beginner-friendly introduction covers the basics of ML concepts, algorithms, and practical applications.',
          author: { name: 'Dr. James Park', avatar: '🔬' },
          createdAt: '2024-06-16T11:30:00Z',
          likes: 98,
          comments: 19,
          views: 267,
          tags: ['Machine Learning', 'AI', 'Data Science'],
          category: 'Education',
          readTime: 15
        },
        {
          _id: '6',
          title: 'Responsive Design Best Practices',
          content: 'Creating websites that work beautifully on all devices is essential. Learn the latest responsive design techniques and mobile-first approaches.',
          author: { name: 'Lisa Zhang', avatar: '📱' },
          createdAt: '2024-06-15T13:20:00Z',
          likes: 76,
          comments: 12,
          views: 189,
          tags: ['Responsive Design', 'Mobile', 'UX'],
          category: 'Guide',
          readTime: 7
        }
      ]
    };
  }
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  const categories = ['All', 'Tutorial', 'Guide', 'Opinion', 'Education'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Viewed' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await postAPI.getAll();
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Posts</h2>
          <p className="text-gray-500">Please wait while we fetch the latest content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discover Posts</h1>
              <p className="mt-1 text-gray-600">Explore the latest articles and insights</p>
            </div>
            <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredAndSortedPosts.length === 0 ? 'No posts found' : 
             `Showing ${filteredAndSortedPosts.length} of ${posts.length} posts`}
          </p>
          <button
            onClick={fetchPosts}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Posts Grid/List */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {filteredAndSortedPosts.map(post => (
              <article
                key={post._id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
                  viewMode === 'list' ? 'p-6' : 'overflow-hidden'
                }`}
              >
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{post.views}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{post.author.avatar}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(post.createdAt)} • {post.readTime} min read</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center space-x-1 ${
                              likedPosts.has(post._id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                            } transition-colors`}
                          >
                            <Heart className={`h-4 w-4 ${likedPosts.has(post._id) ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes + (likedPosts.has(post._id) ? 1 : 0)}</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          
                          <button
                            onClick={() => handleBookmark(post._id)}
                            className={`${
                              bookmarkedPosts.has(post._id) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                            } transition-colors`}
                          >
                            <Bookmark className={`h-4 w-4 ${bookmarkedPosts.has(post._id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{post.author.avatar}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center space-x-1 ${
                              likedPosts.has(post._id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                            } transition-colors`}
                          >
                            <Heart className={`h-4 w-4 ${likedPosts.has(post._id) ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes + (likedPosts.has(post._id) ? 1 : 0)}</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          
                          <button
                            onClick={() => handleBookmark(post._id)}
                            className={`${
                              bookmarkedPosts.has(post._id) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                            } transition-colors`}
                          >
                            <Bookmark className={`h-4 w-4 ${bookmarkedPosts.has(post._id) ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button className="text-gray-500 hover:text-blue-600 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
