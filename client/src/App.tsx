import React from 'react';
import Layout from './components/Layout/Layout';
import LineChart from './containers/LineChart';
import TopBar from './components/Menu/TopBar';

const App: React.FC = () => {
  return (
      <Layout>
        <TopBar/>
        <LineChart/>
      </Layout>
  );
}

export default App;
