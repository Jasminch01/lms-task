"use client";
import CourseUpload from "@/Components/CourseForm";
import Courses from "@/Components/Courses";
import useCurrentUser from "@/utls/UsecurrentUser";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const DashBoardpage = () => {
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;

  // Fetch current user data
  const { data: currentUser } = useCurrentUser(userEmail || "");

  if (!currentUser) {
    redirect("/sign-in");
  }

  if (currentUser.role !== "admin") {
    redirect("/");
  }
  return (
    <div>
      <CourseUpload />
      <Courses />
    </div>
  );
};

export default DashBoardpage;
