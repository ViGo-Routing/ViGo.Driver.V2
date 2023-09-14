import { useState } from "react";
import { FilterBookingStation } from "../screens/Home/FilterBookingModal";

export const useFilterBookingHook = () => {
  const [filterStartDate, setFilterStartDate] = useState(null as Date | null);
  const [filterEndDate, setFilterEndDate] = useState(null as Date | null);
  const [filterStartPickupTime, setFilterStartPickupTime] = useState(
    null as Date | null | undefined
  );
  const [filterEndPickupTime, setFilterEndPickupTime] = useState(
    null as Date | null | undefined
  );
  const [filterStartLocation, setFilterStartLocation] = useState(
    null as FilterBookingStation | null
  );
  const [filterEndLocation, setFilterEndLocation] = useState(
    null as FilterBookingStation | null
  );
  const [filterStartLocationRadius, setFilterStartLocationRadius] = useState(5);
  const [filterEndLocationRadius, setFilterEndLocationRadius] = useState(5);

  const [isDate, setIsDate] = useState(false);
  const [isPickupTime, setIsPickupTime] = useState(false);
  const [isStartStation, setIsStartStation] = useState(false);
  const [isEndStation, setIsEndStation] = useState(false);

  return {
    filterStartDate,
    setFilterStartDate,
    filterEndDate,
    setFilterEndDate,
    filterStartPickupTime,
    setFilterStartPickupTime,
    filterEndPickupTime,
    setFilterEndPickupTime,
    filterStartLocation,
    setFilterStartLocation,
    filterEndLocation,
    setFilterEndLocation,
    filterStartLocationRadius,
    setFilterStartLocationRadius,
    filterEndLocationRadius,
    setFilterEndLocationRadius,
    isDate,
    setIsDate,
    isPickupTime,
    setIsPickupTime,
    isStartStation,
    setIsStartStation,
    isEndStation,
    setIsEndStation,
  };
};
