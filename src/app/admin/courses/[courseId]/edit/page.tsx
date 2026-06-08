"use client";

import {
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_SECTIONS,
} from "@/app/constants";
import LessonForm from "@/components/admin/LessonForm";
import SectionForm from "@/components/admin/SectionForm";
import { FolderOpen, PlaySquare, Plus } from "lucide-react";
import { useState } from "react";

const selectedCourse = INITIAL_COURSES[0];
const selectedCourseSections = INITIAL_SECTIONS;

function EditCoursePage() {
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-6 rounded-2xl border border-[#252525] shadow-lg space-y-6 w-full mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#252525] pb-4 gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#e2ec00]" />
            <div>
              <span className="text-[9px] text-[#e2ec00] font-bold font-mono tracking-widest block">
                CURRICULUM TREE
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {selectedCourse.name}
              </h3>
            </div>
          </div>

          <button className="bg-[#e2ec00]/10 border border-[#e2ec00]/30 text-[#e2ec00] text-xs font-bold py-2 px-4 rounded-xl hover:bg-[#e2ec00]/20 transition-all flex items-center gap-1 uppercase tracking-wider">
            <Plus className="w-3.5 h-3.5" />
            <SectionForm
              course={selectedCourse}
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </button>
        </div>

        {selectedCourseSections.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            Syllabus structure empty. Click "Add Section" to compile curriculum
            blocks.
          </div>
        ) : (
          <div className="space-y-4">
            {selectedCourseSections.map((section, idx) => {
              // Find lessons for each section
              const sectionLessons = INITIAL_LESSONS.filter(
                (l) => l.sectionId === section.id,
              ).sort((a, b) => a.order - b.order);

              return (
                <div
                  key={section.id}
                  className="border border-[#252525] bg-[#111]/40 rounded-xl overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-[#1e1e1e]/60 p-4 flex items-center justify-between border-b border-[#252525]/40 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] text-[#c9c8ab] font-mono">
                        SECTION #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {section.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white/5 border border-white/10 text-[#c9c8ab] px-2 py-0.5 rounded font-mono uppercase">
                        {section.status}
                      </span>

                      <button className="text-[#e2ec00] hover:text-white border border-[#e2ec00]/20 hover:border-[#e2ec00] text-[10px] font-bold py-1 px-3 rounded-lg flex items-center gap-1 uppercase transition-all">
                        <Plus className="w-3 h-3" />
                        <LessonForm
                          sectionName={selectedCourseSections[0].name}
                          onSubmit={() => {}}
                          onCancel={() => {}}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Section Lessons */}
                  <div className="divide-y divide-[#252525]/20">
                    {sectionLessons.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500 italic">
                        No lessons recorded in this section module. Press "Add
                        Lesson" to populate clips.
                      </div>
                    ) : (
                      sectionLessons.map((lesson) => (
                        <LessonForm
                          key={lesson.id}
                          sectionName={selectedCourseSections[1].name}
                          onSubmit={() => {}}
                          onCancel={() => {}}
                        >
                          <div className="w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="p-2 rounded-lg bg-[#e2ec00]/10 text-[#e2ec00] shrink-0 mt-0.5">
                              <PlaySquare className="w-4 h-4" />
                            </div>
                            <div className="grow min-w-0">
                              <div className="flex items-start gap-2 justify-between">
                                <div className="flex flex-col justify-center items-start">
                                  <h5 className="text-xs font-bold text-white truncate">
                                    {lesson.name}
                                  </h5>

                                  <p className="text-[11px] text-[#c9c8ab] mt-1 lead-relaxed line-clamp-2">
                                    {lesson.description}
                                  </p>
                                  {lesson.videoId && (
                                    <span className="text-[9px] text-[#e2ec00]/60 font-mono mt-1 block">
                                      Tip: Click a lesson to edit
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-[#c9c8ab]/60 font-mono">
                                    Order: {lesson.order}
                                  </span>
                                  <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded font-bold uppercase text-[#e2ec00]">
                                    {lesson.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </LessonForm>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default EditCoursePage;
