import dayjs from "dayjs";
import { UserData } from "../util/home.type";

const HomePage = () => {
  // useEffect(() => {
  //   console.log("subbbbbbb");

  //   subscribeToMessage();
  //   return () => unsubscribeFromMessage();
  // }, [subscribeToMessage, unsubscribeFromMessage]);
  const dataTest: UserData[] = [
    {
      id: 1,
      name: "User 1",
      timeCheckIn: "2024-12-17T01:55:29.243Z",
      timeCheckOut: "2024-12-17T10:00:29.243Z",
      locationCheckIn: "Location 1",
      timeWorking: "2 hours",
      imagePicture: "https://img.daisyui.com/images/profile/demo/2@94.webp",
    },
  ];
  const generateDataFor30Days = (data: UserData[]) => {
    const dataFor30Days: UserData[] = [];
    for (let i = 0; i < 30; i++) {
      const dayData = data.map((userData) => ({
        ...userData, // sao chép dữ liệu từ `dataTest`
        day: `Day ${i + 1}`, // thêm thông tin ngày
      }));
      dataFor30Days.push(...dayData);
    }
    return dataFor30Days;
  };

  const dataFor30Days = generateDataFor30Days(dataTest);
  // Hàm lấy tất cả các ngày trong tháng với thứ tương ứng
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

            {days.map((item, index) => {
              const reversedIndex = days.length - 1 - index;
              return (
                <tr className="">
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
                      {dayjs(dataFor30Days[reversedIndex]?.timeCheckIn).format(
                        "HH:mm"
                      )}
                    </span>
                  </td>
                  <td>
                    {" "}
                    <span className="badge badge-ghost badge-sm">
                      {dayjs(dataFor30Days[reversedIndex]?.timeCheckOut).format(
                        "HH:mm"
                      )}
                    </span>
                  </td>
                  <th>
                    <span className="badge badge-ghost badge-sm">
                      {dataFor30Days[reversedIndex]?.locationCheckIn}
                    </span>
                  </th>
                  <th>
                    <span className="badge badge-ghost badge-sm">
                      {calculateWorkingHours(
                        dataFor30Days[reversedIndex]?.timeCheckIn,
                        dataFor30Days[reversedIndex]?.timeCheckOut
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
