import React from "react";

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

import timelineImage from "../../../assets/Images/TimelineImage.png";

import About from "../HomePage/About";

const timeline = [
  {
    Logo: Logo1,
    heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    Description: "Student will always be our top priority",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    heading: "Solve the Problem",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div className=" flex flex-row justify-center items-center gap-10">
      <div >
        {timeline.map((element, index) => {
          return (
            <div
              className="flex flex-row justify-start items-center gap-14 mb-12"
              key={index}
            >
              <div className=" w-5 ">
                <img src={element.Logo} alt="logo.png" />
              </div>

              <div className=" flex flex-col">
                <p className="font-bold">{element.heading}</p>
                <p>{element.Description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className=" p-3 relative">
        <img
          src={timelineImage}
          alt="timelineImage"
          className="shadow-white object-cover h-fit"
        />

        <div className="absolute translate-x-[20%] translate-y-[-50%] bg-caribbeangreen-600 flex flex-row gap-4 text-white uppercase px-5 py-7 ">
          <About number={10} type={"years of experience"} />

          {/* TODO: divider lgana hai */}

          <About number={250} type={"types of courses"} />
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;