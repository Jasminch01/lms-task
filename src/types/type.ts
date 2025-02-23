export type Tcourse = {
  _id: string;
  thumbnail: string;
  title: string;
  price: string;
  description: string;
};

export type Tuser = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export interface Tlecture {
  _id: string;
  moduleId: string;
  title: string;
  videoUrl: string;
  pdfNotes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  completed?: boolean;
  unlocked?: boolean;
}

export interface Tmodule {
  _id: string;
  courseId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  moduleNumber: number;
  __v: number;
  lectures: Tlecture[];
}

export type TcourseProps = {
  course: Tcourse;
};
