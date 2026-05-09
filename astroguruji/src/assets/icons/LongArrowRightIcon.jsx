import PropTypes from "prop-types";

const LongArrowRightIcon = ({
  width = 17,
  height = 17,
  color = "currentColor",
  className = "",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_long_arrow)">
      <path
        d="M16.2509 7.76511C16.2507 7.76492 16.2506 7.76469 16.2503 7.7645L12.8949 4.42528C12.6436 4.17512 12.237 4.17605 11.9868 4.42746C11.7366 4.67883 11.7375 5.08541 11.9889 5.3356L14.2417 7.5775H0.642159C0.287494 7.5775 0 7.865 0 8.21966C0 8.57433 0.287494 8.86182 0.642159 8.86182H14.2417L11.9889 11.1037C11.7376 11.3539 11.7366 11.7605 11.9868 12.0119C12.237 12.2633 12.6436 12.2642 12.895 12.014L16.2504 8.67482C16.2506 8.67463 16.2507 8.67441 16.2509 8.67421C16.5024 8.42319 16.5016 8.0153 16.2509 7.76511Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_long_arrow">
        <rect width="16.4393" height="16.4393" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

LongArrowRightIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default LongArrowRightIcon;
