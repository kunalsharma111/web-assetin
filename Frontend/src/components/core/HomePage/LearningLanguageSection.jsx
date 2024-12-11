import React from "react";
import HighlightText from "../HomePage/HighlightText";
import Knowyourprogress from "../../../assets/Images/Know_your_progress.png";
import ComparewithOther from "../../../assets/Images/Compare_with_others.png";
import Planyourlessons from "../../../assets/Images/Plan_your_lessons.png";

const LearningLanguageSection = () => {
  return (
    <div className=" flex flex-col justify-center items-center">
      <div className=" w-[54%] text-3xl font-bold text-black mt-20 mb-2">
        <p>
          Your swiss knife for{" "}
          <HighlightText text={"learning any language"}></HighlightText>
        </p>
      </div>
      <div className=" w-[50%] text-center">
        Using spin making learning multiple language easy. with 20+ languages
        realistic voice-over, progress tracking custom schedule and more
      </div>

      <div className="  flex flex-row items-center justify-center">
        <img
          src={Knowyourprogress}
          alt="KnowyourprogressImage"
          className="object-contain -mr-[90px]"
        />
        <img
          src={ComparewithOther}
          alt="ComparewithOtherImage"
          className="object-contain"
        />
        <img
          src={Planyourlessons}
          alt="PlanyourlessonsImage"
          className="object-contain -ml-36"
        />
      </div>
    </div>
  );
};

export default LearningLanguageSection;