import '../css/HomeScreen.css';
import Nav from './Nav';
import Banner from './Banner';

export default function HomeScreen() {
  return (
    <div className="homeScreen">
      <Nav />
      <Banner />
    </div>
  );
}
