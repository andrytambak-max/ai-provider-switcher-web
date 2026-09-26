# AI Provider Account Switcher - Web Interface 🌐

A beautiful, modern web application for seamlessly switching between multiple AI providers including Gemini, Claude, GPT, Deepseek, Grok, and local Ollama.

## ✨ Features

- 🔄 **Easy Provider Switching** - Switch between providers with a single click
- 💾 **Local Storage** - All configurations saved securely in browser
- 📊 **Statistics Dashboard** - Track provider usage and switch history
- 🧪 **Connection Testing** - Test provider connectivity
- 🤖 **AI Response Generation** - Generate responses directly from the web interface
- 📜 **Switch History** - View complete history of provider switches
- ⚙️ **Provider Management** - Add, configure, and manage multiple providers
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern Dark UI** - Beautiful gradient design with smooth animations

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/andrytambak-max/ai-provider-switcher-web.git
   cd ai-provider-switcher-web
   ```

2. **Start a local server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   http-server
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📖 Usage Guide

### Adding API Keys

1. Click the **"Add Provider"** section
2. Enter the Provider ID (e.g., `gemini`, `claude`, `gpt`)
3. Enter your API Key
4. Click **"Add"**

### Switching Providers

1. Click on any provider tile in the **"Available Providers"** section
2. The active provider is highlighted with a blue border
3. All switches are logged in the history

### Generating Responses

1. Click **"✨ Generate Response"** button
2. Enter your message
3. Adjust temperature and max tokens if needed
4. Click **"Generate"**

### Managing Providers

1. Select a provider from the **"Configure"** dropdown
2. Click **"Configure"** button
3. Modify settings (name, model, API URL, timeout, API key)
4. Click **"Save"**

### Viewing History

1. Scroll to the **"Switch History"** section
2. Adjust the limit if needed
3. Click **"Load History"**
4. Click **"Clear History"** to reset

## 🎨 Supported Providers

| Provider | Icon | Model | Setup |
|----------|------|-------|-------|
| **Google Gemini** | 🔵 | gemini-2.0-flash | [Get API Key](https://ai.google.dev/tutorials/setup) |
| **Claude** | 🤖 | claude-3-5-sonnet | [Get API Key](https://console.anthropic.com/) |
| **GPT** | 🟢 | gpt-4-turbo | [Get API Key](https://platform.openai.com/) |
| **Deepseek** | 🟣 | deepseek-chat | [Get API Key](https://api.deepseek.com) |
| **Grok** | 🟡 | grok-beta | [Get API Key](https://api.x.ai) |
| **Ollama** | 🏠 | llama2 | [Setup Guide](https://ollama.ai) |

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables and animations
- **Vanilla JavaScript** - No dependencies, pure JS
- **LocalStorage API** - Client-side data persistence
- **Responsive Design** - Mobile-friendly interface

## 📁 Project Structure

```
ai-provider-switcher-web/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── app.js              # Application logic
├── package.json        # Project metadata
└── README.md          # This file
```

## 🎯 Key Features Explained

### Current Provider Display
- Shows the active provider with full details
- Displays model name, API URL, and timeout settings
- Quick access buttons for testing and generating responses

### Available Providers Grid
- Visual tiles for all configured providers
- One-click switching
- Active provider highlighted in blue
- Shows model information

### Management Panel
- **Add Provider**: Quickly add new provider with API key
- **Configure**: Edit existing provider settings
- Full control over model, URL, timeout, and credentials

### Statistics Dashboard
- Total providers count
- Total number of switches
- Last switch timestamp
- Real-time updates

### Switch History
- Complete log of all switches
- Timestamp for each switch
- Custom limit for history display
- Clear history option

## 🔒 Security Notes

- ✅ All data stored locally in browser
- ✅ API keys never sent to external servers (except to provider APIs)
- ✅ No authentication required
- ✅ Works completely offline (except for API calls)
- ⚠️ Clear browser data if sharing computer
- ⚠️ Never share your API keys

## 📝 API Key Setup

### Google Gemini
1. Go to [ai.google.dev](https://ai.google.dev/tutorials/setup)
2. Click "Get API Key"
3. Create new API key
4. Copy and paste in the web interface

### Anthropic Claude
1. Visit [console.anthropic.com](https://console.anthropic.com/login)
2. Sign in or create account
3. Navigate to API keys section
4. Generate new API key
5. Copy and paste in the web interface

### OpenAI GPT
1. Go to [platform.openai.com](https://platform.openai.com/api-keys)
2. Create or sign in to your account
3. Click "Create new secret key"
4. Copy and paste in the web interface

### Deepseek
1. Visit [api.deepseek.com](https://api.deepseek.com)
2. Create account
3. Generate API key
4. Copy and paste in the web interface

### xAI Grok
1. Go to [api.x.ai](https://api.x.ai)
2. Sign in with X account
3. Create API key
4. Copy and paste in the web interface

### Local Ollama
1. Download and install [Ollama](https://ollama.ai)
2. Run `ollama serve`
3. No API key needed (leave blank or use "local")

## 🐛 Troubleshooting

### Provider tile shows "--" for values
- Make sure API key is added
- Refresh the page (Ctrl+R)
- Check browser console for errors

### "Provider not configured" warning
- Add the API key in the "Add Provider" section
- Make sure the key is valid and active

### Connection test fails
- Verify API key is correct
- Check internet connection
- Verify provider is currently available
- Check API rate limits

### History not showing
- Make sure you've switched providers at least once
- Click "Load History" button
- Check the history limit setting

## 🎓 Development

### Adding New Provider

1. Add provider to `PROVIDERS` object in `app.js`:
   ```javascript
   newprovider: { name: 'Provider Name', icon: '🟢', model: 'model-name' }
   ```

2. Add template to `PROVIDER_TEMPLATES`:
   ```javascript
   newprovider: {
       apiUrl: 'https://api.example.com/v1/chat',
       model: 'model-name',
       timeout: 30000
   }
   ```

3. Update HTML form if needed
4. Test switching and API calls

### Customizing Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... other colors ... */
}
```

## 📊 Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - feel free to use in your projects

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Add more provider integrations
- Implement streaming responses
- Add dark/light theme toggle
- Add export/import configuration
- Improve error handling
- Add keyboard shortcuts

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Open an issue on GitHub
3. Check browser console for error messages

## 🚀 Deployment

### Deploy to GitHub Pages

1. Enable GitHub Pages in repository settings
2. Select `main` branch as source
3. Your site will be available at `https://andrytambak-max.github.io/ai-provider-switcher-web`

### Deploy to Other Services

- **Netlify**: Connect GitHub repo, no build needed
- **Vercel**: Connect GitHub repo, no build needed
- **Firebase**: Deploy with `firebase deploy`
- **AWS S3**: Upload files to S3 bucket with public access

## 🎉 What's Next?

- Streaming responses support
- Multi-language support
- Chat history saving
- Advanced prompt templates
- Provider comparison mode
- API usage analytics
- Custom provider creation

---

**Made with ❤️ by andrytambak-max**