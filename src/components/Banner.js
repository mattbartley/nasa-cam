import "../css/Banner.css";

export default function Banner() {
  return (
    <header className="banner">
      <div className="banner_container">
        <div className="banner__card">
          <h1 className="banner__title">
            Images Collected Directly From Mars by <span>NASA</span>
          </h1>
          <div className="banner__content">
            <p className="banner__text">
              A direct connection to official NASA mission images. Explore the
              images by camera, Rover, and by date.
            </p>
            <button className="banner__btn">See Latest Images</button>
          </div>
        </div>
      </div>
    </header>
  );
}
