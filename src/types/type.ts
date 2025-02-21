export type Tcourse = {
  id: number;
  name: string;
  image: string;
  duration: string;
  batch: string;
};

export type TcourseProps = {
  course: Tcourse;
};
