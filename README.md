# Q&A Platform

A Stack Overflow-like question and answer platform built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

### Backend Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (guest, user, admin)
  - Password hashing with bcrypt
  - Profile management

- **Question Management**
  - Create, read, update, delete questions
  - Voting system (upvote/downvote)
  - Tag system with popular tags
  - Search and filtering
  - View tracking
  - Question status (open/closed/duplicate)

- **Answer Management**
  - Create, read, update, delete answers
  - Voting system for answers
  - Accept/unaccept answers
  - Edit history tracking

- **Notification System**
  - Real-time notifications for:
    - New answers to your questions
    - Votes on your content
    - Accepted answers
    - Mentions
    - System notifications
  - Mark as read/unread functionality
  - Notification cleanup utilities

### Frontend Features
- **Modern React Application**
  - TypeScript for type safety
  - React Router for navigation
  - React Query for data fetching
  - React Hook Form for form handling
  - Tailwind CSS for styling

- **User Interface**
  - Responsive design
  - Dark/light theme support
  - Loading states and error handling
  - Toast notifications
  - Pagination
  - Search functionality

- **Authentication**
  - Login/Register forms
  - Protected routes
  - User context management
  - Automatic token refresh

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: React Query + Context API
- **Forms**: React Hook Form
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── questionController.js # Question CRUD operations
│   │   ├── answerController.js  # Answer CRUD operations
│   │   └── notificationController.js # Notification management
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── validation.js       # Input validation
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Question.js         # Question schema
│   │   ├── Answer.js           # Answer schema
│   │   └── Notification.js     # Notification schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── questions.js        # Question routes
│   │   ├── answers.js          # Answer routes
│   │   └── notifications.js    # Notification routes
│   ├── utils/
│   │   └── notifications.js    # Notification utilities
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express server setup
├── src/
│   ├── components/
│   │   ├── Navigation.tsx      # Main navigation component
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Home.tsx           # Questions listing page
│   │   ├── QuestionDetail.tsx # Question detail page
│   │   ├── AskQuestion.tsx    # Create question page
│   │   ├── Login.tsx          # Login page
│   │   ├── Register.tsx       # Registration page
│   │   ├── Profile.tsx        # User profile page
│   │   └── NotFound.tsx       # 404 page
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── index.ts           # Utility functions
│   ├── App.tsx                # Main app component
│   ├── index.tsx              # App entry point
│   └── index.css              # Global styles
├── public/
│   ├── index.html             # HTML template
│   └── manifest.json          # PWA manifest
├── package.json               # Frontend dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── postcss.config.js          # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/qa-platform
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Running Both Servers

You can run both frontend and backend simultaneously:
```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Question Endpoints
- `GET /api/questions` - Get questions with filtering
- `GET /api/questions/:id` - Get specific question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/vote` - Vote on question
- `GET /api/questions/tags/popular` - Get popular tags

### Answer Endpoints
- `GET /api/answers/question/:questionId` - Get answers for question
- `GET /api/answers/:id` - Get specific answer
- `POST /api/answers` - Create new answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer
- `DELETE /api/answers/:id/accept` - Unaccept answer

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/:id/unread` - Mark as unread
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/read` - Delete all read notifications

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qa-platform
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom design system:

- **Primary Color**: Blue (#3b82f6)
- **Typography**: Inter font family
- **Components**: Custom utility classes for buttons, forms, cards
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Ready for dark mode implementation

## 🔐 Security Features

- **Authentication**: JWT-based with secure token storage
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express
- **Password Hashing**: bcrypt for secure password storage

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB connection is configured for production

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Stack Overflow's design and functionality
- Built with modern web development best practices
- Uses popular open-source libraries and frameworks

---

## 🔄 Transformation Notes

This project was transformed from a book reader application to a Q&A platform. The transformation included:

1. **Complete Backend Rewrite**
   - New data models for User, Question, Answer, Notification
   - RESTful API with authentication and authorization
   - Comprehensive notification system

2. **Frontend Modernization**
   - Updated to React 18 with TypeScript
   - Modern state management with React Query
   - Responsive design with Tailwind CSS
   - Complete UI/UX redesign

3. **New Features Added**
   - User authentication and profiles
   - Question and answer management
   - Voting system
   - Tag system
   - Search and filtering
   - Real-time notifications
   - Responsive design

The application is now a fully functional Q&A platform ready for further development and customization.

