export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Neural Link Pro X1",
    sku: "PROD-NL-X1",
    description:
      "Next-generation direct-brain interface with 1024-channel telemetry for immersive productivity.",
    price: 1299.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJG3k-alwuRDTisuK4IDEPQvcyhr8EyEVBPUr8qXQJquc4pVqWdXHBKOIv9yipXzjn8rnpyUcNM9NqDmLiEjsCo4ZiJVE3IXcyX0aizZjLmjg9bTT05E8Kb1aGsggTsJg4R5nxx5P1tIm14EH6aaWB6trEp3DNyYT7wsal2jpUBB8MhO-S_MkXFljOmBiwgrk_4IkWm0E-TFd1AoZBrOK9wv_Y76Am-j5E14BH0b_m5OkUPB1UR_-V0PGQ8PGfKlE6vBOH_UujonQ",
    status: "Public",
  },
  {
    id: "prod-2",
    name: "Quantum Haptic Glove",
    sku: "PROD-QH-G2",
    description:
      "Ultra-responsive haptic feedback with sub-millisecond latency for precise remote manipulation.",
    price: 849.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxgaWi-Nohxr7LwtlpMsyAWjSoYS8saWJkz43BjTDbwczavlq3voF-_keWZZX40ZKlw22GAp6aej6Pe53giM2RKkPUV2HSySF-xuShuLAqgbZSotgsnyYj2B6GmtyWvgsM26YJxILvlKAoTtUAlX0wO8RutliT-Dom1Bd2B5BvV5vvf3s3cuCMBD73I2liTm3TNLv9Yuu3m2AZ-XROy0hkTUxXbSCyO_Ue9yxfDGtNmtK5FAnPT4dhP8MO4-2jcpIhwYTGkHifft8",
    status: "Private",
  },
  {
    id: "prod-3",
    name: "Core AI V4 Module",
    sku: "PROD-AI-V4",
    description:
      "Dedicated hardware acceleration for large language models and real-time generative agents.",
    price: 2499.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCD1QkuNinxe-TaN67ITGLBsYI6jan5rmnigpRnrPubQd1X87r-GS6UDeQW63Vn2zMJUQAdFlo5H7H9fm6E-WTAFlem6_sja69JVIM_o3SUAIfI9KaZeoxoIBoJpqM5a6MI1K0eLLwmSClIflbInE8Q4NNCFdLUIHeclSDbIj48o7arbKtuQgpKif6zeEzQimruFubsETOmqzrFMORN-mDoazI0inBHrX4pM-Ac87XL38b4XIbGEZWvMyi-8w9XAhgB-NNQpH3pZOI",
    status: "Public",
  },
  {
    id: "prod-4",
    name: "Prism Console",
    sku: "PROD-PC-88",
    description:
      "Centralized smart control for home and laboratory environments with voice-AI integration.",
    price: 599.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbyxUzGb2sbqk1fMAV-XPfcSKZhkF-INcoLCJ7DxlYGjbKNdzzajbeL7M_pQ_3vZnh1UEoirM2lj8E6bwRdzYhJqmnafwSyg_2eIGwXqcwYhV0LzDA2XLhSqUslJ2ycSnAyo6JKKKEg6O3sEcx28AS3OBeRWraAsTaNikBTFplzVI9UGKBHmyzqG8Syxw-LZRPJ8Ej0uQFD_MrV8ZEA4d-Pz7Je9M3qB5lVyTMXBG5w8n4HFkXE3YMAOceLdqg4KK38bLKs49_DRc",
    status: "Public",
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    name: "Advanced Neural Networks",
    description: "Mastering architectures and GANs",
    lastModified: "2 hours ago",
    productId: "PROD-NN-992",
  },
  {
    id: "course-2",
    name: "LLM Fine-Tuning 101",
    description: "Customizing models for enterprise",
    lastModified: "Oct 12, 2023",
    productId: "PROD-LL-441",
  },
  {
    id: "course-3",
    name: "Generative Art Pipeline",
    description: "Automating creative workflows",
    lastModified: "Yesterday",
    productId: "PROD-GA-882",
  },
  {
    id: "course-4",
    name: "Scalable AI Infrastructure",
    description: "Cloud deployments & monitoring",
    lastModified: "5 days ago",
    productId: "PROD-IF-210",
  },
];

export const INITIAL_SECTIONS: Section[] = [
  {
    id: "sec-1",
    courseId: "course-1",
    name: "Fundamentals of Attention",
    status: "public",
    order: 1,
  },
  {
    id: "sec-2",
    courseId: "course-1",
    name: "Transformers and Recurrent Architectures",
    status: "public",
    order: 2,
  },
  {
    id: "sec-3",
    courseId: "course-1",
    name: "Adversarial Networks & Diffusion Mechanics",
    status: "private",
    order: 3,
  },
  {
    id: "sec-4",
    courseId: "course-2",
    name: "Instruction Dataset Engineering",
    status: "public",
    order: 1,
  },
  {
    id: "sec-5",
    courseId: "course-3",
    name: "Latent Space Navigation",
    status: "public",
    order: 1,
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: "les-1",
    sectionId: "sec-1",
    name: "Introduction to Attention Mechanisms",
    description:
      "Learn why classic Seq2Seq models struggle on long sentences and how alignment vectors solve it.",
    videoId: "dQw4w9WgXcQ",
    status: "preview",
    order: 1,
  },
  {
    id: "les-2",
    sectionId: "sec-1",
    name: "Query, Key, and Value Vectors Explained",
    description:
      "Visualizing the fundamental matrix multiplications that define self-attention.",
    videoId: "dQw4w9WgXcQ",
    status: "public",
    order: 2,
  },
  {
    id: "les-3",
    sectionId: "sec-1",
    name: "Scaled Dot-Product Complexity",
    description:
      "Understanding why we scale by square-root of depth to keep softmax gradients from flatlining.",
    videoId: "dQw4w9WgXcQ",
    status: "private",
    order: 3,
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "alert-1",
    message:
      "Low stock on Quantum Haptic Glove (only 2 units remaining in EMEA sandbox!).",
    type: "warning",
    date: "Just now",
  },
  {
    id: "alert-2",
    message:
      'Course "LLM Fine-Tuning 101" is currently in Draft; needs section validation.',
    type: "info",
    date: "2 hours ago",
  },
  {
    id: "alert-3",
    message:
      "Regulatory compliance certificate renewal required for direct-brain neural hardware integrations.",
    type: "warning",
    date: "Yesterday",
  },
];
