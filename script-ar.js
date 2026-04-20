const arRoot = document.querySelector("#ar-root");
const basePage = document.body.getAttribute("data-base-page");

const phrasePairs = [
  ["Fill out the details to request your team membership.", "املأ التفاصيل لطلب الانضمام إلى الفريق."],
  ["Log in to continue your cretive journey", "سجّل الدخول لمتابعة رحلتك الإبداعية."],
  ["Sign Up to start your cretive journey", "أنشئ حسابا لبدء رحلتك الإبداعية."],
  ["Questions made by CREE AI according to the team specialty", "أسئلة أنشأها كري AI بحسب تخصص الفريق."],
  ["What are your tips for improving case-study storytelling in product portfolios?", "ما نصائحك لتحسين سرد دراسات الحالة في ملفات الأعمال؟"],
  ["Open to Join", "مفتوح للانضمام"],
  ["Invite Only", "دعوة فقط"],
  ["Create New Chat", "محادثة جديدة"],
  ["Previous Chats", "المحادثات السابقة"],
  ["Start New Chat", "بدء محادثة جديدة"],
  ["BACK TO CREESTUDIOS", "العودة إلى كري ستوديوز"],
  ["Forgot Password?", "هل نسيت كلمة المرور؟"],
  ["Don't have an account?", "ليس لديك حساب؟"],
  ["Already have an account?", "لديك حساب بالفعل؟"],
  ["Sign Up", "إنشاء حساب"],
  ["Log In", "تسجيل الدخول"],
  ["GET STARTED", "ابدأ الآن"],
  ["EMAIL ADDRESS", "البريد الإلكتروني"],
  ["Email Address", "البريد الإلكتروني"],
  ["Email Adress", "البريد الإلكتروني"],
  ["PASSWORD", "كلمة المرور"],
  ["Confirm Password", "تأكيد كلمة المرور"],
  ["Confirm your password", "أكد كلمة المرور"],
  ["Enter your password", "أدخل كلمة المرور"],
  ["Your@email.com", "you@email.com"],
  ["WELCOME!", "أهلا بك!"],
  ["LOG IN!", "تسجيل الدخول"],
  ["Create a Team", "إنشاء فريق"],
  ["CREATE A TEAM", "إنشاء فريق"],
  ["BASIC INFORMATION", "معلومات أساسية"],
  ["JOB DESCRIPTION", "وصف الوظيفة"],
  ["REQUIRED SKILLS", "المهارات المطلوبة"],
  ["BUDGET & TIMELINE", "الميزانية والجدول الزمني"],
  ["APPLICATION REQUIREMENTS", "متطلبات التقديم"],
  ["RECOMMENDATIONS", "التوصيات"],
  ["PUBLISH & VISIBILITY", "النشر والظهور"],
  ["Publish Job Post", "نشر إعلان الوظيفة"],
  ["CREATE JOB POST", "إنشاء إعلان وظيفة"],
  ["JOB DETAILS", "تفاصيل الوظيفة"],
  ["Job Details", "تفاصيل الوظيفة"],
  ["Description", "الوصف"],
  ["Job Overview", "نظرة عامة على الوظيفة"],
  ["Required Skills", "المهارات المطلوبة"],
  ["Key Responsibilities", "المسؤوليات الأساسية"],
  ["Job Requirements", "متطلبات الوظيفة"],
  ["Preferred Qualifications", "المؤهلات المفضلة"],
  ["Apply Now", "قدّم الآن"],
  ["ALL JOBS", "جميع الوظائف"],
  ["CURRENT JOBS", "الوظائف الحالية"],
  ["EXPLORE JOBS", "استكشاف الوظائف"],
  ["FRIEND REQUESTS", "طلبات الصداقة"],
  ["MY LINKS", "روابطي"],
  ["RECENTLY ACTIVE", "نشطون مؤخرا"],
  ["NETWORK INSIGHTS", "إحصاءات الشبكة"],
  ["INVITE FRIENDS", "دعوة الأصدقاء"],
  ["NETWORK", "الشبكة"],
  ["COMMUNITY", "المجتمع"],
  ["COMMUNITIES", "المجتمعات"],
  ["OVERVIEW", "نظرة عامة"],
  ["DISCOVER COMMUNITIES", "اكتشف المجتمعات"],
  ["RECOMMENDED COMMUNITIES", "مجتمعات موصى بها"],
  ["SUGGESTED CONNECTIONS", "اتصالات مقترحة"],
  ["COMMUNITY POSTS", "منشورات المجتمع"],
  ["ANNOUNCEMENTS", "الإعلانات"],
  ["UPCOMING EVENTS", "الفعاليات القادمة"],
  ["SUGGESTED CREATORS", "مبدعون مقترحون"],
  ["View all", "عرض الكل"],
  ["Home", "الرئيسية"],
  ["My Jobs", "وظائفي"],
  ["CREE AI", "كري AI"],
  ["Alerts", "التنبيهات"],
  ["Teams", "الفرق"],
  ["Settings", "الإعدادات"],
  ["SETTINGS", "الإعدادات"],
  ["PROFILE", "الملف الشخصي"],
  ["NOTIFICATIONS", "الإشعارات"],
  ["LOGOUT", "تسجيل الخروج"],
  ["Public", "عام"],
  ["Community", "المجتمع"],
  ["Private", "خاص"],
  ["Accept", "قبول"],
  ["Decline", "رفض"],
  ["Follow", "متابعة"],
  ["Join", "انضمام"],
  ["Message", "رسالة"],
  ["HIRE", "توظيف"],
];

const sortedPairs = phrasePairs.sort((a, b) => b[0].length - a[0].length);

const wordPairs = [
  ["home", "الرئيسية"],
  ["jobs", "الوظائف"],
  ["job", "وظيفة"],
  ["my", "خاصتي"],
  ["teams", "الفرق"],
  ["team", "فريق"],
  ["alerts", "التنبيهات"],
  ["alert", "تنبيه"],
  ["settings", "الإعدادات"],
  ["profile", "الملف الشخصي"],
  ["community", "المجتمع"],
  ["communities", "المجتمعات"],
  ["friends", "الأصدقاء"],
  ["friend", "صديق"],
  ["network", "الشبكة"],
  ["overview", "نظرة عامة"],
  ["explore", "استكشاف"],
  ["current", "الحالية"],
  ["all", "الكل"],
  ["details", "التفاصيل"],
  ["description", "الوصف"],
  ["required", "المطلوبة"],
  ["preferred", "المفضلة"],
  ["qualifications", "المؤهلات"],
  ["skills", "المهارات"],
  ["responsibilities", "المسؤوليات"],
  ["requirements", "المتطلبات"],
  ["budget", "الميزانية"],
  ["timeline", "الجدول الزمني"],
  ["application", "التقديم"],
  ["recommendations", "التوصيات"],
  ["publish", "نشر"],
  ["visibility", "الظهور"],
  ["public", "عام"],
  ["private", "خاص"],
  ["create", "إنشاء"],
  ["new", "جديد"],
  ["chat", "محادثة"],
  ["message", "رسالة"],
  ["search", "بحث"],
  ["filter", "تصفية"],
  ["follow", "متابعة"],
  ["join", "انضمام"],
  ["joined", "منضم"],
  ["invite", "دعوة"],
  ["open", "مفتوح"],
  ["accept", "قبول"],
  ["reject", "رفض"],
  ["send", "إرسال"],
  ["copy", "نسخ"],
  ["link", "رابط"],
  ["email", "البريد الإلكتروني"],
  ["password", "كلمة المرور"],
  ["confirm", "تأكيد"],
  ["login", "تسجيل الدخول"],
  ["log", "تسجيل"],
  ["sign", "إنشاء"],
  ["up", "أعلى"],
  ["in", "في"],
  ["start", "ابدأ"],
  ["continue", "متابعة"],
  ["back", "رجوع"],
  ["close", "إغلاق"],
  ["view", "عرض"],
  ["gallery", "المعرض"],
  ["apply", "قدّم"],
  ["now", "الآن"],
  ["members", "الأعضاء"],
  ["member", "عضو"],
  ["designer", "مصمم"],
  ["design", "تصميم"],
  ["remote", "عن بعد"],
  ["full-time", "دوام كامل"],
  ["permanent", "دائم"],
  ["monthly", "شهري"],
  ["salary", "الراتب"],
  ["duration", "المدة"],
  ["location", "الموقع"],
  ["notifications", "الإشعارات"],
  ["logout", "تسجيل الخروج"],
  ["hire", "توظيف"],
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const translateText = (value) => {
  let output = value;
  for (const [en, ar] of sortedPairs) {
    if (output.includes(en)) {
      output = output.split(en).join(ar);
    }
  }
  for (const [enWord, arWord] of wordPairs) {
    const re = new RegExp("\\b" + escapeRegExp(enWord) + "\\b", "gi");
    output = output.replace(re, arWord);
  }
  return output;
};

const translateNodeText = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const raw = node.nodeValue || "";
    if (/[A-Za-z]/.test(raw)) {
      node.nodeValue = translateText(raw);
    }
    node = walker.nextNode();
  }
};

const translateAttributes = (root) => {
  const attrs = ["placeholder", "aria-label", "title", "alt", "value"];
  const nodes = root.querySelectorAll("*");
  nodes.forEach((el) => {
    attrs.forEach((attr) => {
      const v = el.getAttribute(attr);
      if (v && /[A-Za-z]/.test(v)) {
        el.setAttribute(attr, translateText(v));
      }
    });
  });
};

const translateDom = (root) => {
  translateNodeText(root);
  if (root.nodeType === Node.ELEMENT_NODE) {
    translateAttributes(root);
  }
};

const installDynamicTranslator = (root) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" && mutation.target) {
        const raw = mutation.target.nodeValue || "";
        if (/[A-Za-z]/.test(raw)) {
          mutation.target.nodeValue = translateText(raw);
        }
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const raw = node.nodeValue || "";
          if (/[A-Za-z]/.test(raw)) {
            node.nodeValue = translateText(raw);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          translateDom(node);
        }
      });
    });
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });
};

const wireLanguageToggle = () => {
  const buttons = document.querySelectorAll('button[aria-label*="language"], button[aria-label*="اللغة"]');
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!basePage) {
        return;
      }
      window.location.href = basePage;
    });
  });
};

const bootArabicPage = async () => {
  if (!arRoot || !basePage) {
    return;
  }

  try {
    const response = await fetch(basePage, { cache: "no-store" });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const pageData = doc.body.getAttribute("data-page");
    if (pageData) {
      document.body.setAttribute("data-page", pageData);
    }
    document.body.className = doc.body.className || "";
    document.body.setAttribute("lang", "ar");
    document.body.setAttribute("dir", "rtl");

    const scripts = doc.body.querySelectorAll("script");
    scripts.forEach((s) => s.remove());
    arRoot.innerHTML = doc.body.innerHTML;

    translateDom(arRoot);
    document.title = translateText(document.title);
    wireLanguageToggle();
    installDynamicTranslator(arRoot);

    const runtimeScript = document.createElement("script");
    runtimeScript.src = "script.js";
    document.body.appendChild(runtimeScript);
  } catch (error) {
    arRoot.innerHTML = "<main style='padding:24px;color:#FFEEDC;font-family:Unbounded'>تعذر تحميل الصفحة.</main>";
  }
};

bootArabicPage();
