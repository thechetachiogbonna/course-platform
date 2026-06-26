import MyCoursesList, { UserCourse } from "@/components/user/MyCoursesList";

const mockCourses: UserCourse[] = [
  {
    courseId: "1",
    courseName: "Mastering Prompt Engineering",
    courseDescription: "Learn to communicate with LLMs efficiently for complex problem solving.",
    courseImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD_d9oR-4G7AqbO1L5KioX9PISyvl_wej-f1J-t0tl55aasfGn_t8E_o0XzgTMnP13OzwD-UNiCvjY-Imna-k0By4_QHjqJL9zvbJs6x6t_KOUgBYWv11C3W1YpAwmjU6h10HVh85ZRtLwGf22s3ccdpI6csCYL-qw40KtSRCu1Pxt6MYVfG0LjYeEEWLMrBqhp9WELvfCOWwwM86RcMks5OpaKOwQDEb8ppm4pf1WGvnpHNPfvJLiOJVxR0kom4XKrSwGHuADo5g",
    totalLessons: 100,
    completedLessons: 65,
    progressPercent: 65,
    category: "AI Fundamentals",
  },
  {
    courseId: "2",
    courseName: "Advanced Data Visualization",
    courseDescription: "Transforming complex datasets into stunning interactive stories with AI.",
    courseImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoTg3VBcUU7bpZVpjKyR8OfV6BT8wf21PBRAaGwJ_4xcT2FHbK7NMBfx9qSZerv6pg6FF2Sg024bTLTkWnV2vIj1I0Ygquxb3MIXH5hVfs56LETWREpfdokFe_Up8bW6ud-VVV3UoJRPq9lYEUKVoSw6DpJYjmu3GNOtfPKNKDI09NZ6Rg8gICPdBIkLnqd4WNAOXdMPdFleEWbslx-avW8VLjDDKwZWa_gC_N8scO2SfnKjPBzczYJETD206tK1Dg51aiqBHbqAY",
    totalLessons: 100,
    completedLessons: 12,
    progressPercent: 12,
    category: "Data Science",
  },
  {
    courseId: "3",
    courseName: "Design Systems with AI",
    courseDescription: "Building scalable UI libraries using generative design workflows.",
    courseImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ3fjF79cS3rJcMeLeZyAv-5DtDOUDPK87V0-jVokgLvaHZ_Qd45apGpbanKDpXIPdPUmwgFwbuOB8EZTqt_TS3MHCEfuv7AmslU6cXgFZ6FGSAQonVKzWCOihndF9Di9pLx4o1Mmj42EXxPvJaEwYTDxFXRqrG8xu7LpTQG0hbXPDDLv8ovL8bbU0fWwA-BCARSDrR2InwdcNV7D9-d0zGCK9lO5rteARt0sG4moJ7yp9ZEWDaD7_3YFyuCQBeq0NYM-VCt1dNvY",
    totalLessons: 100,
    completedLessons: 100,
    progressPercent: 100,
    category: "UI/UX Design",
  },
  {
    courseId: "4",
    courseName: "Python for AI Agents",
    courseDescription: "Constructing autonomous agents that can plan, reason, and execute code.",
    courseImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvWz1dDKu1aDEoXYmu4gGRv12B3rBmGf0vYc0qiazdu0v86fF8FUH-xkDk7o-HFQWDUG5unfxPoxAnSbh4wJB9XNiOxWkSxYpC1oRQpdOcflVgS8yL4NtNcjbaZxSRsQwRxiC8fsa1ZBQr8EfhZ6gDaE8Y-oZh081lf9_Sz5nDbKatV4_0D6PEYfodSFRtQYpSFXJbhtN6xMn6R6AV3agxV9NaV_lgMylSo88yVNCTutaQvaBO3Bfg2dbE36wQeatKo7sTyPvQg9w",
    totalLessons: 100,
    completedLessons: 48,
    progressPercent: 48,
    category: "Backend",
  },
];

export default function CoursesPage() {
  return (
    <div className="w-full relative min-h-screen">
      <MyCoursesList courses={mockCourses} />
    </div>
  );
}