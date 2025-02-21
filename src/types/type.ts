export type Tcourse = {
  _id : string;
  thumbnail: string;
  title: string;
  price: string;
  description: string;
};

export type TcourseProps = {
  course: Tcourse;
};
