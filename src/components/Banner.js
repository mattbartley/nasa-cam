import "../css/Banner.css";

export default function Banner() {
  // ↓ Currently selected camera filter for photo gallery - 0 state returns all - real cameras have unique ids

  return (
    <header className="banner">
      <div className="banner_container">
        <div className="banner__content">
          <h1 className="banner__title">NASA.CAM</h1>
          <p className="banner__subtitle">
            Raw Images Collected Directly From Mars
          </p>

          <p className="banner__text">
            A direct connection to official NASA mission images. Explore the
            images by camera, Rover, and by date.
            <span className="banner__subtext">
              ALL Images Credited to NASA/JPL-Caltech
            </span>
          </p>
          <button className="banner__btn">See Latest Images</button>
        </div>
      </div>
    </header>
  );
}
