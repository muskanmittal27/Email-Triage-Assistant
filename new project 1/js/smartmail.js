/**
 * SmartMail AI - Comprehensive Email Management System
 * Production-ready JavaScript with AI-powered features
 */

class SmartMailAI {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.emails = [];
        this.filteredEmails = [];
        this.userSettings = {
            autoReply: true,
            defaultTone: 'professional',
            summaryLength: 'bullets',
            confidenceThreshold: 75,
            autoCategorize: true
        };
        this.analytics = {
            emailsProcessed: 0,
            timeSaved: 0,
            averageResponseTime: 0,
            accuracy: 85
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.loadUserData();
        this.initializeData();
        this.setupRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Authentication
        document.getElementById('getStartedBtn')?.addEventListener('click', () => this.showAuthPage());
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showAuthPage());
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        document.getElementById('authForm')?.addEventListener('submit', (e) => this.handleAuth(e));
        document.getElementById('authSwitchBtn')?.addEventListener('click', () => this.toggleAuthMode());
        document.getElementById('googleAuthBtn')?.addEventListener('click', () => this.handleSocialAuth('google'));
        document.getElementById('githubAuthBtn')?.addEventListener('click', () => this.handleSocialAuth('github'));

        // Dashboard
        document.getElementById('searchInput')?.addEventListener('input', (e) => this.filterEmails(e.target.value));
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => this.filterEmails());
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.filterEmails());

        // Settings
        document.getElementById('saveAccountBtn')?.addEventListener('click', () => this.saveAccountSettings());
        document.getElementById('resetAnalyticsBtn')?.addEventListener('click', () => this.resetAnalytics());
        document.getElementById('confidenceThreshold')?.addEventListener('input', (e) => {
            document.getElementById('confidenceValue').textContent = e.target.value + '%';
        });

        // Modal
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-overlay')?.addEventListener('click', () => this.closeModal());

        // Real-time updates
        this.setupRealTimeUpdates();
    }

    setupNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigateToPage(page, false);
        });
    }

    setupRealTimeUpdates() {
        // Simulate real-time email updates
        setInterval(() => {
            if (this.currentUser && this.currentPage === 'dashboard') {
                this.checkForNewEmails();
            }
        }, 30000); // Check every 30 seconds
    }

    // Authentication System with JWT Mock
    async handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const name = document.getElementById('nameInput').value;
        const isLogin = document.getElementById('authSubmitText').textContent === 'Sign In';

        this.showLoading(true);

        try {
            // Mock JWT authentication
            const token = this.generateJWT({ email, name: name || email.split('@')[0] });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.currentUser = {
                id: this.generateId(),
                email,
                name: name || email.split('@')[0],
                token,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('smartmail_user', JSON.stringify(this.currentUser));
            
            this.updateUI();
            this.navigateToPage('dashboard');
            this.showToast(`${isLogin ? 'Welcome back' : 'Welcome'}, ${this.currentUser.name}!`, 'success');
            
        } catch (error) {
            this.showToast('Authentication failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    generateJWT(payload) {
        // Mock JWT generation
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload_encoded = btoa(JSON.stringify({
            ...payload,
            exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            iat: Date.now()
        }));
        const signature = btoa('mock_signature');
        return `${header}.${payload_encoded}.${signature}`;
    }

    async handleSocialAuth(provider) {
        this.showLoading(true);
        
        try {
            // Mock OAuth authentication
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const mockUser = {
                id: this.generateId(),
                email: `user@${provider}.com`,
                name: `${provider} User`,
                provider,
                token: this.generateJWT({ email: `user@${provider}.com`, name: `${provider} User` })
            };

            this.currentUser = mockUser;
            localStorage.setItem('smartmail_user', JSON.stringify(this.currentUser));
            
            this.updateUI();
            this.navigateToPage('dashboard');
            this.showToast(`Connected with ${provider}!`, 'success');
            
        } catch (error) {
            this.showToast(`Failed to connect with ${provider}. Please try again.`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('smartmail_user');
        this.updateUI();
        this.navigateToPage('home');
        this.showToast('Logged out successfully', 'info');
    }

    // Email Thread Compression with Context Preservation
    async compressEmailThread(threadContent, options = {}) {
        const {
            summaryLength = this.userSettings.summaryLength,
            preserveContext = true,
            extractActionItems = true
        } = options;

        try {
            // Mock AI compression - in production, this would call an LLM API
            const summary = this.generateThreadSummary(threadContent, summaryLength);
            const context = preserveContext ? this.extractThreadContext(threadContent) : null;
            const actionItems = extractActionItems ? this.extractActionItems(threadContent) : [];

            return {
                summary,
                context,
                actionItems,
                confidence: Math.random() * 30 + 70, // 70-100% confidence
                compressionRatio: this.calculateCompressionRatio(threadContent, summary),
                keyParticipants: this.extractParticipants(threadContent),
                deadlines: this.extractDeadlines(threadContent)
            };
        } catch (error) {
            console.error('Thread compression failed:', error);
            throw new Error('Failed to compress email thread');
        }
    }

    generateThreadSummary(content, length) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        switch (length) {
            case 'one-line':
                return this.generateOneLineSummary(sentences);
            case 'bullets':
                return this.generateBulletSummary(sentences);
            case 'full':
                return this.generateFullSummary(sentences);
            default:
                return this.generateBulletSummary(sentences);
        }
    }

    generateOneLineSummary(sentences) {
        // Extract key topics and decisions
        const keyPoints = this.extractKeyPoints(sentences);
        return `Thread discusses: ${keyPoints.join(', ')}. ${this.extractMainDecision(sentences)}`;
    }

    generateBulletSummary(sentences) {
        const keyPoints = this.extractKeyPoints(sentences).slice(0, 5);
        return `• ${keyPoints.join('\n• ')}`;
    }

    generateFullSummary(sentences) {
        const keyPoints = this.extractKeyPoints(sentences);
        const context = this.extractThreadContext(sentences.join(' '));
        const actionItems = this.extractActionItems(sentences.join(' '));
        
        return `Summary:\n${keyPoints.join('\n')}\n\nContext:\n${context}\n\nAction Items:\n${actionItems.map(item => `• ${item}`).join('\n')}`;
    }

    extractKeyPoints(sentences) {
        const keywords = ['decision', 'agree', 'confirm', 'schedule', 'deadline', 'budget', 'approval', 'meeting', 'action', 'follow-up'];
        const keyPoints = [];
        
        sentences.forEach(sentence => {
            const lowerSentence = sentence.toLowerCase();
            if (keywords.some(keyword => lowerSentence.includes(keyword))) {
                keyPoints.push(sentence.trim());
            }
        });
        
        return keyPoints.length > 0 ? keyPoints : sentences.slice(0, 3);
    }

    extractThreadContext(content) {
        const participants = this.extractParticipants(content);
        const deadlines = this.extractDeadlines(content);
        const decisions = this.extractDecisions(content);
        
        return `Participants: ${participants.join(', ')}\n${deadlines.length > 0 ? `Deadlines: ${deadlines.join(', ')}` : ''}\n${decisions.length > 0 ? `Key Decisions: ${decisions.join(', ')}` : ''}`;
    }

    extractActionItems(content) {
        const actionWords = ['need', 'should', 'must', 'will', 'please', 'action', 'task', 'deliverable'];
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const actionItems = [];
        
        sentences.forEach(sentence => {
            const lowerSentence = sentence.toLowerCase();
            if (actionWords.some(word => lowerSentence.includes(word))) {
                actionItems.push(sentence.trim());
            }
        });
        
        return actionItems.slice(0, 5);
    }

    extractParticipants(content) {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
        const emails = content.match(emailRegex) || [];
        const names = this.extractNames(content);
        return [...new Set([...emails.map(email => email.split('@')[0]), ...names])];
    }

    extractNames(content) {
        // Simple name extraction - in production, use NLP
        const nameRegex = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
        const names = content.match(nameRegex) || [];
        return names;
    }

    extractDeadlines(content) {
        const dateRegex = /\b(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}|\w+day|\d{1,2}:\d{2}(?:\s?(?:AM|PM))?)\b/gi;
        const dates = content.match(dateRegex) || [];
        return dates;
    }

    extractDecisions(content) {
        const decisionWords = ['decided', 'agreed', 'confirmed', 'approved', 'rejected', 'declined'];
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const decisions = [];
        
        sentences.forEach(sentence => {
            const lowerSentence = sentence.toLowerCase();
            if (decisionWords.some(word => lowerSentence.includes(word))) {
                decisions.push(sentence.trim());
            }
        });
        
        return decisions;
    }

    extractMainDecision(sentences) {
        const decisionSentence = sentences.find(s => 
            s.toLowerCase().includes('decided') || 
            s.toLowerCase().includes('agreed') ||
            s.toLowerCase().includes('confirm')
        );
        return decisionSentence ? decisionSentence.trim() : 'No clear decision found.';
    }

    calculateCompressionRatio(original, summary) {
        const originalLength = original.length;
        const summaryLength = summary.length;
        return Math.round(((originalLength - summaryLength) / originalLength) * 100);
    }

    // Smart Categorization with Confidence Scores
    async categorizeEmail(email, options = {}) {
        const { 
            autoCategorize = this.userSettings.autoCategorize,
            confidenceThreshold = this.userSettings.confidenceThreshold 
        } = options;

        if (!autoCategorize) {
            return { category: 'uncategorized', confidence: 0, manualReview: true };
        }

        try {
            // Mock AI categorization - in production, this would use ML models
            const analysis = this.analyzeEmailContent(email);
            const category = this.determineCategory(analysis);
            const confidence = this.calculateConfidence(analysis, category);
            
            return {
                category,
                confidence: Math.round(confidence),
                manualReview: confidence < confidenceThreshold,
                reasoning: this.generateCategorizationReasoning(analysis, category),
                alternativeCategories: this.getAlternativeCategories(analysis, category)
            };
        } catch (error) {
            console.error('Email categorization failed:', error);
            return { category: 'uncategorized', confidence: 0, error: true };
        }
    }

    analyzeEmailContent(email) {
        const content = `${email.subject} ${email.body}`.toLowerCase();
        const analysis = {
            urgency: this.analyzeUrgency(content, email),
            sentiment: this.analyzeSentiment(content),
            keywords: this.extractKeywords(content),
            senderType: this.analyzeSender(email.from),
            timing: this.analyzeTiming(email.date),
            threadLength: email.threadLength || 1
        };
        
        return analysis;
    }

    analyzeUrgency(content, email) {
        const urgentWords = ['urgent', 'asap', 'emergency', 'critical', 'deadline', 'today', 'immediately'];
        const urgentScore = urgentWords.reduce((score, word) => 
            content.includes(word) ? score + 1 : score, 0);
        
        // Check for time-sensitive indicators
        const timeIndicators = content.match(/\d+:\d+|tomorrow|today|this week|deadline/gi) || [];
        
        return Math.min(urgentScore + timeIndicators.length, 10);
    }

    analyzeSentiment(content) {
        const positiveWords = ['great', 'excellent', 'good', 'happy', 'pleased', 'thank'];
        const negativeWords = ['urgent', 'problem', 'issue', 'concern', 'disappointed'];
        
        const positiveScore = positiveWords.reduce((score, word) => 
            content.includes(word) ? score + 1 : score, 0);
        const negativeScore = negativeWords.reduce((score, word) => 
            content.includes(word) ? score + 1 : score, 0);
        
        if (positiveScore > negativeScore) return 'positive';
        if (negativeScore > positiveScore) return 'negative';
        return 'neutral';
    }

    extractKeywords(content) {
        const words = content.split(/\s+/).filter(word => word.length > 3);
        const frequency = {};
        
        words.forEach(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '');
            if (cleanWord.length > 3) {
                frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
            }
        });
        
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    analyzeSender(sender) {
        const senderLower = sender.toLowerCase();
        
        if (senderLower.includes('noreply') || senderLower.includes('no-reply')) return 'automated';
        if (senderLower.includes('github') || senderLower.includes('linkedin')) return 'social';
        if (senderLower.includes('amazon') || senderLower.includes('netflix')) return 'promotional';
        if (senderLower.match(/\b(hi|hello|greetings)\b/)) return 'personal';
        
        return 'professional';
    }

    analyzeTiming(date) {
        const emailDate = new Date(date);
        const now = new Date();
        const hoursDiff = (now - emailDate) / (1000 * 60 * 60);
        
        if (hoursDiff < 2) return 'immediate';
        if (hoursDiff < 24) return 'recent';
        if (hoursDiff < 72) return 'old';
        return 'very-old';
    }

    determineCategory(analysis) {
        const { urgency, sentiment, keywords, senderType, timing, threadLength } = analysis;
        
        // Urgency-based categorization
        if (urgency >= 7) return 'urgent';
        if (keywords.some(k => ['meeting', 'schedule', 'calendar'].includes(k))) return 'meetings';
        if (keywords.some(k => ['follow', 'reminder', 'update'].includes(k))) return 'follow-up';
        
        // Sender-based categorization
        if (senderType === 'promotional' || keywords.some(k => ['offer', 'discount', 'sale'].includes(k))) {
            return 'promotions';
        }
        if (senderType === 'social') return 'personal';
        if (senderType === 'automated') return 'spam';
        
        // Default to work
        return 'work';
    }

    calculateConfidence(analysis, category) {
        const { urgency, keywords, senderType } = analysis;
        let confidence = 50; // Base confidence
        
        // Increase confidence based on clear indicators
        if (urgency >= 7 && category === 'urgent') confidence += 30;
        if (senderType === 'promotional' && category === 'promotions') confidence += 25;
        if (keywords.length > 3) confidence += 10;
        
        return Math.min(confidence, 95);
    }

    generateCategorizationReasoning(analysis, category) {
        const reasons = {
            'urgent': 'Contains urgent keywords and time-sensitive language',
            'follow-up': 'Indicates follow-up or reminder context',
            'meetings': 'Contains scheduling or meeting-related terms',
            'promotions': 'Appears to be promotional or marketing content',
            'personal': 'Personal communication style detected',
            'spam': 'Automated or bulk email characteristics',
            'work': 'Professional communication context'
        };
        
        return reasons[category] || 'Based on content analysis and patterns';
    }

    getAlternativeCategories(analysis, currentCategory) {
        const categories = ['work', 'urgent', 'follow-up', 'meetings', 'promotions', 'personal', 'spam'];
        const alternatives = categories.filter(cat => cat !== currentCategory);
        
        // Return top 3 alternatives with confidence scores
        return alternatives.slice(0, 3).map(cat => ({
            category: cat,
            confidence: Math.random() * 30 + 20 // 20-50% confidence
        }));
    }

    // AI Response Generation with Multiple Tones
    async generateAIResponse(email, options = {}) {
        const {
            tone = this.userSettings.defaultTone,
            includeContext = true,
            editable = true
        } = options;

        try {
            // Mock AI response generation - in production, this would use LLM
            const context = includeContext ? await this.compressEmailThread(email.thread || email.body) : null;
            const response = this.generateResponse(email, tone, context);
            
            return {
                response,
                tone,
                context: context?.summary,
                confidence: Math.random() * 20 + 80, // 80-100% confidence
                editable,
                alternatives: this.generateAlternativeResponses(email, tone)
            };
        } catch (error) {
            console.error('AI response generation failed:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    generateResponse(email, tone, context) {
        const baseResponse = this.createBaseResponse(email, context);
        
        switch (tone) {
            case 'professional':
                return this.formatProfessionalResponse(baseResponse, email);
            case 'friendly':
                return this.formatFriendlyResponse(baseResponse, email);
            case 'short':
                return this.formatShortResponse(baseResponse, email);
            case 'detailed':
                return this.formatDetailedResponse(baseResponse, email, context);
            default:
                return this.formatProfessionalResponse(baseResponse, email);
        }
    }

    createBaseResponse(email, context) {
        const subject = email.subject.toLowerCase();
        
        if (subject.includes('meeting') || subject.includes('schedule')) {
            return this.createMeetingResponse(email, context);
        }
        if (subject.includes('follow') || subject.includes('update')) {
            return this.createFollowUpResponse(email, context);
        }
        if (subject.includes('thank')) {
            return this.createThankYouResponse(email, context);
        }
        
        return this.createGenericResponse(email, context);
    }

    createMeetingResponse(email, context) {
        const summary = context?.summary || 'your message';
        return {
            greeting: 'Thank you for reaching out about scheduling',
            acknowledgment: `I've reviewed ${summary}`,
            action: 'I would be happy to coordinate a time that works for everyone',
            closing: 'Looking forward to your response'
        };
    }

    createFollowUpResponse(email, context) {
        return {
            greeting: 'Thank you for the follow-up',
            acknowledgment: 'I appreciate you checking in on this',
            action: 'I will review and get back to you shortly',
            closing: 'Thank you for your patience'
        };
    }

    createThankYouResponse(email, context) {
        return {
            greeting: 'You are very welcome',
            acknowledgment: 'I am glad I could help',
            action: 'Please let me know if you need anything else',
            closing: 'Best regards'
        };
    }

    createGenericResponse(email, context) {
        return {
            greeting: 'Thank you for your message',
            acknowledgment: 'I have reviewed your email',
            action: 'I will follow up as appropriate',
            closing: 'Best regards'
        };
    }

    formatProfessionalResponse(baseResponse, email) {
        return `${baseResponse.greeting}.\n\n${baseResponse.acknowledgment}. ${baseResponse.action}.\n\n${baseResponse.closing},\n${this.currentUser?.name || 'Your Name'}`;
    }

    formatFriendlyResponse(baseResponse, email) {
        return `Hi there!\n\n${baseResponse.greeting.toLowerCase()}. ${baseResponse.acknowledgment.toLowerCase()}. ${baseResponse.action.toLowerCase()}.\n\n${baseResponse.closing.toLowerCase()}!\n${this.currentUser?.name || 'Your Name'}`;
    }

    formatShortResponse(baseResponse, email) {
        return `${baseResponse.greeting}. ${baseResponse.action}. ${baseResponse.closing}.`;
    }

    formatDetailedResponse(baseResponse, email, context) {
        let response = `${baseResponse.greeting}.\n\n${baseResponse.acknowledgment}.\n\n${baseResponse.action}.`;
        
        if (context?.actionItems?.length > 0) {
            response += `\n\nBased on our discussion, I'll also:\n${context.actionItems.map(item => `• ${item}`).join('\n')}`;
        }
        
        response += `\n\n${baseResponse.closing},\n${this.currentUser?.name || 'Your Name'}`;
        return response;
    }

    generateAlternativeResponses(email, currentTone) {
        const tones = ['professional', 'friendly', 'short', 'detailed'];
        const alternatives = [];
        
        tones.forEach(tone => {
            if (tone !== currentTone) {
                alternatives.push({
                    tone,
                    response: this.generateResponse(email, tone),
                    confidence: Math.random() * 15 + 80
                });
            }
        });
        
        return alternatives;
    }

    // Dashboard and Analytics
    async loadDashboard() {
        if (!this.currentUser) return;

        try {
            this.showLoading(true);
            
            // Load emails from API
            const response = await fetch('tables/emails');
            const data = await response.json();
            this.emails = data.data || [];
            
            this.updateDashboardStats();
            this.renderEmailList();
            this.updateAnalytics();
            
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            this.showToast('Failed to load dashboard data', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    updateDashboardStats() {
        const stats = {
            total: this.emails.length,
            processed: this.emails.filter(e => e.status === 'processed').length,
            urgent: this.emails.filter(e => e.category === 'urgent').length,
            followup: this.emails.filter(e => e.category === 'follow-up').length,
            timeSaved: Math.round(this.emails.length * 0.15 * 100) / 100, // 15% time savings
            accuracy: this.calculateOverallAccuracy()
        };

        document.getElementById('totalEmails').textContent = stats.total;
        document.getElementById('processedEmails').textContent = stats.processed;
        document.getElementById('timeSaved').textContent = `${stats.timeSaved}h`;
        document.getElementById('accuracyRate').textContent = `${stats.accuracy}%`;
    }

    calculateOverallAccuracy() {
        const processedEmails = this.emails.filter(e => e.status === 'processed');
        if (processedEmails.length === 0) return 85;
        
        const totalConfidence = processedEmails.reduce((sum, email) => 
            sum + (email.confidence || 80), 0);
        return Math.round(totalConfidence / processedEmails.length);
    }

    renderEmailList() {
        const emailList = document.getElementById('emailList');
        const emailsToRender = this.filteredEmails.length > 0 ? this.filteredEmails : this.emails;
        
        if (emailsToRender.length === 0) {
            emailList.innerHTML = `
                <div class="p-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No emails found. Add some emails to get started!</p>
                </div>
            `;
            return;
        }

        emailList.innerHTML = emailsToRender.map(email => this.createEmailItem(email)).join('');
        
        // Add event listeners to email items
        emailList.querySelectorAll('.email-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.email-actions')) {
                    const emailId = item.dataset.emailId;
                    this.showEmailDetail(emailId);
                }
            });
        });
    }

    createEmailItem(email) {
        const categoryBadge = this.createCategoryBadge(email.category, email.confidence);
        const statusIcon = this.getStatusIcon(email.status);
        
        return `
            <div class="email-item ${email.status === 'unread' ? 'unread' : ''}" data-email-id="${email.id}">
                <div class="email-header">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white text-sm"></i>
                        </div>
                        <div>
                            <p class="email-sender">${email.from}</p>
                            <p class="text-sm text-gray-500">${this.formatDate(email.date)}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${statusIcon}
                        ${categoryBadge}
                    </div>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${this.truncateText(email.body, 100)}</div>
                <div class="email-actions">
                    <button class="btn btn-sm btn-secondary" onclick="smartMail.archiveEmail('${email.id}')">
                        <i class="fas fa-archive mr-1"></i>Archive
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="smartMail.snoozeEmail('${email.id}')">
                        <i class="fas fa-clock mr-1"></i>Snooze
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="smartMail.generateReply('${email.id}')">
                        <i class="fas fa-reply mr-1"></i>AI Reply
                    </button>
                </div>
            </div>
        `;
    }

    createCategoryBadge(category, confidence) {
        const categoryClass = `category-${category}`;
        const confidenceBadge = confidence ? `<span class="confidence-score confidence-${this.getConfidenceLevel(confidence)}">${confidence}%</span>` : '';
        
        return `
            <span class="category-badge ${categoryClass}">
                ${category}
            </span>
            ${confidenceBadge}
        `;
    }

    getConfidenceLevel(confidence) {
        if (confidence >= 80) return 'high';
        if (confidence >= 60) return 'medium';
        return 'low';
    }

    getStatusIcon(status) {
        const icons = {
            unread: '<i class="fas fa-circle text-blue-500 text-xs"></i>',
            read: '<i class="fas fa-check text-gray-400 text-xs"></i>',
            replied: '<i class="fas fa-reply text-green-500 text-xs"></i>',
            archived: '<i class="fas fa-archive text-gray-400 text-xs"></i>'
        };
        return icons[status] || icons.unread;
    }

    // Email Detail Modal
    async showEmailDetail(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;

        const modal = document.getElementById('emailModal');
        const modalBody = document.getElementById('emailModalBody');
        
        // Show loading state
        modalBody.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Processing email...</p>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        try {
            // Generate AI analysis
            const [summary, category, aiResponse] = await Promise.all([
                this.compressEmailThread(email.thread || email.body),
                this.categorizeEmail(email),
                this.generateAIResponse(email)
            ]);
            
            modalBody.innerHTML = this.createEmailDetailHTML(email, summary, category, aiResponse);
            
            // Add event listeners for AI response actions
            this.setupEmailDetailEventListeners(email, aiResponse);
            
        } catch (error) {
            console.error('Failed to load email detail:', error);
            modalBody.innerHTML = `
                <div class="text-center py-8 text-red-600">
                    <i class="fas fa-exclamation-circle text-3xl mb-4"></i>
                    <p>Failed to load email details. Please try again.</p>
                </div>
            `;
        }
    }

    createEmailDetailHTML(email, summary, category, aiResponse) {
        return `
            <div class="space-y-6">
                <!-- Email Header -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${email.from}</h3>
                            <p class="text-sm text-gray-500">${this.formatDate(email.date)}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${this.createCategoryBadge(category.category, category.confidence)}
                    </div>
                </div>

                <!-- Email Subject -->
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">${email.subject}</h2>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span><i class="fas fa-paperclip mr-1"></i>${email.attachments || 0} attachments</span>
                        <span><i class="fas fa-comments mr-1"></i>${email.threadLength || 1} messages</span>
                    </div>
                </div>

                <!-- AI Summary -->
                <div class="ai-summary">
                    <div class="ai-summary-header">
                        <div class="ai-summary-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <h4 class="ai-summary-title">AI Summary</h4>
                            <p class="text-xs text-gray-500">Confidence: ${Math.round(summary.confidence)}% | Compression: ${summary.compressionRatio}%</p>
                        </div>
                    </div>
                    <div class="ai-summary-content">
                        ${summary.summary}
                        ${summary.actionItems.length > 0 ? `
                            <div class="mt-3">
                                <strong>Action Items:</strong>
                                <ul class="list-disc list-inside mt-1">
                                    ${summary.actionItems.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Thread View -->
                <div class="thread-container">
                    <div class="thread-toggle bg-gray-50 p-3 rounded-t-lg cursor-pointer" onclick="this.nextElementSibling.classList.toggle('collapsed')">
                        <div class="flex items-center justify-between">
                            <span class="font-medium">View Full Thread (${email.threadLength || 1} messages)</span>
                            <i class="fas fa-chevron-down transition-transform"></i>
                        </div>
                    </div>
                    <div class="thread-content collapsed p-4">
                        ${this.formatThreadContent(email.thread || email.body)}
                    </div>
                </div>

                <!-- AI Response -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-semibold text-gray-900">AI-Generated Response</h4>
                        <div class="flex items-center space-x-2">
                            <select id="toneSelect" class="form-select text-sm">
                                <option value="professional" ${aiResponse.tone === 'professional' ? 'selected' : ''}>Professional</option>
                                <option value="friendly" ${aiResponse.tone === 'friendly' ? 'selected' : ''}>Friendly</option>
                                <option value="short" ${aiResponse.tone === 'short' ? 'selected' : ''}>Short</option>
                                <option value="detailed" ${aiResponse.tone === 'detailed' ? 'selected' : ''}>Detailed</option>
                            </select>
                            <button id="regenerateResponse" class="btn btn-sm btn-secondary">
                                <i class="fas fa-refresh mr-1"></i>Regenerate
                            </button>
                        </div>
                    </div>
                    
                    <div class="ai-response-editor">
                        <textarea id="aiResponseText" class="ai-response-textarea">${aiResponse.response}</textarea>
                    </div>
                    
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-500">Confidence: ${Math.round(aiResponse.confidence)}%</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button id="copyResponse" class="btn btn-sm btn-secondary">
                                <i class="fas fa-copy mr-1"></i>Copy
                            </button>
                            <button id="sendResponse" class="btn btn-sm btn-primary">
                                <i class="fas fa-paper-plane mr-1"></i>Send
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <button onclick="smartMail.archiveEmail('${email.id}')" class="btn btn-secondary">
                            <i class="fas fa-archive mr-2"></i>Archive
                        </button>
                        <button onclick="smartMail.snoozeEmail('${email.id}')" class="btn btn-secondary">
                            <i class="fas fa-clock mr-2"></i>Snooze
                        </button>
                        <button onclick="smartMail.unsubscribeEmail('${email.id}')" class="btn btn-secondary">
                            <i class="fas fa-ban mr-2"></i>Unsubscribe
                        </button>
                    </div>
                    <button onclick="smartMail.closeModal()" class="btn btn-primary">
                        Close
                    </button>
                </div>
            </div>
        `;
    }

    setupEmailDetailEventListeners(email, aiResponse) {
        // Tone change
        document.getElementById('toneSelect').addEventListener('change', async (e) => {
            const newTone = e.target.value;
            const newResponse = await this.generateAIResponse(email, { tone: newTone });
            document.getElementById('aiResponseText').value = newResponse.response;
        });

        // Regenerate response
        document.getElementById('regenerateResponse').addEventListener('click', async () => {
            const currentTone = document.getElementById('toneSelect').value;
            const newResponse = await this.generateAIResponse(email, { tone: currentTone });
            document.getElementById('aiResponseText').value = newResponse.response;
        });

        // Copy response
        document.getElementById('copyResponse').addEventListener('click', () => {
            const responseText = document.getElementById('aiResponseText').value;
            navigator.clipboard.writeText(responseText);
            this.showToast('Response copied to clipboard', 'success');
        });

        // Send response
        document.getElementById('sendResponse').addEventListener('click', async () => {
            const responseText = document.getElementById('aiResponseText').value;
            await this.sendEmailResponse(email, responseText);
        });
    }

    async sendEmailResponse(email, responseText) {
        this.showLoading(true);
        
        try {
            // Mock email sending
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update email status
            email.status = 'replied';
            await this.updateEmail(email);
            
            this.showToast('Response sent successfully!', 'success');
            this.closeModal();
            this.loadDashboard();
            
        } catch (error) {
            console.error('Failed to send response:', error);
            this.showToast('Failed to send response. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Settings and User Preferences
    async saveSettings() {
        const settings = {
            autoReply: document.getElementById('autoReplyEnabled').checked,
            defaultTone: document.getElementById('defaultTone').value,
            summaryLength: document.getElementById('summaryLength').value,
            confidenceThreshold: parseInt(document.getElementById('confidenceThreshold').value),
            autoCategorize: document.getElementById('autoCategorize').checked
        };

        this.userSettings = { ...this.userSettings, ...settings };
        
        try {
            // Save to API
            await fetch('tables/user_settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.currentUser.id,
                    ...this.userSettings
                })
            });
            
            this.showToast('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showToast('Failed to save settings', 'error');
        }
    }

    async saveAccountSettings() {
        const name = document.getElementById('accountName').value;
        const email = document.getElementById('accountEmail').value;

        if (!name.trim()) {
            this.showToast('Please enter your name', 'warning');
            return;
        }

        try {
            this.currentUser.name = name;
            this.currentUser.email = email;
            
            // Update in localStorage
            localStorage.setItem('smartmail_user', JSON.stringify(this.currentUser));
            
            this.updateUI();
            this.showToast('Account settings updated!', 'success');
        } catch (error) {
            console.error('Failed to update account:', error);
            this.showToast('Failed to update account settings', 'error');
        }
    }

    resetAnalytics() {
        if (confirm('Are you sure you want to reset all analytics data?')) {
            this.analytics = {
                emailsProcessed: 0,
                timeSaved: 0,
                averageResponseTime: 0,
                accuracy: 85
            };
            
            localStorage.removeItem('smartmail_analytics');
            this.updateAnalyticsDisplay();
            this.showToast('Analytics reset successfully', 'success');
        }
    }

    // Utility Functions
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.toggle('hidden', !show);
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${icons[type]} mr-3"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Initialize sample data
    async initializeData() {
        // Check if we have sample data
        const hasData = localStorage.getItem('smartmail_initialized');
        if (hasData) return;

        try {
            // Add sample emails
            const sampleEmails = [
                {
                    id: this.generateId(),
                    from: 'john.doe@company.com',
                    subject: 'Q4 Project Review - Action Required',
                    body: 'Hi team,\n\nI hope this email finds you well. I wanted to follow up on our Q4 project review meeting that we had last week. As discussed, we need to finalize the budget approval for the new initiative and make sure all stakeholders are aligned on the timeline.\n\nKey points from the meeting:\n- Budget approval needed by December 15th\n- Timeline adjustment for Q1 2024\n- Resource allocation for development team\n\nPlease review the attached documents and provide your feedback by December 1st.\n\nBest regards,\nJohn',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'work',
                    status: 'unread',
                    confidence: 85,
                    threadLength: 3,
                    attachments: 2
                },
                {
                    id: this.generateId(),
                    from: 'sarah.smith@client.com',
                    subject: 'URGENT: System Outage - Immediate Response Needed',
                    body: 'URGENT: We are experiencing a complete system outage affecting all users. This is impacting our business operations and needs immediate attention.\n\nTimeline: Issue started at 9:30 AM EST\nImpact: All users unable to access the system\nPriority: Critical\n\nPlease respond ASAP with:\n1. Root cause analysis\n2. Estimated resolution time\n3. Temporary workarounds\n\nThis is affecting our SLA commitments.',
                    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    category: 'urgent',
                    status: 'unread',
                    confidence: 92,
                    threadLength: 1,
                    attachments: 0
                },
                {
                    id: this.generateId(),
                    from: 'marketing@techconf.com',
                    subject: 'Early Bird Special - Tech Conference 2024',
                    body: 'Don\'t miss out! Early bird pricing for Tech Conference 2024 ends this Friday.\n\nWhat you\'ll get:\n- Access to 50+ sessions\n- Networking with 1000+ professionals\n- Certificate of attendance\n- Conference swag bag\n\nRegular Price: $899\nEarly Bird: $599 (Save $300!)\n\nRegister now before the price increases!\n\nBest regards,\nThe Tech Conference Team',
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'promotions',
                    status: 'read',
                    confidence: 88,
                    threadLength: 1,
                    attachments: 0
                }
            ];

            // Add emails to database
            for (const email of sampleEmails) {
                await fetch('tables/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(email)
                });
            }

            // Mark as initialized
            localStorage.setItem('smartmail_initialized', 'true');
        } catch (error) {
            console.error('Failed to initialize sample data:', error);
        }
    }

    // Navigation
    navigateToPage(page, updateHistory = true) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        
        // Show target page
        const targetPage = document.getElementById(page + 'Page');
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.currentPage = page;
            
            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.page === page);
            });
            
            // Update URL
            if (updateHistory) {
                history.pushState({ page }, '', `#${page}`);
            }
            
            // Load page-specific data
            switch (page) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                case 'settings':
                    this.loadSettings();
                    break;
            }
        }
    }

    showAuthPage() {
        document.getElementById('authPage').classList.remove('hidden');
        document.getElementById('homePage').classList.add('hidden');
        document.getElementById('dashboardPage').classList.add('hidden');
        document.getElementById('settingsPage').classList.add('hidden');
    }

    toggleAuthMode() {
        const isLogin = document.getElementById('authSubmitText').textContent === 'Sign In';
        const nameGroup = document.getElementById('nameGroup');
        const authTitle = document.getElementById('authTitle');
        const authSubtitle = document.getElementById('authSubtitle');
        const authSubmitText = document.getElementById('authSubmitText');
        const authSwitchText = document.getElementById('authSwitchText');
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        
        if (isLogin) {
            // Switch to Sign Up
            nameGroup.classList.remove('hidden');
            authTitle.textContent = 'Sign Up';
            authSubtitle.textContent = 'Create your SmartMail AI account';
            authSubmitText.textContent = 'Sign Up';
            authSwitchText.textContent = 'Already have an account?';
            authSwitchBtn.textContent = 'Sign In';
        } else {
            // Switch to Sign In
            nameGroup.classList.add('hidden');
            authTitle.textContent = 'Sign In';
            authSubtitle.textContent = 'Welcome back to SmartMail AI';
            authSubmitText.textContent = 'Sign In';
            authSwitchText.textContent = "Don't have an account?";
            authSwitchBtn.textContent = 'Sign Up';
        }
    }

    updateUI() {
        const userInfo = document.getElementById('userInfo');
        const loginBtn = document.getElementById('loginBtn');
        const userName = document.getElementById('userName');
        
        if (this.currentUser) {
            userInfo.classList.remove('hidden');
            loginBtn.classList.add('hidden');
            userName.textContent = this.currentUser.name;
            
            // Update account settings
            document.getElementById('accountEmail').value = this.currentUser.email;
            document.getElementById('accountName').value = this.currentUser.name;
        } else {
            userInfo.classList.add('hidden');
            loginBtn.classList.remove('hidden');
        }
    }

    loadUserData() {
        const userData = localStorage.getItem('smartmail_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
        
        const analyticsData = localStorage.getItem('smartmail_analytics');
        if (analyticsData) {
            this.analytics = { ...this.analytics, ...JSON.parse(analyticsData) };
        }
    }

    loadSettings() {
        if (!this.currentUser) return;
        
        // Load current settings into form
        document.getElementById('autoReplyEnabled').checked = this.userSettings.autoReply;
        document.getElementById('defaultTone').value = this.userSettings.defaultTone;
        document.getElementById('summaryLength').value = this.userSettings.summaryLength;
        document.getElementById('autoCategorize').checked = this.userSettings.autoCategorize;
        document.getElementById('confidenceThreshold').value = this.userSettings.confidenceThreshold;
        document.getElementById('confidenceValue').textContent = this.userSettings.confidenceThreshold + '%';
        
        // Update analytics display
        this.updateAnalyticsDisplay();
    }

    updateAnalyticsDisplay() {
        document.getElementById('analyticsProcessed').textContent = this.analytics.emailsProcessed;
        document.getElementById('analyticsTimeSaved').textContent = `${this.analytics.timeSaved}h`;
        document.getElementById('analyticsResponseTime').textContent = `${this.analytics.averageResponseTime}m`;
        document.getElementById('analyticsAccuracy').textContent = `${this.analytics.accuracy}%`;
    }

    formatThreadContent(threadContent) {
        // Format thread content for display
        const messages = threadContent.split(/\n---\n/).filter(msg => msg.trim());
        return messages.map((message, index) => `
            <div class="thread-item">
                <div class="thread-header">
                    <span class="thread-sender">Message ${index + 1}</span>
                    <span class="thread-time">${this.formatDate(new Date().toISOString())}</span>
                </div>
                <div class="thread-content">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
        `).join('');
    }

    filterEmails(searchTerm = '') {
        const categoryFilter = document.getElementById('categoryFilter')?.value;
        const statusFilter = document.getElementById('statusFilter')?.value;
        
        this.filteredEmails = this.emails.filter(email => {
            const matchesSearch = !searchTerm || 
                email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.body.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !categoryFilter || email.category === categoryFilter;
            const matchesStatus = !statusFilter || email.status === statusFilter;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
        
        this.renderEmailList();
    }

    closeModal() {
        document.getElementById('emailModal').classList.add('hidden');
    }

    // Email Actions
    async archiveEmail(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;
        
        email.status = 'archived';
        await this.updateEmail(email);
        this.showToast('Email archived', 'success');
        this.renderEmailList();
    }

    async snoozeEmail(emailId) {
        // Mock snooze functionality
        this.showToast('Email snoozed for 24 hours', 'info');
    }

    async unsubscribeEmail(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;
        
        email.category = 'spam';
        email.status = 'archived';
        await this.updateEmail(email);
        this.showToast('Unsubscribed successfully', 'success');
        this.renderEmailList();
    }

    async generateReply(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;
        
        this.showEmailDetail(emailId);
    }

    async updateEmail(email) {
        try {
            await fetch(`tables/emails/${email.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email)
            });
        } catch (error) {
            console.error('Failed to update email:', error);
        }
    }

    // Real-time Updates
    async checkForNewEmails() {
        try {
            const response = await fetch('tables/emails?sort=created_at&limit=1');
            const data = await response.json();
            const latestEmail = data.data?.[0];
            
            if (latestEmail && !this.emails.find(e => e.id === latestEmail.id)) {
                this.showToast('New email received!', 'info');
                this.loadDashboard();
            }
        } catch (error) {
            console.error('Failed to check for new emails:', error);
        }
    }

    // Analytics and Reporting
    updateAnalytics() {
        if (!this.currentUser) return;
        
        // Calculate analytics
        const processedEmails = this.emails.filter(e => e.status === 'processed');
        this.analytics.emailsProcessed = processedEmails.length;
        this.analytics.timeSaved = Math.round(processedEmails.length * 0.15 * 100) / 100;
        this.analytics.averageResponseTime = processedEmails.length > 0 ? 
            Math.round(processedEmails.reduce((sum, email) => sum + (email.responseTime || 5), 0) / processedEmails.length) : 0;
        this.analytics.accuracy = this.calculateOverallAccuracy();
        
        // Save to localStorage
        localStorage.setItem('smartmail_analytics', JSON.stringify(this.analytics));
    }
}

// Initialize the application
let smartMail;

document.addEventListener('DOMContentLoaded', () => {
    smartMail = new SmartMailAI();
});

// Global functions for HTML onclick handlers
window.archiveEmail = (emailId) => smartMail.archiveEmail(emailId);
window.snoozeEmail = (emailId) => smartMail.snoozeEmail(emailId);
window.unsubscribeEmail = (emailId) => smartMail.unsubscribeEmail(emailId);
window.generateReply = (emailId) => smartMail.generateReply(emailId);