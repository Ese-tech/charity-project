// client/src/App.tsx

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { AuthProvider } from './AuthContext';
import ToastProvider from './components/ToastProvider'; // Import ToastProvider

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;