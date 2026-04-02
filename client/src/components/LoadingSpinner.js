import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full`}
      />
    </div>
  );
};

export default LoadingSpinner;
