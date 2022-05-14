import styles from "../css/Banner.css";

export default function Banner() {
  return (
    <header className="banner">
      <div className="header__container">
        <div className="banner__content">
          <h1 className="banner__title">NASA.CAM</h1>
          <p className="banner__subtitle">
            Raw Images Collected Directly From Mars
          </p>
          <div className="hr__wrapper">
            <hr className="banner__hr"></hr>
          </div>
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
