import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home   from './pages/Home';
import Post   from './pages/Post';
import Editor from './pages/Editor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />}   />
        <Route path="/post/:id"   element={<Post />}   />
        <Route path="/editor"     element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}
