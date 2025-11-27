# Quick Visual Reference - Design System

## Color Palette

```
Primary Accent:   #7C3AED (Purple)
Accent Hover:     #6D28D9 (Darker Purple)
Accent Weak:      #EDE9FE (Light Purple)
Muted Text:       #6B7280 (Gray)
Success:          #10B981 (Green)
Destructive:      #EF4444 (Red)
```

## Typography Scale

```
xs:     12px
sm:     14px
base:   16px
lg:     20px
xl:     24px
2xl:    32px
```

## Spacing Scale

```
p-4:    16px padding
p-6:    24px padding (default card)
p-8:    32px padding
gap-6:  24px gap (default grid)
```

## Border Radius

```
sm:     6px
md:     12px (default)
lg:     20px
```

## Shadows

```
subtle:  0 1px 2px rgba(16,24,40,0.04)
card:    0 6px 18px rgba(16,24,40,0.08)
modal:   0 20px 25px -5px rgba(16,24,40,0.1)
```

## Component Quick Reference

### Button Variants
```jsx
<Button variant="primary">Primary CTA</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete Action</Button>
```

### Card Structure
```jsx
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Body>
    Card content goes here
  </Card.Body>
  <Card.Footer>
    Footer actions
  </Card.Footer>
</Card>
```

### Form Inputs
```jsx
<Input 
  label="Email" 
  type="email"
  placeholder="you@example.com"
  helperText="Helper text"
  error="Error message"
/>

<Textarea 
  label="Description"
  rows={4}
  placeholder="Enter description..."
/>

<Select
  label="Category"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
/>
```

### Progress Bar
```jsx
<Progress 
  value={80} 
  max={100}
  label="Profile Strength"
  color="accent"
  size="lg"
/>
```

### Badge
```jsx
<Badge variant="default">Skill</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
```

### Avatar
```jsx
<Avatar name="John Doe" size="lg" />
<Avatar src="/avatar.jpg" name="John Doe" size="md" />
```

### Modal
```jsx
<Modal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  Modal content
</Modal>
```

## Layout Guidelines

### Page Container
```jsx
<div className="max-w-6xl mx-auto px-6 py-8">
  {/* Page content */}
</div>
```

### Dashboard Grid
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Card Grid
```jsx
<div className="grid md:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

## Accessibility Patterns

### Focus Ring
```css
focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2
```

### Disabled State
```jsx
<Button disabled>Disabled</Button>
// Automatically applies opacity-50 and cursor-not-allowed
```

### Keyboard Navigation
- ESC closes modals
- Tab navigates through form fields
- Enter submits forms
- Space activates buttons

## Icon Sizes

```
Inline icons:  h-5 w-5
Avatar icons:  h-8 w-8
Large icons:   h-10 w-10
```

## Common Patterns

### Loading State
```jsx
{loading ? (
  <div className="text-[var(--muted)]">Loading...</div>
) : (
  // Content
)}
```

### Error State
```jsx
<Input 
  error={errors.email}
  // Shows red border and error message
/>
```

### Hover Effect
```jsx
<Card className="hover:shadow-modal transition-shadow cursor-pointer">
  // Card content
</Card>
```

## CSS Variables Usage

```css
/* In your custom styles */
.custom-element {
  color: var(--accent);
  background: var(--accent-weak);
  border-radius: var(--radius-md);
}
```

## Import Pattern

```jsx
// Single component
import Button from '@/components/Button';

// Multiple components
import { Button, Card, Input, Modal } from '@/components';
```

## Do's and Don'ts

### ✅ Do
- Use CSS variables for colors
- Use component props for variants
- Maintain consistent spacing (gap-6)
- Use semantic HTML
- Include labels for inputs
- Handle loading and error states

### ❌ Don't
- Hard-code color values
- Mix different spacing scales
- Nest cards deeply (keep flat)
- Use inline styles for component styling
- Skip accessibility attributes
- Forget disabled states

## Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

### Responsive Grid Example
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

---

**Quick Start**: Copy component examples above and adjust props as needed. All components are self-documenting via props and include sensible defaults.
