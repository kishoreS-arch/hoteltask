import { Routes, Route } from 'react-router-dom';
import HotelList from './pages/HotelList';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';
import HotelDetails from './pages/HotelDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HotelList />} />
      <Route path="/hotels/new" element={<AddHotel />} />
      <Route path="/hotels/:id/edit" element={<EditHotel />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
    </Routes>
  );
}

export default App;
