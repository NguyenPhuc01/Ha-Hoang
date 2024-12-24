import React from "react";

const FullPageLoader: React.FC = () => {
  return (
    <div
      id="loading"
      className="bg-[#00000099] w-full h-full fixed top-0 left-0 z-[5000] flex items-center justify-center"
    >
      <span className="loader"></span>
    </div>
  );
};

export default FullPageLoader;
