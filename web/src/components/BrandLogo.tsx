import logo from "../assets/images/LIMINAAA.png";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

const BrandLogo = ({
  className = "h-8 w-auto",
  alt = "Limina logo",
}: BrandLogoProps) => {
  return <img src={logo} alt={alt} className={className} />;
};

export default BrandLogo;
