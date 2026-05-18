import React from 'react';
import { AuthProvider } from './contexts/authContext';
import { DemoDataProvider } from './contexts/demoDataContext';
import { PaymentProvider } from './contexts/paymentContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DemoDataProvider>
        <PaymentProvider>
          <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center">
            <div className="p-8 rounded-lg shadow-lg bg-slate-50 w-full max-w-2xl mt-12">
              <h1 className="text-3xl font-bold mb-4 text-center">Enterprise Mega App</h1>
              <p className="text-lg text-center mb-8">
                Welcome to the Enterprise Mega App!<br />
                Start building your dashboard and features here.
              </p>
              <div className="flex flex-col items-center space-y-2">
                <span className="text-slate-500 text-sm">
                  (Replace this screen with your main routes and UI)
                </span>
              </div>
            </div>
          </div>
        </PaymentProvider>
      </DemoDataProvider>
    </AuthProvider>
  );
};

export default App;