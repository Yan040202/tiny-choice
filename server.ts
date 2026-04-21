import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

// 支持两种 AI 模式：Gemini 或 DeepSeek (OpenAI 兼容)
const geminiClient = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const deepseekClient = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    })
  : null;

const MOCK_SUGGESTIONS: Record<string, string[]> = {
  '饮食': [
    "看来你的胃已经替你选好了，冲吧！",
    "这个热量应该还在可控范围内，奖励自己一下。",
    "好主意，记得拍照发朋友圈先吃。",
    "听起来就是很有营养的选择，优秀！"
  ],
  '美学': [
    "穿上它，你就是整条街最靓的仔/妹。",
    "这个风格非常有格调，很衬你今天的气质。",
    "经典不过时，选这个准没错。",
    "审美在线，这就是你独特的时尚态度。"
  ],
  '效率': [
    "现在就开始，专注是最高级的休息。",
    "合理利用这段时间，你会发现效率惊人。",
    "定个闹钟，开始你的高效模式吧。",
    "小步快跑，每个时间段都有它的意义。"
  ],
  '娱乐': [
    "释放压力，尽情享受这一刻的快乐！",
    "这个游戏/活动听起来就很解压，去玩吧。",
    "快乐最重要，选这个你会玩得很开心的。",
    "这是个不错的放松方式，充充电再出发。"
  ],
  '心理': [
    "抱抱你，做完这个决定会感觉好一点的。",
    "听从内心的声音，你已经做得很棒了。",
    "深呼吸，每一个小决定都是在走向更好的自己。",
    "没关系，先按照这个结果试试看，一切都会好的。"
  ],
  'default': [
    "这个决定很有远见！",
    "既然选好了，就坚定地去执行吧。",
    "命运的齿轮开始转动，这就是最好的安排。",
    "听起来是个不错的主意，加油！"
  ]
};

app.post('/api/suggest', async (req, res) => {
  try {
    const { category, subCategory, result } = req.body;
    
    const prompt = `
      用户在“小决定”应用中做出了一个选择。
      大类别：${category}
      小类别：${subCategory}
      决定结果：${result}
      
      请根据这个结果，给出一个有趣、幽默或者有启发性的简短建议或评论（30字以内）。
      如果是食物，可以评价一下热量或口味；如果是心理建议，可以给点鼓励。
      语气要亲切、现代。
    `;

    // 优先尝试 DeepSeek
    if (deepseekClient) {
      const response = await deepseekClient.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个幽默、亲切、现代的小助手。" },
          { role: "user", content: prompt }
        ],
        max_tokens: 100
      });
      return res.json({ suggestion: response.choices[0].message.content?.trim() || "决定得不错！" });
    }

    // 其次尝试 Gemini
    if (geminiClient) {
      const result_ai = await geminiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      return res.json({ suggestion: result_ai.text?.trim() || "决定得不错！" });
    }

    // 如果都没有配置 API KEY，使用本地兜底逻辑
    const suggestions = MOCK_SUGGESTIONS[category] || MOCK_SUGGESTIONS['default'];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    res.json({ suggestion: `[本地建议] ${randomSuggestion}` });
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to get AI suggestion' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
