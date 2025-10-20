import { Routes, Route } from 'react-router-dom';
import Nav from './nav.tsx';
import Home from './Home.tsx';
import About from './About.tsx';
import Contact from './Contact.tsx';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Home />} /> {/* Dynamic route */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
