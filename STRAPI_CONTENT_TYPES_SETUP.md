# Complete Strapi Content Types Setup for Barkhaus Template System

## 🎯 Overview
This guide will help you create a complete template system with:
- **Organizations** (your clients/tenants)
- **Templates** (website designs)
- **Sections** (template components)
- **Pages** (individual pages)
- **Assets** (media files)
- **Section Content** (customizable content)

---

## 📋 Step-by-Step Setup

### 1. Organization Content Type

**Go to Content-Types Builder → Create new collection type**
- **Display name**: `Organization`

**Fields to add:**

#### Text Fields:
- `name` (Text, Required, Max: 255)
- `slug` (UID, Target: name, Required)
- `domain` (Text, Optional) - e.g., "happypaws.org"
- `primary_color` (Text, Default: "#2563eb")
- `secondary_color` (Text, Default: "#3b82f6") 
- `accent_color` (Text, Default: "#f59e0b")
- `heading_font` (Text, Default: "Poppins")
- `body_font` (Text, Default: "Inter")
- `mission` (Text, Optional)
- `about` (Text, Optional)

#### Rich Text:
- `custom_css` (Rich text, Optional)

#### JSON Fields:
- `contact_info` (JSON, Optional) - phone, email, address
- `social_media` (JSON, Optional) - Facebook, Instagram, etc.
- `brand_settings` (JSON, Optional) - additional branding

#### Media:
- `logo` (Media, Single, Images only)
- `favicon` (Media, Single, Images only)

#### Boolean:
- `is_active` (Boolean, Default: true)

#### Relations:
- `active_template` (Relation: Organization has one Template)

**Click Save**

---

### 2. Template Content Type

**Create new collection type**: `Template`

#### Text Fields:
- `name` (Text, Required, Max: 255)
- `slug` (UID, Target: name, Required)
- `description` (Text, Optional)
- `category` (Enumeration: modern, classic, minimal, creative, business, nonprofit, portfolio)
- `demo_url` (Text, Optional)
- `version` (Text, Default: "1.0.0")

#### Number:
- `price` (Decimal, Default: 0)
- `sort_order` (Integer, Default: 0)

#### Boolean:
- `is_active` (Boolean, Default: true)
- `is_premium` (Boolean, Default: false)
- `is_featured` (Boolean, Default: false)

#### Media:
- `preview_image` (Media, Single, Images only)
- `thumbnail` (Media, Single, Images only)

#### JSON:
- `configuration` (JSON, Optional) - theme settings
- `tags` (JSON, Optional) - searchable tags
- `responsive_breakpoints` (JSON, Optional)
- `color_schemes` (JSON, Optional) - predefined color options

#### Relations:
- `sections` (Relation: Template has many Sections)

**Click Save**

---

### 3. Section Content Type

**Create new collection type**: `Section`

#### Text Fields:
- `name` (Text, Required, Max: 255)
- `type` (Enumeration: hero, about, services, contact, gallery, testimonials, team, pricing, blog, footer, header, cta, features, stats, faq)
- `css_classes` (Text, Optional)
- `component_name` (Text, Optional) - React component name

#### Rich Text:
- `custom_css` (Rich text, Optional)

#### Number:
- `order` (Integer, Default: 0)

#### Boolean:
- `is_active` (Boolean, Default: true)
- `is_required` (Boolean, Default: false)
- `is_customizable` (Boolean, Default: true)

#### JSON:
- `default_content` (JSON, Optional) - default section content
- `settings` (JSON, Optional) - section configuration
- `animation` (JSON, Optional) - animation settings
- `schema` (JSON, Optional) - content structure definition

#### Relations:
- `template` (Relation: Section belongs to Template)

**Click Save**

---

### 4. Page Content Type

**Create new collection type**: `Page`

#### Text Fields:
- `title` (Text, Required, Max: 255)
- `slug` (UID, Target: title, Required)
- `seo_title` (Text, Optional)
- `seo_description` (Text, Optional)
- `seo_keywords` (Text, Optional)

#### Boolean:
- `is_home` (Boolean, Default: false)
- `is_published` (Boolean, Default: true)
- `show_in_nav` (Boolean, Default: true)

#### Number:
- `nav_order` (Integer, Default: 0)

#### JSON:
- `content` (JSON, Optional) - page content
- `custom_sections` (JSON, Optional) - page-specific sections
- `page_settings` (JSON, Optional) - page configuration

#### Relations:
- `organization` (Relation: Page belongs to Organization)
- `template` (Relation: Page belongs to Template)

**Click Save**

---

### 5. Section Content Type

**Create new collection type**: `SectionContent`

#### Text Fields:
- `section_id` (Text, Required)
- `organization_slug` (Text, Required)
- `page_slug` (Text, Default: "home")
- `last_modified_by` (Text, Optional)

#### Number:
- `version` (Integer, Default: 1)

#### Boolean:
- `is_published` (Boolean, Default: true)

#### Date:
- `scheduled_publish` (DateTime, Optional)

#### JSON:
- `content` (JSON, Required) - actual section content
- `metadata` (JSON, Optional) - content metadata

#### Relations:
- `organization` (Relation: SectionContent belongs to Organization)
- `section` (Relation: SectionContent belongs to Section)

**Click Save**

---

### 6. Asset Content Type

**Create new collection type**: `Asset`

#### Text Fields:
- `name` (Text, Required, Max: 255)
- `description` (Text, Optional)
- `category` (Enumeration: image, video, document, audio, icon, logo, background, hero)
- `alt_text` (Text, Optional)

#### Number:
- `usage_count` (Integer, Default: 0)
- `file_size` (Integer, Optional)

#### Boolean:
- `is_public` (Boolean, Default: false)
- `is_optimized` (Boolean, Default: false)

#### Media:
- `file` (Media, Single, All types)

#### JSON:
- `tags` (JSON, Optional)
- `dimensions` (JSON, Optional) - width, height
- `optimization_settings` (JSON, Optional)

#### Relations:
- `organization` (Relation: Asset belongs to Organization)

**Click Save**

---

## 🔐 Step 3: Configure Permissions

**Settings → Users & Permissions Plugin → Roles → Public**

Enable these permissions:

### Organization:
- ✅ `find`
- ✅ `findOne`

### Template:
- ✅ `find`
- ✅ `findOne`

### Section:
- ✅ `find`
- ✅ `findOne`

### Page:
- ✅ `find`
- ✅ `findOne`

### SectionContent:
- ✅ `find`
- ✅ `findOne`
- ✅ `create`
- ✅ `update`

### Asset:
- ✅ `find`
- ✅ `findOne`

**Click Save**

---

## 📝 Step 4: Add Sample Data

After creating all content types, add sample data to test the system.

### Sample Organization:
- Name: "Happy Paws Rescue"
- Slug: "happy-paws"
- Primary Color: "#2563eb"
- Mission: "Saving lives, one paw at a time"

### Sample Template:
- Name: "Modern Rescue"
- Category: "nonprofit"
- Description: "Clean, modern design perfect for animal rescues"

### Sample Sections:
- Hero Section (type: hero, order: 0)
- About Section (type: about, order: 1)
- Services Section (type: services, order: 2)
- Contact Section (type: contact, order: 3)

---

## ✅ Verification

After setup, verify:
1. All content types created
2. Sample data added
3. API endpoints working:
   - `/api/organizations`
   - `/api/templates`
   - `/api/sections`
   - `/api/pages`
   - `/api/section-contents`
   - `/api/assets`

---

## 🚀 Next Steps

Once Strapi is set up:
1. Update frontend API service
2. Create template rendering system
3. Build content management interface
4. Add live preview functionality
