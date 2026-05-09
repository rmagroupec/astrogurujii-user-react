import PropTypes from "prop-types";

const CircleChevronRightIcon = ({
  width = 39,
  height = 39,
  color = "#FF6F00",
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
      d="M18.3355 3.82031C9.90992 3.82031 3.05566 10.6746 3.05566 19.1001C3.05566 27.5257 9.90992 34.38 18.3355 34.38C26.7611 34.38 33.6153 27.5257 33.6153 19.1001C33.6153 10.6746 26.7611 3.82031 18.3355 3.82031ZM23.0557 20.0004L16.6891 26.367C16.4408 26.6152 16.1148 26.7401 15.7888 26.7401C15.4629 26.7401 15.1369 26.6152 14.8886 26.367C14.3907 25.8691 14.3907 25.0643 14.8886 24.5665L20.355 19.1001L14.8886 13.6338C14.3908 13.1359 14.3908 12.3312 14.8886 11.8333C15.3865 11.3355 16.1912 11.3355 16.6891 11.8333L23.0557 18.1999C23.5536 18.6978 23.5536 19.5025 23.0557 20.0004Z"
      fill={color}
    />
  </svg>
);

CircleChevronRightIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default CircleChevronRightIcon;
