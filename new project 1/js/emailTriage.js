// Email Triage Assistant - Main JavaScript
class EmailTriageAssistant {
    constructor() {
        this.emails = [];
        this.currentEmail = null;
        this.categories = {
            urgent: { name: 'Urgent', color: 'red', icon: 'exclamation-triangle' },
            followup: { name: 'Follow-up', color: 'yellow', icon: 'clock' },
            info: { name: 'Information', color: 'blue', icon: 'info-circle' },
            spam: { name: 'Spam', color: 'gray', icon: 'ban' },
            personal: { name: 'Personal', color: 'purple', icon: 'user' },
            work: { name: 'Work', color: 'green', icon: 'briefcase' }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadEmails();
        this.updateDashboard();
    }

    setupEventListeners() {
        document.getElementById('syncBtn').addEventListener('click', () => this.syncEmails());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshEmails());
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterByCategory(e.target.value));
        document.getElementById('archiveBtn').addEventListener('click', () => this.archiveThread());
        document.getElementById('snoozeBtn').addEventListener('click', () => this.snoozeThread());
        document.getElementById('unsubscribeBtn').addEventListener('click', () => this.unsubscribeThread());
    }

    // Load emails from RESTful API
    async loadEmails() {
        try {
            const response = await fetch('tables/emails');
            const data = await response.json();
            this.emails = data.data || [];
            this.renderEmails();
        } catch (error) {
            console.error('Error loading emails:', error);
            this.loadSampleEmails();
        }
    }

    // Load sample emails for demonstration
    loadSampleEmails() {
        this.emails = [
            {
                id: 1,
                subject: "Project Deadline Extension Request",
                sender: "john.doe@company.com",
                senderName: "John Doe",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                category: "urgent",
                priority: "high",
                threadCount: 5,
                summary: "Team member requesting deadline extension for Q4 project deliverables",
                content: "Hi team, I need to request a 2-week extension on the Q4 project deadline due to unforeseen technical challenges with the new API integration.",
                status: "unread",
                thread: [
                    { sender: "john.doe@company.com", content: "Hi team, I need to request a 2-week extension...", timestamp: new Date(Date.now() - 3600000).toISOString() },
                    { sender: "manager@company.com", content: "John, can you provide more details about the technical challenges?", timestamp: new Date(Date.now() - 3000000).toISOString() },
                    { sender: "john.doe@company.com", content: "The API integration is more complex than anticipated...", timestamp: new Date(Date.now() - 2400000).toISOString() }
                ]
            },
            {
                id: 2,
                subject: "Follow-up: Meeting Notes and Action Items",
                sender: "sarah.smith@client.com",
                senderName: "Sarah Smith",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                category: "followup",
                priority: "medium",
                threadCount: 3,
                summary: "Client requesting follow-up on yesterday's meeting and next steps",
                content: "Thank you for the great meeting yesterday. I've attached the meeting notes and would like to discuss the next steps for the marketing campaign.",
                status: "read",
                thread: [
                    { sender: "sarah.smith@client.com", content: "Thank you for the great meeting yesterday...", timestamp: new Date(Date.now() - 7200000).toISOString() }
                ]
            },
            {
                id: 3,
                subject: "Monthly Newsletter - Industry Updates",
                sender: "newsletter@industry.com",
                senderName: "Industry Newsletter",
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                category: "info",
                priority: "low",
                threadCount: 1,
                summary: "Monthly industry newsletter with market trends and updates",
                content: "This month's newsletter covers the latest industry trends, market analysis, and upcoming events.",
                status: "unread",
                thread: []
            },
            {
                id: 4,
                subject: "Special Offer: 50% Off Software License",
                sender: "sales@software.com",
                senderName: "Software Sales",
                timestamp: new Date(Date.now() - 14400000).toISOString(),
                category: "spam",
                priority: "low",
                threadCount: 1,
                summary: "Promotional email for software license discount",
                content: "Limited time offer! Get 50% off on our premium software license.",
                status: "unread",
                thread: []
            }
        ];
        this.renderEmails();
    }

    // Render email list
    renderEmails(filteredEmails = null) {
        const emailList = document.getElementById('emailList');
        const emailsToRender = filteredEmails || this.emails;
        
        if (emailsToRender.length === 0) {
            emailList.innerHTML = '<div class="p-6 text-center text-gray-500">No emails found</div>';
            return;
        }

        emailList.innerHTML = emailsToRender.map(email => this.createEmailItem(email)).join('');
        
        // Add click listeners to email items
        emailsToRender.forEach(email => {
            const element = document.querySelector(`[data-email-id="${email.id}"]`);
            if (element) {
                element.addEventListener('click', () => this.selectEmail(email));
            }
        });
    }

    // Create email list item HTML
    createEmailItem(email) {
        const category = this.categories[email.category] || this.categories.info;
        const timeAgo = this.getTimeAgo(email.timestamp);
        const isUnread = email.status === 'unread';
        
        return `
            <div class="email-item p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-l-${category.color}-500 ${isUnread ? 'bg-blue-50' : ''}" 
                 data-email-id="${email.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-900 truncate">${email.senderName}</span>
                            <span class="ml-2 px-2 py-1 text-xs rounded-full bg-${category.color}-100 text-${category.color}-800">
                                <i class="fas fa-${category.icon} mr-1"></i>${category.name}
                            </span>
                            ${email.threadCount > 1 ? `<span class="ml-2 text-xs text-gray-500">(${email.threadCount})</span>` : ''}
                        </div>
                        <p class="text-sm font-medium text-gray-900 mt-1">${email.subject}</p>
                        <p class="text-sm text-gray-600 truncate">${email.summary}</p>
                    </div>
                    <div class="flex flex-col items-end ml-4">
                        <span class="text-xs text-gray-500">${timeAgo}</span>
                        ${email.priority === 'high' ? '<i class="fas fa-exclamation-circle text-red-500 mt-1"></i>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Select email and show analysis
    selectEmail(email) {
        this.currentEmail = email;
        this.updateThreadSummary(email);
        this.generateAISuggestions(email);
        this.highlightSelectedEmail(email.id);
    }

    // Update thread summary
    updateThreadSummary(email) {
        const summaryDiv = document.getElementById('threadSummary');
        const threadSummary = this.compressThread(email.thread, email.content);
        
        summaryDiv.innerHTML = `
            <div class="space-y-3">
                <div>
                    <h4 class="font-medium text-gray-900 mb-1">Thread Summary</h4>
                    <p class="text-sm text-gray-600">${threadSummary.summary}</p>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900 mb-1">Key Points</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                        ${threadSummary.keyPoints.map(point => `<li>• ${point}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900 mb-1">Context</h4>
                    <p class="text-sm text-gray-600">${threadSummary.context}</p>
                </div>
            </div>
        `;
    }

    // Compress and analyze email thread
    compressThread(thread, currentContent) {
        if (!thread || thread.length === 0) {
            return {
                summary: this.summarizeContent(currentContent),
                keyPoints: this.extractKeyPoints(currentContent),
                context: "Single email - no thread context available"
            };
        }

        const allContent = thread.map(msg => msg.content).join(' ') + ' ' + currentContent;
        const participants = [...new Set(thread.map(msg => msg.sender))];
        
        return {
            summary: this.summarizeContent(allContent),
            keyPoints: this.extractKeyPoints(allContent),
            context: `Thread with ${participants.length} participants and ${thread.length} messages`
        };
    }

    // Summarize content using basic NLP techniques
    summarizeContent(content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0) return "No content available";
        
        // Simple summary: first sentence + key points
        const firstSentence = sentences[0].trim();
        const wordCount = content.split(' ').length;
        
        return `${firstSentence}${sentences.length > 1 ? '...' : ''} (${wordCount} words)`;
    }

    // Extract key points from content
    extractKeyPoints(content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const keyPoints = [];
        
        // Look for action items, questions, or important statements
        sentences.forEach(sentence => {
            const trimmed = sentence.trim().toLowerCase();
            if (trimmed.includes('request') || trimmed.includes('need') || trimmed.includes('urgent')) {
                keyPoints.push(sentence.trim());
            } else if (trimmed.includes('?')) {
                keyPoints.push(`Question: ${sentence.trim()}`);
            }
        });
        
        return keyPoints.length > 0 ? keyPoints.slice(0, 3) : ["No specific action items identified"];
    }

    // Generate AI suggestions for the email
    generateAISuggestions(email) {
        const suggestionsDiv = document.getElementById('aiSuggestions');
        const suggestions = this.createAISuggestions(email);
        
        suggestionsDiv.innerHTML = suggestions.map(suggestion => `
            <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-start">
                    <i class="fas fa-${suggestion.icon} text-${suggestion.color}-600 mt-1 mr-3"></i>
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-900">${suggestion.title}</h4>
                        <p class="text-xs text-gray-600 mt-1">${suggestion.description}</p>
                        ${suggestion.action ? `<button class="text-xs text-blue-600 hover:text-blue-800 mt-2" onclick="${suggestion.action}">Apply</button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Create AI suggestions based on email analysis
    createAISuggestions(email) {
        const suggestions = [];
        
        // Category suggestion
        const suggestedCategory = this.suggestCategory(email);
        if (suggestedCategory !== email.category) {
            suggestions.push({
                icon: 'tag',
                color: 'blue',
                title: 'Category Suggestion',
                description: `Consider moving this to ${this.categories[suggestedCategory].name}`,
                action: `emailTriage.categorizeEmail(${email.id}, '${suggestedCategory}')`
            });
        }
        
        // Response suggestion
        const responseSuggestion = this.suggestResponse(email);
        if (responseSuggestion) {
            suggestions.push({
                icon: 'reply',
                color: 'green',
                title: 'Response Template',
                description: responseSuggestion.summary,
                action: `emailTriage.showResponseTemplate('${responseSuggestion.template}')`
            });
        }
        
        // Priority suggestion
        if (email.priority === 'high' && this.isOlderThan(email.timestamp, 24)) {
            suggestions.push({
                icon: 'clock',
                color: 'red',
                title: 'High Priority Alert',
                description: 'This high-priority email is older than 24 hours',
                action: null
            });
        }
        
        // Thread management
        if (email.threadCount > 3) {
            suggestions.push({
                icon: 'compress',
                color: 'purple',
                title: 'Long Thread',
                description: 'Consider archiving or summarizing this long thread',
                action: `emailTriage.summarizeThread(${email.id})`
            });
        }
        
        return suggestions;
    }

    // Suggest category based on content analysis
    suggestCategory(email) {
        const content = (email.content + ' ' + email.subject).toLowerCase();
        const sender = email.sender.toLowerCase();
        
        // Spam detection
        if (sender.includes('newsletter') || sender.includes('noreply') || 
            content.includes('unsubscribe') || content.includes('promotional') ||
            content.includes('special offer') || content.includes('discount')) {
            return 'spam';
        }
        
        // Urgent detection
        if (content.includes('urgent') || content.includes('asap') || content.includes('deadline') ||
            content.includes('emergency') || content.includes('critical')) {
            return 'urgent';
        }
        
        // Follow-up detection
        if (content.includes('follow-up') || content.includes('follow up') || content.includes('checking in') ||
            content.includes('status update') || content.includes('next steps')) {
            return 'followup';
        }
        
        // Personal detection
        if (sender.includes('gmail') || sender.includes('yahoo') || sender.includes('hotmail')) {
            return 'personal';
        }
        
        return 'info';
    }

    // Suggest response template
    suggestResponse(email) {
        const content = email.content.toLowerCase();
        const category = email.category;
        
        if (category === 'urgent') {
            return {
                summary: 'Acknowledge urgency and provide timeline',
                template: `Hi ${email.senderName},\n\nThank you for bringing this to my attention. I understand the urgency and will prioritize this matter. I will get back to you within [timeframe] with [specific action].\n\nBest regards`
            };
        }
        
        if (category === 'followup') {
            return {
                summary: 'Provide status update and next steps',
                template: `Hi ${email.senderName},\n\nThank you for following up. Here's the current status: [status update]. The next steps are: [specific next steps].\n\nI'll keep you updated on the progress.\n\nBest regards`
            };
        }
        
        if (content.includes('meeting')) {
            return {
                summary: 'Confirm meeting details',
                template: `Hi ${email.senderName},\n\nThank you for scheduling the meeting. I confirm my availability for [date/time]. Looking forward to our discussion about [topic].\n\nBest regards`
            };
        }
        
        return null;
    }

    // Helper functions
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    isOlderThan(timestamp, hours) {
        const diffMs = new Date() - new Date(timestamp);
        return diffMs > (hours * 3600000);
    }

    highlightSelectedEmail(emailId) {
        document.querySelectorAll('.email-item').forEach(item => {
            item.classList.remove('bg-blue-100', 'border-blue-500');
        });
        
        const selectedElement = document.querySelector(`[data-email-id="${emailId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('bg-blue-100', 'border-blue-500');
        }
    }

    updateDashboard() {
        const urgent = this.emails.filter(e => e.category === 'urgent').length;
        const pending = this.emails.filter(e => e.status === 'unread').length;
        const processed = this.emails.filter(e => e.status === 'read').length;
        const aiSuggestions = this.emails.length * 2; // Mock AI suggestions count
        
        document.getElementById('urgentCount').textContent = urgent;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('processedCount').textContent = processed;
        document.getElementById('aiCount').textContent = aiSuggestions;
        document.getElementById('emailCount').textContent = this.emails.length;
    }

    // Action methods
    async syncEmails() {
        this.showLoading(true);
        try {
            // Simulate API call to sync emails
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real app, this would fetch from an email service
            // For demo, we'll just reload our sample data
            this.loadSampleEmails();
            this.updateDashboard();
            this.showNotification('Emails synced successfully', 'success');
        } catch (error) {
            console.error('Sync error:', error);
            this.showNotification('Error syncing emails', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    refreshEmails() {
        this.renderEmails();
        this.showNotification('Email list refreshed', 'info');
    }

    filterByCategory(category) {
        if (!category) {
            this.renderEmails();
            return;
        }
        
        const filtered = this.emails.filter(email => email.category === category);
        this.renderEmails(filtered);
    }

    // Categorize email
    async categorizeEmail(emailId, category) {
        const email = this.emails.find(e => e.id === emailId);
        if (email) {
            email.category = category;
            
            try {
                // Update in database
                await fetch(`tables/emails/${emailId}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ category: category })
                });
                
                this.renderEmails();
                this.showNotification(`Email categorized as ${this.categories[category].name}`, 'success');
            } catch (error) {
                console.error('Error categorizing email:', error);
                this.showNotification('Error categorizing email', 'error');
            }
        }
    }

    archiveThread() {
        if (this.currentEmail) {
            this.showNotification(`Thread archived: ${this.currentEmail.subject}`, 'success');
        }
    }

    snoozeThread() {
        if (this.currentEmail) {
            this.showNotification(`Thread snoozed for 24 hours: ${this.currentEmail.subject}`, 'info');
        }
    }

    unsubscribeThread() {
        if (this.currentEmail) {
            this.showNotification(`Unsubscribed from: ${this.currentEmail.senderName}`, 'success');
        }
    }

    showResponseTemplate(template) {
        alert(`Response Template:\n\n${template}`);
    }

    summarizeThread(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (email) {
            this.showNotification(`Thread summarized: ${email.subject}`, 'info');
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('hidden', !show);
    }

    showNotification(message, type) {
        // Enhanced notification system
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 notification-${type}`;
        
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        notification.className += ` ${bgColor} text-white`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the application
let emailTriage;
document.addEventListener('DOMContentLoaded', () => {
    emailTriage = new EmailTriageAssistant();
});