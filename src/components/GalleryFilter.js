import { useEffect, useState } from "react";

export default function GalleryFilter({
  images,
  setFilteredPhotos,
  activeCamera,
  setActiveCamera,
  setActiveCameraName,
}) {
  const [availableCameras, setAvailableCameras] = useState([]);

  const getCameras = () => {
    setActiveCamera(0);
    const cameraArr = [];
    let loading = true;
    if (loading) {
      images.map((cameras) => {
        cameraArr.push({
          camera: cameras.camera.id,
          full_name: cameras.camera.full_name,
        });
      });
      const uniqueCamerasIds = [
        ...new Set(cameraArr.map((data) => data.camera)),
      ];
      const uniqueCamerasNames = [
        ...new Set(cameraArr.map((data) => data.full_name)),
      ];
      const cameraHolderArr = uniqueCamerasIds.map((el, i) => {
        return [uniqueCamerasIds[i], uniqueCamerasNames[i]];
      });

      const uniqueCameras = Object.fromEntries(cameraHolderArr);
      setAvailableCameras(uniqueCameras);
      loading = false;
    }
  };
  useEffect(() => {
    getCameras();
  }, [images]);

  useEffect(() => {
    const filtered = images.filter((photo) => photo.camera.id === activeCamera);
    {
      activeCamera === 0
        ? setFilteredPhotos(images)
        : setFilteredPhotos(filtered);
    }
  }, [activeCamera]);

  return (
    <div className="dropdown">
      <div className="dropdown__btn">Select Camera</div>
      <div className="dropdown__content">
        <button
          onClick={() => {
            setActiveCamera(0);
            setActiveCameraName("All Cameras");
          }}
          className={activeCamera === 0 ? "active" : ""}
        >
          All Cameras
        </button>
        {Object.keys(availableCameras).map((camera) => {
          const cameraID = parseInt(camera);
          const cameraName = availableCameras[camera];
          return (
            <button
              key={camera}
              className={activeCamera === cameraID ? "active" : ""}
              onClick={() => {
                setActiveCamera(cameraID);
                setActiveCameraName(cameraName);
              }}
            >
              {cameraName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
