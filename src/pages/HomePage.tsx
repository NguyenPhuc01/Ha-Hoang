import dayjs from "dayjs";
import { CheckInRecord } from "../util/home.type";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const HomePage = () => {
  const [dataCheckIn, setDataCheckIn] = useState<CheckInRecord[]>([]);
  // useEffect(() => {
  //   console.log("subbbbbbb");

  //   subscribeToMessage();
  //   return () => unsubscribeFromMessage();
  // }, [subscribeToMessage, unsubscribeFromMessage]);
  useEffect(() => {
    getListCheckIn();
  }, []);
  const getListCheckIn = async () => {
    const userId = localStorage.getItem("userData");
    if (userId) {
      const res = await axiosInstance.get(
        `check/listCheckIn/${JSON.parse(userId)._id}`
      );
      if (res.status === 200) {
        setDataCheckIn(res.data);
      }
    }
  };

  const getDaysInMonth = (year: number, month: number, currentDay: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month, currentDay);
    const daysInMonth = [];

    while (startDate <= endDate) {
      const day = startDate.getDate();
      const dayOfWeek = startDate.toLocaleString("vi-VN", { weekday: "long" });

      daysInMonth.push({ day, dayOfWeek });
      startDate.setDate(startDate.getDate() + 1);
    }

    return daysInMonth.reverse();
  };

  const today = dayjs();
  const days = getDaysInMonth(today.year(), today.month(), today.date());
  const calculateWorkingHours = (checkIn: string, checkOut: string) => {
    const checkInTime = dayjs(checkIn);
    const checkOutTime = dayjs(checkOut);

    const duration = checkOutTime.diff(checkInTime, "hour", true); // Tính số giờ, có phần thập phân nếu có
    return duration.toFixed(2); // Return the duration as a string with two decimal places
  };
  return (
    <div className="h-full bg-base-200">
      <div className="overflow-x-auto ">
        <table className="table">
          {/* head */}
          <thead className="">
            <tr>
              <th></th>
              <th>Ngày</th>
              <th>Giờ check-in</th>
              <th>Giờ check-out </th>
              <th>Vị trí check-in</th>
              <th>Tổng </th>
            </tr>
          </thead>
          <tbody className="">
            {/* row 1 */}
            {console.log("days", days)}
            {days.map((item, index) => {
              const reversedIndex = days.length - 1 - index;
              return (
                <tr className="" key={reversedIndex}>
                  <th></th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{`${
                          item.day < 10 ? "0" + item.day : item.day
                        }/${today.month()}/${today.year()}`}</div>
                        <div className="text-sm opacity-50">
                          {item.dayOfWeek}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {dataCheckIn[index]?.checkInTime
                        ? dayjs(dataCheckIn[index]?.checkInTime).format("HH:mm")
                        : "-"}
                    </span>
                  </td>
                  <td>
                    {" "}
                    <span className="badge badge-ghost badge-sm">
                      {dataCheckIn[index]?.checkOutTime
                        ? dayjs(dataCheckIn[index]?.checkOutTime).format(
                            "HH:mm"
                          )
                        : "-"}
                    </span>
                  </td>
                  <th>
                    <span className="badge badge-ghost badge-sm">
                      {dataCheckIn[index]?.location
                        ? dataCheckIn[index]?.location
                        : "-"}
                    </span>
                  </th>
                  <th>
                    <span className="badge badge-ghost badge-sm">
                      {calculateWorkingHours(
                        dataCheckIn[index]?.checkInTime,
                        dataCheckIn[index]?.checkOutTime
                      )}
                    </span>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
