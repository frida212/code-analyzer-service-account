# Code Analyzer Agent - Multi-Agent Dashboard

A beautiful, production-ready React dashboard for code analysis with multi-agent capabilities. Features a modern glass morphism design with real-time updates and comprehensive analysis tools.

## 🚀 Features

### **Dashboard Components**
- **Header**: Dynamic status indicators with pulse animations
- **Control Panel**: Repository input with validation and quick actions  
- **Metrics Grid**: Animated cards showing quality scores, issues, and analysis stats
- **Analysis Results**: Filterable issue list with severity color coding and suggestions
- **Agent Communications**: Real-time message feeds from Documentation, Test Generator, and QA agents
- **Interactive Charts**: Doughnut charts for issue visualization

### **Multi-Agent System**
- **Documentation Agent** 📚 - Generates and updates API documentation
- **Test Generator Agent** 🧪 - Creates unit tests for complex functions
- **QA Agent** ✅ - Monitors quality gates and deployment readiness

### **Analysis Capabilities**
- Repository path analysis with optional commit hash
- Issue detection for security, quality, and performance
- Real-time filtering and sorting
- Export functionality for reports
- Historical analysis tracking

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **Backend**: Express.js with REST API
- **Cloud**: Google Cloud integration ready

## 📦 Installation & Setup

### Development Mode (React + Vite)
```bash
npm install
npm run dev
```
The React development server will start on `http://localhost:5173`

### Production Mode (Express Server)
```bash
# Build the React app
npm run build

# Start the Express server
npm run server
```
The production server will start on `http://localhost:3000`

### Full Stack Development
```bash
# Terminal 1: Start React dev server
npm run dev

# Terminal 2: Start Express API server
cd server
npm install
npm start
```

## 🔧 API Endpoints

The Express server provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/metrics` - Dashboard metrics
- `GET /api/issues` - Analysis issues (with filtering)
- `POST /api/analyze` - Start repository analysis
- `GET /api/agents` - Agent status and messages

## 🎨 Design Features

### **Glass Morphism UI**
- Backdrop blur effects with translucent panels
- Gradient backgrounds and shimmer animations
- Smooth hover transitions and micro-interactions
- Apple-level design aesthetics

### **Responsive Design**
- Mobile-first approach with perfect breakpoints
- Adaptive grid systems for all screen sizes
- Touch-friendly interactions

### **Animations & Interactions**
- Pulse animations for status indicators
- Hover effects with scale and translate transforms
- Loading overlays with spinners
- Smooth transitions between states

## 🚀 Deployment Options

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
npm run server
```

### **Docker** (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "server"]
```

## 🔐 Environment Variables

Create a `.env` file for configuration:

```env
VITE_API_URL=http://localhost:3000/api
PORT=3000
NODE_ENV=production
```

## 📊 Usage

1. **Start Analysis**: Enter repository path and optional commit hash
2. **View Results**: Browse issues filtered by type and severity
3. **Monitor Agents**: Watch real-time updates from analysis agents
4. **Export Reports**: Generate comprehensive analysis reports
5. **Track History**: View previous analysis results and trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using React, TypeScript, and modern web technologies.