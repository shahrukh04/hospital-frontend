import React from "react";

const ErrorAlert = ({ message }) => {
  return (
    <div className="bg-red-500 text-white p-3 rounded-md text-center">
      {message}
    </div>
  );
};

export default ErrorAlert;
