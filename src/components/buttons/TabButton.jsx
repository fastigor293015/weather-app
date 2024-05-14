import { forwardRef } from "react";

const TabButton = forwardRef((props, ref) => {
  const { className, active, children, ...otherProps } = props;

  return (
    <button ref={ref} className={["btn tab-button", className, active ? "active" : ""].join(" ")} {...otherProps}>
      {children}
    </button>
  );
})

export default TabButton;
