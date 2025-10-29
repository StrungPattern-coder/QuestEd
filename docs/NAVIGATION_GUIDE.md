# Navigation Guide - Accessing New Features

This guide shows you how to access the newly implemented features: **Study Materials**, **Announcements**, and **Question Bank**.

## 🎓 Teacher Access

### 1. Question Bank
**Multiple ways to access:**

#### From Dashboard Top Navigation
- Log in as a teacher
- Look at the top navigation bar
- Click the **"Question Bank"** button (has a HelpCircle icon 🔍)
- Direct URL: `/dashboard/teacher/question-bank`

#### From Dashboard Quick Actions
- Go to teacher dashboard
- Scroll to the "Quick Actions" section
- Click the **"Question Bank"** card

**What you can do:**
- Create new questions with 4 options
- Set difficulty level (Easy/Medium/Hard)
- Organize by subject, topic, and tags
- Search and filter questions
- Export questions to CSV
- Edit and delete questions

---

### 2. Study Materials (Per Classroom)
**Access from classroom:**

#### From Classroom Detail Page
- Go to teacher dashboard
- Click on any classroom card
- You'll see two new prominent cards:
  - **"Study Materials"** (with FolderOpen icon 📁)
  - Click it to manage materials for that classroom
- Direct URL: `/dashboard/teacher/classrooms/[classroomId]/materials`

**What you can do:**
- Upload materials (PDFs, Images, Videos, Links, Documents)
- Set title and description
- View all materials in the classroom
- Delete materials
- Students can download/view these materials

---

### 3. Announcements (Per Classroom)
**Access from classroom:**

#### From Classroom Detail Page
- Go to teacher dashboard
- Click on any classroom card
- You'll see two new prominent cards:
  - **"Announcements"** (with Bell icon 🔔)
  - Click it to manage announcements
- Direct URL: `/dashboard/teacher/classrooms/[classroomId]/announcements`

**What you can do:**
- Create announcements with title and content
- Set priority (Low/Medium/High)
- Pin important announcements to the top
- Edit existing announcements
- Delete announcements
- Students see them organized by priority and pin status

---

## 👨‍🎓 Student Access

### 1. Study Materials
**Multiple ways to access:**

#### From Dashboard Top Navigation
- Log in as a student
- Look at the top navigation bar (between brand and other buttons)
- Click the **"Materials"** button (with FolderOpen icon 📁)
- Direct URL: `/dashboard/student/materials`

**What you can see:**
- Select any classroom you're enrolled in
- View all materials uploaded by teachers
- Download PDFs, images, documents
- Open video links and external resources
- See file sizes and upload dates

---

### 2. Announcements
**Multiple ways to access:**

#### From Dashboard Top Navigation
- Log in as a student
- Look at the top navigation bar
- Click the **"Announcements"** button (with Bell icon 🔔)
- Direct URL: `/dashboard/student/announcements`

**What you can see:**
- Select any classroom you're enrolled in
- Pinned announcements appear at the top (highlighted)
- Regular announcements below in chronological order
- Priority badges (High/Medium/Low) with color coding
- High priority announcements have alert icons

---

## 🎯 Quick Navigation Summary

### Teacher Navigation Bar (Top)
```
[QuestEd] | [Question Bank 🔍] | [User Info] [Logout]
```

### Teacher Dashboard Quick Actions
- Create New Classroom
- Create New Test
- **Question Bank** ✨ (NEW)

### Teacher Classroom Detail Page
When you open any classroom, you'll see two prominent cards:
1. **Study Materials** 📁 - Upload and manage learning resources
2. **Announcements** 🔔 - Post updates and notices to class

### Student Navigation Bar (Top)
```
[QuestEd] | [Materials 📁] [Announcements 🔔] | [Join Live] [Profile] [User Info] [Logout]
```

---

## 📊 Feature Comparison

| Feature | Teacher Access | Student Access |
|---------|---------------|---------------|
| **Question Bank** | ✅ Top nav + Quick Actions | ❌ Not available |
| **Materials** | ✅ Per classroom page | ✅ Top nav (all classrooms) |
| **Announcements** | ✅ Per classroom page | ✅ Top nav (all classrooms) |

---

## 🚀 Testing the Features

### Test Question Bank
1. Log in as teacher
2. Click "Question Bank" in top nav
3. Create a new question
4. Try filtering by subject/difficulty
5. Export to CSV

### Test Materials
**Teacher:**
1. Go to a classroom detail page
2. Click "Study Materials"
3. Upload a file (use a URL like Google Drive link)
4. Verify it appears in the list

**Student:**
1. Log in as student
2. Click "Materials" in top nav
3. Select a classroom
4. Verify you can see and download materials

### Test Announcements
**Teacher:**
1. Go to a classroom detail page
2. Click "Announcements"
3. Create an announcement with HIGH priority
4. Pin it
5. Create another with LOW priority

**Student:**
1. Log in as student
2. Click "Announcements" in top nav
3. Select the classroom
4. Verify pinned announcement appears at top
5. Verify HIGH priority has alert icon

---

## 🎨 UI Elements to Look For

### Icons Used
- 🔍 **HelpCircle** - Question Bank
- 📁 **FolderOpen** - Study Materials
- 🔔 **Bell** - Announcements
- ⚡ **Zap** - Join Live (existing)
- 👤 **User** - Profile (existing)

### Color Coding
- **Orange (#FF991C)** - Primary action buttons and hover states
- **Green** - Correct answers in Question Bank, Easy difficulty
- **Yellow** - Medium difficulty
- **Red** - Hard difficulty, High priority
- **Blue** - Low priority

---

## 📝 Notes

1. **Materials are per-classroom** - Teachers manage them within each classroom, students see all their classrooms' materials
2. **Announcements are per-classroom** - Same pattern as materials
3. **Question Bank is global** - Teachers have one question bank to reuse across all tests
4. **File Storage** - Currently uses URLs (Google Drive, Dropbox, etc.), not local upload
5. **Pinned Announcements** - Always appear at the top with special styling

---

## 🔗 Direct URLs Reference

### Teacher URLs
- Question Bank: `/dashboard/teacher/question-bank`
- Materials (example): `/dashboard/teacher/classrooms/[classroomId]/materials`
- Announcements (example): `/dashboard/teacher/classrooms/[classroomId]/announcements`

### Student URLs
- Materials: `/dashboard/student/materials`
- Announcements: `/dashboard/student/announcements`

---

## ✅ Build Status
All navigation changes have been tested and verified:
- ✅ Build successful (0 errors)
- ✅ All routes compiled
- ✅ TypeScript validation passed
- ✅ Icons imported correctly
- ✅ Responsive design maintained

---

**Last Updated:** December 2024
**Version:** 1.0
**Status:** Production Ready ✨
