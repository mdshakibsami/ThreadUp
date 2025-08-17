import React from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const handelSubmit = (e) => {
    e.preventDefault();
    // const email = e.target.email.value;
    // console.log(email);

    e.target.reset();
    Swal.fire({
      icon: "success",
      title: "Thank you for subscribing",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  return (
    <div className="rounded-xl shadow-lg  py-10  bg-[#eeeeee]  mx-4 sm:mx-10 my-12 border border-[#eeeeee]">
      <h2 className="text-3xl font-bold text-[#e43636] mb-3 text-center tracking-tight">
        Subscribe to Our Newsletter
      </h2>
      <p className="text-center text-gray-700 mb-8 text-base max-w-5xl mx-auto">
        Get the latest updates, announcements, and exclusive content delivered
        straight to your inbox. Stay connected with ThreadUp and never miss out
        on community news!
      </p>
      <form
        onSubmit={handelSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 justify-center"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          className="bg-[#fef4f1] text-black px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e43636] w-full sm:w-auto"
          required
        />
        <input
          type="submit"
          value="Subscribe"
          className="bg-[#e43636] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
        />
      </form>
    </div>
  );
};

export default Newsletter;
