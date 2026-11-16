# Deploy Parent Feedback Survey (your Netlify account)

1. In Supabase → SQL Editor, run in order if needed:
   - `../supabase/parent_feedback.sql` (new projects)
   - `../supabase/parent_feedback_admin_fields.sql` (status/notes/tags/email)
   - `../supabase/parent_feedback_v2_fields.sql` (tutoring_quality, learning_progress, etc.)
2. Log into [Netlify](https://app.netlify.com).
3. **Add new site → Deploy manually** and drop this folder (`smartmathz-survey-deploy`),  
   or use CLI:

```bash
cd smartmathz-survey-deploy
npx netlify-cli login
npx netlify-cli deploy --prod --dir=.
```

4. Share the new Netlify URL with parents (it will be different from `smartmathz.netlify.app` unless that site is transferred/linked to your account).

Files to deploy: `index.html`, `config.js`, `smartmathz-logo.png`.
