import React from "react";
import { Card } from "@/components/ui/card";

interface Activity {
  time: string;
  title: string;
  description: string;
  type: "borrow" | "return" | "overdue";
}

interface DailyActivityProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity["type"]) => {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center";
  switch (type) {
    case "borrow":
      return (
        <div className={`${baseClasses} bg-blue-100 text-blue-600`}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      );
    case "return":
      return (
        <div className={`${baseClasses} bg-green-100 text-green-600`}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    case "overdue":
      return (
        <div className={`${baseClasses} bg-red-100 text-red-600`}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
  }
};

export const DailyActivity = ({ activities }: DailyActivityProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 