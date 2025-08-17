import Swal from "sweetalert2";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  const handelSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    // const name = form.elements["name"].value;
    // const email = form.elements["email"].value;
    // const subject = form.elements["subject"].value;
    // const message = form.elements["message"].value;

    // console.log({ name, email, subject, message });

    Swal.fire({
      icon: "success",
      title: "Thank you for your mail!",
      text: "I'll respond to you soon.",
      confirmButtonColor: "#E43636",
    });
    form.reset();
  };
  return (
    <>
      {/* Contact Section */}
      <div className="w-full mx-auto bg-[#eeeeee] rounded-2xl shadow-lg sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Contact Info */}
          <div className="flex flex-col justify-center md:items-start items-center text-gray-700 gap-6">
            <h2 className="text-3xl font-bold text-[#E43636] mb-2 text-left md:text-left">
              Contact Information
            </h2>
            <p className="text-lg text-gray-600  mb-4 text-center md:text-left">
              Fill up the form and I'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col gap-6 w-full items-center sm:items-start">
              <div className="flex items-center gap-4">
                <div
                  className="bg-[#E43636] rounded-xl p-3 flex items-center justify-center"
                  style={{ width: 48, height: 48 }}
                >
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-lg">Email</span>
                  <p className="text-gray-700">shakib.sami2.0@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="bg-[#E43636] rounded-xl p-3 flex items-center justify-center"
                  style={{ width: 48, height: 48 }}
                >
                  <FaPhoneAlt className="text-white text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-lg">Phone</span>
                  <p className="text-gray-700">+880 1700534241</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="bg-[#E43636] rounded-xl p-3 flex items-center justify-center"
                  style={{ width: 48, height: 48 }}
                >
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-lg">Location</span>
                  <p className="text-gray-700">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <span className="font-bold text-lg mb-2 block">
                Connect with me
              </span>
              <div className="flex gap-4">
                <a
                  href="https://github.com/mdshakibsami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl p-3 hover:bg-[#E43636] hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.833.091-.646.35-1.088.636-1.34-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/mdshakibsami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl p-3 hover:bg-[#E43636] hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.156 1.459-2.156 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
                  </svg>
                </a>
                <a
                  href="mailto:shakib.sami2.0@gmail.com"
                  className="bg-white rounded-xl p-3 hover:bg-[#E43636] hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm-16 12V8.99l8 6.99 8-6.99V18H4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <form
            onSubmit={handelSubmit}
            className="bg-[#fff5f2] rounded-2xl shadow-lg p-8 flex flex-col gap-4 justify-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Md Shakib"
                  name="name"
                  className="input input-bordered w-full bg-[#eeeeee] border-[#E43636] focus:border-[#E43636] focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-gray-700">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="shakib@example.com"
                  className="input input-bordered w-full bg-[#eeeeee] border-[#E43636] focus:border-[#E43636] focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="How can I help you?"
                className="input input-bordered w-full bg-[#eeeeee] border-[#E43636] focus:border-[#E43636] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Your message here..."
                className="textarea textarea-bordered w-full bg-[#eeeeee] border-[#E43636] focus:border-[#E43636] focus:outline-none"
                rows={4}
                required
              ></textarea>
            </div>
            <input
              type="submit"
              value="➤  Send Message"
              className="btn text-white font-bold px-6 py-2 rounded bg-[#E43636] transition-all duration-200 flex items-center justify-center gap-2"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
