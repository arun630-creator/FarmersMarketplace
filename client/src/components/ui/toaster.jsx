import React from "react";
import PropTypes from "prop-types";

export function Toaster() {
  return <div id="toaster" className="fixed bottom-4 right-4 z-50" />;
}

export function Toast({ title, description, variant = "default" }) {
  const variantClasses = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div 
      className={`${variantClasses[variant]} border rounded-md shadow-md p-4 mb-2 max-w-xs animate-in fade-in-50 slide-in-from-bottom-5`}
    >
      {title && <h4 className="font-semibold text-sm">{title}</h4>}
      {description && <p className="text-xs mt-1 text-gray-600">{description}</p>}
    </div>
  );
}

Toast.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  variant: PropTypes.oneOf(["default", "destructive"]),
};