import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Viewport from './components/Viewport/Viewport';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Viewport />
    </div>
  );
}

export default App;