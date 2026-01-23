import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section with padding-top to account for fixed navbar */}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-gray-100 dark:from-black dark:to-gray-950 pt-16">
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 py-20 px-6 sm:px-8 lg:px-16">
          
          {/* Hero Content */}
          <div className="flex flex-col items-center gap-8 text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Welcome to <span className="text-indigo-600">YourCompany</span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl">
              We deliver innovative solutions for web development, mobile apps, and digital transformation.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href="/services"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 text-base font-semibold text-white transition-all hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-600/30"
              >
                Explore Services
              </a>
              <a
                href="/about/profile"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-700 px-8 text-base font-semibold text-gray-900 dark:text-white transition-all hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast Performance</h3>
              <p className="text-gray-600 dark:text-gray-400">Lightning-fast solutions optimized for speed and efficiency.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">Enterprise-grade security with 99.9% uptime guarantee.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Expert Team</h3>
              <p className="text-gray-600 dark:text-gray-400">Dedicated professionals with years of industry experience.</p>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}