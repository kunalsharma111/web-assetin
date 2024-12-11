import React from "react";

const About = ({ number, type }) => {
  return (
    
      <div className="flex flex-row justify-start items-center gap-5 ">
        <p className="text-3xl font-bold">{number}</p>
        <p className=" w-40">{type}</p>
      </div>
    
  );
};

export default About;