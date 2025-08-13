# E-Com App Admin

A modern, full-stack admin dashboard for managing your e-commerce platform. Built with Next.js, React, Supabase, and TypeScript, this app provides robust authentication, intuitive UI, and seamless integration with your shop backend.

---

## 🚀 Features

- **Authentication**: Secure login, registration, Google OAuth, password visibility toggle, and robust session management.
- **Role-Based Access**: Superadmin, admin, and public views for granular control.
- **Product & Category Management**: Add, edit, and organize products and categories with ease.
- **Order Tracking**: View and manage orders, order items, and customer details.
- **User Management**: Manage users, roles, and permissions.
- **Responsive UI**: Beautiful, mobile-friendly design with custom components and icons.
- **Supabase Integration**: Real-time database, authentication, and API connectivity.
- **Custom Hooks & Middleware**: Centralized logic for authentication, categories, and route protection.
- **Robust Logout**: Ensures all session cookies are cleared for security.
- **Loading & Error States**: User-friendly feedback with spinners and toast notifications.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Framer Motion, Lucide Icons
- **Backend**: Supabase (auth, database)
- **Styling**: CSS Modules, PostCSS
- **Linting**: ESLint, Zod for schema validation
- **Testing**: (Add your testing framework here)

---

## 📁 Project Structure

```bash
├── public/                # Static assets (SVGs, images, favicon)
├── src/
│   ├── actions/           # Server actions (auth, etc.)
│   ├── app/               # Next.js app directory
│   │   ├── Authentication # Auth pages (login, signup)
│   │   ├── profile/       # User profile page
│   │   ├── superadmin/    # Superadmin dashboard
│   │   ├── admin/         # Admin dashboard
│   │   ├── public/        # Public pages
│   │   ├── api/           # API routes
│   ├── components/        # Reusable UI components
│   ├── constants/         # App-wide constants
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── providers/         # Context providers (theme, etc.)
│   ├── styles/            # CSS modules
│   ├── supabase/          # Supabase client, types, middleware
│   ├── types/             # TypeScript types
├── .env.local             # Environment variables
├── package.json           # Project metadata & scripts
├── tsconfig.json          # TypeScript config
├── postcss.config.mjs     # PostCSS config
├── eslint.config.mjs      # ESLint config
└── README.md              # Project documentation
```

---

## ⚡ Getting Started

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd e-com-app-admin
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials and other secrets.
4. **Run the development server**

   ```sh
   npm run dev
   ```

5. **Access the app**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Authentication & Security

- Uses Supabase for secure authentication and session management.
- All sensitive routes are protected via custom middleware and hooks.
- Logout clears all session cookies, including dynamic Supabase cookies.

---

## 🧩 Customization

- Easily extend components and hooks for new features.
- Add new roles, pages, or API endpoints as needed.
- Update styles in `src/styles/` for branding.

---

## 📝 Scripts & Commands

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Run ESLint
- `npm run start` — Start production server

---

## 📚 Documentation

- See inline comments and folder-level `README.md` files for details on components and features.
- Supabase setup: See `SUPABASE_SETUP.md` in the shop folder for backend integration.

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome! Please follow the code style and add tests for new features.

---

## 🛡️ License

This project is licensed under the MIT License.

---

## 💡 Credits

- Built by Mucrypt and contributors
- Powered by Next.js, Supabase, and the open-source community

---

## 📬 Contact

For support or questions, open an issue or reach out via GitHub.
