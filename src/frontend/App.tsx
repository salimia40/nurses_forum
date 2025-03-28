import { Navbar } from './components/navbar';

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-grow">
        <div className="relative z-10 container mx-auto p-8 text-center">
          <div className="mx-auto my-12 max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold">به انجمن پرستاران خوش آمدید</h1>
            <p className="mb-8 text-xl text-gray-600">
              مکانی برای اشتراک تجربیات، یادگیری و پشتیبانی متقابل
            </p>
            <div className="flex justify-center gap-4">
              <a href="/register">
                <button className="rounded-md bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90">
                  همین حالا ثبت نام کنید
                </button>
              </a>
              <a href="/about">
                <button className="rounded-md border border-primary bg-white px-6 py-3 font-medium text-primary transition-colors hover:bg-gray-50">
                  درباره ما
                </button>
              </a>
            </div>
          </div>
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
