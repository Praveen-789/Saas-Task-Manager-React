import { useAppContext } from "@/context/AppContext";

export default function Settings() {
  const { user, logout } = useAppContext();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Settings page content will go here.</p>
        {user && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
            <button 
              onClick={logout}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
        {/* Add your settings UI here */}
      </div>
    </div>
  )
}

