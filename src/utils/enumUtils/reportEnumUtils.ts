import { ColorSchemeType } from "native-base/lib/typescript/components/types";

export const reportTypes = [
  // {
  //   type: "DRIVER_NOT_COMING",
  //   text: "Tài xế không đến"
  // },
  {
    type: "BOOKER_NOT_COMING",
    text: "Khách hàng không đến",
  },
  {
    type: "OTHER",
    text: "Khác",
  },
];

export const getReportText = (type: string) => {
  switch (type) {
    case "BOOKER_NOT_COMING":
      return "Khách hàng không đến";
    case "OTHER":
      return "Khác";
    default:
      return "Khác";
  }
};

export const getReportStatusBadgeColorScheme = (
  status: string
): ColorSchemeType => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PROCESSED":
      return "success";
    case "DENIED":
      return "error";
    default:
      return "coolGray";
  }
};

export const getReportStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Đang chờ xử lý";
    case "PROCESSED":
      return "Đã xử lý";
    case "DENIED":
      return "Đã từ chối";
    default:
      return "Khác";
  }
};
