# RiftScribe

**Your League of Legends Season, Forged into Legend.**

---

## 📖 About The Project

RiftScribe is an AI-powered storytelling agent built for the **Rift Rewind Hackathon**. It transforms a player's raw, year-long match history into a personalized and engaging epic saga. Forget boring stat sheets; RiftScribe chronicles your journey, highlighting your greatest triumphs, your most-played champions, and your path to improvement through a compelling narrative.

Choose your storyteller's voice—from a heroic Bard to a snarky Yordle—and relive your season with custom, AI-generated artwork depicting your most legendary moments.

### Project Status

This project is currently in the **rapid prototyping phase**. To accelerate development and focus on the user experience, it currently uses the Google Gemini API. The final submission will be migrated to the required **AWS AI services (Amazon Bedrock)** as outlined in the official hackathon stack.

### Target Architecture (AWS)

-   **Frontend:** React with Tailwind CSS
-   **Hosting:** AWS Amplify
-   **AI Core:** Amazon Bedrock (Claude for Text, Stability for Images)
-   **Data Pipeline:** AWS Lambda, Amazon S3, Amazon DynamoDB, Amazon API Gateway

---

## ✨ Features

-   **Personalized Saga:** A multi-chapter narrative of your entire season.
-   **Selectable AI Personas:** Choose how your story is told with unique voices inspired by League of Legends lore.
-   **Live AI-Generated Artwork:** Unique images are generated in real-time for each chapter of your saga.
-   **Deep Insights:** Uncover trends, persistent habits, and hidden strengths in your gameplay.
-   **Socially Shareable:** Easily share chapters or key moments of your saga with friends.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
