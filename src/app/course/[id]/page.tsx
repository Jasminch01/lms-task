"use client";
import { Tcourse } from "@/types/type";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseDetailsPage = () => {
  const [course, Setcourse] = useState<Tcourse>({});
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/course?courseId=${id}`,
          {
            withCredentials: true,
          }
        );
        Setcourse(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse();
  }, [id]);

  console.log(course);
  const { thumbnail, title, price, description } = course;

  return (
    <div className="max-w-6xl mx-auto py-20 bg-white">
      <div className="flex gap-5">
        <div className="space-y-5">
          <h1 className="text-xl md:text-4xl font-bold text-gray-800">
            {title}
          </h1>
          <p className="text-gray-600 leading-relaxed">{description}</p>
          <div className="flex items-center space-x-5">
            <button className="py-2 px-5 bg-[#2563EB] text-white rounded">
              Enroll Now
            </button>
            <div className="flex items-center flex-col md:flex-row space-x-3">
              <p className="text-2xl font-semibold">$ {price}</p>
              <p>use promo</p>
            </div>
          </div>
        </div>
        <div className=" w-1/2 md:h-96 overflow-hidden rounded-lg mb-6">
          <Image src={""} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
