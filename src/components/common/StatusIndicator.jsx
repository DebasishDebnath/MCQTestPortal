import React from "react";

const StatusIndicator = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : "pending";

  const getStatusConfig = (status) => {
    switch (status) {
      case "live":
        return {
          label: "Ongoing",
          pingColor: "bg-emerald-200",
          dotColor: "bg-emerald-400",
          statusClass: "bg-emerald-100",
          textColor: "text-emerald-700",
        };
      case "draft":
        return {
          label: "Upcoming",
          pingColor: "bg-sky-200",
          dotColor: "bg-sky-400",
          statusClass: "bg-sky-100",
          textColor: "text-sky-700",
        };
      case "closed":
        return {
          label: "Completed",
          pingColor: "bg-slate-200",
          dotColor: "bg-slate-400",
          statusClass: "bg-slate-100",
          textColor: "text-slate-700",
        };
      case "pending":
        return {
          label: "Pending",
          pingColor: "bg-amber-200",
          dotColor: "bg-amber-400",
          statusClass: "bg-amber-100",
          textColor: "text-amber-700",
        };
      default:
        return {
          label: "Unknown",
          pingColor: "bg-neutral-200",
          dotColor: "bg-neutral-400",
          statusClass: "bg-neutral-100",
          textColor: "text-neutral-700",
        };
    }
  };

  const statusConfig = getStatusConfig(normalizedStatus);

  return (
    <span className="inline-flex items-center gap-3 text-sm ">
      {/* Dot + Ping */}
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusConfig.pingColor} opacity-75`}
        ></span>
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${statusConfig.dotColor}`}
        ></span>
      </span>

      {/* Label */}
      <span
        className={`${statusConfig.statusClass} ${statusConfig.textColor} px-2 py-1 rounded`}
      >
        {statusConfig.label}
      </span>
    </span>
  );
};

export default StatusIndicator;
