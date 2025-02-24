import CourseUpload from '@/Components/CourseForm';
import Courses from '@/Components/Courses';
import React from 'react';

const DashBoardpage = () => {
    return (
        <div>
           <CourseUpload/>
           <Courses/>
        </div>
    );
};

export default DashBoardpage;