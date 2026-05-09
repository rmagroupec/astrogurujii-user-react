import PropTypes from "prop-types";
import BrandLogoMidIcon from "./BrandLogoMidIcon";

const BrandLogoSmallIcon = ({ size = 14, className = "", ...props }) => (
  <div
    className={`rounded-full bg-brand-orange ${className}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
    {...props}
  >
    <BrandLogoMidIcon
      width={14}
      height={14}
      className="p-1 scale-[2] h-full w-full"
    />
  </div>
);

BrandLogoSmallIcon.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default BrandLogoSmallIcon;
