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
  sku: string;
  description: string;
  price: number;
  image: string;
  status: "Public" | "Private";
}

interface Course {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  productId: string;
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
  videoId: string;
  status: "public" | "private" | "preview";
  order: number;
}

type ActiveView =
  | "dashboard"
  | "inventory"
  | "courses"
  | "journey"
  | "competitions"
  | "settings"
  | "catalog-entry"
  | "add-section"
  | "new-lesson";

interface AlertItem {
  id: string;
  message: string;
  type: "warning" | "info";
  date: string;
}
