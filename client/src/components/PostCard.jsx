import { useNavigate } from 'react-router-dom';
import { catBadge, catEmoji, timeAgo, truncate, stripHtml } from '../lib/utils';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const excerpt = post.excerpt || truncate(stripHtml(post.body || ''), 130);

  return (
    <div className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
      {post.coverImage ? (
        <div className="post-card-cover-wrap">
          <img
            src={post.coverImage}
            alt={post.title}
            className="post-card-cover"
            loading="lazy"
            onError={e => {
              e.target.parentNode.innerHTML = `<div class="post-card-placeholder">${catEmoji(post.category)}</div>`;
            }}
          />
        </div>
      ) : (
        <div className="post-card-placeholder">{catEmoji(post.category)}</div>
      )}

      <div className="post-card-body">
        <div className="post-card-meta">
          <span className={`badge ${catBadge(post.category)}`}>{post.category}</span>
          <span>·</span>
          <span>{post.readTime || 1} min read</span>
          <span>·</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>

        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{excerpt}</p>

        <div className="post-card-footer">
          <div className="post-card-tags">
            {(post.tags || []).slice(0, 2).map(t => (
              <span key={t} className="badge badge-blue">#{t}</span>
            ))}
          </div>
          <div className="post-card-stats">
            <span>❤️ {post.likes || 0}</span>
            <span>📖 {post.readTime || 1}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
