import './Tag.css';

const Tag = ({ label, active = false, onClick }) => {
  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <span
      className={`tag ${active ? 'tag--active' : ''} ${onClick ? 'tag--clickable' : ''}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </span>
  );
};

export default Tag;
