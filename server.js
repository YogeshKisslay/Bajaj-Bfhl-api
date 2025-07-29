const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());

app.post('/bfhl', (req, res) => {
    try {
        const { data, full_name, dob, email, roll_number } = req.body;
        if (!Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Input 'data' must be an array"
            });
        }
        if (!full_name || !dob || !email || !roll_number) {
            return res.status(400).json({
                is_success: false,
                error: "Missing required fields: full_name, dob, email, roll_number"
            });
        }
        const formattedDob = dob.replace(/[^0-9]/g, '').slice(0, 8);
        const formattedName = full_name.toLowerCase().replace(/\s+/g, '_');
        const user_id = `${formattedName}_${formattedDob}`;
        const response = {
            is_success: true,
            user_id,
            email,
            roll_number,
            odd_numbers: [],
            even_numbers: [],
            alphabets: [],
            special_characters: [],
            sum: "0",
            concat_string: ""
        };

        let sum = 0;
        let alphabets = [];

        data.forEach(item => {
            const strItem = String(item);
            if (!isNaN(strItem) && strItem.trim() !== '') {
                const num = parseInt(strItem);
                sum += num;
                if (num % 2 === 0) {
                    response.even_numbers.push(strItem);
                } else {
                    response.odd_numbers.push(strItem);
                }
            }
            else if (/^[a-zA-Z]+$/.test(strItem)) {
                response.alphabets.push(strItem.toUpperCase());
                alphabets.push(...strItem.split(''));
            }
            else {
                response.special_characters.push(strItem);
            }
        });

        response.sum = String(sum);
        response.concat_string = alphabets
            .reverse()
            .map((char, index) => 
                index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
            )
            .join('');
        response.odd_numbers.sort((a, b) => Number(a) - Number(b));
        response.even_numbers.sort((a, b) => Number(a) - Number(b));
        response.alphabets.sort();
        response.special_characters.sort();

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});