# FanverseDaily - Future Plans & Roadmap

## Upcoming Features

### 1. Related Stories Component
**Priority:** High
**Location:** Article pages (inline within content)

A component that displays related articles based on tags/category, shown inline within the article content.

**Design Reference:** See `internalblog.html` - Related Stories section

**Features:**
- 2-column grid of related articles
- Thumbnail images with hover zoom effect
- Article title with category tag
- Links to related content based on shared tags
- Positioned after the first few paragraphs of content

**Implementation Notes:**
- Fetch posts with matching tags (excluding current post)
- Limit to 2-4 related posts
- Use the card-dark background with subtle border


### 2. Interactive Poll Widget
**Priority:** Medium
**Location:** Article pages (inline within content)

An interactive poll component for reader engagement on entertainment topics.

**Design Reference:** See `internalblog.html` - Fanverse Poll section

**Features:**
- Poll question with title
- 2-4 answer options as buttons
- Real-time vote percentages
- Vote submission and tracking
- Centered card design with border

**Implementation Notes:**
- Create `polls` database table (id, question, options JSON, votes JSON, post_id, created_at)
- API endpoints for voting and fetching results
- Store votes by session/cookie to prevent duplicate voting
- Optional: User authentication for verified votes


### 3. Comments System
**Priority:** Medium
**Location:** Bottom of article pages

Allow readers to comment on articles.

**Features:**
- Threaded comments with replies
- Upvote/downvote system
- Report functionality
- Moderation panel in admin
- Optional social login (Google, Twitter)


### 4. Author Profiles
**Priority:** Low
**Location:** Article pages, dedicated author pages

Enhanced author information and dedicated author profile pages.

**Features:**
- Author bio and avatar
- Social media links
- List of articles by author
- Author statistics (total posts, total views)


### 5. Reading Progress Indicator
**Priority:** Low
**Location:** Top of viewport on article pages

A progress bar showing how far the reader has scrolled through the article.

**Features:**
- Thin bar at top of screen
- Primary color fill
- Smooth animation on scroll


### 6. Dark/Light Mode Toggle Animation
**Priority:** Low

Enhanced theme toggle with smooth transition animations.


### 7. Search Functionality
**Priority:** High
**Location:** Navigation bar

Full-text search across all published content.

**Features:**
- Real-time search suggestions
- Search results page
- Filter by category/tag
- Highlight matching terms


### 8. Bookmarking System
**Priority:** Medium

Allow users to save articles for later reading.

**Features:**
- Bookmark button on articles (already in UI)
- Saved articles page
- Local storage or user account based
- Share bookmarks


### 9. Newsletter Popup Modal
**Priority:** Medium
**Location:** Site-wide (non-admin pages)
**Status:** Component exists, temporarily disabled

A popup modal that encourages visitors to subscribe to the newsletter.

**Current Implementation:** `src/components/SignupModal.tsx`

**Features:**
- Triggered after delay or scroll threshold
- Email subscription form
- Close button and backdrop click to dismiss
- Cookie/localStorage to prevent repeated display
- Connected to newsletter subscription API

**TODO:**
- [ ] Improve trigger timing (scroll %, time on site, exit intent)
- [ ] Add A/B testing for different copy
- [ ] Better mobile experience
- [ ] Re-enable in `ConditionalLayout.tsx` when ready


---

## Completed Features

- [x] Homepage redesign with category sections
- [x] Dark/Light theme toggle
- [x] Category filter pills with smooth scroll
- [x] Newsletter signup forms
- [x] Trending Now sidebar
- [x] Entertainment-focused branding (FanverseDaily)
- [x] Article page redesign with sidebar layout
- [x] Most Read sidebar widget
- [x] Breadcrumb navigation
- [x] Share/Bookmark buttons (UI only)
- [x] Always-dark footer
- [x] Custom favicon with brand logo
- [x] Loading screen with branding


---

## Technical Debt

- [ ] Remove unused `settings` variable in homepage
- [ ] Add missing database columns (hero, description) migration script
- [ ] Update browserslist database
- [ ] Optimize image loading with next/image
- [ ] Add error boundaries for graceful error handling


---

*Last updated: February 2026*
