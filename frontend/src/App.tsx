import React from "react";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🚀 Tableau Clone
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Analytics Dashboard - Frontend Working!
              </p>
              <div className="space-y-2">
                <p className="text-sm text-green-600">✅ React + TypeScript</p>
                <p className="text-sm text-green-600">✅ Tailwind CSS</p>
                <p className="text-sm text-blue-600">
                  🔄 Ready to build dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
