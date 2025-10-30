# Backend Hosting Guide: Render Free Tier + Automated Backups

## Overview

This guide explains how to host a backend API on Render's free tier for blog comments, while managing the limitations through automated backups and maintenance workflows.

---

## The Problem: Free Tier Limitations

### 1. Cold Starts
**What happens:** After 15 minutes of inactivity, Render spins down your backend service.

**Impact:** First request after idle period takes ~30 seconds to wake up the service.

**Solution:** Accept this for low-traffic personal blogs. Show "Loading comments..." message.

### 2. PostgreSQL Database Expires Every 90 Days
**What happens:** Render's free PostgreSQL databases are automatically deleted after 90 days.

**Impact:** You lose all comment data unless backed up.

**Solution:** Automated backups + manual recreation every 90 days (~10 min work).

---

## Recommended Architecture

```
┌─────────────────────┐
│  GitHub Pages       │  ← Frontend (Vue app) - FREE
│  Frontend only      │
└──────────┬──────────┘
           │
           │ HTTPS API calls
           ↓
┌─────────────────────┐
│  Render Web Service │  ← Backend API - FREE
│  Node.js + Express  │     (with cold starts)
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Render PostgreSQL  │  ← Database - FREE
│  (expires 90 days)  │     (recreate periodically)
└─────────────────────┘
```

**Why this setup:**
- Keep frontend on GitHub Pages (always fast, no cold starts)
- Backend on Render handles dynamic features (comments)
- PostgreSQL for proper relational data
- Total cost: $0

---

## Solution: Automated Backup System

### Strategy Overview

1. **Daily automated backups** via GitHub Actions
2. **Store backups in Git** (comment data as JSON)
3. **Calendar reminder** at day 85 to prepare for DB recreation
4. **10-minute manual process** every 90 days to recreate DB

### Benefits
- Never lose data
- Git tracks all comment history
- Can restore to any point in time
- Simple, auditable process

---

## Implementation

### 1. Backend Structure

```
blog-api/
├── server.js              # Main Express server
├── routes/
│   └── comments.js        # Comment endpoints
├── db/
│   └── database.js        # PostgreSQL connection
├── scripts/
│   └── backup.js          # Backup script
├── backups/               # Backup files (committed to Git)
│   └── .gitkeep
├── package.json
└── README.md
```

### 2. Backup Script

**scripts/backup.js:**
```javascript
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function backupComments() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  try {
    console.log('🔄 Starting backup...')

    // Fetch all comments
    const result = await pool.query(`
      SELECT * FROM comments
      ORDER BY created_at DESC
    `)

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `backups/comments_${timestamp}.json`

    // Write to file
    fs.writeFileSync(
      path.join(__dirname, '..', filename),
      JSON.stringify(result.rows, null, 2)
    )

    console.log(`✅ Backup complete! Saved ${result.rows.length} comments to ${filename}`)

  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

backupComments()
```

### 3. GitHub Actions Workflow

**.github/workflows/backup-database.yml:**
```yaml
name: Backup Database

on:
  schedule:
    # Run every Sunday at 2 AM UTC
    - cron: '0 2 * * 0'

  # Allow manual trigger
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Run backup script
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          cd backend
          node scripts/backup.js

      - name: Commit and push backup
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add backend/backups/
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore: automated database backup $(date +%Y-%m-%d)" && git push)
```

### 4. Restore Script

**scripts/restore.js:**
```javascript
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function restoreComments(backupFile) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  try {
    console.log(`🔄 Restoring from ${backupFile}...`)

    // Read backup file
    const backupPath = path.join(__dirname, '..', backupFile)
    const comments = JSON.parse(fs.readFileSync(backupPath, 'utf8'))

    // Clear existing data (optional - be careful!)
    // await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE')

    // Insert comments
    for (const comment of comments) {
      await pool.query(`
        INSERT INTO comments (id, post_slug, author, email, content, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [
        comment.id,
        comment.post_slug,
        comment.author,
        comment.email,
        comment.content,
        comment.created_at
      ])
    }

    console.log(`✅ Restored ${comments.length} comments!`)

  } catch (error) {
    console.error('❌ Restore failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Usage: node scripts/restore.js backups/comments_2025-01-15.json
const backupFile = process.argv[2]
if (!backupFile) {
  console.error('Usage: node restore.js <backup-file>')
  process.exit(1)
}

restoreComments(backupFile)
```

---

## Workflows

### Daily Automated Backup (No Action Required)

**What happens:**
1. Every Sunday at 2 AM UTC, GitHub Actions runs
2. Connects to your Render PostgreSQL database
3. Exports all comments to JSON
4. Commits the backup file to your repo
5. Pushes to GitHub

**You see:**
- New commit in repo: "chore: automated database backup 2025-01-15"
- New file: `backend/backups/comments_2025-01-15.json`

**Time required:** 0 minutes (fully automated)

---

### 90-Day Database Recreation (Manual)

**Timeline:**

**Day 83:** Render emails "Database expires in 7 days"
**Day 85:** Set aside time, check latest backup exists

#### Step 1: Verify Backup (2 minutes)

```bash
# Check if recent backup exists
ls -lh backend/backups/

# Should see: comments_2025-01-XX.json (within last week)

# Optional: Manually trigger backup
gh workflow run backup-database.yml
```

#### Step 2: Create New Database (3 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Settings:
   - **Name:** `blog-comments-db-v2` (increment version)
   - **Database:** `comments`
   - **User:** `comments_user`
   - **Region:** Same as your web service
   - **Plan:** Free
4. Click "Create Database"
5. Wait 1-2 minutes for provisioning

#### Step 3: Get New Database URL (1 minute)

1. Click on your new database
2. Copy the "Internal Database URL" (starts with `postgres://`)
3. Format: `postgres://user:password@host:5432/database`

#### Step 4: Update Environment Variable (2 minutes)

1. Go to your Web Service in Render
2. Click "Environment" tab
3. Find `DATABASE_URL` variable
4. Click "Edit" → Paste new database URL
5. Click "Save Changes"
6. Wait for service to restart (~30 seconds)

#### Step 5: Restore Data (2 minutes)

```bash
# From your local machine
cd backend

# Set new database URL temporarily
export DATABASE_URL="postgres://user:pass@new-host.render.com/db"

# Run restore script with latest backup
node scripts/restore.js backups/comments_2025-01-XX.json

# Should output: ✅ Restored XX comments!
```

#### Step 6: Verify (1 minute)

```bash
# Test API endpoint
curl https://your-blog-api.onrender.com/api/comments/intro

# Should return your comments
```

#### Step 7: Cleanup (1 minute)

1. Go back to Render Dashboard
2. Find old database (the expired one)
3. Delete it (it's already deleted by Render, but remove from dashboard)

**Total time:** ~10 minutes every 90 days

---

## Setup Checklist

### Initial Setup

- [ ] Create Render account
- [ ] Deploy backend web service to Render
- [ ] Create free PostgreSQL database
- [ ] Add `DATABASE_URL` to environment variables
- [ ] Add backup and restore scripts to repo
- [ ] Create GitHub Actions workflow
- [ ] Add `DATABASE_URL` to GitHub Secrets
- [ ] Manually trigger backup to test
- [ ] Set calendar reminder for day 85

### GitHub Secrets Setup

1. Go to your repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `DATABASE_URL`
4. Value: Your Render PostgreSQL Internal Database URL
5. Click "Add secret"

### Calendar Reminders

Create recurring calendar event:
- **Title:** "Render DB Recreation Due"
- **Date:** Every 85 days (5 days before expiration)
- **Notes:** Link to this guide + current DATABASE_URL

---

## Monitoring & Alerts

### UptimeRobot (Optional, Free)

Monitor your backend health:

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://your-blog-api.onrender.com/health`
   - **Interval:** 5 minutes
3. Set up email alerts for downtime

### Health Check Endpoint

Add to your backend:

```javascript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1')

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    })
  }
})
```

---

## Troubleshooting

### Backup Fails

**Symptom:** GitHub Action fails with "connection refused"

**Fix:**
1. Check `DATABASE_URL` secret is correct
2. Ensure Render database allows external connections (should by default)
3. Check database hasn't expired early

### Restore Fails

**Symptom:** "duplicate key value violates unique constraint"

**Fix:**
1. Comment IDs already exist in new database
2. Either:
   - Clear table first: `TRUNCATE TABLE comments RESTART IDENTITY CASCADE`
   - Or modify restore script to use `ON CONFLICT (id) DO UPDATE`

### Cold Start Too Slow

**Symptom:** Users complain about 30s wait

**Options:**
1. Add loading message: "Comments loading (first load may take 30s)"
2. Use a free pinger service to keep backend awake
3. Upgrade to paid tier ($7/month for always-on)

### Lost All Backups

**Symptom:** Accidentally deleted backups directory

**Fix:**
1. Git history preserves everything
2. Check previous commits: `git log -- backend/backups/`
3. Restore old backup: `git checkout <commit-hash> -- backend/backups/`

---

## Cost Analysis

### Free Tier (Recommended Initially)

| Service | Cost | Notes |
|---------|------|-------|
| Frontend (GitHub Pages) | $0 | Unlimited |
| Backend (Render Web Service) | $0 | Cold starts after 15min |
| Database (Render PostgreSQL) | $0 | Expires every 90 days |
| **Total** | **$0/month** | ~10 min maintenance every 90 days |

### Paid Tier (When You Outgrow Free)

| Service | Cost | Notes |
|---------|------|-------|
| Frontend (GitHub Pages) | $0 | Still free |
| Backend (Render Web Service) | $7/month | Always-on, no cold starts |
| Database (Render PostgreSQL) | $7/month | Never expires, auto backups |
| **Total** | **$14/month** | Zero maintenance |

**When to upgrade:**
- Blog gets consistent traffic (no cold starts needed)
- Manual DB recreation becomes annoying
- You want peace of mind

---

## Alternative Approaches

### Option 1: Utterances/Giscus (GitHub-based)
**Cost:** $0

**Pros:**
- Zero backend, zero database
- No cold starts, no maintenance
- Comments stored in GitHub Issues

**Cons:**
- Users need GitHub accounts
- Less control over styling/features
- Not the "retro blog" aesthetic

### Option 2: Paid Tier from Start
**Cost:** $7-14/month

**Pros:**
- No maintenance, no cold starts
- Professional experience

**Cons:**
- Costs money for hobby project

---

## Future Considerations

### When Your Blog Grows

If you start getting consistent traffic:

1. **Cold starts become a non-issue** - Backend stays warm
2. **Consider paid tier** for reliability
3. **Add features:**
   - Comment threading
   - Reactions/likes
   - User profiles
   - Moderation tools
   - Email notifications

### Migration Path

From free tier → paid tier is seamless:
1. Click "Upgrade" in Render dashboard
2. Enter payment info
3. Done! Backend now always-on, DB persists forever

---

## Resources

- [Render Free Tier Docs](https://render.com/docs/free)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup.html)
- [GitHub Actions Cron Syntax](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- This guide: `BACKEND_HOSTING_GUIDE.md`

---

## Questions to Ask Yourself

Before starting:
- [ ] Am I okay with 30-second cold starts occasionally?
- [ ] Can I spend 10 minutes every 90 days to recreate DB?
- [ ] Is learning backend development worth the effort?

If you answered "no" to any of these, consider Utterances/Giscus instead.

If you answered "yes" to all, this setup gives you full control at zero cost!

---

**Last updated:** 2025-01-30
**Next review:** Before implementing backend
