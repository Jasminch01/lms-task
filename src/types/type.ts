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

export type TcourseProps = {
  course: Tcourse;
};
