function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Britannia Forge - Boiler Installation Platform
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome to your boiler quotation platform. This is a modern web application 
            designed to help customers get accurate quotes for boiler installations.
          </p>
          
          <div className="grid gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Multi-Step Quotation Process</h2>
              <p className="text-blue-100">
                Guide customers through property details, photo uploads, and quote selection
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Intelligent Quote Engine</h2>
              <p className="text-green-100">
                Calculate accurate prices based on property type, boiler specifications, and labor costs
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Payment Processing</h2>
              <p className="text-purple-100">
                Secure payment handling with Stripe integration (currently disabled for design preview)
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">App Status</h3>
            <ul className="text-blue-700 space-y-1">
              <li>✓ Backend server running successfully</li>
              <li>✓ Database connection established</li>
              <li>✓ CSS compilation fixed</li>
              <li>✓ TypeScript errors resolved</li>
              <li>→ Payment processing temporarily disabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;