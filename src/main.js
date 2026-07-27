import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Smooth scroll for nav links (with safety check for '#' links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Contextual Glass Action Lens Cursor Logic (Desktop Only)
  const cursorLens = document.getElementById('cursor-lens');
  const cursorLabel = document.getElementById('cursor-label');

  if (cursorLens && cursorLabel && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -200, mouseY = -200;
    let lensX = -200, lensY = -200;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursorLens.style.opacity = '1';
        lensX = mouseX;
        lensY = mouseY;
      }
    });

    // Smooth LERP (0.22) physics loop for fluid tracking
    function animateLens() {
      lensX += (mouseX - lensX) * 0.22;
      lensY += (mouseY - lensY) * 0.22;

      cursorLens.style.transform = `translate3d(${lensX}px, ${lensY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateLens);
    }
    requestAnimationFrame(animateLens);

    // Contextual Action Detection
    const hoverClasses = ['cursor-hover-view', 'cursor-hover-read', 'cursor-hover-copy', 'cursor-hover-talk', 'cursor-hover-generic'];

    function clearHoverClasses() {
      document.body.classList.remove(...hoverClasses);
    }

    document.addEventListener('mouseover', (e) => {
      const projectCard = e.target.closest('.project-card, a[href="#work"]');
      const blogCard = e.target.closest('.featured-blog-card, .blog-item, #open-blog-modal');
      const copyBtn = e.target.closest('#copy-email-btn, [data-email]');
      const talkBtn = e.target.closest('a[href="#contact"], .contact-submit-btn');
      const genericBtn = e.target.closest('a, button, input, textarea, .social-pill, .suggestion-btn');

      if (projectCard) {
        clearHoverClasses();
        cursorLabel.textContent = 'VIEW →';
        document.body.classList.add('cursor-hover-view');
      } else if (blogCard) {
        clearHoverClasses();
        cursorLabel.textContent = 'READ 📖';
        document.body.classList.add('cursor-hover-read');
      } else if (copyBtn) {
        clearHoverClasses();
        cursorLabel.textContent = 'COPY 📋';
        document.body.classList.add('cursor-hover-copy');
      } else if (talkBtn) {
        clearHoverClasses();
        cursorLabel.textContent = 'TALK 💬';
        document.body.classList.add('cursor-hover-talk');
      } else if (genericBtn) {
        clearHoverClasses();
        cursorLabel.textContent = 'OPEN';
        document.body.classList.add('cursor-hover-generic');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, input, textarea, .project-card, .featured-blog-card, .blog-item, .social-pill')) {
        clearHoverClasses();
      }
    });

    window.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
    window.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));

    document.addEventListener('mouseleave', () => {
      cursorLens.style.opacity = '0';
      isVisible = false;
      clearHoverClasses();
    });
  }



  // AI Chat Toggle & Close Handlers
  const aiToggle = document.getElementById('ai-toggle');
  const aiClose = document.getElementById('ai-close');
  const aiChatWindow = document.getElementById('ai-chat-window');

  if (aiToggle && aiChatWindow) {
    aiToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      aiChatWindow.classList.toggle('active');
    });
  }

  if (aiClose && aiChatWindow) {
    aiClose.addEventListener('click', (e) => {
      e.stopPropagation();
      aiChatWindow.classList.remove('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (aiChatWindow && aiChatWindow.classList.contains('active')) {
      if (!aiChatWindow.contains(e.target) && e.target !== aiToggle && !aiToggle.contains(e.target)) {
        aiChatWindow.classList.remove('active');
      }
    }
  });

  // AI Chat Widget Logic
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-msg');
  const chatMessages = document.getElementById('chat-messages');
  const suggestionBtns = document.querySelectorAll('.suggestion-btn');

  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(isUser ? 'user-message' : 'ai-message');
    msgDiv.textContent = text;
    
    // Insert before suggestions if they exist
    const suggestions = document.querySelector('.chat-suggestions');
    if (suggestions) {
      chatMessages.insertBefore(msgDiv, suggestions);
    } else {
      chatMessages.appendChild(msgDiv);
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSend(text) {
    if (!text.trim()) return;
    
    addMessage(text, true);
    chatInput.value = '';

    // Mock AI Response for frontend demo
    setTimeout(() => {
      let response = "I'm still being connected to my backend brain, but I can tell you Solomon is an incredible AI Builder from Ghana! Check out his Projects section.";
      
      if (text.toLowerCase().includes('who is')) {
        response = "Solomon is a 19-year-old Statistical Data Science student at UMaT, Ghana. He's building a long-term personal brand around AI agents, automation workflows, and software products.";
      } else if (text.toLowerCase().includes('projects')) {
        response = "He's built LockedIn (a platform for UMaT students) and an AI Business Automation Platform using Next.js, Supabase, and n8n.";
      } else if (text.toLowerCase().includes('tech')) {
        response = "Solomon uses Next.js, React, TypeScript, Tailwind CSS, Supabase, n8n, and various AI APIs (Claude, Gemini, OpenAI).";
      }

      addMessage(response, false);
    }, 600);
  }

  sendBtn?.addEventListener('click', () => handleSend(chatInput.value));
  
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend(chatInput.value);
    }
  });

  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      handleSend(btn.textContent);
    });
  });

  // Copy Email Clipboard Logic
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');
  
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email');
      navigator.clipboard.writeText(email).then(() => {
        const originalText = emailText.textContent;
        emailText.textContent = 'Copied to clipboard';
        copyBtn.style.borderColor = '#111111';
        
        setTimeout(() => {
          emailText.textContent = originalText;
          copyBtn.style.borderColor = '';
        }, 2000);
      });
    });
  }

  // Contact Form Feedback
  const mainContactForm = document.getElementById('main-contact-form');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = mainContactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Message sent</span>';
        submitBtn.style.backgroundColor = '#111111';
        submitBtn.style.color = '#ffffff';
        mainContactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span><i data-lucide="send"></i>';
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
          lucide.createIcons();
        }, 3000);
      }
    });
  }

  // Blog Reader Modal Logic
  const openModalBtn = document.getElementById('open-blog-modal');
  const closeModalBtn = document.getElementById('close-blog-modal');
  const blogModal = document.getElementById('blog-reader-modal');

  if (openModalBtn && blogModal) {
    openModalBtn.addEventListener('click', () => {
      blogModal.showModal();
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeModalBtn && blogModal) {
    closeModalBtn.addEventListener('click', () => {
      blogModal.close();
      document.body.style.overflow = '';
    });
  }

  blogModal?.addEventListener('click', (e) => {
    if (e.target === blogModal) {
      blogModal.close();
      document.body.style.overflow = '';
    }
  });
});
