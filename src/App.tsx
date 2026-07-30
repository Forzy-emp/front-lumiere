// import { RouterProvider } from 'react-router-dom';
// import { router } from './routes/appRoutes';
// import { ThemeProvider } from './contexts/ThemeContext';
// import './App.css';

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { RouterProvider } from 'react-router-dom';
import { router } from './routes/appRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;