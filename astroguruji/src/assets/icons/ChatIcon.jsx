import PropTypes from "prop-types";

const ChatIcon = ({
  width = 22,
  height = 21,
  color = "currentColor",
  className = "",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M20 2H2v13h14l4 4V2z" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M6 8h8M6 12h5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

ChatIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default ChatIcon;
