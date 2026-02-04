# Claude Code Workflow - Quick Reference

## 🎯 Strategy for Using Claude Code

### How to Work Phase by Phase:

---

## For Each Phase:

### 1. Tell Claude Code what phase you're working on

**Example:**
```
"I'm working on Phase 1: Color System Migration"
```

---

### 2. Show Claude Code the relevant parts:

- Your HTML mockup (red+bluelight.html or red+bluedark)
- The current file that needs updating
- The implementation strategy guide (IMPLEMENTATION-GUIDE.md)

**Example:**
```
"Here's my HTML design mockup and the current globals.css file.
I need to update the colors to match my design."
```

---

### 3. Ask for specific changes:

Be precise about what you want changed.

**Good Examples:**
- "Update the colors in globals.css to match my HTML design"
- "Replace the cyan theme (#00D9D9) with red (#FF3B5C) for all primary colors"
- "Change the navigation links from 'Blog, About' to 'Gaming, Movies, TV, Anime'"
- "Update the footer to include 4 columns like in my dark mode design"

**Bad Examples:**
- "Make it look better" (too vague)
- "Fix the design" (not specific)
- "Update everything" (too broad)

---

### 4. Test the changes:

After Claude Code makes changes:

1. **Look at the result** in your browser
2. **Check both light and dark modes** (if applicable)
3. **Test on mobile view** (resize browser)
4. **Give feedback** if something isn't right

**Example Feedback:**
```
"The red color is good, but the buttons are too small.
Can you make them match the size in my HTML mockup?"
```

---

### 5. Move to next phase:

**Important Rules:**
- Don't try to do everything at once
- Complete one phase before starting the next
- Test thoroughly before moving on
- If something breaks, fix it before continuing

**Progress Tracking:**
```
✅ Phase 1: Colors - DONE
✅ Phase 2: Typography - DONE
🔄 Phase 3A: Navigation - IN PROGRESS
⏸️ Phase 3B: Hero Section - NOT STARTED
⏸️ Phase 3C: Category Pills - NOT STARTED
```

---

## 🎯 Communication Templates

### Starting a Phase:
```
"I'm ready to start Phase [X]: [Phase Name].

Here's what needs to change:
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

I'm attaching my HTML mockup for reference."
```

---

### Requesting Changes:
```
"Looking at [file name], I need to:
1. Change [specific element] from [current state] to [desired state]
2. Update [component] to match my HTML design
3. Ensure it works in both light and dark modes

Here's the relevant section from my HTML mockup: [paste or show]"
```

---

### Giving Feedback:
```
"The changes look good, but I noticed:
- [Issue 1]: [Description and what should happen instead]
- [Issue 2]: [Description and what should happen instead]

Can you adjust these?"
```

---

### Testing Checklist:
```
After each change, verify:
☐ Does it look right on desktop?
☐ Does it look right on mobile?
☐ Does light mode work?
☐ Does dark mode work?
☐ Do hover effects work?
☐ Are colors matching my design?
```

---

## 💡 Pro Tips

1. **One thing at a time:**
   - "Update navigation colors" ✅
   - NOT "Fix everything on the page" ❌

2. **Reference your HTML:**
   - Always show Claude Code the specific part of your HTML you want to match

3. **Be patient:**
   - First attempt might not be perfect
   - Iterate until it's right
   - Don't rush to the next phase

4. **Save your work:**
   - Commit to git after each successful phase
   - This way you can always go back if something breaks

5. **Take breaks:**
   - Don't try to do all phases in one session
   - Come back fresh for better results

---

## 🚨 If Something Goes Wrong:

**Don't Panic!** Try this:

1. **Describe what's wrong specifically:**
   ```
   "The navigation bar disappeared after the last change.
   It should be visible at the top with the logo and links."
   ```

2. **Show the error** (if there is one)

3. **Ask to revert:**
   ```
   "Can we undo the last change and try a different approach?"
   ```

4. **Try smaller steps:**
   - Instead of changing everything, change one small thing
   - Test it, then move to the next small thing

---

## 📚 Quick Phase Reference

**Phase 1:** Colors (globals.css, tailwind.config.ts)
**Phase 2:** Typography & Visual Polish (globals.css, components)
**Phase 3A:** Navigation (Navigation.tsx)
**Phase 3B:** Hero Section (page.tsx)
**Phase 3C:** Category Pills (new component)
**Phase 3D:** Article Cards (components)
**Phase 3E:** Sidebar (new components)
**Phase 3F:** Footer (Footer.tsx)
**Phase 4:** Theme Toggle (new component)
**Phase 5:** Testing & Polish (all files)

---

## ✅ Remember:

> **You are the designer.**
> **Claude Code is the implementer.**
> **Be clear about what you want, and you'll get great results!**

---

**Good luck with your implementation! 🚀**
