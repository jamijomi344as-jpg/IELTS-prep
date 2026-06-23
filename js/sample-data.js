/* ============================================================
   NAMUNA MA'LUMOTLAR
   Dastlabki testlar va admin akkaunti
   ============================================================ */

const SAMPLE_ADMIN = {
  email: 'admin@ielts.uz',
  password: 'admin123'
};

const SAMPLE_TESTS = [
  // ===== READING TEST =====
  {
    id: 'r001',
    type: 'reading',
    title: 'Reading Practice Test 1 — Academic',
    description: '3 ta matn, 15 ta savol. O\'qishni tushunish ko\'nikmalarini sinab ko\'ring.',
    time_limit: 60,
    created_at: new Date().toISOString(),
    sections: [
      {
        id: 1,
        title: 'Passage 1: The Story of Coffee',
        passage: `<p>Coffee, one of the world's most popular beverages, has a rich and fascinating history that spans centuries and continents. According to popular legend, coffee was first discovered in the ancient coffee forests of the Ethiopian plateau by a goat herder named Kaldi.</p>
        <p>The story goes that Kaldi noticed his goats became unusually energetic after eating the red berries from a particular tree. Intrigued, Kaldi tried the berries himself and experienced a similar burst of energy. He shared his discovery with a local monk, who found that the berries helped him stay alert during long evening prayers.</p>
        <p>The knowledge of coffee gradually spread across the Red Sea to the Arabian Peninsula. By the 15th century, coffee was being cultivated in the Yemeni district of Arabia. From there, it made its way to Mecca and Cairo, where the first coffeehouses were established. These early coffeehouses became important centers of social activity, where people gathered not only to drink coffee but also to exchange news, listen to music, and play chess.</p>
        <p>The popularity of coffee continued to grow, and by the 17th century, it had reached Europe. Initially met with suspicion and even fear — some called it the "bitter invention of Satan" — coffee eventually gained acceptance. The first European coffeehouse opened in Venice in 1645, and soon these establishments were spreading across the continent.</p>
        <p>Today, coffee is one of the most valuable legally traded commodities in the world, second only to oil. It is grown in more than 70 countries, primarily in the equatorial regions of the Americas, Southeast Asia, and Africa. Brazil is the world's largest coffee producer, followed by Vietnam and Colombia.</p>`,
        questions: [
          { id: 1, type: 'mcq', text: 'According to the legend, who first discovered coffee?', options: ['A) A monk in Ethiopia', 'B) A goat herder named Kaldi', 'C) A trader from Yemen', 'D) A farmer in Brazil'], correct_answer: 'B' },
          { id: 2, type: 'mcq', text: 'When was coffee first cultivated in the Arabian Peninsula?', options: ['A) 10th century', 'B) 12th century', 'C) 15th century', 'D) 17th century'], correct_answer: 'C' },
          { id: 3, type: 'tfng', text: 'Early coffeehouses were only used for drinking coffee.', correct_answer: 'False' },
          { id: 4, type: 'tfng', text: 'Coffee was immediately accepted by Europeans without any resistance.', correct_answer: 'False' },
          { id: 5, type: 'fill', text: 'The first European coffeehouse opened in ______ in 1645.', correct_answer: 'Venice' }
        ]
      },
      {
        id: 2,
        title: 'Passage 2: Urban Farming',
        passage: `<p>Urban farming, the practice of growing food within or around cities, has gained significant attention in recent years. As the world's population becomes increasingly urbanized — with more than half of all people now living in cities — finding ways to produce food close to where people live has become a critical challenge.</p>
        <p>There are many forms of urban farming. Community gardens, where neighbors share a piece of land to grow vegetables and herbs, are perhaps the most common. Rooftop gardens make use of otherwise unused building tops. Vertical farms, a more recent innovation, grow plants in stacked layers indoors, often using hydroponic or aeroponic systems that don't require soil.</p>
        <p>The benefits of urban farming extend beyond just food production. Green spaces in cities help reduce the urban heat island effect, where cities are significantly warmer than surrounding rural areas. Plants also absorb carbon dioxide and filter air pollutants, improving air quality. Community gardens can strengthen neighborhood bonds and provide educational opportunities for children.</p>
        <p>However, urban farming also faces significant challenges. Land in cities is expensive, and urban soil may be contaminated with heavy metals and other pollutants from industrial activities. Access to water can be difficult and expensive. Additionally, zoning laws and regulations in many cities were not designed with agriculture in mind, creating legal barriers for urban farmers.</p>
        <p>Despite these challenges, many cities around the world are embracing urban farming. Singapore, for example, has set a goal to produce 30% of its nutritional needs locally by 2030. Detroit, once a symbol of urban decline, has become a hub of urban agriculture, with over 1,400 community gardens and urban farms.</p>`,
        questions: [
          { id: 6, type: 'mcq', text: 'What percentage of the world\'s population currently lives in cities?', options: ['A) Less than 30%', 'B) About 50%', 'C) More than 50%', 'D) Nearly 80%'], correct_answer: 'C' },
          { id: 7, type: 'mcq', text: 'Which of the following is NOT mentioned as a form of urban farming?', options: ['A) Community gardens', 'B) Rooftop gardens', 'C) Vertical farms', 'D) Underground tunnels'], correct_answer: 'D' },
          { id: 8, type: 'ynng', text: 'Urban farming can help reduce city temperatures.', correct_answer: 'Yes' },
          { id: 9, type: 'ynng', text: 'All cities have laws that specifically support urban farming.', correct_answer: 'No' },
          { id: 10, type: 'fill', text: 'Singapore aims to produce ______% of its nutritional needs locally by 2030.', correct_answer: '30' }
        ]
      },
      {
        id: 3,
        title: 'Passage 3: The Science of Sleep',
        passage: `<p>Sleep, once considered a passive and unimportant state, is now recognized as a complex and essential biological process. Far from being a simple "shutdown" of the body and brain, sleep involves distinct stages, each serving specific functions critical to physical and mental health.</p>
        <p>Sleep is divided into two main types: Rapid Eye Movement (REM) sleep and Non-REM (NREM) sleep. NREM sleep is further divided into three stages. During the first stage, the body transitions from wakefulness to sleep. The second stage involves a deeper state of relaxation. The third stage, known as slow-wave sleep, is the deepest and most restorative phase.</p>
        <p>REM sleep, during which most dreaming occurs, is characterized by rapid eye movements, increased brain activity, and temporary muscle paralysis. This stage is believed to be important for memory consolidation, learning, and emotional processing. A complete sleep cycle — from NREM to REM — lasts approximately 90 to 110 minutes and repeats several times throughout the night.</p>
        <p>The consequences of sleep deprivation are well-documented. Short-term effects include impaired cognitive function, reduced attention span, and mood disturbances. Chronic sleep deprivation has been linked to more serious health problems, including obesity, diabetes, cardiovascular disease, and weakened immune function.</p>
        <p>Despite the clear importance of sleep, modern lifestyles often work against healthy sleep patterns. The use of electronic devices before bedtime, irregular work schedules, and the constant connectivity of modern life all contribute to what some experts have called a "sleep epidemic." Researchers recommend that adults aim for 7-9 hours of sleep per night.</p>`,
        questions: [
          { id: 11, type: 'mcq', text: 'How many stages of NREM sleep are there?', options: ['A) One', 'B) Two', 'C) Three', 'D) Four'], correct_answer: 'C' },
          { id: 12, type: 'mcq', text: 'What happens during REM sleep?', options: ['A) The body is fully active', 'B) Most dreaming occurs', 'C) Brain activity decreases', 'D) No eye movement occurs'], correct_answer: 'B' },
          { id: 13, type: 'tfng', text: 'A complete sleep cycle lasts about 90 to 110 minutes.', correct_answer: 'True' },
          { id: 14, type: 'ynng', text: 'Sleep deprivation can impair cognitive performance as much as alcohol.', correct_answer: 'Yes' },
          { id: 15, type: 'fill', text: 'Researchers recommend that adults get ______ to 9 hours of sleep per night.', correct_answer: '7' }
        ]
      }
    ]
  },

  // ===== LISTENING TEST =====
  {
    id: 'l001',
    type: 'listening',
    title: 'Listening Practice Test 1',
    description: '4 ta bo\'lim, 20 ta savol. Audio tinglab savollarga javob bering.',
    time_limit: 40,
    created_at: new Date().toISOString(),
    sections: [
      {
        id: 1,
        title: 'Section 1: Hotel Booking',
        audio_text: "Receptionist: Good morning, Grand Hotel, how can I help you? Man: Hello, I'd like to book a room for next weekend, please. Receptionist: Certainly, sir. What dates are you looking at? Man: From Friday the 15th to Sunday the 17th. That's two nights. Receptionist: Let me check availability. Yes, we have rooms available. Would you like a single or double room? Man: A double room, please. Does it have a sea view? Receptionist: Yes, we have double rooms with sea view available. That would be 140 pounds per night. Man: That sounds good. Does the price include breakfast? Receptionist: Yes, a full English breakfast is included in the price. Man: Excellent. My name is James Wilson. Receptionist: Thank you, Mr. Wilson. Can I take your phone number? Man: It's 07785 432190. Receptionist: Perfect. Your booking is confirmed for two nights starting Friday the 15th. Check-in is at 2 PM.",
        questions: [
          { id: 1, type: 'fill', text: 'The guest wants to stay for ______ nights.', correct_answer: 'two' },
          { id: 2, type: 'mcq', text: 'What type of room does the guest want?', options: ['A) Single room', 'B) Double room with sea view', 'C) Family room', 'D) Suite'], correct_answer: 'B' },
          { id: 3, type: 'mcq', text: 'How much does the room cost per night?', options: ['A) 100 pounds', 'B) 120 pounds', 'C) 140 pounds', 'D) 160 pounds'], correct_answer: 'C' },
          { id: 4, type: 'tfng', text: 'Breakfast is included in the room price.', correct_answer: 'True' },
          { id: 5, type: 'fill', text: 'The guest\'s name is James ______.', correct_answer: 'Wilson' }
        ]
      },
      {
        id: 2,
        title: 'Section 2: Museum Tour Guide',
        audio_text: "Guide: Welcome to the City Museum, everyone. My name is Sarah and I'll be your guide today. The museum was founded in 1895 and houses over 50,000 exhibits. We'll start our tour in the Natural History section on the ground floor, where you can see dinosaur fossils and mineral collections. Then we'll move to the first floor for the Art Gallery, which features paintings from the 18th and 19th centuries. The second floor has the Technology exhibition, showing the history of computers and communications. The museum café is located on the third floor, and it's open from 10 AM to 5 PM. Please note that photography is not allowed in the Art Gallery. The gift shop is near the main entrance, and it closes at 6 PM. Our tour will take approximately 90 minutes.",
        questions: [
          { id: 6, type: 'fill', text: 'The museum was founded in ______.', correct_answer: '1895' },
          { id: 7, type: 'mcq', text: 'Where can visitors see dinosaur fossils?', options: ['A) First floor', 'B) Second floor', 'C) Ground floor', 'D) Third floor'], correct_answer: 'C' },
          { id: 8, type: 'mcq', text: 'What is on the second floor?', options: ['A) Art Gallery', 'B) Technology exhibition', 'C) Natural History', 'D) Café'], correct_answer: 'B' },
          { id: 9, type: 'tfng', text: 'Photography is allowed in the Art Gallery.', correct_answer: 'False' },
          { id: 10, type: 'fill', text: 'The tour takes approximately ______ minutes.', correct_answer: '90' }
        ]
      },
      {
        id: 3,
        title: 'Section 3: Student Discussion',
        audio_text: "Tutor: So, how is your research project going? Student: Well, I've collected most of the data, but I'm having trouble with the analysis. Tutor: What seems to be the problem? Student: I'm not sure which statistical method to use. I have two groups to compare. Tutor: Have you considered using a t-test? Student: I thought about that, but my sample size is quite small, only 15 participants in each group. Tutor: A t-test can still work with small samples, but you should also check if your data is normally distributed. Student: I did check, and it seems to follow a normal distribution. Tutor: Then a t-test should be appropriate. What software are you using? Student: I'm using SPSS. Tutor: That's good. SPSS has built-in t-test functions. I'd suggest running an independent samples t-test. Student: Thank you. Also, I need to submit by next Friday. Tutor: That gives you about 10 days. You should be fine if you start the analysis this week.",
        questions: [
          { id: 11, type: 'mcq', text: 'What problem is the student having?', options: ['A) Collecting data', 'B) Choosing a statistical method', 'C) Finding participants', 'D) Writing the report'], correct_answer: 'B' },
          { id: 12, type: 'fill', text: 'The student has ______ participants in each group.', correct_answer: '15' },
          { id: 13, type: 'mcq', text: 'What software is the student using?', options: ['A) Excel', 'B) R', 'C) SPSS', 'D) Python'], correct_answer: 'C' },
          { id: 14, type: 'tfng', text: 'The tutor recommends an independent samples t-test.', correct_answer: 'True' },
          { id: 15, type: 'fill', text: 'The student needs to submit by next ______.', correct_answer: 'Friday' }
        ]
      },
      {
        id: 4,
        title: 'Section 4: Climate Change Lecture',
        audio_text: "Professor: Today we're going to discuss the impact of climate change on marine ecosystems. As you probably know, the oceans absorb about 30% of the carbon dioxide produced by human activities. This leads to ocean acidification, which makes it difficult for marine organisms such as corals and shellfish to build their shells and skeletons. The current rate of ocean acidification is estimated to be 10 times faster than at any time in the last 55 million years. Rising ocean temperatures are also causing coral bleaching events, where corals expel the algae living in their tissues, turning white and often dying. The Great Barrier Reef, for example, has experienced mass bleaching events in 2016, 2017, and 2020. Another major impact is sea level rise. Global sea levels have risen by about 20 centimeters since 1900, and the rate is accelerating. Scientists project that sea levels could rise by another 30 to 110 centimeters by the year 2100, depending on greenhouse gas emission levels.",
        questions: [
          { id: 16, type: 'fill', text: 'The oceans absorb about ______% of carbon dioxide produced by humans.', correct_answer: '30' },
          { id: 17, type: 'mcq', text: 'What does ocean acidification affect?', options: ['A) Only fish', 'B) Corals and shellfish', 'C) Only plants', 'D) Marine mammals'], correct_answer: 'B' },
          { id: 18, type: 'tfng', text: 'Ocean acidification rate is 10 times faster than any time in the last 55 million years.', correct_answer: 'True' },
          { id: 19, type: 'mcq', text: 'In which years did the Great Barrier Reef experience mass bleaching?', options: ['A) 2015, 2016, 2017', 'B) 2016, 2017, 2020', 'C) 2018, 2019, 2020', 'D) 2014, 2016, 2018'], correct_answer: 'B' },
          { id: 20, type: 'fill', text: 'Sea levels have risen by about ______ centimeters since 1900.', correct_answer: '20' }
        ]
      }
    ]
  },

  // ===== WRITING TEST =====
  {
    id: 'w001',
    type: 'writing',
    title: 'Writing Practice Test 1',
    description: '2 ta topshiriq: Task 1 va Task 2. Yozish ko\'nikmalarini sinab ko\'ring.',
    time_limit: 60,
    created_at: new Date().toISOString(),
    sections: [
      {
        id: 1,
        title: 'Task 1: Bar Chart Description',
        passage: '',
        prompt: 'The bar chart below shows the number of international students enrolled in three different universities in the UK (University A, University B, and University C) from 2010 to 2020.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        image_url: 'https://picsum.photos/seed/ielts-bar-chart/600/350.jpg',
        min_words: 150,
        questions: []
      },
      {
        id: 2,
        title: 'Task 2: Essay',
        passage: '',
        prompt: 'Some people believe that universities should focus on providing academic knowledge, while others think they should also prepare students for practical work skills.\n\nDiscuss both views and give your own opinion.\n\nWrite at least 250 words.',
        image_url: '',
        min_words: 250,
        questions: []
      }
    ]
  }
];
