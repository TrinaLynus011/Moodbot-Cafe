// src/pages/Wall.js
import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Wall() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await API.post('/posts', { content: text.slice(0, 300), media });
      setPosts([res.data, ...posts]);
      setText("");
      setMedia(null);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setMedia(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Trim long text for preview
  const truncateText = (str, maxWords = 12) => {
    const words = str.split(' ');
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/sakura-5470_256.gif')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed", // Keeps background fixed while scrolling
      position: "relative",
      paddingBottom: "2rem"
    }}>
      {/* Frosted overlay — semi-transparent, doesn't block scroll */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
        zIndex: 1
      }} />

      <Container style={{ paddingTop: "2rem", position: "relative", zIndex: 2, paddingBottom: "2rem" }}>
        <h2 className="text-center mb-3" style={{ color: "#B33B83", fontWeight: 700, fontSize: "1.8rem" }}>
          {currentUser?.name || 'User'}'s Community Wall 🌸
        </h2>

        {/* New Post Form */}
        <Card className="p-2 mb-3 shadow-sm" style={{
          borderRadius: 16,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(6px)",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <Form onSubmit={handlePost}>
            <Form.Control
              as="textarea"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 300))}
              rows={2}
              style={{ borderRadius: 12, fontSize: "0.95rem", padding: "0.5rem" }}
            />
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Form.Control
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                size="sm"
                style={{ fontSize: "0.8rem", width: "auto" }}
              />
              <Button 
                type="submit" 
                size="sm"
                style={{ 
                  borderRadius: 12, 
                  background: "#C95FA3", 
                  border: "none", 
                  fontSize: "0.85rem",
                  padding: "0.25rem 0.75rem"
                }}
              >
                Post
              </Button>
            </div>
          </Form>
        </Card>

        {/* Posts Feed */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "0.75rem",
          marginTop: "1rem",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          {posts.length === 0 ? (
            <p className="text-center" style={{ color: "#6A1B5D", fontSize: "0.95rem" }}>
              No posts yet. Be the first to share! 🌸
            </p>
          ) : (
            posts.map(post => (
              <Card
                key={post._id}
                className="shadow-sm"
                style={{
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(5px)",
                  padding: "0.75rem",
                  fontSize: "0.9rem"
                }}
              >
                <div style={{
                  fontWeight: "bold",
                  color: "#B33B83",
                  fontSize: "0.9rem",
                  marginBottom: "0.2rem"
                }}>
                  {post.userName}{" "}
                  <small style={{ color: "#6A1B5D", fontWeight: "normal", fontSize: "0.75rem" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div style={{ marginBottom: "0.4rem", lineHeight: 1.4 }}>
                  {truncateText(post.content)}
                </div>
                {post.media && (
                  post.media.includes("video") || post.media.endsWith(".mp4") ? (
                    <video
                      controls
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        maxHeight: "180px",
                        objectFit: "cover"
                      }}
                    >
                      <source src={post.media.trim()} />
                    </video>
                  ) : (
                    <img
                      src={post.media}
                      alt="post"
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        maxHeight: "180px",
                        objectFit: "cover"
                      }}
                    />
                  )
                )}
              </Card>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}