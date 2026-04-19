# AgriMind Frontend Deploy Fix TODO

✅ Created web/index.html (fixed src="/main.jsx")
✅ Fixed vercel.json (rewrites only, no builds)
✅ Created favicon placeholder

## Remaining:
- [ ] Fix ResultsDashboard.jsx SVG path error (RadialBar/Pie fallback)
- [ ] Test local: `npm run build && npx serve dist`
- [ ] Push: `git add . && git commit -m "Fix deploy: web/index.html, vercel.json, favicon" && git push`
- [ ] Vercel redeploy (Root="", Build="npm run build", Output="dist")
- [ ] Verify /api/predict proxy, charts, form defaults

**Next:** Edit ResultsDashboard.jsx
