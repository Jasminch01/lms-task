"use client";
import { Tcourse } from "@/types/type";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiCoupon3Fill } from "react-icons/ri";
import { TiStarHalfOutline } from "react-icons/ti";

const CourseDetailsPage = () => {
  const [course, setCourse] = useState<Tcourse | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/course?courseId=${id}`,
          {
            withCredentials: true,
          }
        );
        setCourse(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse();
  }, [id]);

  const { title, price, description, thumbnail } = course || {
    _id: "",
    title: "",
    description: "",
    price: "",
    thumbnail: "",
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col-reverse md:flex-row gap-5">
        <div className="space-y-5 w-full md:w-1/2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {title}
          </h1>
          <p className="flex items-center text-[#2563EB]">
            4.3 <TiStarHalfOutline color="#2563EB" /> <span>(500 rating)</span>
          </p>
          <p className="text-gray-600 leading-relaxed">
            {description.slice(0, 160)}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <Link href={`/lecture/${course?._id || "1"}`}>
              <button className="py-2 px-5 bg-[#2563EB] text-white rounded">
                Enroll now
              </button>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <p className="text-xl font-semibold">$ {price}</p>
              <button className="flex items-center gap-2">
                <RiCoupon3Fill />
                Promo code{" "}
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <div className="p-1 border rounded">
              <h2 className="text-sm">50 live classes</h2>
            </div>
            <div className="p-1 border rounded">
              <p className="text-sm">20+ project</p>
            </div>
            <div className="p-1 border rounded">
              <p className="text-sm">remaining 2days</p>
            </div>
            <div className="p-1 border rounded">
              <p className="text-sm">100+ pre-recorded videos</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-5">
            <div className="p-2 border rounded">
              <h2 className="font-semibold">Job placement support</h2>
            </div>
            <div className="p-2 border rounded">
              <p className="font-semibold">
                Lifetime Access to Class Recordings
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 md:h-72 overflow-hidden rounded-lg mb-6">
          <Image
            src={thumbnail || "/path/to/default-thumbnail.png"}
            alt={title}
            width={500}
            height={500}
            className="w-full xl:h-full h-72 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
