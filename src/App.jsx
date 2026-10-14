import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/features/Header';
import Footer from '@/components/features/Footer';
import Home from '@/pages/Home';
import PoemDetail from '@/pages/PoemDetail';
import Category from '@/pages/Category';
import Author from '@/pages/Author';
import Authors from '@/pages/Authors';
import NotFound from '@/pages/NotFound';

import ScrollToTop from '@/components/utils/ScrollToTop';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/poem/:id" element={<PoemDetail />} />
              <Route path="/song/:id" element={<PoemDetail />} />
              <Route path="/prose/:id" element={<PoemDetail />} />
              <Route path="/category/:type" element={<Category />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/author/:slug" element={<Author />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}
