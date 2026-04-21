/**
 * island-decision - appConfig
 * All data must come from this config.
 */

export interface OptionDetail {
  name: string;
  attr?: string; // 🛵 / 📍
  meta?: string; // kcal
}

export interface SubCategory {
  id: string;
  name: string;
  nameEn?: string; // Add English name
  options?: OptionDetail[];
  children?: SubCategory[];
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string; // Add English name
  icon: string;
  color: string;
  subCategories: SubCategory[];
}

export interface BudgetLevel {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  saturation: number;
}

export const appConfig = {
  categories: [
    {
      id: 'eats',
      name: '饮食',
      nameEn: 'Dining',
      icon: 'Utensils',
      color: 'var(--color-macaron-mint)',
      subCategories: [
        {
          id: 'breakfast',
          name: '早餐',
          nameEn: 'Breakfast',
          options: [
            { name: '小笼包', attr: '📍', meta: '350kcal' },
            { name: '热干面', attr: '🛵', meta: '450kcal' },
            { name: '煎饼果子', attr: '📍', meta: '400kcal' }
          ]
        },
        {
          id: 'lunch',
          name: '午餐',
          nameEn: 'Lunch',
          options: [
            { name: '中餐', attr: '📍', meta: '600kcal' },
            { name: '西餐', attr: '🛵', meta: '550kcal' },
            { name: '日韩', attr: '📍', meta: '500kcal' }
          ]
        },
        {
          id: 'dinner',
          name: '晚餐',
          nameEn: 'Dinner',
          options: [
            { name: '火锅', attr: '📍', meta: '800kcal' },
            { name: '串串', attr: '🛵', meta: '700kcal' },
            { name: '大排档', attr: '📍', meta: '650kcal' }
          ]
        },
        {
          id: 'late-night',
          name: '宵夜',
          nameEn: 'Supper',
          options: [
            { name: '烧烤', attr: '🛵', meta: '900kcal' },
            { name: '炸鸡', attr: '📍', meta: '850kcal' },
            { name: '卷饼', attr: '🛵', meta: '500kcal' }
          ]
        },
        {
          id: 'drinks',
          name: '续命水',
          nameEn: 'Beverage',
          options: [
            { name: '奶茶', attr: '🛵', meta: '450kcal' },
            { name: '咖啡', attr: '📍', meta: '50kcal' },
            { name: '水果茶', attr: '🛵', meta: '300kcal' }
          ]
        }
      ]
    },
    {
      id: 'aesthetics',
      name: '美学',
      nameEn: 'Aesthetics',
      icon: 'Shirt',
      color: 'var(--color-macaron-pink)',
      subCategories: [
        {
          id: 'outfit_group',
          name: '今天穿什么',
          nameEn: 'Daily Outfit',
          children: [
            {
              id: 'tops',
              name: '上装',
              nameEn: 'Tops',
              options: [
                { name: '短袖' }, { name: '背心' }, { name: '衬衣' }, 
                { name: '毛衣' }, { name: '风衣' }, { name: '冲锋衣' }
              ]
            },
            {
              id: 'bottoms',
              name: '下装',
              nameEn: 'Bottoms',
              options: [
                { name: '牛仔裤' }, { name: '运动裤' }, { name: '休闲裤' }, 
                { name: '半裙' }, { name: '短裤' }
              ]
            },
            {
              id: 'sets',
              name: '套装',
              nameEn: 'Full Set',
              options: [
                { name: '连体裤' }, { name: '连衣裙' }
              ]
            }
          ]
        },
        {
          id: 'decor',
          name: '软装灵感',
          nameEn: 'Interior Decor',
          options: [{ name: '包豪斯' }, { name: '侘寂风' }, { name: '美式复古' }]
        }
      ]
    },
    {
      id: 'efficiency',
      name: '效率',
      nameEn: 'Efficiency',
      icon: 'Briefcase',
      color: 'var(--color-macaron-yellow)',
      subCategories: [
        {
          id: 'time',
          name: '时间转盘',
          nameEn: 'Time Wheel',
          options: [
            { name: '30分钟' }, 
            { name: '1个小时' }, 
            { name: '2个小时' }
          ]
        }
      ]
    },
    {
      id: 'entertainment',
      name: '娱乐',
      nameEn: 'Fun',
      icon: 'Gamepad2',
      color: 'var(--color-macaron-blue)',
      subCategories: [
        {
          id: 'game',
          name: '玩什么好',
          nameEn: 'What to Play',
          options: [{ name: 'RPG' }, { name: '射击' }, { name: '肉鸽' }]
        }
      ]
    },
    {
      id: 'psychology',
      name: '心理',
      nameEn: 'Psychology',
      icon: 'Brain',
      color: 'var(--color-macaron-purple)',
      subCategories: [
        {
          id: 'anxiety',
          name: '焦虑怎么办',
          nameEn: 'Dealing with Anxiety',
          options: [
            { name: '睡觉' }, 
            { name: '大哭一场' }, 
            { name: '找朋友倾诉' },
            { name: '深呼吸' },
            { name: '运动' }
          ]
        }
      ]
    }
  ] as Category[],
  
  budgetLevels: [
    {
      id: 'light',
      name: '轻盈',
      nameEn: '🌱',
      icon: 'Leaf',
      saturation: 0.2
    },
    {
      id: 'enjoy',
      name: '悦己',
      nameEn: '☕',
      icon: 'Coffee',
      saturation: 0.6
    },
    {
      id: 'ultimate',
      name: '极致',
      nameEn: '✨',
      icon: 'Sparkles',
      saturation: 1.0
    }
  ] as BudgetLevel[]
};
