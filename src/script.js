/*
See on github: https://github.com/serehatcan44/credit-card-form
*/

new Vue({
  el: "#app",
  data() {
    return {
      currentCardBackground: Math.floor(Math.random()* 25 + 1),
      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
      minCardYear: new Date().getFullYear(),
      amexCardMask: "#### ###### #####",
      otherCardMask: "#### #### #### ####",
      cardNumberTemp: "",
      isCardFlipped: false,
      focusElementStyle: null,
      isInputFocused: false,
      particles: [],
      confetti: []
    };
  },
  mounted() {
    this.cardNumberTemp = this.otherCardMask;
    document.getElementById("cardNumber").focus();
    this.initParticles();
    this.animateParticles();
  },
  computed: {
    getCardType () {
      let number = this.cardNumber;
      let re = new RegExp("^4");
      if (number.match(re) != null) return "visa";

      re = new RegExp("^(34|37)");
      if (number.match(re) != null) return "amex";

      re = new RegExp("^5[1-5]");
      if (number.match(re) != null) return "mastercard";

      re = new RegExp("^6011");
      if (number.match(re) != null) return "discover";
      
      re = new RegExp('^9792')
      if (number.match(re) != null) return 'troy'

      return "visa"; // default type
    },
		generateCardNumberMask () {
			return this.getCardType === "amex" ? this.amexCardMask : this.otherCardMask;
    },
    minCardMonth () {
      if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1;
      return 1;
    },
    isCardNumberValid () {
      const cleaned = this.cardNumber.replace(/\s/g, '');
      const requiredLength = this.getCardType === 'amex' ? 15 : 16;
      return cleaned.length === requiredLength && /^\d+$/.test(cleaned);
    },
    isCardNameValid () {
      return this.cardName.trim().length >= 3 && /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(this.cardName);
    },
    isCvvValid () {
      const requiredLength = this.getCardType === 'amex' ? 4 : 3;
      return this.cardCvv.length === requiredLength && /^\d+$/.test(this.cardCvv);
    }
  },
  watch: {
    cardYear () {
      if (this.cardMonth < this.minCardMonth) {
        this.cardMonth = "";
      }
    },
    cardNumber (newVal) {
      // Sadece sayı ve boşluk
      let cleaned = newVal.replace(/[^\d]/g, '');
      
      // Kart tipine göre max uzunluk
      const maxLength = this.getCardType === 'amex' ? 15 : 16;
      cleaned = cleaned.substring(0, maxLength);
      
      // Formatlama
      if (this.getCardType === 'amex') {
        // Amex: 4-6-5 format
        cleaned = cleaned.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (match, p1, p2, p3) => {
          let result = p1;
          if (p2) result += ' ' + p2;
          if (p3) result += ' ' + p3;
          return result;
        });
      } else {
        // Diğer kartlar: 4-4-4-4 format
        cleaned = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      }
      
      this.cardNumber = cleaned;
    },
    cardName (newVal) {
      // Sadece harf ve boşluk
      this.cardName = newVal.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '').substring(0, 30);
    },
    cardCvv (newVal) {
      // Sadece sayı, max 4 hane
      const maxLength = this.getCardType === 'amex' ? 4 : 3;
      this.cardCvv = newVal.replace(/\D/g, '').substring(0, maxLength);
    }
  },
  methods: {
    flipCard (status) {
      this.isCardFlipped = status;
    },
    focusInput (e) {
      this.isInputFocused = true;
      let targetRef = e.target.dataset.ref;
      let target = this.$refs[targetRef];
      this.focusElementStyle = {
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
      }
    },
    blurInput() {
      let vm = this;
      setTimeout(() => {
        if (!vm.isInputFocused) {
          vm.focusElementStyle = null;
        }
      }, 300);
      vm.isInputFocused = false;
    },
    
    // 🎨 3D Tilt Effect
    handleMouseMove(e) {
      const card = this.$refs.cardItem;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    },
    
    handleMouseLeave() {
      const card = this.$refs.cardItem;
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    },
    
    // ✨ Particles Animation
    initParticles() {
      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      for (let i = 0; i < 100; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    },
    
    animateParticles() {
      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(() => this.animateParticles());
    },
    
    // 🎪 Confetti Animation
    createConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.display = 'block';
      
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
      
      for (let i = 0; i < 150; i++) {
        this.confetti.push({
          x: Math.random() * canvas.width,
          y: -10,
          size: Math.random() * 8 + 4,
          speedY: Math.random() * 3 + 2,
          speedX: Math.random() * 4 - 2,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          gravity: 0.3
        });
      }
      
      this.animateConfetti();
    },
    
    animateConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.confetti = this.confetti.filter(piece => piece.y < canvas.height);
      
      this.confetti.forEach(piece => {
        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.speedY += piece.gravity;
        piece.rotation += piece.rotationSpeed;
        
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      });
      
      if (this.confetti.length > 0) {
        requestAnimationFrame(() => this.animateConfetti());
      } else {
        canvas.style.display = 'none';
      }
    },
    
    // 🎉 Submit with Effects
    submitForm() {
      this.createConfetti();
      
      // Ripple effect
      const button = event.target;
      button.classList.add('ripple-effect');
      
      setTimeout(() => {
        button.classList.remove('ripple-effect');
      }, 600);
    }
  }
});
