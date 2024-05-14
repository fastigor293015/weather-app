import { forwardRef } from "react";

const OutlinedButton = forwardRef((props, ref) => {
  const { className, children, ...otherProps } = props;

  return (
    <button ref={ref} className={["btn btn-outlined", className].join(" ")} {...otherProps}>
      {children}
    </button>
  );
})

export default OutlinedButton;
