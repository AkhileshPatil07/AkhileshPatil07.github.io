/* ============================================================
   1. CONFIGURATION & COLOR PALETTE
============================================================ */
const CONFIG = {
  colors: {
    particles: 0x06b6d4, // Electric Cyan
    connections: 0x6366f1 // Royal Indigo
  }
};

/* ============================================================
   2. THREE.JS 3D BACKGROUND (Responsive Constellation & Wireframe)
============================================================ */
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
if (canvasContainer) {
  canvasContainer.appendChild(renderer.domElement);
}

// Particle Constellation Geometry
const isMobile = window.innerWidth < 768;
const particlesCount = isMobile ? 350 : 900;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 11;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.022,
  color: CONFIG.colors.particles,
  transparent: true,
  opacity: 0.75,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Connecting Geometry (Icosahedron Wireframe Sphere)
const sphereGeo = new THREE.IcosahedronGeometry(1.2, 0);
const sphereMat = new THREE.MeshBasicMaterial({
  color: CONFIG.colors.connections,
  wireframe: true,
  transparent: true,
  opacity: 0.18
});
const wireframeSphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(wireframeSphere);

camera.position.z = 3.2;

// Mouse & Gyro Parallax
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
});

// Animation Loop
const clock = new THREE.Clock();
function animateThree() {
  requestAnimationFrame(animateThree);
  const elapsedTime = clock.getElapsedTime();

  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  particlesMesh.rotation.y = elapsedTime * 0.04 + targetX;
  particlesMesh.rotation.x = targetY;

  wireframeSphere.rotation.x = elapsedTime * 0.08;
  wireframeSphere.rotation.y = elapsedTime * 0.08;

  const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
  wireframeSphere.scale.set(pulse, pulse, pulse);

  renderer.render(scene, camera);
}
animateThree();

// Resize listener
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ============================================================
   3. SCROLL PROGRESS INDICATOR
============================================================ */
const scrollProgressEl = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgressEl) scrollProgressEl.style.width = progress + '%';
}, { passive: true });

/* ============================================================
   4. TYPEWRITER EFFECT (ROLES)
============================================================ */
const roles = [
  "DATA ANALYST",
  "DATA SCIENTIST",
  "MARKETING & CAMPAIGN ANALYTICS",
  "DEMAND FORECASTING SPECIALIST",
  "MLOPS & MACHINE LEARNING",
  "POWER BI & SQL DEVELOPER"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeTarget = document.getElementById("typewriter");

function typeRole() {
  if (!typeTarget) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typeTarget.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeTarget.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 45 : 95;

  if (!isDeleting && charIndex === currentRole.length) {
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }

  setTimeout(typeRole, speed);
}

/* ============================================================
   5. MOBILE NAVIGATION MENU
============================================================ */
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const navBackdrop = document.getElementById('nav-backdrop');

function openMobileNav() {
  navLinks.classList.add('active');
  mobileToggle.classList.add('active');
  if (navBackdrop) navBackdrop.classList.add('active');
}

function closeMobileNav() {
  navLinks.classList.remove('active');
  mobileToggle.classList.remove('active');
  if (navBackdrop) navBackdrop.classList.remove('active');
}

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeMobileNav);
}

/* ============================================================
   6. SCROLL REVEAL OBSERVER
============================================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   7. SLIDE-OUT PROJECT DETAILS HOVER PANEL
============================================================ */
const hoverPanel = document.getElementById('hover-panel');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-description');
const closePanelBtn = document.querySelector('.close-panel-btn');

const projectDetails = {
  'marketing-funnel': {
    title: 'MARKETING FUNNEL & CAMPAIGN DASHBOARD',
    description: `
      <p style="margin-bottom: 1rem;">End-to-end multi-channel marketing funnel analysis on a simulated six-month dataset (12 campaigns, 6 channels, ~10,000 leads). Unifies ad spend and user journeys to identify key ROI drivers.</p>
      
      <h4 style="color: #ffffff; margin: 1rem 0 0.5rem; font-size: 1.05rem;">Analytical Highlights</h4>
      <ul style="padding-left: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
        <li><strong>Data Wrangling:</strong> Cleaned data in Python/Pandas, removing 149 duplicate leads and estimating impressions/sessions for 9 campaign-days with broken tracking.</li>
        <li><strong>Relational SQL Modeling:</strong> Implemented SQL joins and Common Table Expressions (CTEs) in SQLite to calculate Cost Per Lead (CPL), Lead-to-Customer conversion rates, and ROAS across all acquisition channels.</li>
        <li><strong>Key Commercial Insight:</strong> Discovered Search and Email delivered 86% of customers on 47% of spend, while Meta, Display, and YouTube returned under Rs. 1 per Rs. 1 spent.</li>
        <li><strong>Interactive Power BI Dashboard:</strong> Designed interactive channel filters, monthly trend timelines, and stage-by-stage drop-off funnels, leading to clear budget reallocation recommendations.</li>
      </ul>
      <p><strong>Technologies:</strong> SQL, SQLite, Python, Pandas, Power BI, Funnel Optimization, ROAS Attribution</p>
    `
  },
  'shoppers-intent': {
    title: 'SHOPPERS INTENT MLOps PIPELINE',
    description: `
      <p style="margin-bottom: 1rem;">An end-to-end, production-grade <strong>MLOps system</strong> that predicts in real-time whether an online shopping session will end in a completed transaction, covering the entire lifecycle from data ingestion to automated retraining.</p>
      
      <h4 style="color: #ffffff; margin: 1rem 0 0.5rem; font-size: 1.05rem;">Architecture Highlights</h4>
      <ul style="padding-left: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
        <li><strong>ETL Data Warehouse:</strong> Automated migration pipeline extracting raw session data from MySQL, validating schemas in Python, and loading clean features into PostgreSQL.</li>
        <li><strong>Imbalance Treatment:</strong> Addressed extreme negative class skew in purchases using <strong>SMOTE</strong>, <strong>StandardScaler</strong>, and <strong>SelectKBest</strong> feature prioritization.</li>
        <li><strong>Model Benchmark &amp; Tracking:</strong> Compared Random Forest, XGBoost, and LightGBM with GridSearchCV; achieved <strong>97.3% ROC-AUC</strong> with winning weights auto-logged and versioned in <strong>MLflow</strong>.</li>
        <li><strong>FastAPI &amp; Docker Serving:</strong> Packaged inference service in Docker with GitHub Actions CI/CD pipeline and deployed REST endpoint.</li>
        <li><strong>Drift Monitoring &amp; Retraining:</strong> Continuous data drift tracking with <strong>Evidently AI</strong> and background <strong>APScheduler</strong> jobs triggering daily automated retraining when performance thresholds slip.</li>
      </ul>
      <p><strong>Technologies:</strong> Python, FastAPI, Docker, MLflow, LightGBM, XGBoost, PostgreSQL, GitHub Actions, Evidently AI</p>
    `
  },
  'laptop-price': {
    title: 'MODULAR LAPTOP PRICE PREDICTION PIPELINE',
    description: `
      <p style="margin-bottom: 1rem;">An end-to-end machine learning system estimating market retail prices for laptops from heterogeneous hardware specifications, structured in modular, unit-testable pipelines.</p>
      
      <h4 style="color: #ffffff; margin: 1rem 0 0.5rem; font-size: 1.05rem;">Engineering Highlights</h4>
      <ul style="padding-left: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
        <li><strong>Modular Architecture:</strong> Engineered independent stages for data ingestion, transformation, and training to enable reproducible experimentation.</li>
        <li><strong>Regex Spec NLP Extraction:</strong> Parsed raw specification free text strings into numerical features - extracting RAM/storage capacity, CPU performance tier, display resolution, and dedicated GPU specifications.</li>
        <li><strong>Centralized Logging &amp; Validation:</strong> Implemented robust logging handlers, custom exception managers, and an automated artifact-integrity verification script prior to container deployment.</li>
        <li><strong>Interactive Streamlit Front End:</strong> Deployed a user-friendly Streamlit web app providing instant market valuation predictions based on user-entered hardware specs.</li>
      </ul>
      <p><strong>Technologies:</strong> Python, Scikit-learn, Pandas, NumPy, Streamlit, Feature Engineering, RegEx Parsing</p>
    `
  },
  'opinion-metrix': {
    title: 'OPINION METRIX AI — SENTIMENT TRANSFORMER',
    description: `
      <p style="margin-bottom: 1rem;">A fine-tuned transformer system for granular customer review sentiment classification, persistence, and real-time visualization.</p>
      
      <h4 style="color: #ffffff; margin: 1rem 0 0.5rem; font-size: 1.05rem;">Key Highlights</h4>
      <ul style="padding-left: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
        <li><strong>Transformer Fine-Tuning:</strong> Fine-tuned pre-trained Hugging Face transformer architectures on multi-category product reviews.</li>
        <li><strong>Tokenization &amp; Attention:</strong> Implemented domain-specific tokenization pipelines with dynamic padding and attention masking.</li>
        <li><strong>Database Logging:</strong> Streamlined inference caching and batch inference storage for downstream business reporting.</li>
        <li><strong>Streamlit Dashboard:</strong> Real-time user interface for single text classification and batch CSV feedback uploads with sentiment breakdown charts.</li>
      </ul>
      <p><strong>Technologies:</strong> Hugging Face Transformers, PyTorch, Python, Streamlit, SQLite, NLP</p>
    `
  },
  'hr-attrition': {
    title: 'HR ANALYTICS EMPLOYEE ATTRITION PREDICTION',
    description: `
      <p style="margin-bottom: 1rem;">Machine learning classification model predicting employee attrition risk with class-imbalance treatment and explainable AI techniques.</p>
      
      <h4 style="color: #ffffff; margin: 1rem 0 0.5rem; font-size: 1.05rem;">Key Highlights</h4>
      <ul style="padding-left: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
        <li><strong>Performance Benchmarking:</strong> Random Forest achieved <strong>0.965 ROC-AUC</strong>, outperforming baseline Logistic Regression (0.790 ROC-AUC).</li>
        <li><strong>Imbalance Resolution:</strong> Handled class imbalance using Synthetic Minority Over-sampling Technique (SMOTE) with stratified 5-fold cross-validation.</li>
        <li><strong>Feature Explainability:</strong> Isolated top predictors of employee departure (overtime hours, stock option level, monthly income, years with current manager).</li>
        <li><strong>HR Decision Framework:</strong> Designed risk scoring thresholds allowing HR teams to proactively intervene and improve workforce retention.</li>
      </ul>
      <p><strong>Technologies:</strong> Python, Scikit-learn, Random Forest, SMOTE, Explainable AI, HR Analytics</p>
    `
  },
  'spam-classifier': {
    title: 'END-TO-END SPAM EMAIL CLASSIFIER',
    description: `
      <p style="margin-bottom: 1rem;">Complete NLP-driven spam and phishing email classifier with mbox archive parsing and multi-model benchmarking.</p>
      
      <h4 style="color: #ffffff; margin: 1rem 0 0.5rem; font-size: 1.05rem;">Key Highlights</h4>
      <ul style="padding-left: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
        <li><strong>Model Comparison:</strong> Evaluated SVM, Logistic Regression, Decision Trees, and Random Forest using 5-fold cross-validation.</li>
        <li><strong>Text Processing:</strong> Cleaned and tokenized email texts using custom regex pipelines and TF-IDF feature extraction.</li>
        <li><strong>Mbox Batch Ingestion:</strong> Built a parser capable of scanning and classifying standard Unix mbox archive files in batch mode.</li>
        <li><strong>Streamlit Interface:</strong> Interactive web app supporting both real-time text input classification and whole-mailbox upload scans.</li>
      </ul>
      <p><strong>Technologies:</strong> Python, Scikit-learn, SVM, NLTK, Streamlit, TF-IDF Vectorization</p>
    `
  }
};

function openPanel(key) {
  if (!hoverPanel || !projectDetails[key]) return;
  const p = projectDetails[key];
  panelTitle.textContent = p.title;
  panelDesc.innerHTML = p.description;
  hoverPanel.classList.add('active');
}

function closePanel() {
  if (hoverPanel) hoverPanel.classList.remove('active');
}

if (closePanelBtn) {
  closePanelBtn.addEventListener('click', closePanel);
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    const key = card.getAttribute('data-project');
    if (key) openPanel(key);
  });
});

document.addEventListener('click', (e) => {
  if (hoverPanel && hoverPanel.classList.contains('active')) {
    if (!hoverPanel.contains(e.target) && !e.target.closest('.project-card')) {
      closePanel();
    }
  }
});

/* ============================================================
   8. CUSTOM CURSOR (DESKTOP)
============================================================ */
const hasFinePointer = () => window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (hasFinePointer()) {
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorOutline = document.querySelector("[data-cursor-outline]");
  let cX = 0, cY = 0;
  let oX = 0, oY = 0;

  window.addEventListener('mousemove', (e) => {
    cX = e.clientX;
    cY = e.clientY;
    if (cursorDot) cursorDot.style.transform = `translate(${cX}px, ${cY}px)`;
  });

  function renderCursor() {
    oX += (cX - oX) * 0.18;
    oY += (cY - oY) * 0.18;
    if (cursorOutline) cursorOutline.style.transform = `translate(${oX}px, ${oY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const clickables = 'a, button, input, textarea, select, .project-card, .skill-block, .spec-card';
  document.addEventListener('mouseenter', (e) => {
    if (e.target.closest(clickables)) document.body.classList.add('cursor-interactive');
  }, true);
  document.addEventListener('mouseleave', (e) => {
    if (e.target.closest(clickables)) document.body.classList.remove('cursor-interactive');
  }, true);
}

/* ============================================================
   9. CONTACT FORM HANDLER
============================================================ */
const contactForm = document.getElementById('contact-form');
const CONTACT_EMAIL = "akhileshpatil0708@gmail.com";

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const isLocalFile = window.location.protocol === 'file:';
    const btn = contactForm.querySelector('.submit-btn span');
    const origText = btn ? btn.textContent : "SEND MESSAGE";

    if (isLocalFile) {
      // FormSubmit blocks direct file:/// submissions by security design.
      // When testing locally as an HTML file, launch Gmail Web or Mail client pre-filled:
      e.preventDefault();
      
      const name = document.getElementById("name") ? document.getElementById("name").value.trim() : "";
      const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
      const message = document.getElementById("message") ? document.getElementById("message").value.trim() : "";

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name || "Visitor"}`);
      const body = encodeURIComponent(`Hi Akhilesh,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}`);

      if (btn) btn.textContent = "OPENING GMAIL...";

      // Open Gmail Web compose window
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${subject}&body=${body}`;
      const newWin = window.open(gmailUrl, '_blank');

      // Fallback to mailto protocol if popup was blocked
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      }

      setTimeout(() => {
        if (btn) btn.textContent = "OPENED IN EMAIL!";
        setTimeout(() => { if (btn) btn.textContent = origText; }, 3000);
      }, 800);
      return;
    }

    // On a live web server (http://localhost or https://your-domain.com / GitHub Pages),
    // allow native HTML POST to FormSubmit.co for automated background delivery!
    if (btn) btn.textContent = "TRANSMITTING...";
  });
}

/* ============================================================
   10. PRELOADER & INITIALIZATION
============================================================ */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const loaderText = preloader ? preloader.querySelector(".loader-text") : null;
  const stages = ["LOADING CORE...", "OPTIMIZING NEURAL PIPELINE...", "SYSTEM ONLINE"];
  let step = 0;

  const interval = setInterval(() => {
    if (step < stages.length) {
      if (loaderText) loaderText.textContent = stages[step];
      step++;
    } else {
      clearInterval(interval);
      if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.style.display = "none";
          document.querySelectorAll('.letterbox-bar').forEach(b => b.classList.add('open'));
          typeRole();
        }, 400);
      }
    }
  }, 450);
});
