// API Response Types (matching original mars-photo-api format)

export interface CameraResponse {
  id: number;
  name: string;
  full_name: string;
}

export interface RoverResponse {
  name: string;
}

export interface PhotoResponse {
  id: number;
  img_src: string;
  sol: number;
  earth_date: string;
  camera: CameraResponse;
  rover: RoverResponse;
}

export interface PhotosAPIResponse {
  photos: PhotoResponse[];
}

export interface ManifestPhoto {
  sol: number;
  earth_date: string;
  total_photos: number;
  cameras: string[];
}

export interface PhotoManifest {
  name: string;
  landing_date: string;
  max_date: string;
  max_sol: number;
  total_photos: number;
  photos: ManifestPhoto[];
}

export interface ManifestAPIResponse {
  photo_manifest: PhotoManifest;
}

// NASA RSS Feed Types

export interface NASAImageFiles {
  full_res: string;
  large: string;
  medium: string;
  small: string;
}

export interface NASACamera {
  instrument: string;
}

export interface NASAImage {
  camera: NASACamera;
  sample_type: string;
  date_taken_utc: string;
  image_files: NASAImageFiles;
}

export interface NASASolResponse {
  images: NASAImage[];
}

export interface NASALatestResponse {
  latest_sol: number;
  total: number;
}
