import PropTypes from "prop-types";

const CircleChevronLeftIcon = ({
  width = 39,
  height = 39,
  color = "#E0E0E0",
  className = "",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 39 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M19.8641 3.82031C28.2896 3.82031 35.1439 10.6746 35.1439 19.1001C35.1439 27.5257 28.2896 34.38 19.8641 34.38C11.4385 34.38 4.58425 27.5257 4.58425 19.1001C4.58425 10.6746 11.4385 3.82031 19.8641 3.82031ZM15.1439 20.0004L21.5105 26.367C21.7588 26.6152 22.0847 26.7401 22.4107 26.7401C22.7367 26.7401 23.0627 26.6152 23.311 26.367C23.8088 25.8691 23.8088 25.0643 23.311 24.5665L17.8446 19.1001L23.3109 13.6338C23.8088 13.1359 23.8088 12.3312 23.3109 11.8333C22.8131 11.3355 22.0083 11.3355 21.5105 11.8333L15.1439 18.1999C14.646 18.6978 14.646 19.5025 15.1439 20.0004Z"
      fill={color}
    />
  </svg>
);

CircleChevronLeftIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default CircleChevronLeftIcon;
