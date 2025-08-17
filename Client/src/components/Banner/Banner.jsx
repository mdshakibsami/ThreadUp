import laptopImg from "../../assets/Banner/banner.svg";

const Banner = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center bg-[#eeeeee] sm:px-10 px-4 py-16 min-h-[60vh] gap-8">
      {/* Left: Text */}
      <div className="order-2 md:order-1 text-left md:pr-12 mb-8 md:mb-0">
        <h2 className="text-3xl  md:text-5xl font-semibold text-[#E43636] mb-4">
          Where stories connect <br></br> and communities grow.
        </h2>
        <p className="mb-6 text-gray-700 text-justify text-base md:text-lg">
          Welcome to a modern social blogging platform designed for meaningful
          engagement and authentic connection. Share your unique stories, spark
          insightful discussions, and become part of a vibrant, growing
          community. Whether you’re posting, participating, or exploring, our
          platform is where conversations flourish and relationships are built.
        </p>
        <a
          href="/dashboard  "
          className="btn  font-bold text-white bg-[#E43636] px-6 py-2"
        >
          Get Started
        </a>
      </div>
      {/* Right: Image */}
      <div className="order-1  md:order-2 flex justify-end  mb-8 md:mb-0">
        <img
          src={laptopImg}
          alt="Banner laptop"
          className="w-full max-w-md rounded-2xl object-cover"
        />
      </div>
    </section>
  );
};

export default Banner;
