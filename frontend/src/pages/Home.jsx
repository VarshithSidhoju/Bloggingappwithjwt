import { useState, useEffect } from 'react';
import { postAPI } from '../api';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    postAPI.getAll()
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>All Posts</h2>
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>By: {post.author?.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;