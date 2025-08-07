# WisdomHub - Trello-like Board Management

A beautiful and intuitive board management application built with Next.js, TypeScript, and MongoDB. Features include authentication, drag-and-drop functionality, dark mode, and a responsive design.

## Features

### 🔐 Authentication
- Manual authentication (no 3rd-party providers)
- Session management with cookies
- CSRF token handling
- Login and registration pages

### 🏠 Dashboard
- View all user boards
- Create, edit, and delete boards
- Beautiful card-based layout
- Skeleton loading states

### 🗂 Board Management
- Create and manage lists
- Add, edit, and delete cards
- Drag and drop functionality for lists and cards
- Real-time updates

### 🌗 Theme Support
- Light and dark mode
- System preference detection
- Manual theme toggle
- Consistent theming across all components

### 💤 Loading States
- Skeleton loaders for better UX
- Empty states with encouraging messages
- Error boundaries for graceful error handling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: bcryptjs for password hashing
- **Drag & Drop**: @dnd-kit
- **Theme**: next-themes
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wisdomhub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/wisdomhub
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

Make sure MongoDB is running on your system. The application will automatically create the necessary collections when you first register a user.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── boards/        # Board management endpoints
│   ├── board/             # Board view pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components
│   ├── board-card.tsx     # Board card component
│   ├── board-view.tsx     # Main board view
│   ├── card.tsx           # Card component
│   ├── list.tsx           # List component
│   └── theme-toggle.tsx   # Theme toggle
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   └── db.ts             # Database connection
└── models/               # MongoDB models
    ├── Board.ts          # Board model
    └── User.ts           # User model
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/[id]` - Get specific board
- `PUT /api/boards/[id]` - Update board
- `DELETE /api/boards/[id]` - Delete board

### Lists
- `POST /api/boards/[id]/lists` - Create new list
- `PUT /api/boards/[id]/lists/[listId]` - Update list
- `DELETE /api/boards/[id]/lists/[listId]` - Delete list

### Cards
- `POST /api/boards/[id]/lists/[listId]/cards` - Create new card
- `PUT /api/boards/[id]/lists/[listId]/cards/[cardId]` - Update card
- `DELETE /api/boards/[id]/lists/[listId]/cards/[cardId]` - Delete card

### Reordering
- `POST /api/boards/[id]/reorder` - Reorder lists and cards

## Features in Detail

### Drag and Drop
The application uses @dnd-kit for smooth drag and drop functionality:
- Drag lists to reorder them horizontally
- Drag cards to reorder them within lists
- Drag cards between different lists
- Visual feedback during dragging

### Dark Mode
- Automatic system preference detection
- Manual toggle available on all pages
- Smooth transitions between themes
- Consistent styling across all components

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
