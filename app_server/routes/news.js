const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const data = {
        title: 'News - Travlr Getaways',
        latestNews: [
            { title: '2023 Best Beaches Contest Winners', url: '/news/1' },
            { title: 'Top 10 Diving Spots', url: '/news/2' },
            { title: 'Fishing ban to be implemented this year', url: '/news/3' },
            { title: 'Lifeguard saves child from drowning', url: '/news/4' },
        ],
        vacationTips: [
            { title: 'What to bring on the beach?', url: '/news/5' },
            { title: 'Planning Fun Activities', url: '/news/6' },
            { title: 'Diving Checklist', url: '/news/7' },
            { title: 'First Aid', url: '/news/8' },
            { title: 'How to Build a Sand Castle?', url: '/news/9' },
            { title: 'Tanning Tips', url: '/news/10' },
        ],
        newsTitle: 'Experience Kayaking!',
        image: 'kayak.jpg',
        headline: 'Experience Kayaking!',
        date: 'April 03, 2023',
        author: 'Juan De La Cruz',
        content1: 'Sed et augue lorem. In sit amet placerat arcu...',
        content2: 'Cras dui sapien, feugiat vitae tristique ut...',
        content3: 'Phasellus viverra fringilla lacus...',
    };

    res.render('news', data);
});

module.exports = router;
