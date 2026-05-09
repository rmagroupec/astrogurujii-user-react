import PropTypes from "prop-types";

const BrandLogoMidIcon = ({
  width = 81,
  height = 53,
  className = "",
  ...props
}) => (
  <img
    src="/images/brand-logo-mid.svg"
    alt="Brand Logo"
    width={width}
    height={height}
    className={className}
    {...props}
  />
);

BrandLogoMidIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

export default BrandLogoMidIcon;
