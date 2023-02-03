/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function GalleryFilter({
  setCurrentFilteredImages,
  activeCamera,
  setActiveCamera,
  setActiveCameraName,
  fetchedPhotos,
  setNumberOfFilteredPhotos,
}) {
  const [availableCameras, setAvailableCameras] = useState([]);

  // Get unique camera names and ids
  // Only show cameras that have photos
  const getCameras = () => {
    const cameraArr = [];
    let loading = true;
    if (loading) {
      fetchedPhotos.map((cameras) => {
        cameraArr.push({
          camera: cameras.camera.id,
          full_name: cameras.camera.full_name,
        });
        return cameraArr;
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
  const [value, setValue] = useState(activeCamera);
  useEffect(() => {
    getCameras();
    setActiveCamera(0);
    setValue(0);
  }, [fetchedPhotos]);

  useEffect(() => {
    const filtered = fetchedPhotos.filter(
      (photo) => photo.camera.id === activeCamera
    );

    activeCamera === 0
      ? setCurrentFilteredImages(fetchedPhotos)
      : setCurrentFilteredImages(filtered);

    setNumberOfFilteredPhotos(filtered.length);
  }, [activeCamera]);

  const handleCameraChange = (event) => {
    setActiveCamera(event.target.value);
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ m: 0 }}>
      <InputLabel>SELECT CAMERA</InputLabel>
      <Select
        sx={{ m: 0, minWidth: 210 }}
        defaultValue={value}
        value={value}
        onChange={handleCameraChange}
        id="camera__select"
        label="SELECT CAMERA"
        autoWidth
      >
        <MenuItem value={0}>
          <em>All Cameras</em>
        </MenuItem>
        {Object.keys(availableCameras).map((camera) => {
          const cameraID = parseInt(camera);
          const cameraFullName = availableCameras[camera];
          return (
            <MenuItem
              key={camera}
              value={cameraID}
              onClick={() => setActiveCameraName(cameraFullName)}
            >
              {cameraFullName}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
