import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import cameraCheckIn from "../assets/camera-checkin.svg";
import checkInSuccess from "../assets/icon-checkin-success-blue.png";
import { useLoading } from "../components/LoadingProvider";
const CheckInPage = () => {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [timeCheckIn, setTimeCheckIn] = useState("");
  const scanningRef = useRef(false);
  const showDialogSuccess = useRef<HTMLDialogElement>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const { setLoading } = useLoading();
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Kiểm tra quyền truy cập camera
      const cameraPermission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      // Kiểm tra quyền truy cập vị trí
      const locationPermission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (
        cameraPermission.state === "granted" &&
        locationPermission.state === "granted"
      ) {
        setCameraPermissionGranted(true);
        console.log("Camera and geolocation permissions granted");
      } else {
        setCameraPermissionGranted(false);
        console.log("Camera and/or geolocation permissions not granted");
      }

      // Yêu cầu quyền truy cập camera nếu chưa được cấp
      if (cameraPermission.state !== "granted") {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      // Yêu cầu quyền truy cập vị trí nếu chưa được cấp
      if (locationPermission.state !== "granted") {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }

      // Kiểm tra lại sau khi yêu cầu quyền
      const finalCameraPermission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      const finalLocationPermission = await navigator.permissions.query({
        name: "geolocation",
      });

      setCameraPermissionGranted(
        finalCameraPermission.state === "granted" &&
          finalLocationPermission.state === "granted"
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setCameraPermissionGranted(false);
    }
  };

  const startScanning = async () => {
    if (videoElement.current && cameraPermissionGranted) {
      if (!qrScanner) {
        const scanner = new QrScanner(
          videoElement.current,
          (result) => {
            if (scanningRef.current) {
              scanner.stop();
              setScanning(false);
              console.log("QR code detected:", result);
              onDetect(result);
              scanningRef.current = false;
            }
          },
          {
            highlightScanRegion: true,
          }
        );
        setQrScanner(scanner);
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          stream.getTracks().forEach((track) => track.stop()); // Stop the stream after checking
        }
      } catch (error) {
        console.error("Cannot access camera:", error);
        return;
      }

      await qrScanner?.start();

      if (qrScanner) {
        setScanning(true);
        scanningRef.current = true;
      }
    }
  };

  const stopScanning = async () => {
    if (qrScanner) {
      qrScanner.stop();
      setScanning(false);
    }
  };

  const onDetect = async (content: any) => {
    // to do call api checkIn here
    console.log("🚀 ~ QR Code detected: ", content);
    setLoading(true);

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      console.log(latitude, longitude);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (showDialogSuccess.current) {
            const currentDate = new Date();

            setTimeCheckIn(
              `${currentDate.getHours()}:${currentDate.getMinutes()}`
            );
            setLoading(false);

            showDialogSuccess.current.showModal();
          }
          console.log("data", data);
        });
    });
  };

  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, [qrScanner]);

  return (
    <div>
      <div className="rounded-lg py-4 py-md-8 text-center text-md-left border border-solid border-gray-300 px-md-8">
        <h4 className="text-gray-700 font-bold text-xl">Thực hiện check in</h4>

        <div className={`${scanning ? "" : "hidden"}`}>
          <video ref={videoElement} />
        </div>

        {/* Button to start scanning */}
        {!scanning && (
          <div
            className={`w-[120px] h-[40px] flex justify-center items-center gap-x-1.5 mt-4 mt-md-[23px] mx-auto mx-md-0 text-center text-sm rounded-lg bg-[#FE771B] text-white font-semibold cursor-pointer ${
              !cameraPermissionGranted ? "cursor-not-allowed opacity-50" : ""
            } `}
            onClick={startScanning}
          >
            Check-in
            <img src={cameraCheckIn} alt="camera" />
          </div>
        )}
        {!cameraPermissionGranted && (
          <div className="mt-3">
            <span>Bạn chưa cấp quyền truy cập camera và vị trí</span>
          </div>
        )}
        {/* Button to stop scanning */}
        {scanning && (
          <div
            className="w-[120px] h-[40px] flex justify-center items-center gap-x-1.5 mt-4 mx-auto mx-lg-0 text-center text-sm rounded-lg bg-[#FE771B] text-white font-semibold cursor-pointer"
            onClick={stopScanning}
          >
            Quay lại
          </div>
        )}
      </div>
      <dialog id="my_modal_1" className="modal" ref={showDialogSuccess}>
        <div className="modal-box py-8">
          <div className="flex justify-center w-full">
            <img src={checkInSuccess} alt="" />
          </div>
          <h3 className="font-bold text-lg text-center mt-3">
            Check in thành công
          </h3>
          <div className="flex w-full justify-center">
            <span>Bạn đã check-in thành công vào lúc: {timeCheckIn}</span>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CheckInPage;
