# 📋 Kanban Board

A clean, responsive task management web app built with **Next.js** and **TypeScript**. Organize your work visually with drag-and-drop Kanban columns, keeping your tasks structured and your progress clear.

🔗 **Live Demo:** [kanban-aksh.vercel.app](https://kanban-aksh.vercel.app/)

---

## ✨ Features

- **Kanban Layout** — Visualize tasks across columns (e.g. *To Do*, *In Progress*, *Done*)
- **Drag & Drop** — Powered by `@dnd-kit` for smooth, accessible card movement between columns
- **Dark Mode** — Theme switching via `next-themes`
- **Accessible UI** — Built with Radix UI primitives and shadcn/ui components
- **Fully Typed** — Written in TypeScript throughout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework & routing |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [@dnd-kit](https://dndkit.com/) | Drag and drop |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [shadcn/ui](https://ui.shadcn.com/) | Component library |
| [Lucide React](https://lucide.dev/) | Icons |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode |
| [Vercel](https://vercel.com/) | Deployment |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/its-akshdeep06/Kanban.git
cd Kanban

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
├── app/          # Next.js app directory (pages & layouts)
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── public/       # Static assets
└── styles/       # Global styles
```

---

## 📦 Deployment

This project is deployed on **Vercel**. It also includes a `netlify.toml` for Netlify compatibility.

---

## 📄 License

This project is private. All rights reserved © [its-akshdeep06](https://github.com/its-akshdeep06).
