# Migration Guide - Updating Remaining Pages to Design System

This guide shows how to update the remaining dashboard pages (projects, experience, skills) to use the new design system components.

## 📋 Pages to Update

- [ ] `/app/dashboard/projects/page.js`
- [ ] `/app/dashboard/experience/page.js`
- [ ] `/app/dashboard/skills/page.js`
- [ ] `/app/portfolio/[id]/page.js` (optional enhancement)

## 🔄 Common Patterns

### 1. Replace Inline Forms with Modal

**Before**:
```jsx
{showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 max-w-2xl">
      <h2>Add Project</h2>
      <form>
        <input className="w-full px-4 py-2 border..." />
        <button className="bg-indigo-600...">Save</button>
      </form>
    </div>
  </div>
)}
```

**After**:
```jsx
import { Modal, Input, Button } from '@/components';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Add Project"
  size="lg"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save Project
      </Button>
    </>
  }
>
  <form className="space-y-4">
    <Input
      label="Project Title"
      value={formData.title}
      onChange={(e) => setFormData({...formData, title: e.target.value})}
    />
    {/* More fields */}
  </form>
</Modal>
```

### 2. Replace Card Layouts

**Before**:
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold mb-4">Projects</h2>
  <div>Content</div>
</div>
```

**After**:
```jsx
import { Card } from '@/components';

<Card>
  <Card.Header>
    <Card.Title>Projects</Card.Title>
  </Card.Header>
  <Card.Body>
    Content
  </Card.Body>
</Card>
```

### 3. Replace Buttons

**Before**:
```jsx
<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
  Add New
</button>
<button className="bg-red-600 text-white px-3 py-1 rounded">
  Delete
</button>
```

**After**:
```jsx
import { Button } from '@/components';

<Button variant="primary">Add New</Button>
<Button variant="destructive" size="sm">Delete</Button>
```

### 4. Replace Form Inputs

**Before**:
```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Title
  </label>
  <input
    type="text"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2..."
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
</div>
```

**After**:
```jsx
import { Input } from '@/components';

<Input
  label="Title"
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

### 5. Replace Badge/Tags

**Before**:
```jsx
<span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
  React
</span>
```

**After**:
```jsx
import { Badge } from '@/components';

<Badge variant="default">React</Badge>
```

## 📝 Step-by-Step: Projects Page

### Step 1: Update Imports

```jsx
// Add to top of file
import { Button, Card, Modal, Input, Textarea, Badge } from '@/components';
```

### Step 2: Replace Page Container

```jsx
// Before
<div className="container mx-auto px-4 py-8">

// After
<div className="max-w-6xl mx-auto px-6 py-8">
```

### Step 3: Replace Header Card

```jsx
<Card className="mb-6">
  <div className="flex justify-between items-center">
    <Card.Title>My Projects</Card.Title>
    <Button variant="primary" onClick={() => setShowModal(true)}>
      Add Project
    </Button>
  </div>
</Card>
```

### Step 4: Replace Project Grid Cards

```jsx
<div className="grid md:grid-cols-3 gap-6">
  {projects.map((project) => (
    <Card key={project.id} className="hover:shadow-modal transition-shadow">
      <Card.Header>
        <Card.Title>{project.title}</Card.Title>
      </Card.Header>
      <Card.Body>
        <p className="text-[var(--muted)] mb-3">{project.description}</p>
        {project.technologies && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.technologies.map(tech => (
              <Badge key={tech} size="sm">{tech}</Badge>
            ))}
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
            Delete
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ))}
</div>
```

### Step 5: Replace Modal Form

```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title={editingProject ? 'Edit Project' : 'Add Project'}
  size="lg"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Project'}
      </Button>
    </>
  }
>
  <form className="space-y-4">
    <Input
      label="Project Title"
      required
      value={formData.title}
      onChange={(e) => setFormData({...formData, title: e.target.value})}
      placeholder="My Awesome Project"
    />
    
    <Textarea
      label="Description"
      required
      rows={4}
      value={formData.description}
      onChange={(e) => setFormData({...formData, description: e.target.value})}
      placeholder="Describe your project..."
    />
    
    <Input
      label="Project URL"
      type="url"
      value={formData.projectURL}
      onChange={(e) => setFormData({...formData, projectURL: e.target.value})}
      placeholder="https://example.com"
      helperText="Optional link to live project or repository"
    />
    
    <Input
      label="Date Completed"
      type="date"
      value={formData.dateCompleted}
      onChange={(e) => setFormData({...formData, dateCompleted: e.target.value})}
    />
  </form>
</Modal>
```

## 📝 Step-by-Step: Experience Page

### Key Changes

1. **Timeline Layout**: Keep the timeline but wrap in Card
2. **Date Validation**: Already handles trigger errors
3. **Modal Form**: Same pattern as projects

```jsx
<Card>
  <Card.Header>
    <div className="flex justify-between items-center">
      <Card.Title>Work Experience</Card.Title>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Experience
      </Button>
    </div>
  </Card.Header>
  <Card.Body>
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="relative pl-6 pb-6 border-l-4 border-[var(--accent)]">
          <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[var(--accent)]" />
          <div className="mb-2">
            <h3 className="text-lg font-semibold">{exp.role}</h3>
            <p className="text-[var(--muted)]">{exp.company}</p>
          </div>
          <p className="text-sm text-[var(--muted)] mb-3">
            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
          </p>
          {exp.description && (
            <p className="text-gray-700 mb-3">{exp.description}</p>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  </Card.Body>
</Card>
```

## 📝 Step-by-Step: Skills Page

### Key Changes

1. **Category Groups**: Use Card for each category
2. **Proficiency Slider**: Keep input[type="range"] but style consistently
3. **Skill Selection**: Use Select component

```jsx
<div className="space-y-6">
  {/* Add Skill Section */}
  <Card>
    <Card.Header>
      <Card.Title>Add New Skill</Card.Title>
    </Card.Header>
    <Card.Body>
      <div className="flex gap-3">
        <Select
          label="Select Skill"
          options={skillDefinitions.map(s => ({
            value: s.skillDefID,
            label: s.skillName
          }))}
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="flex-1"
        />
        <div className="pt-6">
          <Button variant="primary" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </div>
      </div>
    </Card.Body>
  </Card>

  {/* Skills by Category */}
  {Object.entries(groupedSkills).map(([category, skills]) => (
    <Card key={category}>
      <Card.Header>
        <Card.Title>{category}</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.userSkillID}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{skill.skillName}</span>
                  <Badge variant="neutral" size="sm">
                    Level {skill.proficiencyLevel}/10
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemove(skill.userSkillID)}
                >
                  Remove
                </Button>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={skill.proficiencyLevel}
                onChange={(e) => handleUpdate(skill.userSkillID, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  ))}
</div>
```

## 🎨 Styling Tips

### Custom Range Input (for skills proficiency)

```css
/* Add to globals.css if needed */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #E5E7EB;
  height: 0.5rem;
  border-radius: 0.5rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: var(--accent);
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 50%;
  margin-top: -0.375rem;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px var(--accent-weak);
}
```

## ✅ Checklist for Each Page

When updating a page, verify:

- [ ] Import statements updated
- [ ] Container changed to `max-w-6xl mx-auto px-6`
- [ ] All cards use `<Card>` component
- [ ] All buttons use `<Button>` component
- [ ] All inputs use `<Input>` or `<Textarea>` components
- [ ] Modals use `<Modal>` component
- [ ] Colors use CSS variables (`var(--accent)`, `var(--muted)`)
- [ ] Spacing uses `gap-6` and `p-6`
- [ ] No hard-coded colors (indigo-600, etc.)
- [ ] Focus states work correctly
- [ ] Loading states handled
- [ ] Error states displayed with toast

## 🧪 Testing After Migration

1. **Visual Check**: Page should look consistent with dashboard
2. **Functionality**: All CRUD operations still work
3. **Keyboard**: Tab through form, ESC closes modals
4. **Responsive**: Check mobile/tablet layouts
5. **Errors**: Trigger validation errors, check toast display

## 📦 Example: Complete Projects Page Migration

See the complete before/after example in `MIGRATION_EXAMPLE_PROJECTS.md` (if needed).

## 🎯 Quick Wins

If you want to migrate quickly:

1. **Start with imports**: Add component imports to all 3 pages
2. **Replace buttons**: Search and replace button classes
3. **Replace inputs**: Convert all form inputs
4. **Add modals**: Move inline forms to Modal component
5. **Wrap in Cards**: Convert div.bg-white to Card components

## 💡 Tips

- **Test incrementally**: Migrate one section at a time
- **Use browser DevTools**: Check CSS variable values
- **Check console**: Look for missing prop warnings
- **Keep functionality**: Don't change logic, only UI
- **Compare with dashboard**: Use dashboard page as reference

---

**Time Estimate**: 30-45 minutes per page for careful migration with testing.

**Priority Order**: Projects → Skills → Experience (projects is most complex, experience already has good error handling)
