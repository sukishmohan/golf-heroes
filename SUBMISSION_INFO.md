# Golf Heroes - Project Submission Information

## Deployed URLs (April 28, 2026)

### Live Website URL (Vercel)
```
https://golf-heroes-eight.vercel.app
```

### User Dashboard URL
```
https://golf-heroes-eight.vercel.app/dashboard
```

### GitHub Source Code Repository URL
```
https://github.com/sukishmohan/golf-heroes
```

### Admin Panel URL
```
https://golf-heroes-eight.vercel.app/admin
```

### Admin Panel Email
```
admin@golfheroes.com
```

### Admin Panel Password
```
AdminGolfHeroes123!
```

---

## Project Details

**Project Name:** Golf Heroes - Golf Lottery Platform
**Framework:** Next.js 16.2.4 (Turbopack)
**Deployment Platform:** Vercel
**Repository:** https://github.com/sukishmohan/golf-heroes
**Branch:** main

---

## How to Access the Application

### 1. Create User Account
- Visit: https://golf-heroes-984f0pywd-sukishmohans-projects.vercel.app
- Click "Sign Up"
- Fill in: Full Name, Email, Password
- **Select a Charity** (Red Cross, Doctors Without Borders, etc.)
- Click "Create Account"
- You'll be redirected to the login page

### 2. Login as User
- Use your registered email and password
- You'll be redirected to your dashboard
- View your profile and track golf scores

### 3. Access Admin Panel
- Visit: https://golf-heroes-984f0pywd-sukishmohans-projects.vercel.app/login
- Use admin credentials:
  - Email: `admin@golfheroes.com`
  - Password: `AdminGolfHeroes123!`
- Click "Sign In"
- Navigate to `/admin` to access the admin dashboard

### 4. Admin Panel Features
- **Dashboard:** System overview
- **Charities:** Manage registered charities
- **Users:** View and manage all registered users
- **Draws:** Manage lottery draws
- **Reports:** View system reports and analytics
- **Winners:** Track prize winners

---

## Features Implemented

### ✅ User Features
- User registration with charity selection
- User authentication (Login/Logout)
- Personal dashboard
- Golf score tracking
- Subscription status display
- Profile information display

### ✅ Admin Features
- Admin authentication
- Admin dashboard overview
- Charity management
- User management
- Lottery draw management
- Reports and analytics
- Winners tracking
- System configuration

### ✅ Technical Features
- Responsive design (mobile-friendly)
- Real-time data updates
- Professional UI with custom design
- Mock authentication (for development)
- Environment-based configuration
- Error handling and validation

---

## Testing Information

### Test User Credentials
You can create any test account using the registration form:
- **Email:** any@email.com
- **Password:** Any password (min 8 characters recommended)
- **Charity:** Select any from the dropdown

### Admin Credentials
- **Email:** admin@golfheroes.com
- **Password:** AdminGolfHeroes123!

### Test Cases
1. **User Registration**: Register with any email and select a charity
2. **User Login**: Login with registered credentials
3. **Dashboard Access**: View personal dashboard after login
4. **Admin Access**: Login with admin credentials, then navigate to /admin
5. **Charity Selection**: Verify all charities appear in the registration form dropdown

---

## Environment Variables

The project uses the following environment variables (configured in Vercel):

```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key
SUPABASE_SERVICE_ROLE_KEY=placeholder_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
STRIPE_MONTHLY_PRICE_ID=price_placeholder_monthly
STRIPE_YEARLY_PRICE_ID=price_placeholder_yearly
RESEND_API_KEY=re_placeholder
NEXT_PUBLIC_APP_URL=https://golf-heroes.vercel.app
```

---

## Deployment Information

- **Deployed on:** April 28, 2026
- **Deployment Time:** ~2 minutes
- **Build Status:** Successful ✅
- **Production Status:** Live ✅

---

## Documentation

- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Submission Form Template:** See `SUBMISSION_FORM.md`
- **Build Verification:** See `BUILD_COMPLETE.md`
- **Requirements:** See `REQUIREMENTS_VERIFICATION.md`

---

## Contact & Support

For any issues or questions:
- **Repository:** https://github.com/sukishmohan/golf-heroes
- **Issues:** GitHub Issues section
- **Email:** Support through the application

---

## License

This project is proprietary and developed for the Golf Heroes platform.
