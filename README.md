# Portfolio Website

## Overview

A modern, performant single-page portfolio website built with vanilla JavaScript, HTML5, and CSS3. The application features an interactive particle system, typewriter animations, and advanced email protection mechanisms against web scraping and harvesting.

## Technical Architecture

### Core Technologies

- HTML5 semantic markup
- CSS3 with custom properties and fluid typography
- Vanilla JavaScript ES6+
- Web Animations API
- Crypto Web API for security features

### Key Features

#### Performance Optimizations
- Lazy-loaded particle system initialization
- Debounced animation triggers
- CSS containment for render optimization
- Responsive fluid scaling with clamp() functions
- Minimal external dependencies

#### Security Implementation
- Client-side email obfuscation using character code fragmentation
- Behavioral analysis for bot detection
- Honeypot traps with decoy data
- Temporal assembly patterns with auto-destruction
- Protection against automated scraping tools

#### Accessibility
- ARIA labels and roles for screen reader compatibility
- Semantic HTML structure
- Keyboard navigation support
- Focus management for interactive elements
- Sufficient color contrast ratios

## Project Structure

```
.
├── index.html           # Main application entry point
├── contact.html         # Contact form fallback
├── src/
│   └── email-shield.js  # Email protection system
├── amplify.yml          # AWS Amplify configuration
├── manifest.json        # PWA manifest
├── robots.txt          # Search engine directives
├── sitemap.xml         # XML sitemap
└── package.json        # Project metadata
```

## Deployment

### AWS Amplify

The application is configured for deployment on AWS Amplify with the included `amplify.yml` configuration.

```bash
# Deployment occurs automatically via Git integration
git push origin main
```

### AWS S3 Static Hosting

For S3 bucket deployment:

```bash
aws s3 sync . s3://bucket-name \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --exclude "*.md" \
  --cache-control max-age=31536000
```

### CloudFront Distribution

Configure CloudFront for optimal content delivery:

```bash
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

## Email Protection System

The application implements a multi-layered approach to email protection:

1. **Fragment-based storage**: Email components stored separately as character codes
2. **Behavioral analysis**: Pattern recognition to differentiate human from automated access
3. **Progressive revelation**: Multi-stage interaction requirements
4. **Temporal limitations**: Time-boxed availability with automatic cleanup
5. **Decoy systems**: Honeypot implementation for scraper detection

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari 12+, Chrome Mobile)

## Performance Metrics

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Total bundle size: < 50KB (excluding external libraries)

## Development

### Local Development Server

```bash
python3 -m http.server 8000
# Navigate to http://localhost:8000
```

### Testing

Manual testing procedures should verify:
- Cross-browser rendering consistency
- Email protection functionality
- Animation performance
- Responsive design breakpoints
- Accessibility compliance

## Security Considerations

- Content Security Policy headers configured
- XSS protection enabled
- No server-side processing or database connections
- No storage of personal information
- Client-side only implementation

## Maintenance

### Regular Updates
- Review and update particle.js library versions
- Monitor Font Awesome icon library updates
- Validate Google Analytics implementation
- Test email protection effectiveness

### Monitoring
- Google Analytics 4 for traffic analysis
- Browser console for runtime errors
- Performance monitoring via Lighthouse

## License

MIT License - See LICENSE file for details

## Contributing

Contributions should follow established web standards and maintain the existing code structure. All submissions require thorough testing across supported browsers.