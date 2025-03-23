import { Navbar } from './components/navbar';

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-grow">
        <div className="relative z-10 container mx-auto p-8 text-center">
          به انجمن پرستاران خوش آمدید
        </div>
      </main>
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          تمامی حقوق محفوظ است © انجمن پرستاران {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;
