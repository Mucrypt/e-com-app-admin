# PromotionalBanners Component

A flexible and feature-rich component for displaying promotional banners from your database with multiple layout options.

## Features

- 🎯 **Multiple Layouts**: Carousel, Grid, and Featured layouts
- 📱 **Responsive Design**: Optimized for mobile and desktop
- 🔄 **Auto-play Carousel**: Configurable auto-play with pause/resume
- 📊 **Analytics Tracking**: Automatic impression and click tracking
- 🎨 **Rich Styling**: Support for gradients, background colors, and custom positioning
- 🏷️ **Banner Types**: Different badge styles for flash sales, new arrivals, etc.
- ⚡ **Performance**: Lazy loading images and intersection observer for tracking

## Usage

### Basic Usage (Carousel Layout)
```tsx
import PromotionalBanners from '@/components/home/PromotionalBanners'

<PromotionalBanners />
```

### Carousel Layout with Custom Options
```tsx
<PromotionalBanners 
  layout="carousel"
  limit={5}
  autoPlay={true}
  interval={6000}
  showTitle={true}
  title="Special Offers"
  subtitle="Don't miss out on these amazing deals"
  showControls={true}
/>
```

### Grid Layout
```tsx
<PromotionalBanners 
  layout="grid"
  limit={6}
  showTitle={true}
  title="Current Promotions"
  subtitle="Explore all our ongoing deals and offers"
/>
```

### Featured Layout (One large + smaller banners)
```tsx
<PromotionalBanners 
  layout="featured"
  limit={4}
  showTitle={true}
  title="Featured Deals"
  subtitle="Our top picks for you"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | `number` | `5` | Maximum number of banners to fetch |
| `bannerTypes` | `string[]` | `undefined` | Filter by specific banner types |
| `className` | `string` | `''` | Additional CSS classes |
| `showControls` | `boolean` | `true` | Show navigation controls (carousel only) |
| `autoPlay` | `boolean` | `true` | Enable auto-play (carousel only) |
| `interval` | `number` | `5000` | Auto-play interval in milliseconds |
| `layout` | `'carousel' \| 'grid' \| 'featured'` | `'carousel'` | Layout type |
| `showTitle` | `boolean` | `true` | Show section title |
| `title` | `string` | `'Special Offers'` | Section title |
| `subtitle` | `string` | `'Don't miss out on these amazing deals'` | Section subtitle |

## Banner Types

The component supports the following banner types with automatic badge styling:

- `flash_sale`: Red badge with pulse animation
- `new_arrival`: Green badge with bounce animation  
- `seasonal`: Blue badge
- `promotion`: Purple badge
- `featured`: Yellow badge
- `limited`: Orange badge with pulse animation

## Database Schema

The component expects banners with the following structure:

```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  cta_text TEXT,
  cta_url TEXT,
  background_color TEXT,
  text_color TEXT,
  gradient_from TEXT,
  gradient_to TEXT,
  position TEXT CHECK (position IN ('left', 'center', 'right')),
  banner_type TEXT CHECK (banner_type IN ('flash_sale', 'new_arrival', 'seasonal', 'promotion', 'featured', 'limited')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  priority INTEGER,
  sort_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  target_audience TEXT,
  tags TEXT[],
  meta_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Analytics

The component automatically tracks:

- **Impressions**: When banners become visible (using Intersection Observer)
- **Clicks**: When users click on banner CTAs

All tracking is handled via the `/api/banners/impressions` and `/api/banners/[id]/click` endpoints.

## Styling

The component uses Tailwind CSS classes and supports:

- **Custom backgrounds**: Via `background_color` or gradient colors
- **Text positioning**: Via `position` field (left, center, right)
- **Custom animations**: Via `meta_data.animation` field
- **Responsive images**: Mobile and desktop image variants

## Examples

### E-commerce Homepage
```tsx
// Hero carousel banners
<PromotionalBanners 
  layout="carousel"
  limit={3}
  bannerTypes={['featured', 'seasonal']}
  autoPlay={true}
  interval={8000}
/>

// Secondary promotions grid
<PromotionalBanners 
  layout="grid"
  limit={6}
  bannerTypes={['promotion', 'flash_sale']}
  title="Flash Deals"
/>
```

### Product Category Page
```tsx
<PromotionalBanners 
  layout="featured"
  limit={4}
  bannerTypes={['new_arrival', 'limited']}
  title="New in Category"
/>
```

## API Integration

The component integrates with these API endpoints:

- `GET /api/banners` - Fetch active banners
- `POST /api/banners/impressions` - Track banner views
- `POST /api/banners/[id]/click` - Track banner clicks

All API calls include proper error handling and loading states.