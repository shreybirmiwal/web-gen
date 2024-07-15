import React, { useState } from 'react';
import OpenAI from 'openai';

function App() {
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [mood, setMood] = useState('');
  const [color, setColor] = useState('white');
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('');

  const handleSubmit = async () => {
    const client = new OpenAI({
      apiKey: process.env['REACT_APP_OPENAI_API_KEY'],
      dangerouslyAllowBrowser: true
    });

    const promptText = `You are a weather station that has a lot of information about the weather (make up random weather facts that are specific like windspeed, rain etc). I will input an age, a job, and a mood. your task is to style text to match the profile of age job and mood. For example, a happy 3 year old child doesn't want to know about the details, but rather what toys they can play with given the weather. Different for a  30 year old scientist. So make things up to HYPER MATCH the engagement of the audience. emoji can be blank if not appropriate.

      Age: ${age}
      Job: ${job}
      Mood: ${mood}
    `;

    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": [
              { "type": "text", "text": promptText },
            ],
          }
        ],
        temperature: 0,
        response_format: { "type": "json_object" },
      });

      const res2 = JSON.parse(response.choices[0].message.content);

      setColor(res2.Color);
      setText(res2.Text);
      setEmoji(res2.Emoji);

    } catch (error) {
      console.error('Error:', error);
      setText('An error occurred while fetching the response.');
    }
  };

  return (
    <div className="App flex h-screen">
      <div className="w-1/2 border-r-2 border-gray-300 p-4">
        <div className="mb-4">
          <label className="block mb-1">Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Job:</label>
          <input
            type="text"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mood:</label>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </div>
      <div className="w-1/2" style={{ backgroundColor: color }}>
        {/* Right side content can go here */}
        <div className="p-4">
          <div>{text}</div>
          {/* Display Emoji */}
          <div className="text-3xl mt-4">{emoji}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
