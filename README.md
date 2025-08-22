# ChronoTask ⏳✨

A **futuristic To-Do App** with weekly calendar view and sign-in system that feels like a blend of **Google Calendar + Notion + futuristic design**.

![ChronoTask](https://img.shields.io/badge/ChronoTask-Futuristic%20Todo%20App-blue?style=for-the-badge&logo=clock)

## 🚀 Features

### ✨ Core Features
- **🔐 Authentication System** - Secure sign-up & sign-in with JWT
- **📅 Weekly Calendar View** - Beautiful time-based task scheduling
- **🎯 Priority Management** - Color-coded tasks (High/Red, Mid/Orange, Low/Green)
- **🏷️ Category System** - Work, Study, Personal, Health, Other
- **📱 Responsive Design** - Desktop grid view, mobile day view
- **🔍 Search & Filter** - Find tasks quickly by priority or search terms

### 🎨 UI/UX Features
- **🌙 Dark Theme** - Futuristic dark mode with neon accents
- **✨ Glassmorphism** - Modern glass-like UI elements
- **🎭 Framer Motion** - Smooth animations and transitions
- **🎨 TailwindCSS** - Beautiful, responsive styling
- **📱 Mobile-First** - Optimized for all devices

### 🚀 Bonus Features
- **📊 Progress Tracker** - Weekly completion statistics
- **🔄 Status Management** - Pending, In-Progress, Completed
- **⏰ Time Management** - Start and end time scheduling
- **📝 Rich Notes** - Additional context for tasks
- **🎯 Smart Defaults** - Auto-adjusting time suggestions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful icon library
- **Date-fns** - Modern date utility library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chronotask
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to root
cd ..
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chronotask
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 5. Run the Application
```bash
# Development mode (both frontend and backend)
npm run dev

# Or run separately:
npm run server    # Backend only
npm run client    # Frontend only
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🎯 Usage

### 1. **Sign Up/Login**
- Create a new account or sign in with existing credentials
- Secure JWT-based authentication

### 2. **Create Tasks**
- Click the floating "+" button
- Fill in task details:
  - Title and description
  - Start and end times
  - Priority level
  - Category
  - Additional notes

### 3. **Calendar View**
- **Desktop**: Full weekly grid with time slots
- **Mobile**: Scrollable day view
- Navigate between weeks
- Click tasks to view/edit details

### 4. **Manage Tasks**
- Click any task to open details
- Edit task information
- Mark as complete/in-progress
- Delete tasks
- Update priority and status

### 5. **Track Progress**
- View weekly completion statistics
- Monitor priority distribution
- Get motivational messages
- Track daily averages

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradients (#0ea5e9)
- **Neon Accents**: Blue, Purple, Pink, Green, Orange, Red
- **Dark Theme**: Deep grays (#0f172a to #f8fafc)
- **Priority Colors**: Red (High), Orange (Mid), Green (Low)

### Typography
- **Primary Font**: Inter (Modern, readable)
- **Monospace**: JetBrains Mono (Time displays)

### Components
- **Glass Cards**: Translucent backgrounds with backdrop blur
- **Neon Glows**: Subtle shadow effects
- **Rounded Corners**: Modern, friendly design
- **Smooth Transitions**: 300ms ease-in-out animations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Todos
- `GET /api/todos` - Get all user todos
- `GET /api/todos/week/:date` - Get todos for specific week
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/status` - Update todo status

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy to your platform
```

### Database
- **MongoDB Atlas** (Recommended for production)
- **Local MongoDB** (Development)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **TailwindCSS** for beautiful styling
- **Lucide** for beautiful icons
- **Date-fns** for date utilities

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ for the future of productivity**

*ChronoTask - Where time meets productivity in a futuristic way* ⏳✨
