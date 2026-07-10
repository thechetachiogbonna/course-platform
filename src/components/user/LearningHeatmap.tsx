"use client";

import { useMemo, useState } from "react";

type Props = {
  activity: ActivityDay[];
  currentStreak: number;
};

export default function LearningHeatmap({ activity, currentStreak }: Props) {
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);

  const activityMap = useMemo(() => {
    return new Map(activity.map((day) => [day.date, day.secondsWatched]));
  }, [activity]);

  const calendar = useMemo(() => {
    const today = new Date();

    const firstDayOfTheYear = new Date(`${today.getFullYear()}-01-01`);

    const days: ActivityDay[] = [];

    for (let i = 0; i < 365; i++) {
      const date = new Date(firstDayOfTheYear);

      date.setDate(firstDayOfTheYear.getDate() + i);

      const key = formatDate(date);

      days.push({
        date: key,
        secondsWatched: activityMap.get(key) ?? 0,
      });
    }

    return days;
  }, [activityMap]);

  const weeks = useMemo(() => {
    const result: (ActivityDay | null)[][] = [];

    let currentWeek: (ActivityDay | null)[] = new Array(7).fill(null);

    calendar.forEach((day) => {
      const date = new Date(day.date);

      const index = (date.getDay() + 6) % 7;

      currentWeek[index] = day;

      const isSunday = index === 6;

      if (isSunday) {
        result.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    });

    if (currentWeek.some(Boolean)) {
      result.push(currentWeek);
    }

    return result;
  }, [calendar]);

  const monthLabels = useMemo(() => {
    return weeks.map((week, weekIndex) => {
      const firstDay = week.find((day): day is ActivityDay => day !== null);

      if (!firstDay) return "";

      const month = new Date(firstDay.date).getMonth();

      if (weekIndex === 0) {
        return new Date(firstDay.date).toLocaleString(undefined, {
          month: "short",
        });
      }

      const previousFirstDay = weeks[weekIndex - 1].find(
        (day): day is ActivityDay => day !== null,
      );

      if (!previousFirstDay) return "";

      const previousMonth = new Date(previousFirstDay.date).getMonth();

      if (month !== previousMonth) {
        return new Date(firstDay.date).toLocaleString(undefined, {
          month: "short",
        });
      }

      return "";
    });
  }, [weeks]);

  return (
    <div className="glass-card rounded-2xl border border-[#252525] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Learning Activity</h3>

          <p className="mt-1 text-sm text-gray-400">
            {currentStreak > 0
              ? `${currentStreak} day streak 🔥`
              : "No active streak"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Less</span>

          <div className="h-3 w-3 rounded-sm bg-[#2a2a2a]" />

          <div className="h-3 w-3 rounded-sm bg-brand-yellow/30" />

          <div className="h-3 w-3 rounded-sm bg-brand-yellow/60" />

          <div className="h-3 w-3 rounded-sm bg-brand-yellow" />

          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <div className="w-max">
          {/* Month row */}
          <div className="flex ml-8 mb-2 gap-0.75">
            {monthLabels.map((label, index) => (
              <div key={index} className="w-3.25 text-[10px] text-gray-400">
                {label}
              </div>
            ))}
          </div>

          <div className="flex gap-0.75">
            {/* Day labels */}
            <div className="flex flex-col justify-between mr-2 text-[10px] text-gray-400">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="h-3.25">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.75">
                {week.map((day, dayIndex) => (
                  <div
                    key={day?.date ?? `${weekIndex}-${dayIndex}`}
                    onMouseEnter={() => day && setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-3.25 w-3.25 rounded-sm ${
                      day ? getCellColor(day.secondsWatched) : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 h-5 text-sm text-gray-400">
        {hoveredDay ? (
          <>
            <span className="text-brand-yellow">
              {formatPrettyDate(hoveredDay.date)}
            </span>

            {" • "}

            {formatDuration(hoveredDay.secondsWatched)}
          </>
        ) : (
          "Hover over a day to see your activity."
        )}
      </div>
    </div>
  );
}

function getCellColor(seconds: number) {
  if (seconds === 0) {
    return "bg-[#2a2a2a]";
  }

  if (seconds < 600) {
    return "bg-brand-yellow/30";
  }

  if (seconds < 1800) {
    return "bg-brand-yellow/60";
  }

  return "bg-brand-yellow";
}

function getDayLabel(dayIndex: number) {
  if (dayIndex === 0) return "Mon";
  if (dayIndex === 1) return "Tue";
  if (dayIndex === 2) return "Wed";
  if (dayIndex === 3) return "Thu";
  if (dayIndex === 4) return "Fri";
  if (dayIndex === 5) return "Sat";
  if (dayIndex === 6) return "Sun";
}

function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateMonthLabel(date: Date) {
  return date
    .toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    })
    .split(" ")[0];
}

function formatPrettyDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(seconds: number) {
  if (seconds === 0) {
    return "No activity";
  }

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m watched`;
  }

  return `${minutes}m watched`;
}
