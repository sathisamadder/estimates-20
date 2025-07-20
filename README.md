# Professional Construction Estimator

A comprehensive construction estimation application with Firebase integration, quantity multiplication features, and mobile-responsive design.

## Features

### 🔧 **Core Functionality**
- **11 Construction Item Types**: Detailed calculations for columns, beams, slabs, foundations, and more
- **Advanced Reinforcement Calculations**: Multiple bar sizes and spacing options
- **Quantity Multiplication**: Easily calculate materials for multiple identical units (e.g., 5 columns)
- **Custom Material Rates**: Set project-specific pricing for accurate cost estimation
- **Real-time Cost Calculations**: Instant updates in BDT currency

### 🔥 **Firebase Integration**
- **Cloud Database**: Automatic synchronization with Firebase Firestore
- **Offline Support**: Local storage fallback when Firebase is unavailable
- **Multi-device Sync**: Access your projects from any device
- **Real-time Updates**: Changes sync instantly across devices

### 📱 **Mobile-First Design**
- **Responsive Interface**: Optimized for mobile, tablet, and desktop
- **Touch-friendly Controls**: Easy-to-use mobile interface
- **Offline Capability**: Works without internet connection
- **Progressive Web App**: Install directly on mobile devices

### 💼 **Project Management**
- **Multi-project Support**: Manage multiple construction projects
- **Client Database**: Organize projects by client
- **Export Options**: JSON, CSV, and summary formats
- **Print-friendly Reports**: Professional printable estimates

## Setup Instructions

### 1. Firebase Configuration (Optional)

To enable cloud synchronization, set up Firebase:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Firestore Database

2. **Get Configuration Values**:
   - Go to Project Settings → General
   - Scroll down to "Your apps" and click Web app icon
   - Copy the configuration values

3. **Set Environment Variables**:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your Firebase config
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   
   # Set to true for production
   VITE_USE_FIREBASE_PROD=true
   ```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

### 3. Production Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir dist/spa
```

## Usage Guide

### Adding Construction Items

1. **Select Item Type**: Choose from foundation, structure, utility, masonry, or finishing works
2. **Enter Dimensions**: Input length, width, height, and other relevant measurements
3. **Configure Reinforcement**: Set bar sizes, spacing, and mixing ratios
4. **Quantity Multiplication**: Enable for multiple identical units
5. **Calculate**: Get instant material quantities and cost estimates

### Quantity Multiplication Feature

For projects with multiple identical elements:

1. ✅ Check "Multiple Units" option
2. 📝 Enter the number of units (e.g., 5 for five identical columns)
3. 📊 All materials will be automatically multiplied
4. 💰 Total cost includes labor and material for all units

### Example: 5 Identical Columns
- **Input**: 1 column (12" × 15" × 10')
- **Multiply by**: 5 units
- **Output**: Materials for 5 columns automatically calculated

### Managing Projects

1. **Create Project**: Click "New Project" in header
2. **Add Client**: Organize projects by client
3. **Switch Projects**: Use project selector dropdown
4. **Export Data**: Multiple formats available (JSON, CSV, Summary)

### Mobile Usage

- **Hamburger Menu**: Access all features on mobile
- **Floating Action Button**: Quick item addition
- **Swipe Navigation**: Easy tab switching
- **Touch-optimized**: Large buttons and inputs

## Technical Details

### Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: Firebase Firestore + Local Storage fallback
- **UI Framework**: TailwindCSS + Radix UI components
- **State Management**: React hooks + custom data manager

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

### Performance
- **Bundle Size**: Optimized for fast loading
- **Offline Support**: Service worker caching
- **Real-time Sync**: Efficient Firebase queries

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Security & Privacy

- **No API Keys Exposed**: Environment variables used securely
- **Local Data**: Works completely offline if needed
- **Firebase Rules**: Secure database access patterns
- **No Personal Data**: Only project and client information stored

## Support

For issues and questions:
- Create GitHub issue
- Check documentation
- Review example projects

## License

MIT License - feel free to use in commercial projects.

---

**Built with ❤️ for the construction industry**

*Professional Construction Estimator - Making construction estimation fast, accurate, and modern.*
