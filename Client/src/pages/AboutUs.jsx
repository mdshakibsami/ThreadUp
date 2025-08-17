import React from "react";
import Swal from "sweetalert2";
import {
  FaRegComments,
  FaUsers,
  FaLightbulb,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Contact from "../components/contact/Contact";

const AboutUs = () => {
  return (
    <div className="min-h-screen px-2 sm:px-10 bg-[#fff5f2] py-12 flex flex-col items-center justify-center">
      {/* About Us Heading and Description */}
      <div className=" w-full mb-8">
        <h1 className="text-4xl font-bold text-[#E43636] mb-4 text-center">
          About Us
        </h1>
        <p className="text-gray-700  text-lg mb-6 text-center">
          ThreadUp is a modern social blogging platform where stories connect
          and communities grow. Our mission is to empower individuals to share
          their unique experiences, spark meaningful discussions, and build
          authentic relationships in a vibrant, supportive environment. Whether
          you’re a writer, a reader, or a conversationalist, ThreadUp is
          designed to help you discover, engage, and connect.
        </p>
      </div>

      {/* Features Card */}
      <div className="px-2 sm:px-10 w-full bg-[#eeeeee] rounded-2xl shadow-lg p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-[#fff5f2] rounded-xl p-6 shadow">
            <FaLightbulb className="text-[#E43636] text-3xl mb-2" />
            <span className="text-gray-700 font-medium text-center">
              Share your stories and insights with a welcoming community.
            </span>
          </div>
          <div className="flex flex-col items-center bg-[#fff5f2] rounded-xl p-6 shadow">
            <FaRegComments className="text-[#E43636] text-3xl mb-2" />
            <span className="text-gray-700 font-medium text-center">
              Engage in thoughtful discussions and explore diverse perspectives.
            </span>
          </div>
          <div className="flex flex-col items-center bg-[#fff5f2] rounded-xl p-6 shadow">
            <FaUsers className="text-[#E43636] text-3xl mb-2" />
            <span className="text-gray-700 font-medium text-center">
              Connect with others who share your interests and passions.
            </span>
          </div>
        </div>
      </div>
      <Contact></Contact>
    </div>
  );
};

export default AboutUs;
