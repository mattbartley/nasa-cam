import "../css/Banner.css";

export default function Banner() {
  // ↓ Currently selected camera filter for photo gallery - 0 state returns all - real cameras have unique ids

  return (
    <header className="banner">
      <div className="banner_container">
        {/* <h1 className="banner__title">NASA.CAM</h1> */}
        <div className="banner__card">
          <h1 className="banner__title">
            Raw Images Collected Directly From Mars
          </h1>
          <div className="banner__content">
            <p className="banner__text">
              A direct connection to official NASA mission images. Explore the
              images by camera, Rover, and by date.
            </p>
            <button className="banner__btn">See Latest Images</button>
          </div>
        </div>
        <span className="banner__subtext">
          ALL Images Credited to NASA/JPL-Caltech
        </span>
      </div>
    </header>
  );
}
