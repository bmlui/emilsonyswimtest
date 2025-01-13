export default function Header() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Emilson Y Swim Test Log</h1>
        <button
          onClick={() => (window.location.href = "/cdn-cgi/access/logout")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-80"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
