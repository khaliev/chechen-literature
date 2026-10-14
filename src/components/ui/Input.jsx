import './Input.css';

const Input = ({ icon, placeholder, value, onChange, className = '', ...rest }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {icon && <span className="input-icon">{icon}</span>}
      <input
        className={`input-field ${icon ? 'input-field--with-icon' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};

export default Input;
