import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TopBar from './components/Menu/TopBar';
import LiveSessionPage from './pages/LiveSessionPage';
import OfflineSessionPage from './pages/OfflineSessionPage';

const App: React.FC = () => {
  
  return (
      <Router>
        <TopBar/>
        <Route path="/" exact component={LiveSessionPage} />
        <Route path="/live" component={LiveSessionPage} />
        <Route path="/stats" component={OfflineSessionPage} />
      </Router>
      
  );
}

export default App;
