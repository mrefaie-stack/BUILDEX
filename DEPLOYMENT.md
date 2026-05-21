# BUILDEX — Deployment

نشر BUILDEX على `buildex.mila-knight.com` بدون أي تأثير على `milaknight-os` أو أي subdomain آخر على نفس السيرفر.

> **مبدأ العزل:** كل مورد خاص بـ BUILDEX له اسم/مسار/منفذ مختلف. مفيش حاجة مشتركة مع المشاريع التانية.

| المورد | القيمة |
|---|---|
| المجلد على السيرفر | `/root/buildex` |
| PM2 process name | `buildex` |
| المنفذ الداخلي | `3010` |
| Nginx site config | `/etc/nginx/sites-available/buildex.mila-knight.com.conf` |
| Domain | `buildex.mila-knight.com` |

---

## 1) أول مرة فقط — Bootstrap

### الخطوة 1: تأكد DNS

Record A: `buildex.mila-knight.com` → `72.61.162.106` (تم بالفعل).

### الخطوة 2: SSH إلى السيرفر

```bash
ssh root@72.61.162.106
```

### الخطوة 3: نزّل وشغّل سكريبت bootstrap

```bash
curl -fsSL https://raw.githubusercontent.com/mrefaie-stack/BUILDEX/main/deploy/bootstrap.sh -o /tmp/buildex-bootstrap.sh
bash /tmp/buildex-bootstrap.sh
```

في أول تشغيل، السكريبت:
1. يتحقق من وجود `git / node / npm / nginx / pm2` (يثبّت pm2 لو ناقص)
2. يعمل clone للريبو في `/root/buildex`
3. ينسخ `.env.example` → `.env` و **يقف** عشان تملي القيم

### الخطوة 4: عبّي `.env`

```bash
nano /root/buildex/.env
```

املأ على الأقل:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
NEXT_PUBLIC_WHATSAPP_NUMBER=963...
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
```

### الخطوة 5: شغّل bootstrap تاني

```bash
bash /tmp/buildex-bootstrap.sh
```

دلوقتي السكريبت هيكمّل:
- `npm ci` + `npm run build`
- يبدأ PM2 process اسمه `buildex` على بورت 3010
- ينسخ Nginx config وينعمل symlink في `sites-enabled`
- يعمل `nginx -t` ثم `systemctl reload nginx`
- يعمل smoke test على `http://127.0.0.1:3010`

### الخطوة 6: SSL (مرة واحدة)

```bash
sudo certbot --nginx -d buildex.mila-knight.com
```

Certbot يعدّل ملف الـ site config تلقائيًا ويضيف بلوك HTTPS ويعمل redirect من HTTP.

### الخطوة 7: تأكد

افتح `https://buildex.mila-knight.com` في المتصفح.

---

## 2) ديبلوي عادي — بعد كل push

### من جهازك المحلي:

```bash
npm install --no-save ssh2

SSH_HOST=72.61.162.106 \
SSH_USER=root \
SSH_PASSWORD='...' \
  node scripts/deploy.js
```

السكريبت بيعمل (بنفس فكرة سكريبت `milaknight-os`):
1. `git fetch && git reset --hard origin/main` في `/root/buildex`
2. `npm ci` (fallback to `npm install`)
3. `npm run build`
4. `pm2 restart buildex --update-env`

> لو عندك SSH key بدل الباسوورد:
> ```bash
> SSH_KEY=~/.ssh/id_rsa node scripts/deploy.js
> ```

### مباشرة من السيرفر (لو حبيت):

```bash
ssh root@72.61.162.106
cd /root/buildex
git pull origin main && npm ci && npm run build && pm2 restart buildex
```

---

## 3) أوامر مفيدة على السيرفر

```bash
# فقط BUILDEX
pm2 logs buildex --lines 200
pm2 restart buildex
pm2 stop buildex
pm2 describe buildex

# nginx (يأثر على كل المواقع — احذر)
nginx -t
systemctl reload nginx

# الـ port المخصص لـ buildex
curl -I http://127.0.0.1:3010
```

---

## 4) Rollback سريع

لو deploy جديد كسر حاجة:

```bash
ssh root@72.61.162.106
cd /root/buildex
git log --oneline -10               # شوف آخر commits
git reset --hard <previous-sha>
npm run build
pm2 restart buildex
```

---

## 5) ضمانات العزل

السكريبتات هنا **ما بتلمس**:
- `/root/milaknight-os` (ولا أي مسار غير `/root/buildex`)
- أي PM2 process اسمه غير `buildex`
- أي nginx config غير `buildex.mila-knight.com.conf`
- أي بورت غير `3010`
- أي domain غير `buildex.mila-knight.com`

`pm2 restart buildex` بيعيد تشغيل **process واحد فقط** بالاسم. مستحيل يأثر على `milaknight-os`.

`nginx -t` بيتحقق من **كل** الـ sites قبل reload — لو ملف buildex خرب الـ syntax، الـ reload ما هيحصل أصلاً (الإعداد القديم بيفضل شغال).

---

## 6) Schema قاعدة البيانات

شغّل مرة واحدة في Supabase SQL editor:

```sql
-- المحتوى الكامل في supabase/schema.sql
```

---

## ملاحظات أمان

- **لا تحط الباسوورد في الكود.** السكريبت بيقرأ `SSH_PASSWORD` من env variables بس.
- لو ينفع، استخدم SSH key authentication بدل password — أأمن.
- `.env` على السيرفر فيه service-role key لـ Supabase. اضبط permissions:  
  ```bash
  chmod 600 /root/buildex/.env
  ```
