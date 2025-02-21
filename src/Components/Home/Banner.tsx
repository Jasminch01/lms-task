// import Image from "next/image";
"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Banner() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gray-200 rounded-lg shadow-lg bg-white overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            <div className="md:w-1/2">
              <DotLottieReact
                src="https://lottie.host/cc592023-9712-4157-a7b5-f6509c882c81/5qBVUc7LPV.lottie"
                loop
                autoplay
                height={250}
              />
            </div>

            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold  mb-4">
                Master the Future of Technology
              </h1>
              <p className="text-gray-600 font-inter mb-6">
                Explore our comprehensive courses in programming, AI, cloud
                computing, and more. Start your journey today and unlock your
                potential.
              </p>
              <button className=" text-white bg-[#2563EB] font-semibold py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto">
                Learn Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
