// E-PERSMIP - DaisyUI Usage Guide
// =================================

// DaisyUI telah berhasil diinstall dan dikonfigurasi!
// Berikut adalah panduan penggunaan komponen DaisyUI yang umum digunakan:

// 1. BUTTONS
// ----------
// <button className="btn">Button</button>
// <button className="btn btn-primary">Primary</button>
// <button className="btn btn-secondary">Secondary</button>
// <button className="btn btn-accent">Accent</button>
// <button className="btn btn-ghost">Ghost</button>
// <button className="btn btn-link">Link</button>

// 2. CARDS
// --------
// <div className="card w-96 bg-base-100 shadow-xl">
//   <div className="card-body">
//     <h2 className="card-title">Card title!</h2>
//     <p>If a dog chews shoes whose shoes does he choose?</p>
//     <div className="card-actions justify-end">
//       <button className="btn btn-primary">Buy Now</button>
//     </div>
//   </div>
// </div>

// 3. STATS (sudah digunakan di Home.jsx)
// ---------------------------------------
// <div className="stats shadow">
//   <div className="stat">
//     <div className="stat-title">Total Page Views</div>
//     <div className="stat-value">89,400</div>
//     <div className="stat-desc">21% more than last month</div>
//   </div>
// </div>

// 4. NAVBAR
// ---------
// <div className="navbar bg-base-100">
//   <a className="btn btn-ghost text-xl">daisyUI</a>
// </div>

// 5. MODAL
// --------
// <dialog id="my_modal_1" className="modal">
//   <div className="modal-box">
//     <h3 className="font-bold text-lg">Hello!</h3>
//     <p className="py-4">Press ESC key or click the button below to close</p>
//     <div className="modal-action">
//       <form method="dialog">
//         <button className="btn">Close</button>
//       </form>
//     </div>
//   </div>
// </dialog>

// 6. HERO
// -------
// <div className="hero min-h-screen bg-base-200">
//   <div className="hero-content text-center">
//     <div className="max-w-md">
//       <h1 className="text-5xl font-bold">Hello there</h1>
//       <p className="py-6">Provident cupiditate voluptatem et in.</p>
//       <button className="btn btn-primary">Get Started</button>
//     </div>
//   </div>
// </div>

// 7. BADGE
// --------
// <div className="badge">default</div>
// <div className="badge badge-primary">primary</div>
// <div className="badge badge-secondary">secondary</div>

// 8. ALERT
// --------
// <div className="alert">
//   <svg xmlns="..." className="stroke-current shrink-0 h-6 w-6"><path stroke-linecap="..." /></svg>
//   <span>We use cookies for no reason.</span>
// </div>

// 9. LOADING
// ----------
// <span className="loading loading-spinner loading-xs"></span>
// <span className="loading loading-spinner loading-sm"></span>
// <span className="loading loading-spinner loading-md"></span>
// <span className="loading loading-spinner loading-lg"></span>

// 10. INPUT
// ---------
// <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
// <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" />

// 11. THEMES
// ----------
// Tema yang tersedia di tailwind.config.js:
// - light (default)
// - dark
// - corporate
// - business
// - persmip (custom theme)

// Untuk menggunakan tema tertentu, tambahkan data-theme pada elemen HTML:
// <html data-theme="dark">
// atau
// <div data-theme="corporate">

// 12. THEME TOGGLE
// ----------------
// function ThemeController() {
//   const [theme, setTheme] = useState('light');
//   
//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//   }, [theme]);
//   
//   return (
//     <select 
//       className="select select-bordered w-full max-w-xs" 
//       onChange={(e) => setTheme(e.target.value)}
//     >
//       <option value="light">Light</option>
//       <option value="dark">Dark</option>
//       <option value="corporate">Corporate</option>
//       <option value="persmip">PERSMIP</option>
//     </select>
//   );
// }

// DOKUMENTASI LENGKAP: https://daisyui.com/
// Anda bisa mengganti komponen yang ada di Home.jsx dengan komponen DaisyUI ini.

export default {};
