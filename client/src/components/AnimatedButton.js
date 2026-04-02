import React from "react";
import { motion } from "framer-motion";

const AnimatedButton = ({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
  loading = false,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "inertia", velocity: 500 }}
      layout
      {...props}>
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      ) : null}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
