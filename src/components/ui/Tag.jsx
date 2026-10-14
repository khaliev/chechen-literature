import './Tag.css';

const Tag = ({ label, active = false, onClick }) => {
  return (
    <span
      className={`tag ${active ? 'tag--active' : ''} ${onClick ? 'tag--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </span>
  );
};

export default Tag;
