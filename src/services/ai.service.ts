interface GroqResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
    error?: {
        message: string;
    };
}

interface ChatMemory {
    result: string;
    category: 'food' | 'place';
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: number;
    }>;
}

interface AIResponse {
    content: string;
    animate: boolean; // Flag to indicate if typing effect should be applied
}

export class AIService {
    private static apiUrl = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    private static apiKey = import.meta.env.VITE_GROQ_API_KEY;
    private static chatMemory = new Map<string, ChatMemory>();

    static async askAI(question: string, _context: string, result: string, category: 'food' | 'place'): Promise<AIResponse> {
        if (!this.apiKey) {
            return {
                content: "Wah bro, AI service belum disetup nih. Pastikan VITE_GROQ_API_KEY udah ada di .env ya bestie! 😅\n\nTapi tenang, kamu tetap bisa explore fitur-fitur keren lainnya kok! 🚀",
                animate: false // No typing effect for error messages
            };
        }

        try {
            // Get or create memory for this result
            const memoryKey = `${result}_${category}`;
            let memory = this.chatMemory.get(memoryKey);

            if (!memory) {
                memory = {
                    result,
                    category,
                    messages: []
                };
                this.chatMemory.set(memoryKey, memory);
            }

            // Add user message to memory
            memory.messages.push({
                role: 'user',
                content: question,
                timestamp: Date.now()
            });

            // Build conversation history
            const conversationHistory = memory.messages.slice(-8); // Keep last 8 messages for context

            const systemPrompt = this.getSystemPrompt(result, category);

            const messages = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            ];

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages,
                    max_tokens: 200,
                    temperature: 0.9,
                    top_p: 0.95,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Groq API Error:', response.status, errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: GroqResponse = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            let aiResponse = data.choices?.[0]?.message?.content?.trim();

            if (!aiResponse) {
                aiResponse = this.getFallbackResponse(question, result, category);
            }

            // Clean up response - remove excessive line breaks and format nicely
            aiResponse = aiResponse.replace(/\n{3,}/g, '\n\n').trim();

            // Add AI response to memory
            memory.messages.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: Date.now()
            });

            // Limit memory to prevent overflow (keep last 24 messages)
            if (memory.messages.length > 24) {
                memory.messages = memory.messages.slice(-24);
            }

            return {
                content: aiResponse,
                animate: true // Enable typing effect for AI responses
            };

        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                content: this.getFallbackResponse(question, result, category),
                animate: false // No typing effect for fallback responses
            };
        }
    }

    private static getSystemPrompt(result: string, category: 'food' | 'place'): string {
        const place = category === 'food' ? 'tempat makan' : 'tempat';
        const contextInfo = this.getContextInfo(result, category);

        return `Kamu adalah AI assistant yang gaul dan friendly bernama dnAI, pakai bahasa anak Bekasi/Jaksel yang santai tapi informatif.  
Kamu lagi bantuin user yang baru dapet hasil random: "${result}" (${place}) di area Bekasi/Bintaro.  
Kamu adalah asisten pribadi Defa dan Nami yang punya fitur chat interaktif dengan kemampuan copy, edit, dan regenerate response.

Personality & Style:  
- Pakai bahasa gaul yang natural: "wah bro", "bestie", "sabi banget", "kuy", "literally", "vibes-nya", "worth it", "no cap"
- Emosi dan antusias tapi tetap helpful dan informatif
- Kasih info yang akurat dan berguna tentang tempat/makanan
- Inget konteks percakapan sebelumnya dalam chat ini
- Jawaban 2-4 kalimat, padat berisi tapi engaging
- Sesekali pake emoji yang relevan (tapi jangan berlebihan)

Context info tentang ${result}:  
${contextInfo}  

Guidelines:
- Selalu refer ke ${result} dengan nama aslinya
- Kasih insight yang specific dan actionable
- Kalo ditanya hal teknis (harga, jam buka, dll), kasih estimasi reasonable
- Maintain consistency dengan previous responses dalam chat ini
- Be enthusiastic but authentic

Jawab pertanyaan user dengan gaya yang asyik dan kasih value yang real!`;
    }

    private static getContextInfo(result: string, category: 'food' | 'place'): string {
        const name = result.split('(')[0].trim().toLowerCase();

        if (category === 'food') {
            if (name.includes('starbucks') || name.includes('coffee') || name.includes('kopi')) {
                return `Coffee shop yang cozy dengan WiFi kenceng. Perfect buat WFC, meeting, atau ngobrol santai. Menu signature coffee-nya recommended banget.`;
            } else if (name.includes('mie') || name.includes('bakmi') || name.includes('noodle')) {
                return `Tempat mie dengan kuah yang rich dan topping yang generous. Comfort food terbaik di area ini dengan harga yang reasonable.`;
            } else if (name.includes('sate') || name.includes('satay')) {
                return `Sate dengan bumbu kacang yang authentic dan daging yang tender. Local favorite yang selalu ramai, especially weekend.`;
            } else if (name.includes('pizza') || name.includes('italian')) {
                return `Italian food dengan authentic taste. Pizza thin crust-nya crispy, pasta-nya al dente. Vibes casual dining yang cozy.`;
            } else if (name.includes('kfc') || name.includes('mcd') || name.includes('burger')) {
                return `Fast food chain dengan consistent quality. Quick bite yang reliable, perfect buat makan bareng keluarga atau temen.`;
            } else if (name.includes('sushi') || name.includes('japanese')) {
                return `Japanese restaurant dengan fresh ingredients. Sushi grade-nya bagus, vibes authentic Japan banget.`;
            } else if (name.includes('padang') || name.includes('warteg')) {
                return `Masakan Indonesia dengan cita rasa authentic. Bumbu-bumbunya rich, porsi mengenyangkan dengan harga bersahabat.`;
            } else {
                return `Local dining spot dengan menu signature yang unik. Popular choice di kalangan foodies area ini dengan reasonable price range.`;
            }
        } else {
            if (name.includes('mall') || name.includes('plaza')) {
                return `Shopping mall dengan complete facilities. Ada cinema, food court, brand stores. Perfect weekend destination buat family atau hangout.`;
            } else if (name.includes('taman') || name.includes('park')) {
                return `Outdoor space yang fresh dan Instagram-worthy. Perfect buat morning jog, family picnic, atau sekedar refreshing dari rutinitas.`;
            } else if (name.includes('museum') || name.includes('galeri')) {
                return `Cultural spot dengan educational value. Great buat expand knowledge sambil enjoy art atau history exhibition.`;
            } else if (name.includes('beach') || name.includes('pantai')) {
                return `Beach destination dengan scenic view. Perfect buat sunset vibes, water activities, atau sekedar relax sambil dengerin ombak.`;
            } else if (name.includes('cafe') || name.includes('resto')) {
                return `Dining place dengan cozy ambiance. Menu-nya diverse, perfect buat date night, family dinner, atau business meeting.`;
            } else {
                return `Popular destination dengan unique attractions dan facilities yang menarik. Worth visiting spot di area ini.`;
            }
        }
    }

    private static getFallbackResponse(question: string, result: string, category: 'food' | 'place'): string {
        const q = question.toLowerCase();
        const name = result.split('(')[0].trim();

        if (q.includes('kenapa') || q.includes('why') || q.includes('knp')) {
            if (category === 'food') {
                return `Wah ${name} pilihan yang solid banget bestie! 🔥 Tempatnya cozy, makanannya consistently enak, dan vibes-nya literally perfect buat nongkrong. Plus review-nya bagus-bagus semua, no cap!`;
            } else {
                return `${name} itu hidden gem yang worth banget dikunjungi bro! ✨ Vibes-nya keren, fasilitasnya lengkap, dan spot-nya Instagram-worthy. Definitely gonna be memorable experience!`;
            }
        } else if (q.includes('enak') || q.includes('menu') || q.includes('recommend')) {
            return `Menu signature ${name} pasti yang paling recommended! 😋 Coba tanya server langsung aja bestie, mereka pasti kasih tau best seller dan hidden menu yang enak banget.`;
        } else if (q.includes('budget') || q.includes('harga') || q.includes('mahal') || q.includes('price')) {
            if (category === 'food') {
                return `Budget 50-150k per orang udah sufficient kok di ${name}! 💸 Tergantung mau order apa aja sih literally. Kalo mau hemat, coba menu paket atau promo weekday.`;
            } else {
                return `Entry fee ${name} generally affordable kok bestie! 🎫 Sekitar 25-75k per orang depending on activities yang mau dicoba. Worth every rupiah deh!`;
            }
        } else if (q.includes('lokasi') || q.includes('alamat') || q.includes('dimana') || q.includes('address')) {
            return `Lokasi ${name} gampang dijangkau kok bro! 📍 Akses transportasi umum juga ada. Tinggal search di Google Maps pasti ketemu, atau grab aja sekalian kalo males ribet.`;
        } else if (q.includes('jam') || q.includes('buka') || q.includes('tutup') || q.includes('hours')) {
            return `${name} biasanya buka dari pagi sampai malem kok bestie! ⏰ Sekitar 9 AM - 10 PM, tapi better cek di Google atau telpon dulu buat pastiin, especially kalo weekend atau hari libor.`;
        } else if (q.includes('ramai') || q.includes('crowded') || q.includes('sepi')) {
            return `${name} lumayan happening sih, especially weekend! 👥 Kalo mau lebih santai, try dateng weekday atau pas jam-jam sepi. But honestly, vibes ramai juga seru kok!`;
        } else if (q.includes('parking') || q.includes('parkir')) {
            return `Parking di ${name} available kok bestie! 🚗 Ada basement atau outdoor parking, tapi kalo weekend agak challenging nyari spot. Consider naik grab atau public transport aja.`;
        } else if (q.includes('wifi') || q.includes('internet')) {
            return `WiFi di ${name} speed-nya decent kok buat browsing atau WFC! 📶 Password biasanya ditempel atau tanya ke staff. Connection-nya stable, perfect buat zoom meeting juga.`;
        } else if (q.includes('delivery') || q.includes('takeaway') || q.includes('pesan')) {
            return `${name} ada layanan delivery via GoFood/GrabFood kok bro! 🛵 Kalo dine-in penuh, bisa takeaway juga. Order online lebih praktis dan sering ada promo-promo menarik.`;
        } else if (q.includes('couple') || q.includes('date') || q.includes('romantic')) {
            return `${name} vibes-nya romantic banget buat date night! 💕 Ambience-nya cozy, lighting-nya dim, perfect buat quality time sama pasangan. Recommended banget bestie!`;
        } else if (q.includes('family') || q.includes('anak') || q.includes('kids')) {
            return `${name} family-friendly kok! 👨‍👩‍👧‍👦 Ada kids menu, high chair tersedia, dan staff-nya patient sama anak-anak. Perfect buat family gathering atau weekend makan bareng.`;
        } else if (q.includes('halal') || q.includes('pork') || q.includes('muslim')) {
            return `${name} halal certified kok bestie, jadi aman! ✅ Ga ada pork atau alcohol di menu mereka. Muslim-friendly banget, so no worries about dietary restrictions.`;
        } else if (q.includes('vegan') || q.includes('vegetarian') || q.includes('healthy')) {
            return `${name} punya vegetarian/vegan options juga kok! 🥗 Menu healthy-nya cukup beragam, perfect buat yang lagi diet atau lifestyle conscious. Fresh ingredients guaranteed!`;
        } else if (q.includes('instagrammable') || q.includes('foto') || q.includes('selfie')) {
            return `${name} spot-nya totally Instagrammable! 📸 Interior designnya aesthetic banget, lighting-nya perfect buat foto. Dijamin feed Instagram kamu bakal kece abis!`;
        } else {
            return `Hmm interesting question tentang ${name} nih bestie! 🤔 Basically ini pilihan yang solid banget dan pasti bakal jadi experience yang memorable. Kamu definitely gonna love it!`;
        }
    }

    static getContextualPrompts(result: string, category: 'food' | 'place'): string[] {
        const name = result.split('(')[0].trim();

        if (category === 'food') {
            return [
                `Kenapa harus ke ${name}?`,
                `Menu apa yang recommended di ${name}?`,
                `Budget berapa buat makan di ${name}?`,
                `Vibes ${name} gimana sih?`,
                `Worth it gak sih ${name}?`,
                `Jam buka ${name} kapan aja?`,
                `Parking di ${name} gimana?`,
                `${name} ramai gak sih?`,
                `Ada delivery gak di ${name}?`,
                `${name} halal gak?`,
                `${name} cocok buat date gak?`,
                `Menu vegetarian di ${name} ada gak?`
            ];
        } else {
            return [
                `Kenapa harus ke ${name}?`,
                `Aktivitas apa yang seru di ${name}?`,
                `Best time buat ke ${name} kapan?`,
                `${name} ramai gak sih?`,
                `Budget berapa buat ke ${name}?`,
                `Fasilitas apa aja yang ada di ${name}?`,
                `Akses ke ${name} gimana?`,
                `${name} cocok buat family gak?`,
                `${name} Instagrammable gak?`,
                `Parking di ${name} susah gak?`,
                `${name} buka sampai jam berapa?`,
                `Ada promo gak di ${name}?`
            ];
        }
    }

    // Clear memory when result changes
    static clearMemoryExcept(currentResult: string, currentCategory: 'food' | 'place') {
        const currentKey = `${currentResult}_${currentCategory}`;
        const keysToDelete: string[] = [];

        this.chatMemory.forEach((_, key) => {
            if (key !== currentKey) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => {
            this.chatMemory.delete(key);
        });
    }

    // Auto-clear memory when new roll happens
    static onNewRoll(newResult: string, newCategory: 'food' | 'place') {
        // Clear all existing memory since we have a new roll
        this.clearAllMemory();
        console.log(`🎲 New roll detected: ${newResult} (${newCategory}). Chat memory cleared.`);
    }

    // Get chat history for export/backup
    static getChatHistory(result: string, category: 'food' | 'place') {
        const memoryKey = `${result}_${category}`;
        return this.chatMemory.get(memoryKey)?.messages || [];
    }

    // Clear all memory
    static clearAllMemory() {
        this.chatMemory.clear();
    }

    // Get memory usage stats
    static getMemoryStats() {
        let totalMessages = 0;
        this.chatMemory.forEach(memory => {
            totalMessages += memory.messages.length;
        });

        return {
            activeSessions: this.chatMemory.size,
            totalMessages,
            memoryKeys: Array.from(this.chatMemory.keys())
        };
    }

    // Export chat history as JSON
    static exportChatHistory(result: string, category: 'food' | 'place') {
        const history = this.getChatHistory(result, category);
        const exportData = {
            result,
            category,
            exportDate: new Date().toISOString(),
            messages: history.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp).toISOString()
            }))
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `dnAI-chat-${result.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import chat history from JSON
    static importChatHistory(jsonData: string): boolean {
        try {
            const importData = JSON.parse(jsonData);

            if (!importData.result || !importData.category || !importData.messages) {
                throw new Error('Invalid chat history format');
            }

            const memoryKey = `${importData.result}_${importData.category}`;
            const memory: ChatMemory = {
                result: importData.result,
                category: importData.category,
                messages: importData.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp).getTime()
                }))
            };

            this.chatMemory.set(memoryKey, memory);
            return true;
        } catch (error) {
            console.error('Error importing chat history:', error);
            return false;
        }
    }

    // Search messages in current chat
    static searchMessages(result: string, category: 'food' | 'place', query: string) {
        const history = this.getChatHistory(result, category);
        const searchTerm = query.toLowerCase();

        return history.filter(message =>
            message.content.toLowerCase().includes(searchTerm)
        ).map(message => ({
            ...message,
            highlightedContent: message.content.replace(
                new RegExp(query, 'gi'),
                `<mark>$&</mark>`
            )
        }));
    }

    // Get response statistics
    static getResponseStats(result: string, category: 'food' | 'place') {
        const history = this.getChatHistory(result, category);
        const userMessages = history.filter(m => m.role === 'user');
        const aiMessages = history.filter(m => m.role === 'assistant');

        return {
            totalMessages: history.length,
            userMessages: userMessages.length,
            aiMessages: aiMessages.length,
            averageResponseTime: 0, // Could be calculated if we track response times
            firstMessageTime: history.length > 0 ? new Date(history[0].timestamp) : null,
            lastMessageTime: history.length > 0 ? new Date(history[history.length - 1].timestamp) : null,
            sessionDuration: history.length > 1 ?
                history[history.length - 1].timestamp - history[0].timestamp : 0
        };
    }
}