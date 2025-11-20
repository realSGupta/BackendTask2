# Quick Fix: GitHub Authentication

## ✅ I just configured Git to use Windows Credential Manager

Now try pushing again. When prompted:
- Username: realSGupta
- Password: Use a Personal Access Token (NOT your GitHub password)

## How to get a Personal Access Token:

1. Go to: https://github.com/settings/tokens/new
2. Note: "BackendTask2 Push"
3. Expiration: 30 days
4. Select: ✅ repo (check the main "repo" box)
5. Click "Generate token"
6. COPY THE TOKEN (looks like: ghp_xxxxxxxxxxxx)
7. Use this as your password when pushing

## Then run:
```bash
git push -u origin main
```

When prompted:
- Username: realSGupta
- Password: [paste your token]

---

## Alternative: GitHub Desktop (No passwords needed!)
Download: https://desktop.github.com/
- Sign in once
- Never worry about tokens/passwords again
- One-click push

Which do you prefer? Token or GitHub Desktop?
