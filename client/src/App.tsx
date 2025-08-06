import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { AuthProvider } from './AuthContext'; // Import AuthProvider

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
