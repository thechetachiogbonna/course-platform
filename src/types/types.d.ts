type User = {
  id: string;
  clerk_user_id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  image_url: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

interface Product {
  id: string;
  name: string;
  courses: Course[];
  description: string;
  price: number;
  imageUrl: string;
  status: "public" | "private";
  created_at: Date;
}

interface Course {
  id: string;
  name: string;
  description: string;
  updated_at: string;
}

interface Section {
  id: string;
  courseId: string;
  name: string;
  status: "public" | "private";
  order: number;
}

interface Lesson {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  youtubeVideoId: string;
  status: "public" | "private" | "preview";
  order: number;
}
