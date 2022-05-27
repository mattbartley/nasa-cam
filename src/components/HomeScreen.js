import "../css/HomeScreen.css";
import Nav from "./Nav";
import Banner from "./Banner";
import Stats from "./Stats";

export default function HomeScreen() {
  return (
    <div className="homeScreen">
      <Nav />
      <Banner />
      <Stats />
    </div>
  );
}
