"use client";

import { calendarEvents } from "@/lib/data";
import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={[Views.WORK_WEEK, Views.DAY]}
      view={view}
      onView={handleOnChangeView}
      min={new Date(2024, 1, 0, 8, 0, 0)}
      max={new Date(2024, 1, 0, 17, 0, 0)}
      style={{ height: "98%" }}
    />
  );
};

export default BigCalendar;
