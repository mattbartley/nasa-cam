import { useEffect, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function GalleryFilter({
  currentImages,
  setCurrentFilteredImages,
  activeCamera,
  setActiveCamera,
  setActiveCameraName,
  setImagesPerPage,
  fetchedPhotos,
  setNumberOfCams,
}) {
  const [availableCameras, setAvailableCameras] = useState([]);

  const getCameras = () => {
    setActiveCamera(0);
    const cameraArr = [];
    let loading = true;
    if (loading) {
      fetchedPhotos.map((cameras) => {
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
  }, [fetchedPhotos]);

  useEffect(() => {
    const filtered = fetchedPhotos.filter(
      (photo) => photo.camera.id === activeCamera
    );
    {
      activeCamera === 0
        ? setCurrentFilteredImages(fetchedPhotos)
        : setCurrentFilteredImages(filtered);
    }
    //console.log(imagesPerPage + " galfilter");
    console.log("filtered: " + filtered.length);
    setNumberOfCams(filtered.length);
  }, [activeCamera]);

  const cameraValue = "";
  const handleCameraChange = (event) => {
    console.log(event.target.value);
    setActiveCamera(event.target.value[0]);
    setActiveCameraName(event.target.value[1]);
  };

  return (
    <FormControl sx={{ m: 0 }}>
      <InputLabel>SELECT CAMERA</InputLabel>
      <Select
        sx={{ m: 0, minWidth: 210 }}
        value={cameraValue}
        onChange={handleCameraChange}
        id="camera__select"
        label="SELECT CAMERA"
        autoWidth
      >
        <MenuItem value={[0, "All Cameras"]}>
          <em>All Cameras</em>
        </MenuItem>
        {Object.keys(availableCameras).map((camera) => {
          const cameraID = parseInt(camera);
          const cameraFullName = availableCameras[camera];
          return (
            <MenuItem key={camera} value={[cameraID, cameraFullName]}>
              {cameraFullName}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
