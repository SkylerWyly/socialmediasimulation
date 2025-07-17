# Social Media Simulator

A React-based social media interface simulator for research purposes, designed to study how different framings of criminal justice content affect user engagement and perception.

## Features

- **Experimental Conditions**: Toggle between sympathetic, condemning, and neutral framings
- **Engagement Tracking**: Monitor user interactions, scroll behavior, and time spent
- **Data Export**: Export participant interaction data for analysis
- **Realistic Interface**: Mimics Twitter-like social media experience

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/social-media-crime-simulator.git
   cd social-media-crime-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Deployment to GitHub Pages

1. **Update the homepage URL in package.json**
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

2. **Install gh-pages** (if not already installed)
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Build and deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings on GitHub
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Your site will be available at the homepage URL

### File Structure
```
social-media-crime-simulator/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js
│   ├── index.js
│   └── SocialMediaSimulator.jsx
├── package.json
├── .gitignore
└── README.md
```

## Usage

### For Researchers

1. **Configure Experiment**: Use the yellow control panel to set:
   - Valence condition (sympathetic/condemning/neutral)
   - Engagement level (high/low)

2. **Monitor Participants**: Track real-time metrics:
   - Time spent on page
   - Scroll interactions
   - Click interactions
   - Posts viewed

3. **Export Data**: Click "Export Data" to download participant interaction data as JSON

### For Participants

Participants interact with the interface naturally:
- Like, retweet, comment on posts
- Click user profiles
- Scroll through content
- All interactions are automatically tracked

## Technical Details

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS via CDN
- **Icons**: Lucide React icon library
- **Data Tracking**: In-memory state management with JSON export
- **Deployment**: GitHub Pages with automated build process

## Research Applications

This simulator is designed for studies examining:
- Social media influence on criminal justice perceptions
- Framing effects in online content
- User engagement patterns with controversial content
- Information processing in social media contexts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is intended for research purposes. Please ensure appropriate ethical review and participant consent procedures are followed when using this tool for studies.

## Support

For technical issues or questions about implementation, please create an issue in the GitHub repository.
