"use client"
import ModuleLectureManagement from '@/Components/ModuleLectureManagement';
import { useParams } from 'next/navigation';
import React from 'react';

const Modulepage = () => {
    const { id } = useParams();
    console.log(id)
    return (
        <div className='h-screen'>
            <ModuleLectureManagement/>
        </div>
    );
};

export default Modulepage;